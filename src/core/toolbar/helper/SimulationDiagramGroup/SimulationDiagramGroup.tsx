import React from 'react';
import { Group, Stack, Text } from '@mantine/core';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { IconBpeEvaluate, IconBpeRecord } from '@/core/toolbar/utils/icons/Icons';

const SimulationDiagramGroup = () => {
  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        <ToolbarIcon
          icon={IconBpeRecord}
          label="Record"
          title="Record Simulation"
          orientation="vertical"
          size="large"
          disabled
        />
        <ToolbarIcon
          icon={IconBpeEvaluate}
          label="Evaluate"
          title="Evaluate Model"
          orientation="vertical"
          size="large"
          disabled
        />
      </Group>
      <Text size="xs" align="center">
        Diagram
      </Text>
    </Stack>
  );
};

export default SimulationDiagramGroup;
