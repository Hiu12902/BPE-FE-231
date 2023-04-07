import { Anchor, Stack, Text } from '@mantine/core';
import { useClipboard, useHotkeys } from '@mantine/hooks';

import { ModelerContext } from '@/core/context/ModelerContext';
import useGetModelerModules from '@/core/hooks/useGetModelerModule';
import { TOOLBAR_HOTKEYS } from '@/core/toolbar/constants/hotkeys';
import ToolbarIcon from '@/core/toolbar/helper/ToolbarIcon/ToolbarIcon';
import { IconBpeExport, IconBpeImport } from '@/core/toolbar/utils/icons/Icons';
import { showNotification } from '@mantine/notifications';
import { ChangeEvent, createRef, useContext } from 'react';
import { getElementForGraph } from '../DiagramGroup/helper/getElementJson';

const ImportExportGroup = () => {
  const modeler = useContext(ModelerContext);
  const [elementRegistry] = useGetModelerModules(modeler, ['elementRegistry']);
  const clipboard = useClipboard();
  const uploadLinkRef = createRef<HTMLInputElement>();
  const downloadLinkRef = createRef<HTMLAnchorElement>();
  const jsonDownloadLinkRef = createRef<HTMLAnchorElement>();
  const handleImportDiagram = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const input = event.target;
    if (input.files) {
      reader.readAsText(input.files[0]);
    }
    reader.onloadend = async (e) => {
      let xml = e.target?.result;
      try {
        //@ts-ignore
        await modeler.importXML(xml);
        //@ts-ignore
        const canvas = modeler.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
      } catch (err) {
        console.log(err);
      }
    };
  };

  const setEncoded = (link: HTMLAnchorElement | null, name: string, data: any) => {
    const encodedData = encodeURIComponent(data.xml);
    if (data) {
      link?.setAttribute('href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData);
      link?.setAttribute('download', name);
    }
  };

  const saveBpmn = () => {
    //@ts-ignore
    modeler.saveXML({ format: true }).then((xml, err) => {
      setEncoded(downloadLinkRef.current, 'diagram.bpmn', err ? null : xml);
    });
  };

  const saveAsJson = () => {
    const jsonObj = getElementForGraph(elementRegistry);
    clipboard.copy(JSON.stringify(jsonObj));
    showNotification({
      title: 'Copied!',
      message: 'JSON format of model is copied!',
    });
  };

  useHotkeys([
    [TOOLBAR_HOTKEYS.IMPORT, () => uploadLinkRef.current?.click()],
    [TOOLBAR_HOTKEYS.EXPORT, () => downloadLinkRef?.current?.click()],
  ]);

  return (
    <Stack spacing={0}>
      <input
        type="file"
        onChange={handleImportDiagram}
        ref={uploadLinkRef}
        style={{ display: 'none' }}
      />
      <ToolbarIcon
        icon={IconBpeImport}
        label="Import"
        title="Import File"
        orientation="horizontal"
        size="small"
        disabled={!modeler}
        onClick={() => uploadLinkRef.current?.click()}
        hotkey={TOOLBAR_HOTKEYS.IMPORT}
      />
      <Anchor onClick={saveBpmn} href="#" ref={downloadLinkRef} download>
        <ToolbarIcon
          icon={IconBpeExport}
          label="Export"
          title="Export File"
          orientation="horizontal"
          size="small"
          hotkey={TOOLBAR_HOTKEYS.EXPORT}
        />
      </Anchor>
      <Anchor onClick={saveAsJson} href="#" ref={jsonDownloadLinkRef} download>
        <ToolbarIcon
          icon={IconBpeExport}
          label="JSON"
          title="Export JSON"
          orientation="horizontal"
          size="small"
        />
      </Anchor>
      <Text size="xs" align="center" weight="bold">
        I/O
      </Text>
    </Stack>
  );
};

export default ImportExportGroup;
