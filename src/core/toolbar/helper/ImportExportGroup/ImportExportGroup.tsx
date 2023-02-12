import { Stack, Text, Space, Anchor, TextInput, Button } from '@mantine/core';

import { DEFAULT_SPACING } from '../../constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { IconBpeImport, IconBpeExport } from '../../utils/icons/Icons';
import { ChangeEvent, createRef, useContext } from 'react';
import { ModelerContext } from '../../../context/ModelerContext';

const ImportExportGroup = () => {
  const modeler = useContext(ModelerContext);
  const uploadLinkRef = createRef<HTMLInputElement>();
  const downloadLinkRef = createRef<HTMLAnchorElement>();
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

  return (
    <Stack spacing={DEFAULT_SPACING - 3.5}>
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
      />
      <Anchor onClick={saveBpmn} href="#" ref={downloadLinkRef} download>
        <ToolbarIcon
          icon={IconBpeExport}
          label="Export"
          title="Export File"
          orientation="horizontal"
          size="small"
        />
      </Anchor>
      <Space h={20} />
      <Text size="xs" align="center" weight="bold">
        I/O
      </Text>
    </Stack>
  );
};

export default ImportExportGroup;
