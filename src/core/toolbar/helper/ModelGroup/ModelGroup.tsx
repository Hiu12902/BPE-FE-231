import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import { IconBpeHistory, IconBpeSave, IconBpeValidate } from '@/core/toolbar/utils/icons/Icons';
import * as selectors from '@/redux/selectors';
import { Stack, Text } from '@mantine/core';
import { useDebouncedState, useFavicon, useHotkeys } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import { TOOLBAR_HOTKEYS } from '@/core/toolbar/constants/hotkeys';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import projectApi from '@/api/project';
import { useCallback, useEffect, useState } from 'react';
import favIcon from '@/assets/favicon.svg';
import favIconIndicated from '@/assets/favicon-indicated.svg';
import useNotification from '@/hooks/useNotification';

const ModelGroup = () => {
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const modeler = currentModeler?.modeler;
  const xmlFileLink = `static/${currentModeler?.projectId}/${currentModeler?.id}.bpmn`;
  const [eventBus] = useGetModelerModules(['eventBus']);
  const [modelEditState, setModelEditState] = useState<{ [id: string]: boolean }>({});
  const [isEditDebounced, setIsEditDebounced] = useDebouncedState(false, 10000);
  const [isEdit, setIsEdit] = useState(false);
  const [favicon, setFavicon] = useState(favIcon);
  useFavicon(favicon);
  const [linting] = useGetModelerModules(['linting']);
  const lintingActive = useSelector(selectors.getLintingState);
  const notify = useNotification();

  const handleLinting = () => {
    //@ts-ignore
    linting?.toggle();
  };

  const onSaveModel = useCallback(async (): Promise<void> => {
    try {
      const { xml } = await modeler?.saveXML({ format: true });
      const blob = new Blob([xml], { type: 'text/xml' });
      const file = new File([blob], `${currentModeler?.id}.bpmn`);
      const data = new FormData();
      data.append('file', file);
      data.append('xmlFileLink', xmlFileLink);
      if (currentModeler?.projectId && currentModeler?.id) {
        const res = await projectApi.saveBpmnFile(
          { projectId: currentModeler?.projectId, version: currentModeler?.id },
          data
        );
        if (res) {
          notify({
            title: 'Success!',
            message: 'Saved model successfully!',
            type: 'success',
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [modeler]);

  // const onEditModel = useCallback(() => {
  //   if (currentModeler) {
  //     setModelEditState((prevState) => ({ ...prevState, [currentModeler.id]: true }));
  //     setIsEditDebounced(true);
  //   }
  // }, [currentModeler]);

  // useEffect(() => {
  //   if (isEditDebounced && currentModeler) {
  //     // onSaveModel();
  //     console.log(modelEditState);
  //     setFavicon(favIconIndicated);
  //     setModelEditState((prevState) => ({ ...prevState, [currentModeler.id]: false }));
  //     setIsEditDebounced(false);
  //   } else {
  //     setFavicon(favIcon);
  //   }
  // }, [isEditDebounced]);

  // useEffect(() => {
  //   if (currentModeler) {
  //     eventBus?.on('element.changed', onEditModel);

  //     return () => {
  //       eventBus?.off('element.changed', onEditModel);
  //     };
  //   }
  // }, [currentModeler]);

  useHotkeys([
    [TOOLBAR_HOTKEYS.VALIDATE, handleLinting],
    [TOOLBAR_HOTKEYS.SAVE, () => onSaveModel()],
    [TOOLBAR_HOTKEYS.HISTORY, () => console.log('reserve for history')],
  ]);

  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <ToolbarIcon
        icon={IconBpeSave}
        label="Save"
        title="Save Model"
        orientation="horizontal"
        size="small"
        hotkey={TOOLBAR_HOTKEYS.SAVE}
        onClick={() => onSaveModel()}
        disabled={!currentModeler}
      />
      <ToolbarIcon
        icon={IconBpeValidate}
        label="Validate"
        title="Validate Model"
        orientation="horizontal"
        size="small"
        onClick={() =>
          //@ts-ignore
          linting?.toggle()
        }
        active={lintingActive}
        hotkey={TOOLBAR_HOTKEYS.VALIDATE}
        disabled={!currentModeler}
      />
      <ToolbarIcon
        icon={IconBpeHistory}
        label="History"
        title="Open Model's Edit History"
        orientation="horizontal"
        size="small"
        hotkey={TOOLBAR_HOTKEYS.HISTORY}
        disabled
      />
      <Text size="xs" align="center" weight="bold">
        Model
      </Text>
    </Stack>
  );
};

export default ModelGroup;
