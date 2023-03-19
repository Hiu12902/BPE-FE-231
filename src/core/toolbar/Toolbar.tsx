import React, { useContext, useEffect, useState } from 'react';
import { Header, Group, Space, Stack, Text, Center, Divider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

import { PALETTE_WIDTH, TOOLBAR_HEIGHT } from '../../constants/theme/themeConstants';
import {
  IconBpeSave,
  IconBpeValidate,
  IconBpeHistory,
  IconBpeBold,
  IconBpeItalic,
  IconBpeUnderline,
  IconBpeTextSize,
  IconBpeTextColor,
  IconBpeElementColor,
  IconBpeClearStyle,
} from './utils/icons/Icons';
import ToolbarIcon from './helper/ToolbarIcon/ToolbarIcon';
import UtilsGroup from './helper/UtilsGroup/UtilsGroup';
import ClipBoardGroup from './helper/ClipBoardGroup/ClipBoardGroup';
import EditingGroup from './helper/EditGroup/EditGroup';
import ImportExportGroup from './helper/ImportExportGroup/ImportExportGroup';
import MiscGroup from './helper/MiscGroup/MiscGroup';
import DiagramGroup from './helper/DiagramGroup/DiagramGroup';
import { ToolbarModeContext } from '../context/ToolbarModeContext';
import { TOOLBAR_MODE } from '../../constants/toolbar';
import SimulationDiagramGroup from './helper/SimulationDiagramGroup/SimulationDiagramGroup';
import SimulationModesGroup from './helper/SimulationModesGroup/SimulationModesGroup';
import SimulationPlayerGroup from './helper/SimulationPlayerGroup/SimulationPlayerGroup';
import SimulationSpeedGroup from './helper/SimulationSpeedGroup/SimulationSpeedGroup';
import SimulationMiscGroup from './helper/SimulationMiscGroup/SimulationMiscGroup';

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

const DefaultToolbar = () => {
  return (
    <>
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
    </>
  );
};

const SimulationToolbar = () => {
  return (
    <>
      <SimulationDiagramGroup />
      <Divider size="xs" orientation="vertical" />
      <SimulationModesGroup />
      <Divider size="xs" orientation="vertical" />
      <SimulationPlayerGroup />
      <Divider size="xs" orientation="vertical" />
      <SimulationSpeedGroup />
      <Divider size="xs" orientation="vertical" />
      <SimulationMiscGroup />
    </>
  );
};

const BpeToolbar = () => {
  const [toolbarMode, setToolbarMode] = useContext(ToolbarModeContext);

  return (
    <Header height={TOOLBAR_HEIGHT} p={0} fixed={false}>
      <Group ml={PALETTE_WIDTH + 10} spacing="sm">
        {toolbarMode === TOOLBAR_MODE.DEFAULT ? (
          <DefaultToolbar />
        ) : toolbarMode === TOOLBAR_MODE.SIMULATING ? (
          <SimulationToolbar />
        ) : null}
      </Group>
    </Header>
  );
};

export default BpeToolbar;
