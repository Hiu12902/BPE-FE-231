//@ts-ignore
import BpmnModeler from 'bpmn-js/lib/Modeler';
//@ts-ignore
import lintModule from 'bpmn-js-bpmnlint';
//@ts-ignore
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
//@ts-ignore
import TokenSimulationModule from 'bpmn-js-token-simulation';
//@ts-ignore
import SimulationSupportModule from 'bpmn-js-token-simulation/lib/simulation-support';
//@ts-ignore
import CommentSection from '@/components/CommentSection/CommentSection';
import FilesListModal from '@/components/FilesListModal/FilesListModal';
import PropertiesProviderModule from '@/core/properties-panel';
//@ts-ignore
import PropertiesModdleDescripter from '@/core/properties-panel/descriptors/bpeDescriptor';
import { getCurrentModeler } from '@/redux/selectors';
import { modelActions, tabsSliceActions } from '@/redux/slices';
import { useAppDispatch } from '@/redux/store';
import { Group, Menu, Stack, Text } from '@mantine/core';
import { randomId } from '@mantine/hooks';
//@ts-ignore
import SimulationBehaviorModule from 'bpmn-js-token-simulation/lib/simulator/behaviors';
import { ChangeEvent, createRef, useState } from 'react';
import { useSelector } from 'react-redux';
import linterConfig from '../../../../../packed-config';
import { DEFAULT_SPACING } from '../../constants/size';
import { IconBpeComment, IconBpeFiles, IconBpeResult } from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';

const MiscGroup = () => {
  const dispatch = useAppDispatch();
  const [openCommentSection, setOpenCommentSection] = useState(false);
  const [openFilesList, setOpenFilesList] = useState(false);
  const [openFileMenu, setOpenFileMenu] = useState(false);
  const currentModeler = useSelector(getCurrentModeler);
  const uploadLinkRef = createRef<HTMLInputElement>();

  const detaching = () => {
    currentModeler?.modeler?.detach();
    currentModeler?.modeler?.get('propertiesPanel').detach();
  };

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
        await currentModeler?.modeler?.importXML(xml);
        //@ts-ignore
        const canvas = currentModeler?.modeler?.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
        dispatch(
          //@ts-ignore
          tabsSliceActions.updateActiveTab({ ...activeTab, value: canvas?.getRootElement()?.id })
        );
      } catch (err) {
        console.log(err);
      }
    };
  };

  const createNewModeler = () => {
    detaching();

    const modeler = new BpmnModeler({
      linting: {},
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        PropertiesProviderModule,
        TokenSimulationModule,
        SimulationSupportModule,
        SimulationBehaviorModule,
        lintModule,
      ],
      moddleExtensions: {
        bpe: PropertiesModdleDescripter,
      },
      keyboard: {
        bindTo: document,
      },
      textRenderer: {
        defaultStyle: {
          fontSize: '14px',
        },
        externalStyle: {
          fontSize: '14px',
        },
      },
    });
    const newId = randomId();
    const linting = modeler.get('linting');
    linting.setLinterConfig(linterConfig);
    dispatch(modelActions.setModelers({ modeler: modeler, id: newId }));
    dispatch(modelActions.setCurrentModeler(newId));
  };

  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        <CommentSection
          opened={openCommentSection}
          onClose={() => setOpenCommentSection(() => false)}
        />
        <FilesListModal opened={openFilesList} onClose={() => setOpenFilesList(false)} />
        <ToolbarIcon
          icon={IconBpeComment}
          label="Comment"
          title="Open Comment Section"
          orientation="vertical"
          size="large"
          onClick={() => setOpenCommentSection((o) => !o)}
          overflow
        />
        <ToolbarIcon
          icon={IconBpeResult}
          label="Evaluated Results"
          title="Open Evaluated Results"
          orientation="vertical"
          size="large"
          onClick={() => setOpenFilesList((o) => !o)}
          overflow
        />
        <input
          type="file"
          onChange={handleImportDiagram}
          ref={uploadLinkRef}
          style={{ display: 'none' }}
        />
        <Menu shadow="md" opened={openFileMenu} onChange={setOpenFileMenu} position="right">
          <Menu.Target>
            <ToolbarIcon
              icon={IconBpeFiles}
              label="Files"
              title="Open Or Create New Model"
              orientation="vertical"
              size="large"
              onClick={() => setOpenFileMenu((o) => !o)}
              overflow
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={createNewModeler}>Create New</Menu.Item>
            <Menu.Item>Open Model</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Text size="xs" align="center" weight="bold">
        Misc
      </Text>
    </Stack>
  );
};

export default MiscGroup;
