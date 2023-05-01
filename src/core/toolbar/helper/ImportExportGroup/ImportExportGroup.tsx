import { Anchor, Menu, Stack, Text } from '@mantine/core';

import * as selectors from '@/redux/selectors';
import { tabsSliceActions } from '@/redux/slices';
import { useAppDispatch } from '@/redux/store';
import { useClipboard, useHotkeys } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { ChangeEvent, createRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useGetModelerModules from '../../../hooks/useGetModelerModule';
import { TOOLBAR_HOTKEYS } from '../../constants/hotkeys';
import { DEFAULT_SPACING } from '../../constants/size';
import {
  IconBpeExport,
  IconBpeExportBpmn,
  IconBpeExportPng,
  IconBpeImport,
} from '../../utils/icons/Icons';
import { getElementForGraph } from '../DiagramGroup/helper/getElementJson';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import generateImage from './utils/exportImages';

const ImportExportGroup = () => {
  const dispatch = useAppDispatch();
  const modeler = useSelector(selectors.getCurrentModeler)?.modeler;

  const activeTab = useSelector(selectors.getActiveTab);
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const [elementRegistry] = useGetModelerModules(['elementRegistry']);
  const clipboard = useClipboard();
  const uploadLinkRef = createRef<HTMLInputElement>();
  const downloadLinkRef = createRef<HTMLAnchorElement>();
  const pngDownloadLinkRef = createRef<HTMLAnchorElement>();
  const handleImportDiagram = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const input = event.target;
    let fileName = 'diagram';
    if (input.files) {
      reader.readAsText(input.files[0]);
      fileName = input.files[0].name.replace('.bpmn', '');
    }
    reader.onloadend = async (e) => {
      let xml = e.target?.result;
      try {
        //@ts-ignore
        await modeler.importXML(xml);
        //@ts-ignore
        const canvas = modeler.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
        dispatch(
          //@ts-ignore
          tabsSliceActions.updateActiveTab({
            ...activeTab,
            value: canvas?.getRootElement()?.id,
            label: fileName || activeTab?.label || 'diagram',
          })
        );
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

  const saveSvg = async () => {
    const { svg } = await currentModeler?.modeler.saveSVG();
    const dataUrl = await generateImage('png', svg);
    pngDownloadLinkRef.current?.setAttribute('href', dataUrl);
    pngDownloadLinkRef.current?.setAttribute('download', 'diagram.png');
  };

  useHotkeys([
    [TOOLBAR_HOTKEYS.IMPORT, () => uploadLinkRef.current?.click()],
    [TOOLBAR_HOTKEYS.EXPORT, () => downloadLinkRef?.current?.click()],
  ]);

  return (
    <Stack spacing={DEFAULT_SPACING + 20}>
      <input
        type="file"
        onChange={handleImportDiagram}
        ref={uploadLinkRef}
        style={{ display: 'none' }}
      />
      <Stack spacing={5}>
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
        <Menu shadow="md" position="bottom">
          <Menu.Target>
            <ToolbarIcon
              icon={IconBpeExport}
              label="Export"
              title="Export File"
              orientation="horizontal"
              size="small"
              hotkey={TOOLBAR_HOTKEYS.EXPORT}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconBpeExportBpmn width={30} height={30} />}>
              <Anchor onClick={saveBpmn} href="#" ref={downloadLinkRef} download underline={false}>
                Export as bpmn file
              </Anchor>
            </Menu.Item>
            <Menu.Item icon={<IconBpeExportPng width={30} height={30} />}>
              <Anchor
                onClick={saveSvg}
                href="#"
                ref={pngDownloadLinkRef}
                download
                underline={false}
              >
                Export as png file
              </Anchor>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Stack>
      {/* <Anchor onClick={saveAsJson} href="#" ref={jsonDownloadLinkRef} download>
        <ToolbarIcon
          icon={IconBpeExport}
          label="JSON"
          title="Export JSON"
          orientation="horizontal"
          size="small"
        />
      </Anchor> */}
      <Text size="xs" align="center" weight="bold">
        I/O
      </Text>
    </Stack>
  );
};

export default ImportExportGroup;
