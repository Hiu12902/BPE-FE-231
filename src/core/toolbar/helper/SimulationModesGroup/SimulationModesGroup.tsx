import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionIcon, Affix, Button, Space, Stack, Text, Transition } from '@mantine/core';
//@ts-ignore
import { is } from 'bpmn-js/lib/util/ModelUtil';
//@ts-ignore
import PauseHandler from 'bpmn-js-token-simulation/lib/features/context-pads/handler/PauseHandler';
//@ts-ignore
import TriggerHandler from 'bpmn-js-token-simulation/lib/features/context-pads/handler/TriggerHandler';

import { DEFAULT_SPACING } from '../../constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import {
  IconBpeBranchingWhite,
  IconBpeMultipleCase,
  IconBpeOneCase,
  IconBpePlayWhite,
  IconBpeStepByStep,
} from '@/core/toolbar/utils/icons/Icons';
import { ModelerContext } from '../../../context/ModelerContext';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { SIMULATION_CASE_MODE } from '../../constants/simulation';
//@ts-ignore
import { findSet } from 'bpmn-js-token-simulation/lib/simulator/util/SetUtil';
import { useAppDispatch } from '@/redux/store';
import { toolSliceActions } from '@/redux/slices';
import * as toolSelectors from '@/redux/selectors';
import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';

