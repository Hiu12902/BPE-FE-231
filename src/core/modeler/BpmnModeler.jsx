import 'bpmn-font/dist/css/bpmn-embedded.css';
import lintModule from 'bpmn-js-bpmnlint';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import SimulationSupportModule from 'bpmn-js-token-simulation/lib/simulation-support';
import SimulationBehaviorModule from 'bpmn-js-token-simulation/lib/simulator/behaviors';
import 'bpmn-js/dist/assets/diagram-js.css';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { useEffect } from 'react';
import { batch, useSelector } from 'react-redux';
import './BpmnModeler.css';

import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import 'bpmn-js-properties-panel/dist/assets/element-templates.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';

import ResultTable from '@/components/ResultTable/ResultTable';
import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';
import { TOOLBAR_MODE } from '@/constants/toolbar';
import { ModelerContext } from '@/core/context/ModelerContext';
import { PaletteNavbar } from '@/core/palette/PaletteNavbar';
import PropertiesProviderModule from '@/core/properties-panel';
import PropertiesModdleDescripter from '@/core/properties-panel/descriptors/bpeDescriptor';
import BpeToolbar from '@/core/toolbar/Toolbar';
import ValidationTerminal from '@/core/validation-terminal';
import * as selectors from '@/redux/selectors';
import { lintingActions, modelActions, tabsSliceActions, toolSliceActions } from '@/redux/slices';
import { TabVariant } from '@/redux/slices/tabs';
import { useAppDispatch } from '@/redux/store';
import { ActionIcon, AppShell, Container, Footer, Tabs, createStyles } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { find } from 'lodash';
import linterConfig from '../../../packed-config';
import { IconBpeCancel } from '../toolbar/utils/icons/Icons';
import Modeler from './components/Modeler';

const useStyles = createStyles((theme) => ({
  main: {
    paddingTop: 'var(--mantine-header-height, 0px) !important',
    paddingBottom: 'var(--mantine-footer-height, 0px) !important',
    paddingLeft: 'var(--mantine-navbar-width, 0px) !important',
    paddingRight: 'var(--mantine-aside-width, 0px) !important',

    '.bjs-drilldown': {
      display: 'none',
    },
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
  const dispatch = useAppDispatch();
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const modelers = useSelector(selectors.getModelers);
  const lintingActive = useSelector(selectors.getLintingState);
  const lintingIssues = useSelector(selectors.getLintingIssues);
  const toolbarMode = useSelector(selectors.selectToolbarMode);
  const evaluatedResults = useSelector(selectors.getEvaluatedResult);
  const tabs = useSelector(selectors.getTabs);
  const activeTab = useSelector(selectors.getActiveTab);
  const { classes, cx } = useStyles();

  const detaching = () => {
    currentModeler?.modeler?.detach();
    currentModeler?.modeler?.get('propertiesPanel').detach();
  };

  const createNewModeler = () => {
    detaching();

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
    });
    const newId = randomId();
    const linting = modeler.get('linting');
    linting.setLinterConfig(linterConfig);
    dispatch(modelActions.setModelers({ modeler: modeler, id: newId }));
    dispatch(modelActions.setCurrentModeler(newId));
  };

  useEffect(() => {
    createNewModeler();
  }, []);

  useEffect(() => {
    if (currentModeler?.modeler) {
      const eventBus = currentModeler.modeler.get('eventBus');
      eventBus?.on('linting.toggle', ({ active }) => {
        dispatch(lintingActions.setIsLintingActive(active));
      });

      eventBus?.on('linting.completed', ({ issues }) => {
        dispatch(lintingActions.setLintingIssues(Object.values(issues).flat()));
      });
    }
  }, [currentModeler]);

  useEffect(() => {
    if (activeTab.variant === TabVariant.RESULT) {
      detaching();
      dispatch(lintingActions.setIsLintingActive(false));
    }
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab.variant) {
      case TabVariant.RESULT:
        return <ResultTable />;
    }
  };

  return (
    <ModelerContext.Provider value={currentModeler?.modeler}>
      <AppShell
        navbar={<PaletteNavbar />}
        header={<BpeToolbar />}
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
        {tabs.length > 1 ? (
          <Tabs
            value={activeTab.id}
            onTabChange={(tab) => {
              if (tab === activeTab.id) {
                return;
              }
              const nextTab = find(tabs, (e) => e.id === tab);
              batch(() => {
                dispatch(tabsSliceActions.setActiveTab(tab));
                dispatch(toolSliceActions.setToolbarMode(nextTab.toolMode));
              });
              if (nextTab.variant === TabVariant.MODEL) {
                // Change this and the tool is doomed
                detaching();
                dispatch(modelActions.setCurrentModeler(tab));
              }
            }}
            variant="outline"
            keepMounted={false}
          >
            <Tabs.List>
              {tabs.map((tab) => {
                return (
                  <Tabs.Tab
                    disabled={toolbarMode === TOOLBAR_MODE.SIMULATING && tab.id !== activeTab.id}
                    value={tab.id}
                    rightSection={
                      !(tab.variant === TabVariant.MODEL && modelers.length < 2) && (
                        <ActionIcon>
                          <IconBpeCancel
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(tabsSliceActions.closeTab(tab.id));
                              if (tab.variant === TabVariant.MODEL) {
                                detaching();
                                dispatch(modelActions.deleteModeler(tab.id));
                              }
                            }}
                          />
                        </ActionIcon>
                      )
                    }
                  >
                    {tab.label}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>

            {tabs.map((tab) => {
              return (
                tab.variant === TabVariant.RESULT && (
                  <Tabs.Panel value={tab.id} pt="lg">
                    <Container size="100%">
                      <ResultTable evaluatedResult={evaluatedResults[tab.id]} />
                    </Container>
                  </Tabs.Panel>
                )
              );
            })}
          </Tabs>
        ) : null}
        <Modeler />
      </AppShell>
    </ModelerContext.Provider>
  );
};

export default BpeBpmnModeler;
