import { Anchor, Box, Grid, ScrollArea, Text, Timeline, createStyles } from '@mantine/core';
//@ts-ignore
import BpmnModeler from 'bpmn-js/lib/Modeler';
//@ts-ignore
import PropertiesProviderModule from '@/core/properties-panel';
//@ts-ignore
import PropertiesModdleDescripter from '@/core/properties-panel/descriptors/bpeDescriptor';
import { getActiveTab, getCurrentModeler, getEvaluatedResult } from '@/redux/selectors';
//@ts-ignore
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const useStyles = createStyles(() => ({
  container: {
    '.bjs-breadcrumbs': {
      display: 'none',
    },
    width: '100%',
    height: '100%',
  },
}));

const StepElement = ({ currentElement }: { currentElement?: string }) => {
  const { classes } = useStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [modeler, setModeler] = useState<any>();
  const [prevElement, setPrevElement] = useState<string>();
  const currentModeler = useSelector(getCurrentModeler)?.modeler;

  useEffect(() => {
    const modeler = new BpmnModeler({
      container: containerRef.current,
      propertiesPanel: {
        parent: panelRef.current,
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        PropertiesProviderModule,
      ],
      moddleExtensions: {
        bpe: PropertiesModdleDescripter,
      },
    });

    (async () => await modeler.createDiagram())();
    setModeler(modeler);
  }, []);

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
  const activeTab = useSelector(getActiveTab);
  const evaluatedResult = useSelector(getEvaluatedResult)[activeTab?.id as string];
  const [elementSelected, setElementSelected] = useState<string>();

  return (
    <Grid>
      <Grid.Col span={6}>
        <ScrollArea h="50vh">
          {evaluatedResult.map((result) => (
            <Timeline active={result.steps?.length} bulletSize={24} lineWidth={2}>
              {result.steps?.map((step) => (
                <Timeline.Item
                  title={
                    <Anchor onClick={() => setElementSelected(step.activity || step.gateWay)}>
                      {step.label || step.event}
                    </Anchor>
                  }
                >
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
                      Branching Probability: {step.branchingProbability}
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
                </Timeline.Item>
              ))}
            </Timeline>
          ))}
        </ScrollArea>
      </Grid.Col>
      {/* <Grid.Col span={6}>
        <StepElement currentElement={elementSelected} />
      </Grid.Col> */}
    </Grid>
  );
};

export default ResultDetailSteps;
