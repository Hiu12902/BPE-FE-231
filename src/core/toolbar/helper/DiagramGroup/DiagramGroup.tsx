import { Affix, Button, Group, Stack, Text, Transition } from '@mantine/core';
import { useEffect, useState } from 'react';
import { batch, useSelector } from 'react-redux';
//@ts-ignore
import { is } from 'bpmn-js/lib/util/ModelUtil';

import evaluatedResultApi from '@/api/evaluatedResult';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import { IconBpeCompare, IconBpeEvaluate, IconBpeSimulate } from '@/core/toolbar/utils/icons/Icons';
import * as selectors from '@/redux/selectors';
import {
  evaluatedResultActions,
  lintingActions,
  tabsSliceActions,
  toolSliceActions,
} from '@/redux/slices';
import { TabVariant } from '@/redux/slices/tabs';
import { useAppDispatch } from '@/redux/store';
import { randomId, useClipboard, useHotkeys } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { filter, flatten, values } from 'lodash';
import { TOOLBAR_HOTKEYS } from '../../constants/hotkeys';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { getElementForGraph } from './helper/getElementJson';

const planeSuffix = '_plane';

const mockPayload = {
  target: {
    cycleTime: 5,
    cost: 3,
  },
  worst: {
    cycleTime: 20,
    cost: 10,
  },
  as_is: {
    name: 'Process 1',
    cycleTime: 6.25,
    cost: 3.125,
    transparency: [
      {
        view: 'Process 1',
        numberOfExplicitTask: 2,
        transparency: 0.4,
      },
    ],
    flexibility: 0.5,
    exceptionHandling: 0.3,
    quality: 0.8,
  },
  to_be: {
    name: 'Process 2',
    cycleTime: 6,
    cost: 3,
    transparency: [
      {
        view: 'Process 1',
        numberOfExplicitTask: 2,
        transparency: 0.6,
      },
    ],
    flexibility: 0.9,
    exceptionHandling: 0.5,
    quality: 0.6,
  },
};

