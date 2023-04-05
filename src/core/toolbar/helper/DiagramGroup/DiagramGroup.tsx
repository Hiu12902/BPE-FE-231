import { useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import { Affix, Button, Group, Stack, Text, Transition } from '@mantine/core';
//@ts-ignore
import { is } from 'bpmn-js/lib/util/ModelUtil';

import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { IconBpeSimulate, IconBpeEvaluate, IconBpeCompare } from '@/core/toolbar/utils/icons/Icons';
import { ModelerContext } from '@/core/context/ModelerContext';
import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { ToolbarModeContext } from '@/core/context/ToolbarModeContext';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import { useAppDispatch } from '@/redux/store';
import { toolSliceActions, tabsSliceActions, evaluatedResultActions } from '@/redux/slices';
import * as toolSelectors from '@/redux/selectors';
import * as tabsSelector from '@/redux/selectors';
import { getElementForGraph } from './helper/getElementJson';
import { useClipboard } from '@mantine/hooks';
import evaluatedResultApi from '@/api/evaluatedResult';
import { TabVariant } from '@/redux/slices/tabs';

const planeSuffix = '_plane';

const DiagramGroup = () => {
  const dispatch = useAppDispatch();
  const currentElement = useSelector(toolSelectors.selectElementSelected);
  const clipboard = useClipboard();
  const tabs = useSelector(tabsSelector.getTabs);
  const modeler = useContext(ModelerContext);
  const [, setToolbarMode] = useContext(ToolbarModeContext);
  const [showAffix, setShowAffix] = useState(false);
  const [toggleMode, canvas, eventBus, elementRegistry] = useGetModelerModules(modeler, [
    'toggleMode',
    'canvas',
    'eventBus',
    'elementRegistry',
  ]);

  const getJsonFromModel = () => {
    const jsonObj = getElementForGraph(elementRegistry);
    clipboard.copy(JSON.stringify(jsonObj));
    return JSON.stringify(jsonObj);
  };

  const handleSwitchToSimulation = () => {
    //@ts-ignore
    toggleMode.toggleMode(true);
    setToolbarMode(() => TOOLBAR_MODE.SIMULATING);
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
    //@ts-ignore
    const parentRoot = canvas?.findRoot(currentElement.id);
    dispatch(
      tabsSliceActions.setTabs([
        {
          label: parentRoot.id as string,
          value: parentRoot.id as string,
          variant: TabVariant.SUB_PROCESS,
        },
        {
          label: currentElement.id,
          value: currentElement.id + planeSuffix,
          variant: TabVariant.SUB_PROCESS,
        },
      ])
    );
    dispatch(tabsSliceActions.setActiveTab(currentElement.id + planeSuffix));
  };

  const onEvaluateModel = async () => {
    try {
      const result = await evaluatedResultApi.evaluate(getJsonFromModel());
      if (result) {
        dispatch(evaluatedResultActions.setEvaluatedResult(result));
        dispatch(
          tabsSliceActions.setTabs([
            {
              label: 'abc',
              //@ts-ignore
              value: canvas?.getRootElement()?.id || '',
              variant: TabVariant.MODEL,
            },
            {
              label: 'Evaluated Result',
              value: 'evaluateResult',
              variant: TabVariant.RESULT,
            },
          ])
        );
        dispatch(tabsSliceActions.setActiveTab('evaluateResult'));
      }
    } catch (error) {
      console.error(error);
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
