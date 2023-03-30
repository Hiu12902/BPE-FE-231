import React, { useContext, useEffect, useState } from 'react';
import { Button, Group, Menu, Stack, Text } from '@mantine/core';
//@ts-ignore
import { is } from 'bpmn-js/lib/util/ModelUtil';

import { ModelerContext } from '@/core/context/ModelerContext';
import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import {
  IconBpePause,
  IconBpePlay,
  IconBpeRepeat,
  IconBpeRestart,
  IconBpeStartPoints,
  IconBpeStop,
} from '@/core/toolbar/utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const SimulationPlayerGroup = () => {
  const modeler = useContext(ModelerContext);
  const [openPlayMenu, setOpenPlayMenu] = useState(false);
  const [startEvents, setStartEvents] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationStarted, setSimulationStarted] = useState(false);
  let simulationCount = 0;
  const [simulationEntriesHistory, setSimulationEntriesHistory] = useState<string>('');
  const buttonRef = React.createRef<HTMLButtonElement>();
  const [elementRegistry, simulationSupport, pauseSimulation, eventBus, resetSimulation] =
    useGetModelerModules(modeler, [
      'elementRegistry',
      'simulationSupport',
      'pauseSimulation',
      'eventBus',
      'resetSimulation',
    ]);

  useEffect(() => {
    if (elementRegistry) {
      setStartEvents(() =>
        //@ts-ignore
        elementRegistry.filter(
          //@ts-ignore
          (element) => {
            return (
              is(element, 'bpmn:StartEvent') &&
              element?.type !== 'label' &&
              element?.parent?.type !== 'bpmn:SubProcess'
            );
          }
        )
      );
    }
  }, [elementRegistry]);

  const handleSetStopPlaying = () => {
    setIsPlaying(() => false);
  };

  const handleSetPlaying = () => {
    setIsPlaying(() => true);
  };

  const onTraceSimulation = (context: any) => {
    if (context?.action === 'signal' && context?.element?.type === 'bpmn:StartEvent') {
      simulationCount++;
      setIsPlaying(() => true);
    } else if (context?.action === 'enter' && context?.element?.type === 'bpmn:EndEvent') {
      simulationCount--;
      if (simulationCount === 0) {
        setIsPlaying(() => false);
        setSimulationStarted(() => false);
        //@ts-ignore
        pauseSimulation.isActive = false;
      }
    }
  };

  useEffect(() => {
    //@ts-ignore
    eventBus?.on('tokenSimulation.pauseSimulation', handleSetStopPlaying);

    //@ts-ignore
    eventBus?.on('tokenSimulation.playSimulation', handleSetPlaying);

    //@ts-ignore
    eventBus?.on('tokenSimulation.resetSimulation', handleSetStopPlaying);

    //@ts-ignore
    eventBus?.on('tokenSimulation.simulator.trace', onTraceSimulation);

    return () => {
      //@ts-ignore
      eventBus?.off('tokenSimulation.pauseSimulation', handleSetStopPlaying);
      //@ts-ignore
      eventBus?.off('tokenSimulation.playSimulation', handleSetPlaying);
      //@ts-ignore
      eventBus?.off('tokenSimulation.resetSimulation', handleSetStopPlaying);
      //@ts-ignore
      eventBus?.off('tokenSimulation.simulator.trace', onTraceSimulation);
    };
  }, [eventBus]);

  const handleSelectStartEvent = (id: string) => {
    //@ts-ignore
    simulationSupport.triggerElement(id);
    setIsPlaying(() => true);
    setSimulationStarted(() => true);
    setSimulationEntriesHistory(id);
  };

  const handleStopSimulation = () => {
    //@ts-ignore
    resetSimulation.resetSimulation();
    //@ts-ignore
    pauseSimulation.isActive = false;
    setSimulationStarted(() => false);
  };

  const handleRestartSimulation = () => {
    if (simulationEntriesHistory.length < 1) {
      return;
    }
    if (isPlaying) {
      //@ts-ignore
      resetSimulation.resetSimulation();
    }
    setIsPlaying(() => true);
    //@ts-ignore
    simulationSupport.triggerElement(simulationEntriesHistory);
  };

  const renderMenuOptions = () =>
    startEvents?.map((event) => (
      <Menu.Item>
        <Button
          className="bpmn-icon-start-event-none custom-entry color-black"
          /* @ts-ignore */
          onClick={() => handleSelectStartEvent(event.id)}
        >
          {/* @ts-ignore */}
          {event.id}
        </Button>
      </Menu.Item>
    ));

  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        <Menu shadow="md" opened={openPlayMenu} onChange={setOpenPlayMenu}>
          <Menu.Target>
            <ToolbarIcon
              icon={IconBpeStartPoints}
              label="Start"
              title="Select Simulation Entry Point"
              orientation="vertical"
              size="large"
              onClick={() => setOpenPlayMenu(() => true)}
              ref={buttonRef}
              disabled={isPlaying}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Text m={10} color="dimmed" size="sm">
              Select an entry point to start Simulation
            </Text>{' '}
            {renderMenuOptions()}
          </Menu.Dropdown>
        </Menu>
        <ToolbarIcon
          icon={isPlaying ? IconBpePause : IconBpePlay}
          label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          //@ts-ignore
          disabled={!pauseSimulation?.isActive}
          orientation="vertical"
          size="large"
          //@ts-ignore
          onClick={() => pauseSimulation?.toggle()}
        />
        <ToolbarIcon
          icon={IconBpeStop}
          label="Stop"
          title="Stop Simulation"
          orientation="vertical"
          size="large"
          onClick={handleStopSimulation}
          disabled={!simulationStarted}
        />
        <ToolbarIcon
          icon={IconBpeRestart}
          label="Restart"
          title="Restart Simulation"
          orientation="vertical"
          size="large"
          onClick={handleRestartSimulation}
          disabled={simulationEntriesHistory.length < 1}
        />
        <ToolbarIcon
          icon={IconBpeRepeat}
          label="Repeat"
          title="Repeat Simulation"
          orientation="vertical"
          size="large"
        />
      </Group>
      <Text size="xs" align="center">
        Player
      </Text>
    </Stack>
  );
};

export default SimulationPlayerGroup;
