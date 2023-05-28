import { Divider, Group, Stack, Text } from '@mantine/core';
import { useHotkeys, useLocalStorage, useSetState } from '@mantine/hooks';
import { useEffect } from 'react';

import { TOOLBAR_HOTKEYS } from '@/core/toolbar/constants/hotkeys';
import { getCurrentModeler } from '@/redux/selectors';
import { useSelector } from 'react-redux';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { DEFAULT_SPACING } from '../../constants/size';
import { IconBpeCopy, IconBpeCut, IconBpePaste } from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { createReviver } from './helper/createReviver';

const BPMN_CLIPBOARD = 'bpmnClipboard';

const ClipBoardGroup = () => {
  const modeler = useSelector(getCurrentModeler)?.modeler;

  const [clipboard, copyPaste, eventBus, moddle, editorActions] = useGetModelerModules([
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

  const onSelectElement = (context: any) => {
    if (context.newSelection.length > 0) {
      setAccessState({ copy: true });
    } else {
      setAccessState({ copy: false });
    }
  };

  const handleSetToClipboard = () => {
    const copiedElements = clipboard.get();
    setBpmnClipboard(() => copiedElements);
  };

  useEffect(() => {
    eventBus?.on('selection.changed', onSelectElement);
    return () => {
      eventBus?.off('selection.changed', onSelectElement);
    };
  }, [eventBus]);

  const handleCopy = () => {
    const selectedElements = getSelectedElements();
    copyPaste.copy(selectedElements);
    handleSetToClipboard();
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

  useHotkeys([
    [TOOLBAR_HOTKEYS.PASTE, handlePasteElement],
    [TOOLBAR_HOTKEYS.CUT, handleCut],
    [TOOLBAR_HOTKEYS.COPY, handleCopy],
  ]);

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
          hotkey={TOOLBAR_HOTKEYS.PASTE}
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
            hotkey={TOOLBAR_HOTKEYS.COPY}
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
            hotkey={TOOLBAR_HOTKEYS.CUT}
          />
        </Stack>
      </Group>
      <Text size="xs" align="center" weight="bold">
        Clipboard
      </Text>
    </Stack>
  );
};

export default ClipBoardGroup;
