import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import { IconBpeHistory, IconBpeSave, IconBpeValidate } from '@/core/toolbar/utils/icons/Icons';
import * as selectors from '@/redux/selectors';
import { Stack, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import { TOOLBAR_HOTKEYS } from '../../constants/hotkeys';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import projectApi from '@/api/project';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { ACCESS_TOKEN } from '@/constants/localStorageKeys';

const ModelGroup = () => {
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const modeler = currentModeler?.modeler;
  const xmlFileLink = `static/${currentModeler?.projectId}/${currentModeler?.id}.bpmn`;

  const [linting] = useGetModelerModules(['linting']);
  const lintingActive = useSelector(selectors.getLintingState);

  const handleLinting = () => {
    //@ts-ignore
    linting?.toggle();
  };

  const onSaveModel = async (isBeforeUnload?: boolean): Promise<void> => {
    try {
      const { xml } = await modeler?.saveXML({ format: true });
      const blob = new Blob([xml], { type: 'text/xml' });
      const file = new File([blob], `${currentModeler?.id}.bpmn`);
      const data = new FormData();
      data.append('file', file);
      data.append('xmlFileLink', xmlFileLink);
      if (currentModeler?.projectId && currentModeler?.id) {
        if (!isBeforeUnload) {
          const res = await projectApi.saveBpmnFile(
            { projectId: currentModeler?.projectId, version: currentModeler?.id },
            data
          );
          if (res) {
            showNotification({
              title: 'Success!',
              message: 'Saved model successfully!',
              color: 'green',
            });
          }
        } else {
          const accessToken = localStorage.getItem(ACCESS_TOKEN);
          if (accessToken) {
            fetch(
              `http://127.0.0.1:8000/api/v1/bpmnfile/${currentModeler?.projectId}/${currentModeler?.id}/save`,
              {
                method: 'put',
                headers: new Headers({
                  Authorization: 'Bearer ' + JSON.parse(accessToken),
                  'Content-type': 'application/json',
                }),
                body: data,
                keepalive: true,
              }
            );
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   window.addEventListener('beforeunload', () => onSaveModel(true));
  //   return () => {
  //     window.removeEventListener('beforeunload', () => onSaveModel(true));
  //   };
  // });

  useHotkeys([
    [TOOLBAR_HOTKEYS.VALIDATE, handleLinting],
    [TOOLBAR_HOTKEYS.SAVE, () => onSaveModel(false)],
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
        onClick={() => onSaveModel(false)}
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
