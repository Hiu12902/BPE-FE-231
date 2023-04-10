import { Divider, Group, Header, Stack, Text } from '@mantine/core';

import * as selectors from '@/redux/selectors';
import { useSelector } from 'react-redux';
import { PALETTE_WIDTH, TOOLBAR_HEIGHT } from '../../constants/theme/themeConstants';
import { TOOLBAR_MODE } from '../../constants/toolbar';
import ClipBoardGroup from './helper/ClipBoardGroup/ClipBoardGroup';
import DiagramGroup from './helper/DiagramGroup/DiagramGroup';
import EditingGroup from './helper/EditGroup/EditGroup';
import EvaluationFunctionGroup from './helper/EvaluationFunctionGroup/EvaluationFunctionGroup';
import ImportExportGroup from './helper/ImportExportGroup/ImportExportGroup';
import MiscGroup from './helper/MiscGroup/MiscGroup';
import ModelGroup from './helper/ModelGroup/ModelGroup';
import SimulationActionGroup from './helper/SimulationActionGroup/SimulationActionGroup';
import SimulationMiscGroup from './helper/SimulationMiscGroup/SimulationMiscGroup';
import SimulationModesGroup from './helper/SimulationModesGroup/SimulationModesGroup';
import SimulationPlayerGroup from './helper/SimulationPlayerGroup/SimulationPlayerGroup';
import SimulationSpeedGroup from './helper/SimulationSpeedGroup/SimulationSpeedGroup';
import ToolbarIcon from './helper/ToolbarIcon/ToolbarIcon';
import UtilsGroup from './helper/UtilsGroup/UtilsGroup';
import {
  IconBpeBold,
  IconBpeClearStyle,
  IconBpeElementColor,
  IconBpeItalic,
  IconBpeTextColor,
  IconBpeTextSize,
  IconBpeUnderline,
} from './utils/icons/Icons';

const DEFAULT_SPACING = 5;

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
      {/* <SimulationDiagramGroup />
      <Divider size="xs" orientation="vertical" /> */}
      <SimulationModesGroup />
      <Divider size="xs" orientation="vertical" />
      <SimulationPlayerGroup />
      <Divider size="xs" orientation="vertical" />
      <SimulationSpeedGroup />
      <Divider size="xs" orientation="vertical" />
      <SimulationMiscGroup />
      <Divider size="xs" orientation="vertical" />
      <SimulationActionGroup />
    </>
  );
};

const BpeToolbar = () => {
  const toolbarMode = useSelector(selectors.selectToolbarMode);

  return (
    <Header height={TOOLBAR_HEIGHT} p={0} fixed={false}>
      <Group ml={PALETTE_WIDTH + 10} spacing="sm">
        {toolbarMode === TOOLBAR_MODE.DEFAULT ? (
          <DefaultToolbar />
        ) : toolbarMode === TOOLBAR_MODE.SIMULATING ? (
          <SimulationToolbar />
        ) : (
          <EvaluationFunctionGroup />
        )}
      </Group>
    </Header>
  );
};

export default BpeToolbar;
