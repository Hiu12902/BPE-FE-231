import { Group, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
//@ts-ignore
import { is } from 'bpmn-js/lib/util/ModelUtil';

import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import {
  IconBpeBranching,
  IconBpePausepointActive,
  IconBpePausepointInactive,
  IconBpePlayWhite,
} from '@/core/toolbar/utils/icons/Icons';
import * as selectors from '@/redux/selectors';
import { toolSliceActions } from '@/redux/slices';
import { useAppDispatch } from '@/redux/store';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const SimulationActionGroup = () => {
  const dispatch = useAppDispatch();
  const modeler = useSelector(selectors.getCurrentModeler)?.modeler;
  const [simulator, exclusiveGatewaySettings, simulationSupport, eventBus] = useGetModelerModules([
    'simulator',
    'exclusiveGatewaySettings',
    'simulationSupport',
    'eventBus',
  ]);

  const currentElement = useSelector(selectors.selectElementSelected);
  const currentScope = useSelector(selectors.selectCurrentScope);

  const [isAtCurrentElement, setIsAtCurrentElement] = useState(false);
  const [currentElementTraversed, setCurrentElementTraversed] = useState<any>();
  const [isWait, setIsWait] = useState(false);

  const getFirstIcon = () => {
    if (isAtCurrentElement && isWait) {
      return {
        icon: IconBpePlayWhite,
        onClick: () =>
          currentScope &&
          //@ts-ignore
          simulator?.exit({ element: currentElement, scope: currentScope }),
        label: 'Continue',
        title: 'Continue Simulation',
      };
    } else if (!isAtCurrentElement && isWait) {
      return {
        icon: IconBpePausepointActive,
        onClick: () => {
          if (currentElement) {
            //@ts-ignore
            simulator?.setConfig(currentElement, {
              wait: false,
            });
            setIsWait(false);
          }
        },
        label: 'Unpause',
        title: 'Remove pause point to element',
      };
    }
    return {
      icon: IconBpePausepointInactive,
      onClick: () => {
        if (currentElement) {
          //@ts-ignore
          simulator?.setConfig(currentElement, {
            wait: true,
          });
          setIsWait(true);
        }
      },
      label: 'Pause',
      title: 'Add pause point to element',
    };
  };

  const icons = [
    {
      ...getFirstIcon(),
      visible: true,
    },
    {
      icon: IconBpeBranching,
      onClick: () => {
        //@ts-ignore
        currentElement && exclusiveGatewaySettings?.setSequenceFlow(currentElement);
      },
      visible: is(currentElement, 'bpmn:Gateway'),
      label: 'Switch branch',
      title: 'Switch to another branch',
    },
  ];

  const onElementChanged = (context: any) => {
    if (context?.action === 'enter') {
      const element = context?.element;
      setIsAtCurrentElement(element === currentElement?.id);
      setCurrentElementTraversed(element);

      if (
        !is(element, 'bpmn:SequenceFlow') &&
        !is(element, 'bpmn:Participant') &&
        !is(element, 'bpmn:Process') &&
        !is(element, 'bpmn:Collaboration') &&
        !is(element, 'bpmn:StartEvent') &&
        !is(element, 'bpmn:EndEvent')
      ) {
        //@ts-ignore
        const isWait = simulator?.getConfig(element).wait;
        //@ts-ignore
        const scope = simulator?.findScope({ element });
        if (isWait) {
          dispatch(
            toolSliceActions.setCurrentEvent({
              element,
              type: 'continue',
              interrupting: false,
              boundary: false,
            })
          );
        }
        dispatch(toolSliceActions.setCurrentScope(scope));
      }
    }
  };

  useEffect(() => {
    //@ts-ignore
    eventBus?.on('tokenSimulation.simulator.trace', onElementChanged);

    return () => {
      //@ts-ignore
      eventBus?.off('tokenSimulation.simulator.trace', onElementChanged);
    };
  }, [eventBus]);

  useEffect(() => {
    setIsAtCurrentElement(currentElementTraversed?.id === currentElement?.id);
    //@ts-ignore
    currentElement && setIsWait(simulator?.getConfig(currentElement)?.wait);
  }, [currentElement, currentElementTraversed]);

  return currentElement ? (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        {icons.map(
          (icon) =>
            icon.visible && (
              <ToolbarIcon
                label={icon.label}
                title={icon.title}
                orientation="vertical"
                size="large"
                icon={icon.icon}
                onClick={icon.onClick}
              />
            )
        )}
      </Group>
      <Text size="xs" align="center">
        Actions
      </Text>
    </Stack>
  ) : null;
};

export default SimulationActionGroup;
