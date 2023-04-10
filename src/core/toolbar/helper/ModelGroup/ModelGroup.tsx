import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import { IconBpeHistory, IconBpeSave, IconBpeValidate } from '@/core/toolbar/utils/icons/Icons';
import * as selectors from '@/redux/selectors';
import { Stack, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import { TOOLBAR_HOTKEYS } from '../../constants/hotkeys';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const ModelGroup = () => {
  const modeler = useSelector(selectors.getCurrentModeler)?.modeler;

  const [linting] = useGetModelerModules(['linting']);
  const lintingActive = useSelector(selectors.getLintingState);

  const handleLinting = () => {
    //@ts-ignore
    linting?.toggle();
  };

  useHotkeys([
    [TOOLBAR_HOTKEYS.VALIDATE, handleLinting],
    [TOOLBAR_HOTKEYS.SAVE, () => console.log('reserve for save')],
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
        hotkey={TOOLBAR_HOTKEYS.VALIDATE}
        disabled
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
