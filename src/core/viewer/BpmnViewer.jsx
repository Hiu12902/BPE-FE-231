import React, { useEffect, useState } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import { baseXml } from '../../assets/baseXml';
import './BpmnViewer.css';

// import MagicPropertiesProviderModule from './provider/magic';
// import magicModdleDescriptor from './descriptors/magic';

import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';

import { AppShell, Box, Aside } from '@mantine/core';
import { PaletteNavbar } from '../palette/PaletteNavbar';

const BpeBpmnModeler = () => {
  const [modeler, setModeler] = useState();

  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties',
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        // MagicPropertiesProviderModule,
      ],
      moddleExtensions: {
        // magic: magicModdleDescriptor
      },
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
    <AppShell
      navbar={<PaletteNavbar modeler={modeler} />}
      aside={
        <Aside height="100vh" width={{ base: 250 }}>
          <Box id="properties" />
        </Aside>
      }
    >
      <Box id="canvas" style={{ height: '100%' }} />
    </AppShell>
  );
};

export default BpeBpmnModeler;
