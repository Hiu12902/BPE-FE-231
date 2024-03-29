import BackButton from "@/components/BackButton";
import Logo from "@/components/Logo";
import { PALETTE_WIDTH, PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { TOOLBAR_MODE } from "@/constants/toolbar";
import useGetModelerModules from "@/core/hooks/useGetModelerModule";
import { getCurrentModeler, selectToolbarMode } from "@/redux/selectors";
import {
  Accordion,
  ActionIcon,
  Divider,
  Flex,
  Navbar,
  Overlay,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  Transition,
} from "@mantine/core";
import { ReactComponent as IconChevronRight } from "@tabler/icons/icons/chevron-right.svg";
import { ReactComponent as IconChevronsLeft } from "@tabler/icons/icons/chevrons-left.svg";
import { assign } from "min-dash";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useBeforeUnload } from "react-router-dom";
import { usePaletteNavbarStyles } from "./PaletteNavbar.style";
import {
  artifactSymbols,
  dataSymbols,
  eventSymbols,
  gatewaySymbols,
  participantsSymbols,
  subProcessSymbols,
  taskSymbols,
} from "./utils/symbols";
//@ts-ignore
import { getDi } from "bpmn-js/lib/util/ModelUtil";
//@ts-ignore
import { hasEventDefinition } from "bpmn-js/lib/util/DiUtil";

