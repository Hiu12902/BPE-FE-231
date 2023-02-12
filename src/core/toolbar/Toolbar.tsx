import React, { useContext, useEffect, useState } from 'react';
import { Header, Group, Space, Stack, Text, Center, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { PALETTE_WIDTH, TOOLBAR_HEIGHT } from '../../constants/theme/themeConstants';
import {
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
  IconBpeComment,
  IconBpeResult,
} from './utils/icons/Icons';
import ToolbarIcon from './helper/ToolbarIcon/ToolbarIcon';
import UtilsGroup from './helper/UtilsGroup/UtilsGroup';
import ClipBoardGroup from './helper/ClipBoardGroup/ClipBoardGroup';
import EditingGroup from './helper/EditGroup/EditGroup';

const DEFAULT_SPACING = 5;

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
