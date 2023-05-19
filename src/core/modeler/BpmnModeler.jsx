import 'bpmn-font/dist/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import BpeToolbar from '@/core/toolbar/Toolbar';
import ValidationTerminal from '@/core/validation-terminal';
import * as selectors from '@/redux/selectors';
import { lintingActions, modelActions, tabsSliceActions, toolSliceActions } from '@/redux/slices';
import { TabVariant } from '@/redux/slices/tabs';
import { useAppDispatch } from '@/redux/store';
import {
  ActionIcon,
  AppShell,
  Container,
  Footer,
  Grid,
  Group,
  Tabs,
  createStyles,
} from '@mantine/core';
import { find } from 'lodash';
import { IconBpeCancel } from '../toolbar/utils/icons/Icons';
import Modeler from './components/Modeler';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@mantine/hooks';
import { ReactComponent as IconArrowLeft } from '@tabler/icons/icons/square-rounded-chevron-left-filled.svg';
import { ReactComponent as IconArrowRight } from '@tabler/icons/icons/square-rounded-chevron-right-filled.svg';
import { useBeforeUnload } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  main: {
    paddingTop: 'var(--mantine-header-height, 0px) !important',
    paddingBottom: 'var(--mantine-footer-height, 0px) !important',
    paddingLeft: 'var(--mantine-navbar-width, 0px) !important',
    paddingRight: 'var(--mantine-aside-width, 0px) !important',
    overflowY: 'hidden',
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

  tabs: {
    overflowX: 'scroll',
    flexWrap: 'unset',
    scrollbarWidth: 'none',

    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },

  scrollBtnsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '0.0625rem solid #dee2e6',
    borderLeft: '0.0625rem solid #dee2e6',
    height: 48,
    marginTop: 10,
  },

  scrollBtnsWrapper: {
    position: 'absolute',
    right: 240,
    backgroundColor: 'white',
    paddingRight: 20,
  },

  tabsWrapper: {
    paddingRight: 0,
  },
}));

const BpeBpmnModeler = () => {
  useDocumentTitle('Editor - BPSky');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const modelers = useSelector(selectors.getModelers);
  const lintingActive = useSelector(selectors.getLintingState);
  const lintingIssues = useSelector(selectors.getLintingIssues);
  const toolbarMode = useSelector(selectors.selectToolbarMode);
  const evaluatedResults = useSelector(selectors.getEvaluatedResult);
  const tabs = useSelector(selectors.getTabs);
  const activeTab = useSelector(selectors.getActiveTab);
  const { classes, cx } = useStyles();
  const [scrollBtnsVisibility, setScrollBtnsVisibility] = useState(false);
  const tabsListRef = useRef();

  const detaching = () => {
    currentModeler?.modeler?.detach();
    currentModeler?.modeler?.get('propertiesPanel').detach();
  };

  useEffect(() => {
    if (modelers.length === 0) {
      const cachedModelers = JSON.parse(localStorage.modelers);
      if (cachedModelers.length > 0) {
        cachedModelers.map((modeler, index) => {
          batch(() => {
            dispatch(modelActions.setModelers(modeler));
            dispatch(
              tabsSliceActions.setTabs({
                label: `${modeler?.projectName}_ver_${modeler?.id}`,
                value: modeler?.id,
                variant: TabVariant.MODEL,
                toolMode: TOOLBAR_MODE.DEFAULT,
                id: modeler?.id,
              })
            );
          });
        });

        localStorage.currentOpenedModeler &&
          batch(() => {
            dispatch(modelActions.setCurrentModeler(localStorage.currentOpenedModeler));
            dispatch(tabsSliceActions.setActiveTab(localStorage.currentOpenedModeler));
          });
      } else {
        navigate('/');
      }
    }
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

  useEffect(() => {
    if (tabsListRef.current) {
      setScrollBtnsVisibility(tabsListRef.current?.scrollWidth > tabsListRef.current?.clientWidth);
    }
  }, [tabsListRef.current?.scrollWidth, tabsListRef.current?.clientWidth]);

  useBeforeUnload(
    useCallback(() => {
      localStorage.modelers = JSON.stringify(
        modelers.map((modeler) => ({
          id: modeler.id,
          projectId: modeler.projectId,
          projectName: modeler.projectName,
        }))
      );
      localStorage.currentOpenedModeler = currentModeler?.id;
    }, [modelers, currentModeler?.id])
  );

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
            <Grid>
              <Grid.Col span={scrollBtnsVisibility ? 11 : 12} className={classes.tabsWrapper}>
                <Tabs.List className={classes.tabs} ref={tabsListRef}>
                  {tabs.map((tab) => {
                    return (
                      <Tabs.Tab
                        disabled={
                          toolbarMode === TOOLBAR_MODE.SIMULATING && tab.id !== activeTab.id
                        }
                        value={tab.id}
                        rightSection={
                          !(tab.variant === TabVariant.MODEL && modelers.length < 2) && (
                            <ActionIcon>
                              <IconBpeCancel
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(tabsSliceActions.closeTab(tab.id));
                                  if (activeTab.id === tab.id) {
                                    detaching();
                                  }
                                  if (tab.variant === TabVariant.MODEL) {
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
              </Grid.Col>

              {scrollBtnsVisibility && (
                <Grid.Col span={1} className={classes.scrollBtnsContainer}>
                  <Group className={classes.scrollBtnsWrapper} spacing={5}>
                    <ActionIcon
                      onClick={() => {
                        if (tabsListRef.current) {
                          tabsListRef.current.scrollLeft -= 200;
                        }
                      }}
                    >
                      <IconArrowLeft />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => {
                        if (tabsListRef.current) {
                          tabsListRef.current.scrollLeft += 200;
                        }
                      }}
                    >
                      <IconArrowRight />
                    </ActionIcon>
                  </Group>
                </Grid.Col>
              )}
            </Grid>

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
