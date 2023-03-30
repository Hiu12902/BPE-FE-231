import { getCurrentModeler } from '@/redux/selectors';
import { toolSliceActions } from '@/redux/slices';
import { useAppDispatch } from '@/redux/store';
import { Group, Stack, Text } from '@mantine/core';
import { useSelector } from 'react-redux';
import { TOOLBAR_MODE } from '../../../../constants/toolbar';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '../../constants/size';
import { IconBpeCancel, IconBpeSimulationLog } from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const SimulationMiscGroup = () => {
  const modeler = useSelector(getCurrentModeler)?.modeler;
  const dispatch = useAppDispatch();
  const [toggleMode, canvas, log] = useGetModelerModules(['toggleMode', 'canvas', 'log']);

  const handleSwitchToDefault = () => {
    //@ts-ignore
    toggleMode.toggleMode(false);

    //@ts-ignore
    canvas.zoom('fit-viewport', 'auto');

    dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.DEFAULT));
  };

  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        <ToolbarIcon
          icon={IconBpeSimulationLog}
          label="Show Log"
          title="Show simulation log"
          orientation="vertical"
          size="large"
          //@ts-ignore
          onClick={() => log.toggle()}
        />
        <ToolbarIcon
          icon={IconBpeCancel}
          label="Cancel"
          title="Cancel Simulation"
          orientation="vertical"
          size="large"
          onClick={handleSwitchToDefault}
        />
      </Group>
      <Text size="xs" align="center">
        Misc
      </Text>
    </Stack>
  );
};

export default SimulationMiscGroup;
