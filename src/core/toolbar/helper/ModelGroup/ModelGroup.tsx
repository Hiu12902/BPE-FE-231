import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import { IconBpeHistory, IconBpeSave, IconBpeValidate } from '@/core/toolbar/utils/icons/Icons';
import * as selectors from '@/redux/selectors';
import { Stack, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { batch, useDispatch, useSelector } from 'react-redux';
import { TOOLBAR_HOTKEYS } from '@/core/toolbar/constants/hotkeys';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import projectApi from '@/api/project';
import useNotification from '@/hooks/useNotification';
import { modelActions, tabsSliceActions } from '@/redux/slices';
import { useState } from 'react';
import HistoryImagesModal from '@/components/HistoryImagesModal';
import generateImage from '../ImportExportGroup/utils/exportImages';
import { dataURLtoFile } from '@/core/utils/image';

const ModelGroup = () => {
  const dispatch = useDispatch();
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const [linting] = useGetModelerModules(['linting']);
  const lintingActive = useSelector(selectors.getLintingState);
  const notify = useNotification();
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const handleLinting = () => {
    //@ts-ignore
    linting?.toggle();
  };

  const onSaveModel = async () => {
    try {
      const formData = new FormData();
      const { xml } = await currentModeler?.modeler?.saveXML({ format: true });
      const blob = new Blob([xml], { type: 'text/xml' });
      const file = new File([blob], `${currentModeler?.name}.bpmn`);
      formData.append('file', file);
      if (currentModeler?.projectId && currentModeler?.id && currentModeler?.processId) {
        const res = await projectApi.saveBpmnFile(
          {
            processId: currentModeler?.processId,
            projectId: currentModeler?.projectId,
            version: currentModeler?.id,
          },
          formData
        );
        if (res) {
          notify({
            title: 'Success!',
            message: 'Saved model successfully!',
            type: 'success',
          });
          batch(() => {
            dispatch(
              tabsSliceActions.updateModelEditState({ tabId: currentModeler.id, isEdited: false })
            );
            dispatch(
              modelActions.updateModelEditState({
                modelId: currentModeler.id,
                isEdited: false,
              })
            );
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveImage = async () => {
    try {
      if (!currentModeler?.projectId || !currentModeler?.processId || !currentModeler.id) {
        return;
      }
      const formData = new FormData();
      const { svg } = await currentModeler?.modeler?.saveSVG();
      const imageSrc = await generateImage('png', svg);
      const imgFile = dataURLtoFile(imageSrc, `${currentModeler?.name}.png`);
      formData.append('file', imgFile);
      formData.append('projectID', currentModeler?.projectId.toString());
      formData.append('version', currentModeler?.id);
      formData.append('processID', currentModeler?.processId.toString());

      await projectApi.saveImage(formData);
    } catch (err) {
      console.error(err);
    }
  };

  const saveModel = async () => {
    await Promise.all([onSaveModel(), saveImage()]);
  };

  useHotkeys([
    [TOOLBAR_HOTKEYS.VALIDATE, handleLinting],
    [TOOLBAR_HOTKEYS.SAVE, saveModel],
    [TOOLBAR_HOTKEYS.HISTORY, () => console.log('reserve for history')],
  ]);

  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <HistoryImagesModal opened={openHistoryModal} onClose={() => setOpenHistoryModal(false)} />
      <ToolbarIcon
        icon={IconBpeSave}
        label="Save"
        title="Save Model"
        orientation="horizontal"
        size="small"
        hotkey={TOOLBAR_HOTKEYS.SAVE}
        onClick={saveModel}
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
        onClick={() => setOpenHistoryModal(true)}
        disabled={!currentModeler}
      />
      <Text size="xs" align="center" weight="bold">
        Model
      </Text>
    </Stack>
  );
};

export default ModelGroup;
