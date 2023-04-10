import { getCurrentModeler } from '@/redux/selectors';
import { Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '../../constants/size';
import { IconBpeSpeedFast, IconBpeSpeedNormal, IconBpeSpeedSlow } from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

enum AnimationSpeed {
  SLOW = 0.5,
  NORMAL = 1.0,
  FAST = 2.0,
}

const SimulationSpeedGroup = () => {
  const modeler = useSelector(getCurrentModeler)?.modeler;
  const [speed, setSpeed] = useState(1.0);
  const [animation] = useGetModelerModules(['animation']);

  useEffect(() => {
    //@ts-ignore
    animation?.setAnimationSpeed(speed);

    //@ts-ignore
    return () => animation?.setAnimationSpeed(AnimationSpeed.NORMAL);
  }, [speed]);

  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <ToolbarIcon
        icon={IconBpeSpeedSlow}
        label="Slow"
        title="Set slow speed"
        orientation="horizontal"
        size="small"
        active={speed === AnimationSpeed.SLOW}
        onClick={() => setSpeed(AnimationSpeed.SLOW)}
      />
      <ToolbarIcon
        icon={IconBpeSpeedNormal}
        label="Normal"
        title="Set normal speed"
        orientation="horizontal"
        size="small"
        active={speed === AnimationSpeed.NORMAL}
        onClick={() => setSpeed(AnimationSpeed.NORMAL)}
      />
      <ToolbarIcon
        icon={IconBpeSpeedFast}
        label="Fast"
        title="Set fast speed"
        orientation="horizontal"
        size="small"
        active={speed === AnimationSpeed.FAST}
        onClick={() => setSpeed(AnimationSpeed.FAST)}
      />
      <Text size="xs" align="center" weight="bold">
        Speed
      </Text>
    </Stack>
  );
};

export default SimulationSpeedGroup;
