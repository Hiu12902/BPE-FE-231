import { Group, Stack, Text } from '@mantine/core';
import React, { useContext } from 'react';
import { TOOLBAR_MODE } from '../../../../constants/toolbar';
import { ModelerContext } from '../../../context/ModelerContext';
import { ToolbarModeContext } from '../../../context/ToolbarModeContext';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '../../constants/size';
import { IconBpeCancel, IconBpeSimulationLog } from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const SimulationMiscGroup = () => {
  const modeler = useContext(ModelerContext);
  const [, setToolbarMode] = useContext(ToolbarModeContext);
  const [toggleMode, canvas, log] = useGetModelerModules(modeler, ['toggleMode', 'canvas', 'log']);

  const handleSwitchToDefault = () => {
    //@ts-ignore
    toggleMode.toggleMode(false);
    setToolbarMode(() => TOOLBAR_MODE.DEFAULT);
    //@ts-ignore
    canvas.zoom('fit-viewport', 'auto');
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
