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
import {
  lintingActions,
  modelActions,
  tabsSliceActions,
  toolSliceActions,
  userActions,
} from '@/redux/slices';
import { TabVariant } from '@/redux/slices/tabs';
import { useAppDispatch } from '@/redux/store';
import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  Footer,
  Grid,
  Group,
  Tabs,
  Text,
  createStyles,
  Image,
  Flex,
  Space,
  Badge,
  Modal,
  Indicator,
} from '@mantine/core';
import { find } from 'lodash';
import { IconBpeCancel } from '../toolbar/utils/icons/Icons';
import Modeler from './components/Modeler';
import { useDocumentTitle } from '@mantine/hooks';
import { ReactComponent as IconArrowLeft } from '@tabler/icons/icons/square-rounded-chevron-left-filled.svg';
import { ReactComponent as IconArrowRight } from '@tabler/icons/icons/square-rounded-chevron-right-filled.svg';
import { useBeforeUnload } from 'react-router-dom';
import emptyEditor from '@/assets/empty-editor.png';
import Workspace from '@/components/Workspace';
import useDetachModel from '../hooks/useDetachModel';
import userApi from '@/api/user';

const useStyles = createStyles((theme) => ({
  main: {
    paddingTop: 'var(--mantine-header-height, 0px) !important',
    paddingBottom: 'var(--mantine-footer-height, 0px) !important',
    paddingLeft: 'var(--mantine-navbar-width, 0px) !important',
    paddingRight: 'var(--mantine-aside-width, 0px) !important',
    overflow: 'hidden',
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

  tab: {
    '&[data-active]': {
      backgroundColor: theme.colors.blue[0],
      color: PRIMARY_COLOR[1],
    },
  },

  closeIcon: {
    '&:hover': {
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;',
    },
  },
}));

const BpeBpmnModeler = () => {
  useDocumentTitle('Editor - BPSky');
  const dispatch = useAppDispatch();
  // Modeler & Current modeler
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const modelers = useSelector(selectors.getModelers);
  // Linting thể hiện cho lỗi thiết kế
  const lintingActive = useSelector(selectors.getLintingState);
  const lintingIssues = useSelector(selectors.getLintingIssues);
  // Toolbar cho mode simulating sẽ khác với mode evaluating
  const toolbarMode = useSelector(selectors.selectToolbarMode);
  const evaluatedResults = useSelector(selectors.getEvaluatedResult);
  // Tabs đang được mở và tabs đang làm việc hiện tại
  const tabs = useSelector(selectors.getTabs);
  const activeTab = useSelector(selectors.getActiveTab);
  
  const { classes, cx } = useStyles();
  const [scrollBtnsVisibility, setScrollBtnsVisibility] = useState(false);
  const tabsListRef = useRef();
  const [noModeler, setNoModeler] = useState(false);
  const [openModels, setOpenModels] = useState(false);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(
    localStorage.elementNavbarToggle === 'true'
  );
  const detach = useDetachModel();
  const currentUser = useSelector(selectors.getCurrentUser);

  const getUser = async () => {
    try {
      const res = await userApi.getMe();
      if (res) {
        dispatch(userActions.setUser(res));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentUser.email) {
      getUser();
    }
  }, [currentUser]);

  useEffect(() => {
    if (modelers.length === 0) {
      if (!!localStorage.modelers && !!localStorage.currentOpenedModeler) {
        const cachedModelers = JSON.parse(localStorage.modelers);
        if (cachedModelers.length > 0) {
          cachedModelers.map((modeler, index) => {
            batch(() => {
              dispatch(modelActions.setModelers(modeler));
              dispatch(
                tabsSliceActions.setTabs({
                  label: `${modeler?.name}`,
                  value: modeler?.id,
                  variant: TabVariant.MODEL,
                  toolMode: TOOLBAR_MODE.DEFAULT,
                  id: modeler?.id,
                  projectID: modeler?.projectId,
                  processId: modeler?.processId,
                  role: modeler?.role,
                })
              );
            });
          });

          batch(() => {
            dispatch(modelActions.setCurrentModeler(localStorage.currentOpenedModeler));
            dispatch(tabsSliceActions.setActiveTab(localStorage.currentOpenedModeler));
          });
        }
      } else {
        setNoModeler(true);
      }
    } else {
      setNoModeler(false);
    }
  }, [modelers]);

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
    if (activeTab?.variant === TabVariant.RESULT) {
      detach();
      dispatch(lintingActions.setIsLintingActive(false));
    }
    dispatch(toolSliceActions.setToolbarMode(activeTab?.toolMode));
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
          name: modeler.name,
          processId: modeler.processId,
          role: modeler.role,
        }))
      );
      localStorage.currentOpenedModeler = currentModeler?.id;
    }, [modelers, currentModeler?.id])
  );

  const renderModelsModal = () => {
    return (
      <Modal
        opened={openModels}
        onClose={() => setOpenModels(false)}
        title={<Badge size="lg">Open models from your workspace</Badge>}
        size="90%"
        styles={{
          'content': {
            height: '100%',
            paddingBottom: "50px",
          }
        }}
        overlayProps={{
          blur: 3,
          opacity: 0.55,
        }}
        withCloseButton={true}
      >
        <Workspace />
      </Modal>
    );
  };

  const renderNoModelers = () => {
    return (
      <Flex align="center" justify="center" direction="column">
        <Image src={emptyEditor} width={250} height={250} />
        <Text color="dimmed" align="center" w="45%" size="md">
          It seems like you haven't opened any model yet! You can use the <b>Files</b> button on
          toolbar to open a new model or
        </Text>
        <Space h="md" />
        <Button onClick={() => setOpenModels(true)}>Open New Model</Button>
      </Flex>
    );
  };

  return (
    <ModelerContext.Provider value={currentModeler?.modeler}>
      <AppShell
        navbar={
          <PaletteNavbar
            isNavbarCollapsed={isNavbarCollapsed}
            setIsNavbarCollapsed={setIsNavbarCollapsed}
          />
        }
        header={<BpeToolbar isNavbarCollapsed={isNavbarCollapsed} />}
        classNames={{
          main: cx(classes.main, {
            [classes.mainSimulation]: toolbarMode === TOOLBAR_MODE.SIMULATING,
          }),
        }}
        footer={
          lintingActive ? (
            <Footer height={140} fixed={false} style={{ bottom: 0, zIndex: 0 }}>
              <ValidationTerminal issues={lintingIssues} isNavbarCollapsed={isNavbarCollapsed} />
            </Footer>
          ) : null
        }
        styles={{ main: { padding: 0 } }}
      >
        {renderModelsModal()}
        {tabs.length > 1 ? (
          <Tabs
            value={activeTab?.id}
            onTabChange={(tab) => {
              if (tab === activeTab?.id) {
                return;
              }
              const nextTab = find(tabs, (e) => e.id === tab);
              batch(() => {
                dispatch(tabsSliceActions.setActiveTab(tab));
                dispatch(toolSliceActions.setToolbarMode(nextTab.toolMode));
              });
              if (nextTab.variant === TabVariant.MODEL) {
                // Change this and the tool is doomed
                detach();
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
                          toolbarMode === TOOLBAR_MODE.SIMULATING && tab.id !== activeTab?.id
                        }
                        value={tab.id}
                        rightSection={
                          !(tab.variant === TabVariant.MODEL && modelers.length < 2) && (
                            <ActionIcon
                              disabled={toolbarMode === TOOLBAR_MODE.SIMULATING}
                              variant="subtle"
                              radius={50}
                              className={classes.closeIcon}
                              p={0}
                            >
                              <IconBpeCancel
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(tabsSliceActions.closeTab(tab.id));
                                  if (activeTab?.id === tab.id) {
                                    detach();
                                  }
                                  if (tab.variant === TabVariant.MODEL) {
                                    dispatch(modelActions.deleteModeler(tab.id));
                                  }
                                }}
                                opacity={toolbarMode === TOOLBAR_MODE.SIMULATING ? 0.5 : 1}
                              />
                            </ActionIcon>
                          )
                        }
                        className={classes.tab}
                      >
                        <Indicator
                          color="red"
                          offset={-3}
                          withBorder
                          size={15}
                          disabled={!tab.isModelEdited}
                        >
                          {tab.label}
                        </Indicator>
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
        {(modelers.length > 0 || !localStorage.modelers) && !noModeler ? (
          <Modeler />
        ) : (
          renderNoModelers()
        )}
      </AppShell>
    </ModelerContext.Provider>
  );
};

export default BpeBpmnModeler;
