import 'bpmn-font/dist/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import { useEffect, useRef, useState } from 'react';
import { batch, useSelector } from 'react-redux';
import '../BpmnModeler.css';

import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

import { PROPERTIES_PANEL_WIDTH } from '@/constants/theme/themeConstants';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import * as selectors from '@/redux/selectors';
import { modelActions, tabsSliceActions, toolSliceActions } from '@/redux/slices';
import { TabVariant } from '@/redux/slices/tabs';
import { useAppDispatch } from '@/redux/store';
import { Aside, Box } from '@mantine/core';

const Modeler = () => {
  const dispatch = useAppDispatch();
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const [canvas, setCanvas] = useState();
  const toolbarMode = useSelector(selectors.selectToolbarMode);
  const canvasRef = useRef(null);
  const propertiesPanelRef = useRef(null);
  const activeTab = useSelector(selectors.getActiveTab);

  useEffect(() => {
    if (currentModeler?.modeler) {
      const propertiesPanel = currentModeler.modeler.get('propertiesPanel');
      propertiesPanel.detach();
      propertiesPanel.attachTo(propertiesPanelRef.current);
      const canvas = currentModeler.modeler.get('canvas');
      currentModeler.modeler.attachTo(canvasRef.current);
      setCanvas(canvas);
      if (currentModeler.isNew) {
        currentModeler.modeler.createDiagram();
        batch(() => {
          dispatch(
            tabsSliceActions.setTabs([
              {
                label: `diagram-${currentModeler.id.replace('mantine-', '')}`,
                value: '',
                variant: TabVariant.MODEL,
                toolMode: TOOLBAR_MODE.DEFAULT,
                id: currentModeler.id,
              },
            ])
          );
          dispatch(modelActions.updateCurrentModeler({ ...currentModeler, isNew: false }));
        });
      }
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
