import 'bpmn-font/dist/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import { useEffect, useRef, useState } from 'react';
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
import { PROPERTIES_PANEL_WIDTH } from '@/constants/theme/themeConstants';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import * as selectors from '@/redux/selectors';
import { modelActions, tabsSliceActions, toolSliceActions } from '@/redux/slices';
import { TabVariant } from '@/redux/slices/tabs';
import { useAppDispatch } from '@/redux/store';
import { Aside, Box } from '@mantine/core';
import linterConfig from '../../../../packed-config';
import projectApi from '@/api/project';

const Modeler = () => {
  const dispatch = useAppDispatch();
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const [canvas, setCanvas] = useState();
  const toolbarMode = useSelector(selectors.selectToolbarMode);
  const canvasRef = useRef(null);
  const propertiesPanelRef = useRef(null);
  const activeTab = useSelector(selectors.getActiveTab);

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
              label: `${currentModeler?.projectName}_ver_${currentModeler?.id}`,
              value: currentModeler?.id,
              variant: TabVariant.MODEL,
              toolMode: TOOLBAR_MODE.DEFAULT,
              id: currentModeler?.id,
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
    if (activeTab.variant === TabVariant.MODEL) {
      const modeler = currentModeler?.modeler;
      modeler?.attachTo(canvasRef.current);
      modeler?.get('propertiesPanel')?.attachTo(propertiesPanelRef.current);
    }

    if (activeTab.variant !== TabVariant.RESULT) {
      if (canvas?.findRoot(activeTab.value)) {
        canvas?.setRootElement(canvas?.findRoot(activeTab.value));
      }
      if (toolbarMode === TOOLBAR_MODE.EVALUATING) {
        dispatch(toolSliceActions.setToolbarMode(TOOLBAR_MODE.DEFAULT));
      }
    }
  }, [activeTab]);

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
      >
        <Box ref={propertiesPanelRef} style={{ height: '100%' }} />
      </Aside>
    </>
  );
};

export default Modeler;
