import React, { useContext, useEffect, useState } from 'react';
import { Header, Group, Space, Stack, Text, Center, Divider } from '@mantine/core';
import { PALETTE_WIDTH, TOOLBAR_HEIGHT } from '../../constants/theme/themeConstants';
import {
  IconBpePaste,
  IconBpeCopy,
  IconBpeCut,
  IconBpeSave,
  IconBpeValidate,
  IconBpeHistory,
  IconBpeSimulate,
  IconBpeEvaluate,
  IconBpeCompare,
  IconBpeImport,
  IconBpeExport,
  IconBpeBold,
  IconBpeItalic,
  IconBpeUnderline,
  IconBpeTextSize,
  IconBpeTextColor,
  IconBpeElementColor,
  IconBpeClearStyle,
  IconBpeDelete,
  IconBpeRedo,
  IconBpeUndo,
  IconBpeZoomIn,
  IconBpeZoomOut,
  IconBpeComment,
  IconBpeResult,
  IconBpeHand,
  IconBpeLasso,
  IconBpeSpace,
  IconBpeConnector,
} from './utils/icons/Icons';
import ToolbarIcon from './helper/ToolbarIcon/ToolbarIcon';
import useGetModelerModules from '../hooks/useGetModelerModule';
import { ModelerContext } from '../context/ModelerContext';
import UtilsGroup from './helper/UtilsGroup/UtilsGroup';

const DEFAULT_SPACING = 5;

const ClipBoardGroup = () => {
  const modeler = useContext(ModelerContext);
  const [clipboard, copyPaste, elementRegistry] = useGetModelerModules(modeler, [
    'clipboard',
    'copyPaste',
    'elementRegistry',
  ]);

  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group spacing={DEFAULT_SPACING}>
        <ToolbarIcon
          icon={IconBpePaste}
          label="Paste"
          title="Paste Element/Text"
          orientation="vertical"
          size="large"
          disabled={!modeler}
        />
        <Stack spacing={0}>
          <ToolbarIcon
            icon={IconBpeCopy}
            title="Copy Element/Text"
            orientation="horizontal"
            size="small"
            label="Copy"
            disabled={!modeler}
          />
          <Divider my="xs" />
          <ToolbarIcon
            icon={IconBpeCut}
            title="Cut Element/Text"
            orientation="horizontal"
            size="small"
            label="Cut"
            disabled={!modeler}
          />
        </Stack>
      </Group>
      <Text size="xs" align="center">
        Clip board
      </Text>
    </Stack>
  );
};

const ModelGroup = () => {
  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <ToolbarIcon
        icon={IconBpeSave}
        label="Save"
        title="Save Model"
        orientation="horizontal"
        size="small"
      />
      <ToolbarIcon
        icon={IconBpeValidate}
        label="Validate"
        title="Validate Model"
        orientation="horizontal"
        size="small"
      />
      <ToolbarIcon
        icon={IconBpeHistory}
        label="History"
        title="Open Model's Edit History"
        orientation="horizontal"
        size="small"
      />
      <Text size="xs" align="center">
        Model
      </Text>
    </Stack>
  );
};

const DiagramGroup = () => {
  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        <ToolbarIcon
          icon={IconBpeSimulate}
          label="Simulate"
          title="Run Simulation"
          orientation="vertical"
          size="large"
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

const ImportExportGroup = () => {
  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <ToolbarIcon
        icon={IconBpeImport}
        label="Import"
        title="Import File"
        orientation="horizontal"
        size="small"
      />
      <ToolbarIcon
        icon={IconBpeExport}
        label="Export"
        title="Export File"
        orientation="horizontal"
        size="small"
      />
      <Space h={20} />
      <Text size="xs" align="center">
        I/O
      </Text>
    </Stack>
  );
};

const FormattingGroup = () => {
  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <Group spacing="xs">
        <ToolbarIcon icon={IconBpeBold} title="Bold" orientation="vertical" size="small" />
        <ToolbarIcon icon={IconBpeItalic} title="Italic" orientation="vertical" size="small" />
        <ToolbarIcon
          icon={IconBpeUnderline}
          title="Underline"
          orientation="vertical"
          size="small"
        />
        <ToolbarIcon
          icon={IconBpeTextSize}
          title="Change Text Size"
          orientation="vertical"
          size="small"
        />
        <ToolbarIcon
          icon={IconBpeTextColor}
          title="Change Text Color"
          orientation="vertical"
          size="small"
        />
        <ToolbarIcon
          icon={IconBpeElementColor}
          title="Change Element Color"
          orientation="vertical"
          size="small"
        />
        <ToolbarIcon
          icon={IconBpeClearStyle}
          title="Clear All Styles"
          orientation="vertical"
          size="small"
        />
      </Group>
      <Text size="xs" align="center">
        Formatting
      </Text>
    </Stack>
  );
};

const EditingGroup = () => {
  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <Group spacing={DEFAULT_SPACING}>
        <ToolbarIcon
          icon={IconBpeDelete}
          label="Delete"
          title="Delete Element"
          orientation="vertical"
          size="large"
        />
        <Stack spacing={0}>
          <Group spacing={DEFAULT_SPACING}>
            <ToolbarIcon icon={IconBpeRedo} title="Redo" orientation="vertical" size="small" />
            <Divider size="xs" orientation="vertical" />
            <ToolbarIcon icon={IconBpeUndo} title="Undo" orientation="vertical" size="small" />
          </Group>
          <Divider my="xs" />
          <Group spacing={DEFAULT_SPACING}>
            <ToolbarIcon
              icon={IconBpeZoomOut}
              title="Zoom Out"
              orientation="vertical"
              size="small"
            />
            <Divider size="xs" orientation="vertical" />
            <ToolbarIcon icon={IconBpeZoomIn} title="Zoom In" orientation="vertical" size="small" />
          </Group>
        </Stack>
      </Group>
      <Text size="xs" align="center">
        Edit
      </Text>
    </Stack>
  );
};

const MiscGroup = () => {
  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <Group>
        <ToolbarIcon
          icon={IconBpeComment}
          label="Comment"
          title="Open Comment Section"
          orientation="vertical"
          size="large"
        />
        <ToolbarIcon
          icon={IconBpeResult}
          label="Evaluated Results"
          title="Open Evaluated Results"
          orientation="vertical"
          size="large"
        />
      </Group>
      <Text size="xs" align="center">
        Misc
      </Text>
    </Stack>
  );
};
const BpeToolbar = () => {
  return (
    <Header height={TOOLBAR_HEIGHT} p={0} fixed={false}>
      <Group ml={PALETTE_WIDTH + 10} spacing="sm">
        <ClipBoardGroup />
        <Divider size="xs" orientation="vertical" />
        <ModelGroup />
        <Divider size="xs" orientation="vertical" />
        <DiagramGroup />
        <Divider size="xs" orientation="vertical" />
        <ImportExportGroup />
        <Divider size="xs" orientation="vertical" />
        {/* <FormattingGroup />
        <Divider size="xs" orientation="vertical" /> */}
        <EditingGroup />
        <Divider size="xs" orientation="vertical" />
        <UtilsGroup />
        <Divider size="xs" orientation="vertical" />
        <MiscGroup />
      </Group>
    </Header>
  );
};

export default BpeToolbar;
