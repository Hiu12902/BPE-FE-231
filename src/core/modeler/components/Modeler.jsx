import 'bpmn-font/dist/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { batch, useSelector } from 'react-redux';
import '../BpmnModeler.css';

import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import lintModule from 'bpmn-js-bpmnlint';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import PropertiesProviderModule from '@/core/properties-panel';
import PropertiesModdleDescripter from '@/core/properties-panel/descriptors/bpeDescriptor';
import SimulationSupportModule from 'bpmn-js-token-simulation/lib/simulation-support';
import SimulationBehaviorModule from 'bpmn-js-token-simulation/lib/simulator/behaviors';

import { baseXml } from '@/assets/baseXml';
import { PRIMARY_COLOR, PROPERTIES_PANEL_WIDTH } from '@/constants/theme/themeConstants';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import * as selectors from '@/redux/selectors';
import { modelActions, tabsSliceActions, toolSliceActions } from '@/redux/slices';
import { TabVariant } from '@/redux/slices/tabs';
import { useAppDispatch } from '@/redux/store';
import { Aside, Box, Loader, Text } from '@mantine/core';
import linterConfig from '../../../../packed-config';
import projectApi from '@/api/project';
import useFocusElement from '@/core/hooks/useFocusElement';
import { debounce } from 'lodash';
import useGetModelerModules from '@/core/hooks/useGetModelerModule';

const Modeler = () => {
  const dispatch = useAppDispatch();
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const modelers = useSelector(selectors.getModelers);
  const [canvas, setCanvas] = useState();
  const [rootProcess, setRootProcess] = useState();
  const toolbarMode = useSelector(selectors.selectToolbarMode);
  const canvasRef = useRef(null);
  const propertiesPanelRef = useRef(null);
  const activeTab = useSelector(selectors.getActiveTab);
  const selectedElement = useSelector(selectors.selectElementSelected);
  const focusElement = useFocusElement();
  const allModelsNotEdited = !modelers.find((modeler) => modeler.isEdited);
  const [showSavingText, setShowSavingText] = useState(false);
  const [eventBus] = useGetModelerModules(['eventBus']);

  const hideSavingText = useCallback(
    debounce(() => setShowSavingText(false), 15000),
    []
  );

  const createNewModeler = () => {
    const modeler = new BpmnModeler({
      linting: {},
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        PropertiesProviderModule,
        TokenSimulationModule,
        SimulationSupportModule,
        SimulationBehaviorModule,
        lintModule,
      ],
      moddleExtensions: {
        bpe: PropertiesModdleDescripter,
      },
      keyboard: {
        bindTo: document,
      },
      textRenderer: {
        defaultStyle: {
          fontSize: '14px',
        },
        externalStyle: {
          fontSize: '14px',
        },
      },
    });
    const linting = modeler.get('linting');
    linting.setLinterConfig(linterConfig);

    return modeler;
  };

  const handleShowSavingText = () => {
    setShowSavingText(true);
    hideSavingText.cancel();
    hideSavingText();
  };

  useEffect(() => {
    if (!allModelsNotEdited) {
      handleShowSavingText();
    }
  }, [allModelsNotEdited]);

  useEffect(() => {
    if (!currentModeler) {
      return;
    }

    if (currentModeler?.modeler) {
      const propertiesPanel = currentModeler.modeler.get('propertiesPanel');
      propertiesPanel.detach();
      propertiesPanel.attachTo(propertiesPanelRef.current);
      const canvas = currentModeler.modeler.get('canvas');
      currentModeler.modeler.attachTo(canvasRef.current);
      setCanvas(canvas);
      if (currentModeler.isNew) {
        (async () => {
          try {
            const xml = await projectApi.getBpmnFileContent({
              projectId: currentModeler?.projectId,
              version: currentModeler?.id,
              processId: currentModeler?.processId,
            });
            await currentModeler?.modeler?.importXML(xml || baseXml);
            const canvas = currentModeler?.modeler?.get('canvas');
            canvas.zoom('fit-viewport', 'auto');
          } catch (err) {
            console.error(err);
          }
        })();
        batch(() => {
          dispatch(
            tabsSliceActions.setTabs({
              label: `${currentModeler?.name}`,
              value: currentModeler?.id,
              variant: TabVariant.MODEL,
              toolMode: TOOLBAR_MODE.DEFAULT,
              id: currentModeler?.id,
              projectID: currentModeler?.projectId,
              processId: currentModeler?.processId,
            })
          );
          dispatch(modelActions.updateCurrentModeler({ ...currentModeler, isNew: false }));
        });
      }
    } else {
      const modeler = createNewModeler();
      dispatch(modelActions.updateCurrentModeler({ ...currentModeler, modeler: modeler }));
    }
  }, [currentModeler]);

  useEffect(() => {
    eventBus?.on('element.changed', handleShowSavingText);
    return () => {
      eventBus?.off('element.changed', handleShowSavingText);
    };
  }, [eventBus]);

  useEffect(() => {
    if (activeTab?.variant === TabVariant.MODEL) {
      const modeler = currentModeler?.modeler;
      modeler?.attachTo(canvasRef.current);
      modeler?.get('propertiesPanel')?.attachTo(propertiesPanelRef.current);
      if (rootProcess) {
        canvas?.setRootElement(canvas?.findRoot(rootProcess));
        setRootProcess(undefined);
      }
    }

    if (activeTab?.variant === TabVariant.SUB_PROCESS) {
      if (canvas?.findRoot(activeTab.value)) {
        setRootProcess(canvas?.getRootElements(activeTab.value)?.[0]?.id);
        canvas?.setRootElement(canvas?.findRoot(activeTab.value));
      }
      if (toolbarMode === TOOLBAR_MODE.EVALUATING) {
        dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.DEFAULT));
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (!selectedElement || (selectedElement && !selectedElement.shouldFocused)) {
      return;
    }
    focusElement(selectedElement?.id);
  }, [selectedElement]);

  return (
    <>
      <Box
        ref={canvasRef}
        style={{ height: '100%' }}
        display={toolbarMode === TOOLBAR_MODE.EVALUATING ? 'none' : ''}
      />
      <Aside
        height="100vh"
        width={{ base: toolbarMode === TOOLBAR_MODE.EVALUATING ? '0%' : PROPERTIES_PANEL_WIDTH }}
        display={toolbarMode === TOOLBAR_MODE.EVALUATING ? 'none' : ''}
        zIndex={10}
      >
        <Box ref={propertiesPanelRef} style={{ height: '100%' }} />
      </Aside>
      {showSavingText && (
        <Text
          size="sm"
          weight={600}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: PRIMARY_COLOR[3],
            color: PRIMARY_COLOR[1],
            border: `1px solid ${PRIMARY_COLOR[1]}`,
            zIndex: 101,
            width: PROPERTIES_PANEL_WIDTH,
            paddingLeft: 5,
          }}
        >
          {!allModelsNotEdited && <Loader variant="dots" size="sm" mr={5} />}
          {allModelsNotEdited ? 'All changes are saved' : 'Saving...'}
        </Text>
      )}
    </>
  );
};

export default Modeler;
