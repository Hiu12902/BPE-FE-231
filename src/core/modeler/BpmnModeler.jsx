import React, { useEffect, useState } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import SimulationSupportModule from 'bpmn-js-token-simulation/lib/simulation-support';
import SimulationBehaviorModule from 'bpmn-js-token-simulation/lib/simulator/behaviors';
import { baseXml } from '@/assets/baseXml';
import './BpmnModeler.css';

import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

import { AppShell, Box, Aside, createStyles } from '@mantine/core';
import { PaletteNavbar } from '@/core/palette/PaletteNavbar';
import BpeToolbar from '@/core/toolbar/Toolbar';
import { ModelerContext } from '@/core/context/ModelerContext';
import { PRIMARY_COLOR, PROPERTIES_PANEL_WIDTH } from '@/constants/theme/themeConstants';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import { ToolbarModeContext } from '@/core/context/ToolbarModeContext';

const useStyles = createStyles((theme) => ({
  main: {
    paddingTop: 'var(--mantine-header-height, 0px) !important',
    paddingBottom: 'var(--mantine-footer-height, 0px) !important',
    paddingLeft: 'var(--mantine-navbar-width, 0px) !important',
    paddingRight: 'var(--mantine-aside-width, 0px) !important',
  },

  mainSimulation: {
    '.djs-element .djs-hit-all': {
      cursor: 'pointer',
    },

    '.djs-element .djs-hit-stroke': {
      pointerEvents: 'none !important',
    },

    '.overlay-button': {
      border: `2px solid ${PRIMARY_COLOR[0]}`,
      backgroundColor: 'white',
      color: PRIMARY_COLOR[0],
      cursor: 'pointer',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',

      '&:hover': {
        backgroundColor: PRIMARY_COLOR[0],
        color: 'white',
      },
    },
  },
}));

import PropertiesProviderModule from '../properties-panel';
import PropertiesModdleDescripter from '../properties-panel/descriptors/bpeDescriptor';

const BpeBpmnModeler = () => {
  const [modeler, setModeler] = useState();
  const [toolbarMode, setToolbarMode] = useState(TOOLBAR_MODE.DEFAULT);
  const { classes, cx } = useStyles();

  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties',
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        PropertiesProviderModule,
        TokenSimulationModule,
        SimulationSupportModule,
        SimulationBehaviorModule,
      ],
      moddleExtensions: {
        bpe: PropertiesModdleDescripter,
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
    <ModelerContext.Provider value={modeler}>
      <AppShell
        navbar={<PaletteNavbar />}
        aside={
          <Aside height="100vh" width={{ base: PROPERTIES_PANEL_WIDTH }}>
            <Box id="properties" />
          </Aside>
        }
        header={
          <ToolbarModeContext.Provider value={[toolbarMode, setToolbarMode]}>
            <BpeToolbar />
          </ToolbarModeContext.Provider>
        }
        classNames={{
          main: cx(classes.main, {
            [classes.mainSimulation]: toolbarMode === TOOLBAR_MODE.SIMULATING,
          }),
        }}
      >
        <Box id="canvas" style={{ height: '100%' }} />
      </AppShell>
    </ModelerContext.Provider>
  );
};

export default BpeBpmnModeler;
