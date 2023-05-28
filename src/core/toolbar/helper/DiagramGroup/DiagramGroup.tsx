import {
  Affix,
  Button,
  Container,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  Transition,
} from '@mantine/core';
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
  comparingActions,
  evaluatedResultActions,
  lintingActions,
  tabsSliceActions,
  toolSliceActions,
} from '@/redux/slices';
import { TabVariant } from '@/redux/slices/tabs';
import { useAppDispatch } from '@/redux/store';
import { useForm } from '@mantine/form';
import { randomId, useClipboard, useHotkeys } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { filter, findIndex, flatten, keys, map, values } from 'lodash';
import { TOOLBAR_HOTKEYS } from '../../constants/hotkeys';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { getElementForGraph } from './helper/getElementJson';

const planeSuffix = '_plane';

interface UserInputProps {
  cycleTime: number | undefined;
  cost: number | undefined;
  quality: number | undefined;
  flexibility: number | undefined;
  transparency: number | undefined;
  exceptionHandling: number | undefined;
}

interface UserInputForm {
  target: UserInputProps;
  worst: UserInputProps;
}

const UserInputFormTitleMap: Record<keyof UserInputForm, string> = {
  target: 'Target',
  worst: 'Worst',
};

const UserInputFormLableMap: Record<keyof UserInputProps, string> = {
  cycleTime: 'Cycle Time',
  cost: 'Cost',
  quality: 'Quality',
  flexibility: 'Flexibility',
  transparency: 'Transparency',
  exceptionHandling: 'Exception Handling',
};

const DiagramGroup = () => {
  const dispatch = useAppDispatch();
  const currentElement = useSelector(selectors.selectElementSelected);
  const tabs = useSelector(selectors.getTabs);
  const clipboard = useClipboard();
  const modeler = useSelector(selectors.getCurrentModeler)?.modeler;
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const modelers = useSelector(selectors.getModelers);
  const [showAffix, setShowAffix] = useState(false);
  const [toggleMode, canvas, eventBus, elementRegistry, linting] = useGetModelerModules([
    'toggleMode',
    'canvas',
    'eventBus',
    'elementRegistry',
    'linting',
  ]);

  const userInputForm = useForm<UserInputForm>({
    initialValues: {
      target: {
        cycleTime: undefined,
        cost: undefined,
        flexibility: 100,
        quality: 100,
        exceptionHandling: 100,
        transparency: 100,
      },
      worst: {
        cycleTime: undefined,
        cost: undefined,
        flexibility: 0,
        quality: 0,
        exceptionHandling: 0,
        transparency: 0,
      },
    },
  });

  const [openInputModal, setOpenInputModal] = useState(false);
  const [isInputValid, setIsInputValid] = useState(false);

  const checkUserInput = () => {
    const invalidValue = findIndex(
      flatten(map(values(userInputForm.values), (obj) => values(obj))),
      (value) => typeof value !== 'number'
    );
    return invalidValue < 0;
  };

  useEffect(() => {
    setIsInputValid(() => !checkUserInput());
  }, [userInputForm.values]);

  const renderInputModal = () => {
    return (
      <Modal
        onClose={() => setOpenInputModal(false)}
        opened={openInputModal}
        title="Please Input Your Expected values"
        size="lg"
      >
        <Container>
          <Stack>
            <Group position="apart">
              {keys(userInputForm.values).map((key) => (
                <Stack>
                  {keys(userInputForm.values[key as keyof UserInputForm]).map((subkey) => (
                    <NumberInput
                      label={`${UserInputFormTitleMap[key as keyof UserInputForm]} ${
                        UserInputFormLableMap[subkey as keyof UserInputProps]
                      }`}
                      {...userInputForm.getInputProps(`${key}.${subkey}`)}
                    />
                  ))}
                </Stack>
              ))}
            </Group>

            <Group position="right">
              <Button onClick={batchEvaluate} disabled={isInputValid}>
                Compare
              </Button>
            </Group>
          </Stack>
        </Container>
      </Modal>
    );
  };

  const getJsonFromModel = (modeler: any) => {
    const elementRegistry = modeler.get('elementRegistry');
    const jsonObj = getElementForGraph(elementRegistry);
    clipboard.copy(JSON.stringify(jsonObj));
    return jsonObj;
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
    batch(() => {
      dispatch(
        tabsSliceActions.setTabs({
          label: `${currentElement.id}_${currentModeler?.name}`,
          value: currentElement.id + planeSuffix,
          variant: TabVariant.SUB_PROCESS,
          toolMode: TOOLBAR_MODE.DEFAULT,
          id: currentElement.id,
          model: currentModeler?.id,
          projectID: currentModeler?.projectId,
        })
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
            tabsSliceActions.setTabs({
              label: `Evaluated Result - ${currentModeler?.name}`,
              value: 'evaluateResult',
              variant: TabVariant.RESULT,
              toolMode: TOOLBAR_MODE.EVALUATING,
              id: newId,
              model: currentModeler?.id,
              projectID: currentModeler?.projectId,
            })
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
      ...userInputForm.values.target,
    };
    obj['worst'] = {
      ...userInputForm.values.worst,
    };
    obj['as_is'] = payload[0];
    obj['to_be'] = payload[1];

    return obj;
  };

  const batchEvaluate = async () => {
    try {
      const results = await Promise.all(
        modelers.map(async (modeler) => {
          return await evaluatedResultApi.evaluate(getJsonFromModel(modeler.modeler));
        })
      );
      const flattenResult = flatten(results);
      const payload = flattenResult.map((result) => ({
        cycleTime: result.totalCycleTime,
        cost: result.totalCost,
        transparency: result.transparency,
        flexibility: result.flexibility,
        exceptionHandling: result.exceptionHandling,
        quality: result.quality,
      }));
      const res = await evaluatedResultApi.compare(buildComparePayload(payload));
      const newId = randomId();
      batch(() => {
        dispatch(evaluatedResultActions.setEvaluatedResult({ result: flattenResult, id: newId }));
        dispatch(comparingActions.setCompareResult(res));
        dispatch(
          comparingActions.setDiagrams({
            toCompareDiagram: modelers[1].id.replace('mantine-', ''),
            diagramComparedTo: modelers[0].id.replace('mantine-', ''),
          })
        );
        dispatch(
          tabsSliceActions.setTabs({
            label: `Comparing - ${currentModeler?.name}`,
            value: 'evaluateResult',
            variant: TabVariant.RESULT,
            toolMode: TOOLBAR_MODE.EVALUATING,
            id: newId,
            isCompare: true,
            projectID: currentModeler?.projectId,
          })
        );
        dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.EVALUATING));
      });
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
    [TOOLBAR_HOTKEYS.EVALUATE, onEvaluateModel],
    [TOOLBAR_HOTKEYS.COMPARE, batchEvaluate],
  ]);

  return (
    <>
      {renderInputModal()}
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
            disabled={!currentModeler}
          />
          <ToolbarIcon
            icon={IconBpeEvaluate}
            label="Evaluate"
            title="Evaluate Model"
            orientation="vertical"
            size="large"
            onClick={onEvaluateModel}
            hotkey={TOOLBAR_HOTKEYS.EVALUATE}
            disabled={!currentModeler}
          />
          <ToolbarIcon
            icon={IconBpeCompare}
            label="Compare"
            title="Compare Model's Versions"
            orientation="vertical"
            size="large"
            disabled={modelers.length < 2}
            hotkey={TOOLBAR_HOTKEYS.COMPARE}
            onClick={() => setOpenInputModal(true)}
          />
        </Group>
        <Text size="xs" align="center" weight="bold">
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
