import {
  Affix,
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Stepper,
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
import { filter, findIndex, flatten, keys, map, values } from 'lodash';
import { TOOLBAR_HOTKEYS } from '@/core/toolbar/constants/hotkeys';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { getElementForGraph } from './helper/getElementJson';
import { IModeler } from '@/redux/slices/model';
import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';
import useNotification from '@/hooks/useNotification';

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

interface IItemProps extends IModeler {
  checked?: boolean;
  onSelect?: (modelerId: string) => void;
}

const ModelItem = (props: IItemProps) => {
  const { id, name, projectName, checked, onSelect } = props;

  return (
    <Card
      shadow="xs"
      style={{ cursor: 'pointer', border: checked ? `1px solid ${PRIMARY_COLOR[2]}` : undefined }}
      onClick={() => onSelect?.(id)}
    >
      <Group>
        <Checkbox checked={checked} />
        <Text color={PRIMARY_COLOR[1]}>{name}</Text>
        <Badge radius={0}>project: {projectName}</Badge>
      </Group>
    </Card>
  );
};

const DiagramGroup = () => {
  const dispatch = useAppDispatch();
  const currentElement = useSelector(selectors.selectElementSelected);
  const clipboard = useClipboard();
  const modeler = useSelector(selectors.getCurrentModeler)?.modeler;
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const modelers = useSelector(selectors.getModelers);
  const [showAffix, setShowAffix] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [compareModels, setCompareModels] = useState<IModeler[]>([]);
  const [warningDifferentProject, setWarningDifferentProject] = useState(false);
  const nextStep = () => setActiveStep((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));
  const [toggleMode, eventBus, linting] = useGetModelerModules([
    'toggleMode',
    'eventBus',
    'linting',
  ]);
  const notify = useNotification();

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

  useEffect(() => {
    if (compareModels.length > 1 && compareModels[0].projectId !== compareModels[1].projectId) {
      setWarningDifferentProject(true);
    } else {
      setWarningDifferentProject(false);
    }
  }, [compareModels]);

  const renderInputModal = () => {
    return (
      <Modal
        onClose={() => setOpenInputModal(false)}
        opened={openInputModal}
        title="Please Input Your Expected values"
        size="lg"
      >
        <Stepper
          active={activeStep}
          onStepClick={setActiveStep}
          breakpoint="sm"
          allowNextStepsSelect={false}
          size="sm"
        >
          <Stepper.Step label="Select models" description="Select 2 exact models">
            <Alert style={{ borderLeft: `5px solid ${PRIMARY_COLOR[0]}` }}>
              Hint: only models opened in editor are shown here
            </Alert>
            <Divider my="sm" />
            <SimpleGrid cols={1}>
              {modelers.map((modeler) => (
                <ModelItem
                  {...modeler}
                  checked={!!compareModels.find((md) => md.id === modeler.id)}
                  onSelect={(modelerId) => {
                    if (!!compareModels.find((md) => md.id === modeler.id)) {
                      const tempCompareModels = compareModels.filter(
                        (modeler) => modeler.id !== modelerId
                      );
                      setCompareModels(() => tempCompareModels);
                    } else {
                      if (compareModels.length > 1) {
                        notify({
                          title: 'Sorry',
                          message:
                            'We only support comparing 2 models currently, please unselect another model and try again.',
                          type: 'warning',
                        });
                        return;
                      }
                      const modeler = modelers.find((modeler) => modeler.id === modelerId);
                      if (modeler) {
                        setCompareModels((modelers) => [...modelers, modeler]);
                      }
                    }
                  }}
                />
              ))}
              <Transition transition="fade" mounted={warningDifferentProject}>
                {(transitionStyles) => (
                  <Alert
                    style={{ ...transitionStyles, borderLeft: `5px solid yellow` }}
                    color="yellow"
                  >
                    Warning: We don't recommend selecting models from different projects since the
                    compare results may not be accurate!
                  </Alert>
                )}
              </Transition>
            </SimpleGrid>
          </Stepper.Step>
          <Stepper.Step label="Input performance level" description="Input your desired values">
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
              </Stack>
            </Container>
          </Stepper.Step>
        </Stepper>

        <Group position="right" mt="xl">
          <Button
            variant="default"
            onClick={activeStep > 0 ? prevStep : () => setOpenInputModal(false)}
          >
            {activeStep > 0 ? 'Back' : 'Cancel'}
          </Button>
          <Button
            onClick={activeStep > 0 ? batchEvaluate : nextStep}
            disabled={activeStep === 0 && compareModels.length < 2}
          >
            {activeStep > 0 ? 'Compare' : 'Next step'}
          </Button>
        </Group>
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
          processId: currentModeler?.processId,
        })
      );
      dispatch(lintingActions.setIsLintingActive(false));
    });
  };

  const onEvaluateModel = async () => {
    const errors = await lint();
    if (errors.length > 0) {
      notify({
        title: 'Oops',
        message: 'Your model has some errors, please try validating it!',
        type: 'error',
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
              processId: currentModeler?.processId,
            })
          );
          dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.EVALUATING));
        });
      }
    } catch (error) {
      notify({
        title: 'Oops',
        message:
          'An error has occurred while evaluating your model, please check your model and try again.',
        type: 'error',
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
        compareModels.map(async (modeler) => {
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
            processId: currentModeler?.processId,
          })
        );
        dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.EVALUATING));
      });
    } catch (err) {
      console.error(err);
      notify({
        title: 'Oops',
        message: 'Your models has some errors, please check them and try again!',
        type: 'error',
      });
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
