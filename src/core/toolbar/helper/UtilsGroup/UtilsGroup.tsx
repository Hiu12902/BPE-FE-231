import { Group, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

import { getCurrentModeler } from '@/redux/selectors';
import { useHotkeys } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { TOOLBAR_HOTKEYS } from '@/core/toolbar/constants/hotkeys';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import {
  IconBpeConnector,
  IconBpeHand,
  IconBpeLasso,
  IconBpeSpace,
} from '@/core/toolbar/utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const UtilsGroup = () => {
  const currentModeler = useSelector(getCurrentModeler);
  const [handTool, lassoTool, spaceTool, globalConnect, eventBus] = useGetModelerModules([
    'handTool',
    'lassoTool',
    'spaceTool',
    'globalConnect',
    'eventBus',
  ]);
  const [currentActiveTool, setCurrentActiveTool] = useState<string | undefined>();

  const toggleTool = (tool: any, toolName: string) => {
    //@ts-ignore
    tool.toggle();
    setCurrentActiveTool((tool) => (tool !== toolName ? toolName : undefined));
  };

  //@ts-ignore
  useHotkeys([
    [TOOLBAR_HOTKEYS.HAND_TOOL, () => toggleTool(handTool, 'handTool')],
    [TOOLBAR_HOTKEYS.LASSO_TOOL, () => toggleTool(lassoTool, 'lassoTool')],
    [TOOLBAR_HOTKEYS.SPACE_TOOL, () => toggleTool(spaceTool, 'spaceTool')],
    [TOOLBAR_HOTKEYS.GLOBAL_CONNECT, () => toggleTool(globalConnect, 'globalConnect')],
  ]);

  //@ts-ignore
  eventBus?.once(['hand.ended', 'lasso.ended', 'spaceTool.ended', 'global-connect.ended'], () => {
    setCurrentActiveTool(undefined);
  });

  useEffect(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCurrentActiveTool(undefined);
      }
    });

    return () => {
      document.removeEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setCurrentActiveTool(undefined);
        }
      });
    };
  }, []);

  return (
    <Stack spacing={DEFAULT_SPACING + 10}>
      <Group spacing={5}>
        <Stack>
          <ToolbarIcon
            icon={IconBpeHand}
            label="Hand"
            title="Activate Hand Tool"
            orientation="horizontal"
            size="small"
            onClick={() => toggleTool(handTool, 'handTool')}
            active={currentActiveTool === 'handTool'}
            hotkey={TOOLBAR_HOTKEYS.HAND_TOOL}
            disabled={!currentModeler}
          />
          <ToolbarIcon
            icon={IconBpeLasso}
            label="Lasso"
            title="Activate Lasso Tool"
            orientation="horizontal"
            size="small"
            onClick={() => toggleTool(lassoTool, 'lassoTool')}
            active={currentActiveTool === 'lassoTool'}
            hotkey={TOOLBAR_HOTKEYS.LASSO_TOOL}
            overflow
            disabled={!currentModeler}
          />
        </Stack>
        <Stack>
          <ToolbarIcon
            icon={IconBpeSpace}
            label="Space"
            title="Activate Space Tool"
            orientation="horizontal"
            size="small"
            onClick={() => toggleTool(spaceTool, 'spaceTool')}
            active={currentActiveTool === 'spaceTool'}
            hotkey={TOOLBAR_HOTKEYS.SPACE_TOOL}
            disabled={!currentModeler}
          />
          <ToolbarIcon
            icon={IconBpeConnector}
            label="Connector"
            title="Activate Global Connector"
            orientation="horizontal"
            size="small"
            onClick={() => toggleTool(globalConnect, 'globalConnect')}
            active={currentActiveTool === 'globalConnect'}
            hotkey={TOOLBAR_HOTKEYS.GLOBAL_CONNECT}
            disabled={!currentModeler}
          />
        </Stack>
      </Group>
      <Text size="xs" align="center" weight="bold">
        Utilities
      </Text>
    </Stack>
  );
};

export default UtilsGroup;
