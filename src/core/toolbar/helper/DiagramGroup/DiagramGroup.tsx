import { useContext, useEffect } from 'react';
import { Group, Stack, Text } from '@mantine/core';
import { DEFAULT_SPACING } from '../../constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { IconBpeSimulate, IconBpeEvaluate, IconBpeCompare } from '../../utils/icons/Icons';
import { ModelerContext } from '../../../context/ModelerContext';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { ToolbarModeContext } from '../../../context/ToolbarModeContext';
import { TOOLBAR_MODE } from '../../../../constants/toolbar';

const DiagramGroup = () => {
  const modeler = useContext(ModelerContext);
  const [toolbarMode, setToolbarMode] = useContext(ToolbarModeContext);
  const [toggleMode] = useGetModelerModules(modeler, ['toggleMode']);

  const handleSwitchToSimulation = () => {
    //@ts-ignore
    toggleMode.toggleMode(true);
    setToolbarMode(() => TOOLBAR_MODE.SIMULATING);
  };

  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        <ToolbarIcon
          icon={IconBpeSimulate}
          label="Simulate"
          title="Run Simulation"
          orientation="vertical"
          size="large"
          onClick={handleSwitchToSimulation}
        />
        <ToolbarIcon
          icon={IconBpeEvaluate}
          label="Evaluate"
          title="Evaluate Model"
          orientation="vertical"
          size="large"
        />
        <ToolbarIcon
          icon={IconBpeCompare}
          label="Compare"
          title="Compare Model's Versions"
          orientation="vertical"
          size="large"
        />
      </Group>
      <Text size="xs" align="center">
        Diagram
      </Text>
    </Stack>
  );
};

export default DiagramGroup;