const SimulationModesGroup = () => {
  const modeler = useContext(ModelerContext);
  const dispatch = useAppDispatch();
  const [stepperMode, setStepperMode] = useState<SIMULATION_CASE_MODE>(
    SIMULATION_CASE_MODE.ONE_CASE
  );
  const [overlayId, setOverlayId] = useState('');
  const [overlayPosition, setOverlayPosition] = useState({
    top: 0,
    left: 0,
  });
  const currentElement = useSelector(toolSelectors.selectElementSelected);
  const currentScope = useSelector(toolSelectors.selectCurrentScope);
  const currentEvent = useSelector(toolSelectors.selectCurrentEvent);
  const [opened, setOpened] = useState(false);
  const [isGateway, setIsGateway] = useState(false);
  const [
    elementRegistry,
    eventBus,
    simulator,
    contextPads,
    resetSimulation,
    exclusiveGatewaySettings,
    overlays,
    simulationSupport,
  ] = useGetModelerModules(modeler, [
    'elementRegistry',
    'eventBus',
    'simulator',
    'contextPads',
    'resetSimulation',
    'exclusiveGatewaySettings',
    'overlays',
    'simulationSupport',
  ]);

  const icons = [
    {
      icon: <IconBpePlayWhite height={30} width={30} />,
      duration: 400,
      onClick: () => {
        if (stepperMode === SIMULATION_CASE_MODE.STEP_BY_STEP) {
          //@ts-ignore
          currentScope && simulator?.trigger({ event: currentEvent, scope: currentScope });
        } else {
          //@ts-ignore
          simulationSupport?.triggerElement(currentElement?.id);
        }
      },
      visible: true,
    },
    {
      icon: <IconBpeBranchingWhite height={30} width={30} />,
      duration: 300,
      onClick: () => {
        console.log(currentElement);
        //@ts-ignore
        currentElement && exclusiveGatewaySettings?.setSequenceFlow(currentElement);
      },
      visible: isGateway,
    },
  ];

  const onTraceSimulation = (context: any) => {
    const element = context?.element;

    if (
      !is(element, 'bpmn:SequenceFlow') &&
      !is(element, 'bpmn:Participant') &&
      !is(element, 'bpmn:Process') &&
      !is(element, 'bpmn:Collaboration') &&
      !is(element, 'bpmn:StartEvent') &&
      !is(element, 'bpmn:EndEvent') &&
      context?.action === 'enter'
    ) {
      //@ts-ignore
      console.log(simulationSupport?.getElementTrigger(context?.element?.id));
      setIsGateway(is(element, 'bpmn:ExclusiveGateway'));
      if (stepperMode === SIMULATION_CASE_MODE.STEP_BY_STEP) {
        //@ts-ignore
        simulator.waitAtElement(context?.element);
      } else {
        //@ts-ignore
        simulator.setConfig(context?.element, {
          wait: false,
        });
      }
    } else if (is(element, 'bpmn:SequenceFlow')) {
      if (overlayId) {
        //@ts-ignore
        overlays?.remove(overlayId);
      }
    }
  };

  const onElementSelect = (context: any) => {
    const { newSelection } = context;
    if (newSelection?.length < 1 || newSelection?.length > 1) {
      if (overlayId) {
        //@ts-ignore
        overlays?.remove(overlayId);
      }
      return;
    }
    const element = newSelection[0];

    if (
      !is(element, 'bpmn:SequenceFlow') &&
      !is(element, 'bpmn:Participant') &&
      !is(element, 'bpmn:Process') &&
      !is(element, 'bpmn:Collaboration') &&
      !is(element, 'bpmn:StartEvent') &&
      !is(element, 'bpmn:EndEvent')
    ) {
      dispatch(toolSliceActions.setElementSelected(element));
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
    return;
  };

  function getOffset(el: HTMLElement) {
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  }

  useEffect(() => {
    //@ts-ignore
    const elements = elementRegistry?.getAll();
    elements?.map(
      (element: any) =>
        !is(element, 'bpmn:SequenceFlow') &&
        !is(element, 'bpmn:Participant') &&
        !is(element, 'bpmn:Process') &&
        !is(element, 'bpmn:Collaboration') &&
        !is(element, 'bpmn:StartEvent') &&
        !is(element, 'bpmn:Activity') &&
        (() => {
          //@ts-ignore
          contextPads.registerHandler(element?.type, PauseHandler);
          //@ts-ignore
          contextPads.registerHandler(element?.type, TriggerHandler);
        })()
    );
    console.log(eventBus);
  }, [elementRegistry]);

  useEffect(() => {
    //@ts-ignore
    eventBus?.on('tokenSimulation.simulator.trace', onTraceSimulation);
    return () => {
      //@ts-ignore
      eventBus?.off('tokenSimulation.simulator.trace', onTraceSimulation);
    };
  }, [stepperMode, eventBus]);

  useEffect(() => {
    //@ts-ignore
    eventBus?.on('selection.changed', onElementSelect);
    return () => {
      //@ts-ignore
      eventBus?.on('selection.changed', onElementSelect);
    };
  }, [eventBus]);

  useEffect(() => {
    if (!!currentElement) {
      //@ts-ignore
      const newOverlayId = overlays?.add(currentElement, {
        html: `<button id=${currentElement.id} class="overlay-button" >Actions</button>`,
        position: {
          top: -10,
          left: -10,
        },
      });
      if (overlayId) {
        //@ts-ignore
        overlays?.remove(overlayId);
      }
      setOverlayId(newOverlayId);
      const overlayButton = document.getElementById(currentElement.id);
      setOverlayPosition({
        top: getOffset(overlayButton!)?.top || 0,
        left: getOffset(overlayButton!)?.left || 0,
      });
      overlayButton?.addEventListener('click', () => {
        setOpened((o) => !o);
      });
    }
  }, [currentElement]);

  useEffect(() => {
    return () => {
      //@ts-ignore
      overlayId && overlays?.remove(overlayId);
    };
  }, [overlayId]);

  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <ToolbarIcon
        icon={IconBpeStepByStep}
        label="Step By Step"
        title="Switch to Step By Step mode"
        orientation="horizontal"
        size="small"
        onClick={() => {
          setStepperMode(SIMULATION_CASE_MODE.STEP_BY_STEP);
          //@ts-ignore
          resetSimulation.resetSimulation();
        }}
        active={stepperMode === SIMULATION_CASE_MODE.STEP_BY_STEP}
      />
      <ToolbarIcon
        icon={IconBpeOneCase}
        label="One Case"
        title="Switch to One Case mode"
        orientation="horizontal"
        size="small"
        onClick={() => {
          setStepperMode(SIMULATION_CASE_MODE.ONE_CASE);
          //@ts-ignore
          resetSimulation.resetSimulation();
        }}
        active={stepperMode === SIMULATION_CASE_MODE.ONE_CASE}
      />
      <ToolbarIcon
        icon={IconBpeMultipleCase}
        label="Multiple Cases"
        title="Switch to Multiple Case mode"
        orientation="horizontal"
        size="small"
        disabled
      />
      {icons.map((item, index: number) => (
        <Affix
          position={{ top: overlayPosition.top - 40 - 35 * index, left: overlayPosition.left }}
        >
          <Transition
            mounted={opened && item.visible}
            transition="slide-up"
            duration={item.duration}
            timingFunction="ease"
            key={index}
          >
            {(styles) => (
              <div style={styles}>
                <ActionIcon
                  variant="filled"
                  radius={50}
                  size={30}
                  onClick={item.onClick}
                  color={PRIMARY_COLOR[0]}
                >
                  {item.icon}
                </ActionIcon>
                <Space h={5} />
              </div>
            )}
          </Transition>
        </Affix>
      ))}
      <Text size="xs" align="center">
        Modes
      </Text>
    </Stack>
  );
};

export default SimulationModesGroup;
