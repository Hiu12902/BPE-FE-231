import { useContext, useEffect, useState } from 'react';
import { Divider, Group, Stack, Text } from '@mantine/core';
import { useSetState, useLocalStorage } from '@mantine/hooks';

import { ModelerContext } from '../../../context/ModelerContext';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '../../constants/size';
import { IconBpeCopy, IconBpeCut, IconBpePaste } from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { createReviver } from './helper/createReviver';

const BPMN_CLIPBOARD = 'bpmnClipboard';

const ClipBoardGroup = () => {
  const modeler = useContext(ModelerContext);
  const [clipboard, copyPaste, eventBus, moddle, editorActions] = useGetModelerModules(modeler, [
    'clipboard',
    'copyPaste',
    'eventBus',
    'moddle',
    'editorActions',
  ]);

  const [bpmnClipboard, setBpmnClipboard, removeBpmnClipboard] = useLocalStorage({
    key: BPMN_CLIPBOARD,
    defaultValue: '',
  });

  const [accessState, setAccessState] = useSetState({
    copy: false,
    paste: false,
  });

  //@ts-ignore
  const getSelectedElements = () => modeler && modeler.get('selection').get();

  eventBus &&
    //@ts-ignore
    eventBus.on('selection.changed', (context) => {
      if (context.newSelection.length > 0) {
        setAccessState({ copy: true });
      } else {
        setAccessState({ copy: false });
      }
    });

  const handleCopy = () => {
    const selectedElements = getSelectedElements();
    //@ts-ignore
    copyPaste.copy(selectedElements);
    //@ts-ignore
    const copiedElements = clipboard.get();
    setBpmnClipboard(() => copiedElements);
  };

  const handleCut = () => {
    handleCopy();
    //@ts-ignore
    editorActions.trigger('removeSelection');
  };

  const handlePasteElement = () => {
    let serializedCopy = localStorage.getItem(BPMN_CLIPBOARD);
    let parsedCopy = JSON.parse(serializedCopy as string, createReviver(moddle));
    //@ts-ignore
    clipboard.set(parsedCopy);
    //@ts-ignore
    copyPaste.paste();
  };

  window.onbeforeunload = () => {
    removeBpmnClipboard();
  };

  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group spacing={DEFAULT_SPACING}>
        <ToolbarIcon
          icon={IconBpePaste}
          label="Paste"
          title="Paste Element"
          orientation="vertical"
          size="large"
          disabled={!modeler || !bpmnClipboard}
          onClick={handlePasteElement}
        />
        <Stack spacing={0}>
          <ToolbarIcon
            icon={IconBpeCopy}
            title="Copy Element"
            orientation="horizontal"
            size="small"
            label="Copy"
            disabled={!modeler || !accessState.copy}
            onClick={handleCopy}
          />
          <Divider my="xs" />
          <ToolbarIcon
            icon={IconBpeCut}
            title="Cut Element"
            orientation="horizontal"
            size="small"
            label="Cut"
            disabled={!modeler || !accessState.copy}
            onClick={handleCut}
          />
        </Stack>
      </Group>
      <Text size="xs" align="center" weight="bold">
        Clip board
      </Text>
    </Stack>
  );
};

export default ClipBoardGroup;
