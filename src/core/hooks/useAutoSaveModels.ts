import projectApi from '@/api/project';
import { getCurrentModeler, getModelers, getTabs } from '@/redux/selectors';
import { useCallback, useEffect, useState } from 'react';
import { batch, useSelector } from 'react-redux';
import useGetModelerModules from './useGetModelerModule';
import { debounce } from 'lodash';
import { useAppDispatch } from '@/redux/store';
import { modelActions, tabsSliceActions } from '@/redux/slices';
import { useFavicon } from '@mantine/hooks';
import favIcon from '@/assets/favicon.svg';
import favIconIndicated from '@/assets/favicon-indicated.svg';
import generateImage from '../toolbar/helper/ImportExportGroup/utils/exportImages';
import { dataURLtoFile } from '../utils/image';

export default function useAutoSaveModels() {
  const dispatch = useAppDispatch();
  const modelers = useSelector(getModelers);
  const currentModeler = useSelector(getCurrentModeler);
  const tabs = useSelector(getTabs);
  const [eventBus] = useGetModelerModules(['eventBus']);
  const [isEditDebounced, setIsEditDebounced] = useState(false);
  const [favicon, setFavicon] = useState(favIcon);
  useFavicon(favicon);
  const allModelsNotEdited = !modelers.find((modeler) => modeler.isEdited);

  const handleSetDebounceEditState = useCallback(
    debounce(() => setIsEditDebounced(true), 10000),
    []
  );

  const onEditModel = useCallback(() => {
    if (currentModeler) {
      batch(() => {
        dispatch(
          tabsSliceActions.updateModelEditState({ tabId: currentModeler.id, isEdited: true })
        );
        dispatch(
          modelActions.updateModelEditState({
            modelId: currentModeler.id,
            isEdited: true,
          })
        );
      });
      handleSetDebounceEditState.cancel();
      handleSetDebounceEditState();
    }
  }, [currentModeler?.id, handleSetDebounceEditState]);

  const onSaveModels = useCallback(async (): Promise<void> => {
    try {
      const formData = new FormData();
      const imagesFormData = new FormData();
      const data: { [modelName: string]: any } = {};
      const imageData: { [key: string]: any } = {};
      await Promise.all(
        modelers.map(async (model) => {
          if (model.isEdited) {
            const { modeler } = model;
            const { xml } = await modeler?.saveXML({ format: true });
            const { svg } = await modeler?.saveSVG();
            const imageSrc = await generateImage('png', svg);
            const imgFile = dataURLtoFile(imageSrc, `${model.name}.png`);
            const blob = new Blob([xml], { type: 'text/xml' });
            const file = new File([blob], `${model.name}.bpmn`);
            formData.append('files', file);
            imagesFormData.append('files', imgFile);
            data[`${model.name as string}.bpmn`] = {
              project_id: model.projectId,
              process_id: model.processId,
              version: model.id,
            };
            imageData[`${model.name as string}.png`] = {
              project_id: model.projectId,
              process_id: model.processId,
              version: model.id,
            };
          }
        })
      );
      formData.append('data', JSON.stringify(data));
      imagesFormData.append('data', JSON.stringify(imageData));
      Promise.all([
        projectApi.autosaveBpmnFiles(formData),
        projectApi.autoSaveImages(imagesFormData),
      ]);
    } catch (err) {
      console.error(err);
    }
  }, [modelers]);

  const autoSave = async () =>
    onSaveModels().then(() => {
      batch(() => {
        modelers.map((modeler) =>
          dispatch(
            modelActions.updateModelEditState({
              modelId: modeler.id,
              isEdited: false,
            })
          )
        );
        tabs.map((tab) =>
          dispatch(tabsSliceActions.updateModelEditState({ tabId: tab.id, isEdited: false }))
        );
      });
      setIsEditDebounced(false);
    });

  useEffect(() => {
    if (isEditDebounced) {
      autoSave();
    }
  }, [isEditDebounced]);

  useEffect(() => {
    eventBus?.on('element.changed', onEditModel);
    return () => {
      eventBus?.off('element.changed', onEditModel);
    };
  }, [eventBus]);

  const onBeforeUnload = (e: Event) => {
    if (!allModelsNotEdited) {
      e.preventDefault();
      return "Your changes haven't been saved yet! Do you want to save them before you leave this page?";
    }
  };

  useEffect(() => {
    setFavicon(allModelsNotEdited ? favIcon : favIconIndicated);
    if (allModelsNotEdited) {
      handleSetDebounceEditState.cancel();
      setIsEditDebounced(false);
    }

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [allModelsNotEdited]);
}
