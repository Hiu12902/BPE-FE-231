import {
  Anchor,
  Box,
  Grid,
  ScrollArea,
  Stepper,
  Text,
  Timeline,
  createStyles,
} from '@mantine/core';
import { getActiveTab, getCurrentModeler, getEvaluatedResult } from '@/redux/selectors';
import { useEffect, useRef, useState } from 'react';
import { batch, useSelector } from 'react-redux';
import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { useAppDispatch } from '@/redux/store';
import { tabsSliceActions, toolSliceActions } from '@/redux/slices';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import { notifications } from '@mantine/notifications';
import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';

const useStyles = createStyles(() => ({
  container: {
    '.bjs-breadcrumbs': {
      display: 'none',
    },
    width: '100%',
    height: '100%',
  },

  seperator: {
    width: '100px',
    backgroundColor: PRIMARY_COLOR[1],
    flex: 'unset',
  },

  stepIcon: {
    backgroundColor: PRIMARY_COLOR[0],
    color: 'white',
    fontSize: 13,
  },

  stepDescription: {
    width: 'max-content',
  },

  steps: {
    paddingBottom: 10,
  },
}));

const StepElement = ({ currentElement }: { currentElement?: string }) => {
  const { classes } = useStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [modeler, setModeler] = useState<any>();
  const [prevElement, setPrevElement] = useState<string>();
  const currentModeler = useSelector(getCurrentModeler)?.modeler;

  // useEffect(() => {
  //   const modeler = new BpmnModeler({
  //     container: containerRef.current,
  //     propertiesPanel: {
  //       parent: panelRef.current,
  //     },
  //     additionalModules: [
  //       BpmnPropertiesPanelModule,
  //       BpmnPropertiesProviderModule,
  //       PropertiesProviderModule,
  //     ],
  //     moddleExtensions: {
  //       bpe: PropertiesModdleDescripter,
  //     },
  //   });

  //   (async () => await modeler.createDiagram())();
  //   setModeler(modeler);
  // }, []);

  useEffect(() => {
    const elementRegistry = modeler?.get('elementRegistry'),
      modeling = modeler?.get('modeling');
    const startEvent = elementRegistry?.get('StartEvent_1');
    modeling?.removeElements([startEvent]);
  }, [modeler]);

  useEffect(() => {
    if (currentElement) {
      const currentElementRegistry = currentModeler?.get('elementRegistry');
      const elementRegistry = modeler?.get('elementRegistry'),
        modeling = modeler?.get('modeling');
      if (prevElement) {
        const prevElem = currentElementRegistry?.get(prevElement);
        modeling?.removeElements([prevElem]);
      }
      const element = currentElementRegistry?.get(currentElement);

      const process = elementRegistry?.get('Process_1');
      modeling?.createShape(element, { x: 100, y: 100 }, process);
      const canvas = modeler?.get('canvas');
      canvas?.zoom('fit-viewport', 'auto');
      setPrevElement(currentElement);
    }
  }, [currentElement]);

  return (
    <Grid>
      <Grid.Col span={6}>
        <Box ref={containerRef} className={classes.container} />
      </Grid.Col>
      <Grid.Col span={6}>
        <Box ref={panelRef} />
      </Grid.Col>
    </Grid>
  );
};

const ResultDetailSteps = () => {
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const activeTab = useSelector(getActiveTab);
  const evaluatedResult = useSelector(getEvaluatedResult)[activeTab?.id as string];
  const [elementRegistry] = useGetModelerModules(['elementRegistry']);

  return (
    <ScrollArea w="calc(100vw - var(--mantine-navbar-width)">
      {evaluatedResult.map((result) => (
        <Stepper
          active={-1}
          breakpoint="sm"
          iconSize={30}
          classNames={{
            separator: classes.seperator,
            stepIcon: classes.stepIcon,
            stepDescription: classes.stepDescription,
            steps: classes.steps,
          }}
        >
          {result.steps?.map((step) => (
            <Stepper.Step
              label={
                <Anchor
                  onClick={() => {
                    batch(() => {
                      const element = elementRegistry?.get(step.activity || step.gateWay);
                      if (element) {
                        dispatch(
                          toolSliceActions.setElementSelected({
                            ...element,
                            shouldFocused: true,
                          })
                        );
                        if (!!activeTab?.model) {
                          dispatch(tabsSliceActions.setActiveTab(activeTab?.model));
                          dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.DEFAULT));
                        }
                      } else {
                        notifications.show({
                          title: 'Sorry :(',
                          message: "We couldn't find any element that matched",
                          color: 'red',
                        });
                      }
                    });
                  }}
                >
                  {step.label || step.event}
                </Anchor>
              }
              description={
                <>
                  {step.cost && (
                    <Text color="dimmed" size="sm">
                      Cost: {step.cost}
                    </Text>
                  )}
                  {step.cycleTime && (
                    <Text color="dimmed" size="sm">
                      Cycle Time: {step.cycleTime}
                    </Text>
                  )}
                  {step.branchingProbability && (
                    <Text color="dimmed" size="sm">
                      Branching Probability: [
                      {step.branchingProbability?.map(
                        (prob, index) =>
                          prob.toString() +
                          (step.branchingProbability?.length &&
                          index !== step.branchingProbability?.length - 1
                            ? ', '
                            : '')
                      )}
                      ]
                    </Text>
                  )}
                  {step.rework && (
                    <Text color="dimmed" size="sm">
                      Rework: {step.rework}
                    </Text>
                  )}
                  {(step.activity || step.gateWay) && (
                    <Text color="dimmed" size="sm">
                      Element: {step.activity || step.gateWay}
                    </Text>
                  )}
                </>
              }
            ></Stepper.Step>
          ))}
        </Stepper>
      ))}
    </ScrollArea>
  );
};

export default ResultDetailSteps;
