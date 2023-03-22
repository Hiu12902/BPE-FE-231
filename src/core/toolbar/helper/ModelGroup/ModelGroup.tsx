import { useContext, useEffect, useState } from 'react';
import { Stack, Text } from '@mantine/core';

import { ModelerContext } from '../../../context/ModelerContext';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '../../constants/size';
import { IconBpeHistory, IconBpeSave, IconBpeValidate } from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const ModelGroup = () => {
  const modeler = useContext(ModelerContext);
  const [linting, eventBus] = useGetModelerModules(modeler, ['linting', 'eventBus']);
  const [lintingActive, setLintingActive] = useState(false);

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
        onClick={() => {
          //@ts-ignore
          linting?.toggle();
          setLintingActive((o) => !o);
        }}
        active={lintingActive}
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

export default ModelGroup;
