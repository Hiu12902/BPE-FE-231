import { getCurrentModeler } from '@/redux/selectors';
import { Divider, Group, Stack, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { TOOLBAR_HOTKEYS } from '../../constants/hotkeys';
import { DEFAULT_SPACING } from '../../constants/size';
import {
  IconBpeDelete,
  IconBpeRedo,
  IconBpeUndo,
  IconBpeZoomIn,
  IconBpeZoomOut,
  IconBpeZoomReset,
} from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const EditingGroup = () => {
  const modeler = useSelector(getCurrentModeler)?.modeler;

  const [editorActions, eventBus, zoomScroll, canvas, commandStack] = useGetModelerModules([
    'editorActions',
    'eventBus',
    'zoomScroll',
    'canvas',
    'commandStack',
  ]);

  const [deleteAccess, setDeleteAccess] = useState(false);

  eventBus &&
    //@ts-ignore
    eventBus.on('selection.changed', (context) => {
      if (context.newSelection.length > 0) {
        setDeleteAccess(() => true);
      } else {
        setDeleteAccess(() => false);
      }
    });

  const handleDelete = () => {
    //@ts-ignore
    editorActions.trigger('removeSelection');
  };

  useHotkeys([
    //@ts-ignore
    [TOOLBAR_HOTKEYS.ZOOMIN, () => zoomScroll.stepZoom(1)],
    //@ts-ignore
    [TOOLBAR_HOTKEYS.ZOOMOUT, () => zoomScroll.stepZoom(-1)],
    //@ts-ignore
    [TOOLBAR_HOTKEYS.RESET_ZOOM, () => canvas.zoom('fit-viewport', 'auto')],
  ]);

  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group spacing={DEFAULT_SPACING}>
        <ToolbarIcon
          icon={IconBpeDelete}
          label="Delete"
          title="Delete Element"
          orientation="vertical"
          size="large"
          disabled={!modeler || !deleteAccess}
          onClick={handleDelete}
          hotkey={TOOLBAR_HOTKEYS.DELETE}
        />
        <Stack spacing={0}>
          <Group spacing={DEFAULT_SPACING}>
            <ToolbarIcon
              icon={IconBpeRedo}
              title="Redo"
              orientation="vertical"
              size="small"
              disabled={!modeler}
              //@ts-ignore
              onClick={() => commandStack.redo()}
              hotkey={TOOLBAR_HOTKEYS.REDO}
            />
            <Divider size="xs" orientation="vertical" />
            <ToolbarIcon
              icon={IconBpeUndo}
              title="Undo"
              orientation="vertical"
              size="small"
              disabled={!modeler}
              //@ts-ignore
              onClick={() => commandStack.undo()}
              hotkey={TOOLBAR_HOTKEYS.UNDO}
            />
          </Group>
          <Divider my="xs" />
          <Group spacing={DEFAULT_SPACING}>
            <ToolbarIcon
              icon={IconBpeZoomOut}
              title="Zoom Out"
              orientation="vertical"
              size="small"
              disabled={!modeler}
              //@ts-ignore
              onClick={() => zoomScroll.stepZoom(-1)}
              hotkey={TOOLBAR_HOTKEYS.ZOOMOUT}
            />
            <Divider size="xs" orientation="vertical" />
            <ToolbarIcon
              icon={IconBpeZoomIn}
              title="Zoom In"
              orientation="vertical"
              disabled={!modeler}
              size="small"
              //@ts-ignore
              onClick={() => zoomScroll.stepZoom(1)}
              hotkey={TOOLBAR_HOTKEYS.ZOOMIN}
            />
            <Divider size="xs" orientation="vertical" />
            <ToolbarIcon
              icon={IconBpeZoomReset}
              title="Reset Zoom"
              orientation="vertical"
              size="small"
              disabled={!modeler}
              //@ts-ignore
              onClick={() => canvas.zoom('fit-viewport', 'auto')}
              hotkey={TOOLBAR_HOTKEYS.RESET_ZOOM}
            />
          </Group>
        </Stack>
      </Group>
      <Text size="xs" align="center" weight="bold">
        Edit
      </Text>
    </Stack>
  );
};

export default EditingGroup;
