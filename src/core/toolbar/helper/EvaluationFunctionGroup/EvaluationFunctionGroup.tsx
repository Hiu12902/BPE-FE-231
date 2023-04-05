import { Group, Stack } from '@mantine/core';
import React from 'react';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { IconBpeExportLarge, IconBpeSaveLarge } from '@/core/toolbar/utils/icons/Icons';

const EvaluationFunctionGroup = () => {
  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        <ToolbarIcon
          icon={IconBpeSaveLarge}
          label="Save Result"
          title="Save evaluated result"
          orientation="vertical"
          size="large"
        />
        <ToolbarIcon
          icon={IconBpeExportLarge}
          label="Export Result"
          title="Export evaluated result"
          orientation="vertical"
          size="large"
        />
      </Group>
    </Stack>
  );
};

export default EvaluationFunctionGroup;
