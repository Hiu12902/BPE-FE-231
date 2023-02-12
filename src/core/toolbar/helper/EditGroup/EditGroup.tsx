import { Divider, Group, Stack, Text } from '@mantine/core';
import { DEFAULT_SPACING } from '../../constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import {
  IconBpeDelete,
  IconBpeRedo,
  IconBpeUndo,
  IconBpeZoomIn,
  IconBpeZoomOut,
  IconBpeZoomReset,
} from '../../utils/icons/Icons';
import { useContext, useState } from 'react';
import { ModelerContext } from '../../../context/ModelerContext';
import useGetModelerModules from '../../../hooks/useGetModelerModule';

const EditingGroup = () => {
  const modeler = useContext(ModelerContext);
  const [editorActions, eventBus, zoomScroll, canvas, commandStack] = useGetModelerModules(
    modeler,
    ['editorActions', 'eventBus', 'zoomScroll', 'canvas', 'commandStack']
  );

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