const DiagramGroup = () => {
  const dispatch = useAppDispatch();
  const currentElement = useSelector(selectors.selectElementSelected);
  const tabs = useSelector(selectors.getTabs);
  const clipboard = useClipboard();
  const modeler = useSelector(selectors.getCurrentModeler)?.modeler;
  const modelers = useSelector(selectors.getModelers);
  const [showAffix, setShowAffix] = useState(false);
  const [toggleMode, canvas, eventBus, elementRegistry, linting] = useGetModelerModules([
    'toggleMode',
    'canvas',
    'eventBus',
    'elementRegistry',
    'linting',
  ]);

  const getJsonFromModel = (modeler: any) => {
    const elementRegistry = modeler.get('elementRegistry');
    const jsonObj = getElementForGraph(elementRegistry);
    clipboard.copy(JSON.stringify(jsonObj));
    return JSON.stringify(jsonObj);
  };

  const lint = async () => {
    //@ts-ignore
    const lintRes = await linting?.lint();
    const issues = flatten(values(lintRes));
    return filter(issues, (issue) => issue.category === 'error');
  };

  const handleSwitchToSimulation = async () => {
    const errors = await lint();
    if (errors.length > 0) {
      notifications.show({
        title: 'Oops',
        message: 'Your model has some errors, please resolve them and try again!',
        color: 'red',
      });
      return;
    }
    dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.SIMULATING));
    //@ts-ignore
    toggleMode.toggleMode(true);
  };

  const onSelectElement = (context: any) => {
    if (context.newSelection.length < 0) {
      setShowAffix(false);
      return;
    }

    const element = context.newSelection[0];
    dispatch(toolSliceActions.setElementSelected(element));
    if (is(element, 'bpmn:SubProcess') && element.collapsed === true) {
      setShowAffix(true);
      return;
    }
    setShowAffix(false);
  };

  const onOpenNewTab = () => {
    const newId = randomId();
    batch(() => {
      dispatch(
        tabsSliceActions.setTabs([
          {
            label: currentElement.id,
            value: currentElement.id + planeSuffix,
            variant: TabVariant.SUB_PROCESS,
            toolMode: TOOLBAR_MODE.DEFAULT,
            id: newId,
          },
        ])
      );
      dispatch(lintingActions.setIsLintingActive(false));
    });
  };

  const onEvaluateModel = async () => {
    const errors = await lint();
    if (errors.length > 0) {
      notifications.show({
        title: 'Oops',
        message: 'Your model has some errors, please try validating it!',
        color: 'red',
      });
      return;
    }

    try {
      const result = await evaluatedResultApi.evaluate(getJsonFromModel(modeler));
      if (result) {
        const newId = randomId();
        batch(() => {
          dispatch(evaluatedResultActions.setEvaluatedResult({ result: result, id: newId }));
          dispatch(
            tabsSliceActions.setTabs([
              {
                label: 'Evaluated Result',
                value: 'evaluateResult',
                variant: TabVariant.RESULT,
                toolMode: TOOLBAR_MODE.EVALUATING,
                id: newId,
              },
            ])
          );
          dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.EVALUATING));
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Oops',
        message:
          'An error has occurred while evaluating your model, please check your model and try again.',
        color: 'red',
      });
      console.error(error);
    }
  };

  const buildComparePayload = (payload: any[]) => {
    const obj: any = {};

    obj['target'] = {
      cycleTime: 5,
      cost: 3,
    };
    obj['worst'] = {
      cycleTime: 20,
      cost: 10,
    };
    obj['as_is'] = payload[0];
    obj['to_be'] = payload[1];

    return obj;
  };

  const batchEvaluate = async () => {
    try {
      // const results = await Promise.all(
      //   modelers.map(async (modeler) => {
      //     return await evaluatedResultApi.evaluate(getJsonFromModel(modeler.modeler));
      //   })
      // );
      // const flattenResult = flatten(results);
      // const payload = flattenResult.map((result) => ({
      //   cycleTime: result.totalCycleTime,
      //   cost: result.totalCost,
      //   transparency: result.transparency,
      //   flexibility: result.flexibility,
      //   exceptionHandling: result.exceptionHandling,
      //   quality: result.quality,
      // }));
      const res = await evaluatedResultApi.compare(JSON.stringify(mockPayload));
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    //@ts-ignore
    eventBus?.on('selection.changed', onSelectElement);
    return () => {
      //@ts-ignore
      eventBus?.off('selection.changed', onSelectElement);
    };
  }, [eventBus]);

  useHotkeys([
    [TOOLBAR_HOTKEYS.SIMULATE, handleSwitchToSimulation],
    [TOOLBAR_HOTKEYS.EVALUATE, () => console.log('reserve for evaluation')],
    [TOOLBAR_HOTKEYS.COMPARE, () => console.log('reserve for comparison')],
  ]);

  return (
    <>
      <Stack spacing={DEFAULT_SPACING}>
        <Group>
          <ToolbarIcon
            icon={IconBpeSimulate}
            label="Simulate"
            title="Run Simulation"
            orientation="vertical"
            size="large"
            onClick={handleSwitchToSimulation}
            hotkey={TOOLBAR_HOTKEYS.SIMULATE}
          />
          <ToolbarIcon
            icon={IconBpeEvaluate}
            label="Evaluate"
            title="Evaluate Model"
            orientation="vertical"
            size="large"
            onClick={onEvaluateModel}
          />
          <ToolbarIcon
            icon={IconBpeCompare}
            label="Compare"
            title="Compare Model's Versions"
            orientation="vertical"
            size="large"
            // disabled={modelers.length < 2}
            onClick={batchEvaluate}
          />
        </Group>
        <Text size="xs" align="center">
          Diagram
        </Text>
      </Stack>
      <Affix position={{ top: 140, right: 350 }}>
        <Transition transition="slide-up" mounted={showAffix}>
          {(transitionStyles) => (
            <Button style={transitionStyles} onClick={onOpenNewTab}>
              Open In New Tab
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  );
};

export default DiagramGroup;
