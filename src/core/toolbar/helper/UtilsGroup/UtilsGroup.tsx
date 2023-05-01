import { Group, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

import { getCurrentModeler } from '@/redux/selectors';
import { useHotkeys } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { TOOLBAR_HOTKEYS } from '../../constants/hotkeys';
import { DEFAULT_SPACING } from '../../constants/size';
import { IconBpeConnector, IconBpeHand, IconBpeLasso, IconBpeSpace } from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const UtilsGroup = () => {
  const modeler = useSelector(getCurrentModeler)?.modeler;
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
      <Group>
        <Stack>
          <ToolbarIcon
            icon={IconBpeHand}
            label="Hand Tool"
            title="Activate Hand Tool"
            orientation="horizontal"
            size="small"
            onClick={() => toggleTool(handTool, 'handTool')}
            active={currentActiveTool === 'handTool'}
            hotkey={TOOLBAR_HOTKEYS.HAND_TOOL}
            overflow
          />
          <ToolbarIcon
            icon={IconBpeLasso}
            label="Lasso Tool"
            title="Activate Lasso Tool"
            orientation="horizontal"
            size="small"
            //@ts-ignore
            onClick={() => toggleTool(lassoTool, 'lassoTool')}
            active={currentActiveTool === 'lassoTool'}
            hotkey={TOOLBAR_HOTKEYS.LASSO_TOOL}
            overflow
          />
        </Stack>
        <Stack>
          <ToolbarIcon
            icon={IconBpeSpace}
            label="Space Tool"
            title="Activate Space Tool"
            orientation="horizontal"
            size="small"
            //@ts-ignore
            onClick={() => toggleTool(spaceTool, 'spaceTool')}
            active={currentActiveTool === 'spaceTool'}
            hotkey={TOOLBAR_HOTKEYS.SPACE_TOOL}
            overflow
          />
          <ToolbarIcon
            icon={IconBpeConnector}
            label="Global Connector"
            title="Activate Global Connector"
            orientation="horizontal"
            size="small"
            //@ts-ignore
            onClick={() => toggleTool(globalConnect, 'globalConnect')}
            active={currentActiveTool === 'globalConnect'}
            hotkey={TOOLBAR_HOTKEYS.GLOBAL_CONNECT}
            overflow
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
