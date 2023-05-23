import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import { IconBpeExportLarge, IconBpeSaveLarge } from '@/core/toolbar/utils/icons/Icons';
import { Group, Stack } from '@mantine/core';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { CSSProperties, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getActiveTab, getEvaluatedResult } from '@/redux/selectors';

const EvaluationFunctionGroup = ({ style }: { style?: CSSProperties }) => {
  const activeTab = useSelector(getActiveTab);
  const evaluatedResult = useSelector(getEvaluatedResult)[activeTab?.id as string];
  const [fileName, setFileName] = useState();

  return (
    <Stack spacing={DEFAULT_SPACING} style={style}>
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
