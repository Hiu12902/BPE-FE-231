import { useContext, useEffect, useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';

import { ModelerContext } from '@/core/context/ModelerContext';
import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import { IconBpeHistory, IconBpeSave, IconBpeValidate } from '@/core/toolbar/utils/icons/Icons';
import ToolbarIcon from '@/core/toolbar/helper/ToolbarIcon/ToolbarIcon';
import { TOOLBAR_HOTKEYS } from '@/core/toolbar/constants/hotkeys';

const ModelGroup = () => {
  const modeler = useContext(ModelerContext);
  const [linting] = useGetModelerModules(modeler, ['linting']);
  const [lintingActive, setLintingActive] = useState(false);

  const handleLinting = () => {
    //@ts-ignore
    linting?.toggle();
    setLintingActive((o) => !o);
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
      />
      <ToolbarIcon
        icon={IconBpeValidate}
        label="Validate"
        title="Validate Model"
        orientation="horizontal"
        size="small"
        onClick={handleLinting}
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
      />
      <Text size="xs" align="center">
        Model
      </Text>
    </Stack>
  );
};

export default ModelGroup;
