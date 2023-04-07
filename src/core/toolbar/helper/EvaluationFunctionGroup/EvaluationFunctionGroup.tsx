import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import { IconBpeExportLarge, IconBpeSaveLarge } from '@/core/toolbar/utils/icons/Icons';
import { Group, Stack } from '@mantine/core';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

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
          disabled
        />
        <ToolbarIcon
          icon={IconBpeExportLarge}
          label="Export Result"
          title="Export evaluated result"
          orientation="vertical"
          size="large"
          disabled
        />
      </Group>
    </Stack>
  );
};

export default EvaluationFunctionGroup;
