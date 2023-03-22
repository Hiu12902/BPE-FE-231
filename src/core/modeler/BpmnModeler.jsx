import React, { useEffect, useState } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import lintModule from 'bpmn-js-bpmnlint';
import { Linter } from 'bpmnlint';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import SimulationSupportModule from 'bpmn-js-token-simulation/lib/simulation-support';
import SimulationBehaviorModule from 'bpmn-js-token-simulation/lib/simulator/behaviors';
import { baseXml } from '@/assets/baseXml';
import './BpmnModeler.css';

import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';

import { AppShell, Box, Aside, createStyles, Footer } from '@mantine/core';
import { PaletteNavbar } from '@/core/palette/PaletteNavbar';
import BpeToolbar from '@/core/toolbar/Toolbar';
import { ModelerContext } from '@/core/context/ModelerContext';
import { PRIMARY_COLOR, PROPERTIES_PANEL_WIDTH } from '@/constants/theme/themeConstants';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import { ToolbarModeContext } from '@/core/context/ToolbarModeContext';
import PropertiesProviderModule from '@/core/properties-panel';
import PropertiesModdleDescripter from '@/core/properties-panel/descriptors/bpeDescriptor';
import linterConfig from '../../../packed-config';
import ValidationTerminal from '@/core/validation-terminal';

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

const BpeBpmnModeler = () => {
  const [modeler, setModeler] = useState();
  const [toolbarMode, setToolbarMode] = useState(TOOLBAR_MODE.DEFAULT);
  const [lintingActive, setLintingActive] = useState(false);
  const [lintingIssues, setLintingIssues] = useState(false);
  const { classes, cx } = useStyles();

  useEffect(() => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      propertiesPanel: {
        parent: '#properties',
      },
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
    });

    const linting = modeler.get('linting');
    linting.setLinterConfig(linterConfig);

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

  useEffect(() => {
    if (modeler) {
      const eventBus = modeler.get('eventBus');
      eventBus?.on('linting.toggle', ({ active }) => {
        setLintingActive(() => active);
      });

      //@ts-ignore
      eventBus?.on('linting.completed', ({ issues }) => {
        console.log(issues);
        setLintingIssues(() => Object.values(issues).flat());
      });
    }
  }, [modeler]);

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
        footer={
          lintingActive ? (
            <Footer height={140} fixed={false} style={{ bottom: 0, zIndex: 0 }}>
              <ValidationTerminal issues={lintingIssues} />
            </Footer>
          ) : null
        }
        styles={{ main: { padding: 0 } }}
      >
        <Box id="canvas" style={{ height: '100%' }} />
      </AppShell>
    </ModelerContext.Provider>
  );
};

export default BpeBpmnModeler;
