import { Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
//@ts-ignore
import { is } from 'bpmn-js/lib/util/ModelUtil';
//@ts-ignore
import PauseHandler from 'bpmn-js-token-simulation/lib/features/context-pads/handler/PauseHandler';
//@ts-ignore
import TriggerHandler from 'bpmn-js-token-simulation/lib/features/context-pads/handler/TriggerHandler';

import {
  IconBpeMultipleCase,
  IconBpeOneCase,
  IconBpeStepByStep,
} from '@/core/toolbar/utils/icons/Icons';
import * as selectors from '@/redux/selectors';
import { toolSliceActions } from '@/redux/slices';
import { useAppDispatch } from '@/redux/store';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { SIMULATION_CASE_MODE } from '../../constants/simulation';
import { DEFAULT_SPACING } from '../../constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const SimulationModesGroup = () => {
  const modeler = useSelector(selectors.getCurrentModeler)?.modeler;
  const dispatch = useAppDispatch();
  const stepperMode = useSelector(selectors.selectSimulationMode);
  const [elements, setElements] = useState([]);
  const [elementRegistry, eventBus, simulator, contextPads, resetSimulation] = useGetModelerModules(
    ['elementRegistry', 'eventBus', 'simulator', 'contextPads', 'resetSimulation']
  );

  const onElementSelect = (context: any) => {
    const { newSelection } = context;
    if (newSelection?.length < 1 || newSelection?.length > 1) {
      dispatch(toolSliceActions.setElementSelected(undefined));
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
    setElements(elements);
  }, [elementRegistry]);

  useEffect(() => {
    //@ts-ignore
    eventBus?.on('selection.changed', onElementSelect);
    return () => {
      //@ts-ignore
      eventBus?.off('selection.changed', onElementSelect);
    };
  }, [eventBus]);

  useEffect(() => {
    elements?.map((element) => {
      if (
        !is(element, 'bpmn:SequenceFlow') &&
        !is(element, 'bpmn:Participant') &&
        !is(element, 'bpmn:Process') &&
        !is(element, 'bpmn:Collaboration') &&
        !is(element, 'bpmn:StartEvent') &&
        !is(element, 'bpmn:EndEvent')
      ) {
        if (stepperMode === SIMULATION_CASE_MODE.STEP_BY_STEP) {
          //@ts-ignore
          simulator.waitAtElement(element);
        } else {
          //@ts-ignore
          simulator.setConfig(element, {
            wait: false,
          });
        }
      }
    });
  }, [stepperMode, elements]);

  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <ToolbarIcon
        icon={IconBpeStepByStep}
        label="Step By Step"
        title="Switch to Step By Step mode"
        orientation="horizontal"
        size="small"
        onClick={() => {
          dispatch(toolSliceActions.setSimulationMode(SIMULATION_CASE_MODE.STEP_BY_STEP));
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
          dispatch(toolSliceActions.setSimulationMode(SIMULATION_CASE_MODE.ONE_CASE));
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
      <Text size="xs" align="center" weight="bold">
        Modes
      </Text>
    </Stack>
  );
};

export default SimulationModesGroup;
