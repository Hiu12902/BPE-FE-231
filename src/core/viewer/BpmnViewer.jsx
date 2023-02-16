import React, { useEffect, useState } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import minimapModule from 'diagram-js-minimap';
import { baseXml } from '../../assets/baseXml';
import './BpmnViewer.css';

import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';

import { AppShell, Box, Aside } from '@mantine/core';
import { PaletteNavbar } from '../palette/PaletteNavbar';
import BpeToolbar from '../toolbar/Toolbar';
import { ModelerContext } from '../context/ModelerContext';
import { PROPERTIES_PANEL_WIDTH } from '../../constants/theme/themeConstants';

const BpeBpmnModeler = () => {
  const [modeler, setModeler] = useState();

  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties',
      },
      additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, minimapModule],
      moddleExtensions: {},
      keyboard: {
        bindTo: document,
      },
    });
    setModeler(modeler);

    (async () => {
      try {
        await modeler.importXML(baseXml);
        const canvas = modeler.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <ModelerContext.Provider value={modeler}>
      <AppShell
        navbar={<PaletteNavbar />}
        aside={
          <Aside height="100vh" width={{ base: PROPERTIES_PANEL_WIDTH }}>
            <Box id="properties" />
          </Aside>
        }
        header={<BpeToolbar />}
        styles={{ main: { padding: 0 } }}
      >
        <Box id="canvas" style={{ height: '100%' }} />
      </AppShell>
    </ModelerContext.Provider>
  );
};

export default BpeBpmnModeler;