export function PaletteNavbar({
  isNavbarCollapsed,
  setIsNavbarCollapsed,
}: {
  isNavbarCollapsed: boolean;
  setIsNavbarCollapsed: (value: boolean) => boolean;
}) {
  const { classes } = usePaletteNavbarStyles();
  const modeler = useSelector(getCurrentModeler)?.modeler;
  const [eventBus, modeling] = useGetModelerModules(["eventBus", "modeling"]);
  const toolbarMode = useSelector(selectToolbarMode);

  const handleGateway = (
    event:
      | React.DragEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLButtonElement>,
    type: string,
    options?: { isExpanded: boolean }
  ) => {
    event.stopPropagation();
    if (modeler) {
      //@ts-ignore
      const elementFactory = modeler.get("elementFactory");
      //@ts-ignore
      const create = modeler.get("create");

      var shape = elementFactory.createShape(assign({ type: type }, options));
      if (options) {
        var di = getDi(shape);
        di.isExpanded = options.isExpanded;
      }

      if (type === "bpmn:Participant") {
        create.start(event, elementFactory.createParticipantShape());
      } else {
        create.start(event, shape);
      }
    }
  };

  const onCreateConditionalEvent = (ctx: any) => {
    const { context } = ctx;
    if (hasEventDefinition(context.shape, "bpmn:ConditionalEventDefinition")) {
      modeling.updateProperties(context.shape, {
        percentage: 0.5,
        condition: "Default percentage for a conditional event is 50%",
      });
    }
  };

  useEffect(() => {
    if (!eventBus) {
      return;
    }
    eventBus?.on(
      "commandStack.shape.create.postExecuted",
      onCreateConditionalEvent
    );
    return () => {
      eventBus?.off(
        "commandStack.shape.create.postExecuted",
        onCreateConditionalEvent
      );
    };
  }, [eventBus]);

  useBeforeUnload(
    useCallback(() => {
      localStorage.setItem("elementNavbarToggle", isNavbarCollapsed.toString());
    }, [isNavbarCollapsed])
  );

  return (
    <>
      <Transition
        mounted={isNavbarCollapsed}
        transition="scale-x"
        duration={150}
        timingFunction="ease"
      >
        {(styles) => (
          <Navbar
            height="100vh"
            width={{ base: 20 }}
            p="sm"
            sx={(theme) => ({
              backgroundColor: theme.fn.variant({
                variant: "filled",
                color: theme.primaryColor,
              }).background,
              top: 0,
              cursor: "pointer",
              "&:hover": {
                boxShadow:
                  "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
              },
            })}
            style={styles}
            onClick={() => setIsNavbarCollapsed(false)}
          >
            <Tooltip label="Expand">
              <ActionIcon
                // className={classes.unCollapseBtn}
                variant="light"
                color="white"
                mt={70}
                radius={50}
                onClick={() => setIsNavbarCollapsed(false)}
              >
                <IconChevronRight />
              </ActionIcon>
            </Tooltip>
          </Navbar>
        )}
      </Transition>

      <Transition
        mounted={!isNavbarCollapsed}
        transition="scale-x"
        duration={150}
        timingFunction="ease"
      >
        {(styles) => (
          <Navbar
            height="100vh"
            width={{ base: PALETTE_WIDTH }}
            p="sm"
            sx={(theme) => ({
              backgroundColor: theme.fn.variant({
                variant: "filled",
                color: theme.primaryColor,
              }).background,
              top: 0,
            })}
            style={styles}
          >
            <Navbar.Section>
              <Logo fullReload={false} />
              <Divider my="sm" />
              <Flex justify="center" align="center">
                <BackButton />
                <Tooltip label="Collapse">
                  <ActionIcon
                    variant="light"
                    color="white"
                    style={{
                      left: "15%",
                    }}
                    radius={50}
                    onClick={() => setIsNavbarCollapsed(true)}
                  >
                    <IconChevronsLeft />
                  </ActionIcon>
                </Tooltip>
              </Flex>
            </Navbar.Section>

            <Navbar.Section
              grow
              component={ScrollArea}
              mx="-xs"
              px="xs"
              mt={20}
              // classNames={classes.scrollbar}
              type="hover"
              styles={{
                scrollbar: {
                  "&, &:hover": {
                    background: "transparent",
                  },
                  '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
                    backgroundColor: PRIMARY_COLOR[3],
                    "&:active": {
                      backgroundColor: PRIMARY_COLOR[2],
                    },
                  },
                },
              }}
            >
              {/* {(!modeler || toolbarMode !== TOOLBAR_MODE.DEFAULT) && (
                <Overlay color="#000" opacity={0.25} />
              )} */}

              <Accordion
                classNames={{
                  label: classes.label,
                  control: classes.control,
                  chevron: classes.chevron,
                }}
              >
                <Accordion.Item value="gateway">
                  <Accordion.Control
                    disabled={!modeler || toolbarMode !== TOOLBAR_MODE.DEFAULT}
                  >
                    <Text weight={600} size="sm">
                      Gateways
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      {gatewaySymbols.map((symbol) => (
                        <button
                          className={symbol.className}
                          onClick={(e) => handleGateway(e, symbol.tagName)}
                          onDragStart={(e) => handleGateway(e, symbol.tagName)}
                          draggable="true"
                        >
                          {" "}
                          {symbol.name}
                        </button>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="tasks">
                  <Accordion.Control
                    disabled={!modeler || toolbarMode !== TOOLBAR_MODE.DEFAULT}
                  >
                    <Text weight={600} size="sm">
                      Tasks
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      {taskSymbols.map((symbol) => (
                        <button
                          className={symbol.className}
                          onClick={(e) => handleGateway(e, symbol.tagName)}
                          onDragStart={(e) => handleGateway(e, symbol.tagName)}
                          draggable="true"
                        >
                          {" "}
                          {symbol.name}
                        </button>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="events">
                  <Accordion.Control
                    disabled={!modeler || toolbarMode !== TOOLBAR_MODE.DEFAULT}
                  >
                    <Text weight={600} size="sm">
                      Events
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      {eventSymbols.map((symbol) => (
                        <button
                          className={symbol.className}
                          onClick={(e) => handleGateway(e, symbol.tagName)}
                          onDragStart={(e) => handleGateway(e, symbol.tagName)}
                          draggable="true"
                        >
                          {" "}
                          {symbol.name}
                        </button>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="data">
                  <Accordion.Control
                    disabled={!modeler || toolbarMode !== TOOLBAR_MODE.DEFAULT}
                  >
                    <Text weight={600} size="sm">
                      Data
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      {dataSymbols.map((symbol) => (
                        <button
                          className={symbol.className}
                          onClick={(e) => handleGateway(e, symbol.tagName)}
                          onDragStart={(e) => handleGateway(e, symbol.tagName)}
                          draggable="true"
                        >
                          {" "}
                          {symbol.name}
                        </button>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="subProcess">
                  <Accordion.Control
                    disabled={!modeler || toolbarMode !== TOOLBAR_MODE.DEFAULT}
                  >
                    <Text weight={600} size="sm">
                      Sub Processes
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      {subProcessSymbols.map((symbol) => (
                        <button
                          className={symbol.className}
                          onClick={(e) =>
                            handleGateway(e, symbol.tagName, symbol.option)
                          }
                          onDragStart={(e) =>
                            handleGateway(e, symbol.tagName, symbol.option)
                          }
                          draggable="true"
                        >
                          {" "}
                          {symbol.name}
                        </button>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="participants">
                  <Accordion.Control
                    disabled={!modeler || toolbarMode !== TOOLBAR_MODE.DEFAULT}
                  >
                    <Text weight={600} size="sm">
                      Participants
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      {participantsSymbols.map((symbol) => (
                        <button
                          className={symbol.className}
                          onClick={(e) => handleGateway(e, symbol.tagName)}
                          onDragStart={(e) => handleGateway(e, symbol.tagName)}
                          draggable="true"
                        >
                          {" "}
                          {symbol.name}
                        </button>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="artifacts">
                  <Accordion.Control
                    disabled={!modeler || toolbarMode !== TOOLBAR_MODE.DEFAULT}
                  >
                    <Text weight={600} size="sm">
                      Artifacts
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack>
                      {artifactSymbols.map((symbol) => (
                        <button
                          className={symbol.className}
                          onClick={(e) => handleGateway(e, symbol.tagName)}
                          onDragStart={(e) => handleGateway(e, symbol.tagName)}
                          draggable="true"
                        >
                          {" "}
                          {symbol.name}
                        </button>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Navbar.Section>
          </Navbar>
        )}
      </Transition>
    </>
  );
}
