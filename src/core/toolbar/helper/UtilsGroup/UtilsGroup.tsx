import { useContext } from 'react';
import { Group, Stack, Text } from '@mantine/core';

import { ModelerContext } from '../../../context/ModelerContext';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '../../constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { IconBpeConnector, IconBpeHand, IconBpeLasso, IconBpeSpace } from '../../utils/icons/Icons';

const UtilsGroup = () => {
  const modeler = useContext(ModelerContext);
  const [handTool, lassoTool, spaceTool, globalConnect] = useGetModelerModules(modeler, [
    'handTool',
    'lassoTool',
    'spaceTool',
    'globalConnect',
  ]);

  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <Group>
        <ToolbarIcon
          icon={IconBpeHand}
          label="Hand Tool"
          title="Activate Hand Tool"
          orientation="vertical"
          size="large"
          //@ts-ignore
          onClick={(event) => handTool.activateHand(event)}
        />
        <ToolbarIcon
          icon={IconBpeLasso}
          label="Lasso Tool"
          title="Activate Lasso Tool"
          orientation="vertical"
          size="large"
          //@ts-ignore
          onClick={(event) => lassoTool.activateSelection(event)}
        />
        <ToolbarIcon
          icon={IconBpeSpace}
          label="Space Tool"
          title="Activate Space Tool"
          orientation="vertical"
          size="large"
          //@ts-ignore
          onClick={(event) => spaceTool.activateSelection(event)}
        />
        <ToolbarIcon
          icon={IconBpeConnector}
          label="Global Connector"
          title="Activate Global Connector"
          orientation="vertical"
          size="large"
          //@ts-ignore
          onClick={(event) => globalConnect.start(event)}
        />
      </Group>
      <Text size="xs" align="center" weight="bold">
        Utilities
      </Text>
    </Stack>
  );
};

export default UtilsGroup;
