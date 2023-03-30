import { Accordion, Navbar, ScrollArea, Stack, Text } from '@mantine/core';
import { assign } from 'min-dash';
//@ts-ignore
import { getDi } from 'bpmn-js/lib/util/ModelUtil';

import { getCurrentModeler } from '@/redux/selectors';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PALETTE_WIDTH } from '../../constants/theme/themeConstants';
import { usePaletteNavbarStyles } from './PaletteNavbar.style';
import {
  artifactSymbols,
  dataSymbols,
  eventSymbols,
  gatewaySymbols,
  participantsSymbols,
  subProcessSymbols,
  taskSymbols,
} from './utils/symbols';

export function PaletteNavbar() {
  const { classes } = usePaletteNavbarStyles();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const modeler = useSelector(getCurrentModeler)?.modeler;

  const handleGateway = (
    event: React.DragEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>,
    type: string,
    options?: { isExpanded: boolean }
  ) => {
    event.stopPropagation();
    if (modeler) {
      //@ts-ignore
      const elementFactory = modeler.get('elementFactory');
      //@ts-ignore
      const create = modeler.get('create');

      var shape = elementFactory.createShape(assign({ type: type }, options));
      if (options) {
        var di = getDi(shape);
        di.isExpanded = options.isExpanded;
      }

      if (type === 'bpmn:Participant') {
        create.start(event, elementFactory.createParticipantShape());
      } else {
        create.start(event, shape);
      }
    }
  };

  return (
    <Navbar
      height="100vh"
      width={{ base: PALETTE_WIDTH }}
      p="sm"
      sx={(theme) => ({
        backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
          .background,
        top: 0,
      })}
    >
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        {isCollapsed ? null : (
          <Accordion
            defaultValue="gateway"
            classNames={{
              label: classes.label,
              control: classes.control,
              chevron: classes.chevron,
            }}
          >
            <Accordion.Item value="gateway">
              <Accordion.Control>
                <Text weight={600} size="md">
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
                      {' '}
                      {symbol.name}
                    </button>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="tasks">
              <Accordion.Control>
                <Text weight={600} size="md">
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
                      {' '}
                      {symbol.name}
                    </button>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="events">
              <Accordion.Control>
                <Text weight={600} size="md">
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
                      {' '}
                      {symbol.name}
                    </button>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="data">
              <Accordion.Control>
                <Text weight={600} size="md">
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
                      {' '}
                      {symbol.name}
                    </button>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="subProcess">
              <Accordion.Control>
                <Text weight={600} size="md">
                  Sub Processes
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  {subProcessSymbols.map((symbol) => (
                    <button
                      className={symbol.className}
                      onClick={(e) => handleGateway(e, symbol.tagName, symbol.option)}
                      onDragStart={(e) => handleGateway(e, symbol.tagName, symbol.option)}
                      draggable="true"
                    >
                      {' '}
                      {symbol.name}
                    </button>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="participants">
              <Accordion.Control>
                <Text weight={600} size="md">
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
                      {' '}
                      {symbol.name}
                    </button>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="artifacts">
              <Accordion.Control>
                <Text weight={600} size="md">
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
                      {' '}
                      {symbol.name}
                    </button>
                  ))}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
      </Navbar.Section>
    </Navbar>
  );
}
