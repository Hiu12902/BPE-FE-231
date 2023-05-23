import CommentSection from '@/components/CommentSection/CommentSection';
import FilesListModal from '@/components/FilesListModal/FilesListModal';
import { getCurrentModeler } from '@/redux/selectors';
import { Badge, Group, Menu, Modal, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { DEFAULT_SPACING } from '../../constants/size';
import { IconBpeComment, IconBpeFiles, IconBpeResult } from '../../utils/icons/Icons';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import projectApi from '@/api/project';
import { showNotification } from '@mantine/notifications';
import Workspace from '@/components/Workspace';

const MiscGroup = () => {
  const [openCommentSection, setOpenCommentSection] = useState(false);
  const [openFilesList, setOpenFilesList] = useState(false);
  const [openFileMenu, setOpenFileMenu] = useState(false);
  const [openModels, setOpenModels] = useState(false);
  const currentModeler = useSelector(getCurrentModeler);

  const onCreateNewVersion = async (): Promise<void> => {
    try {
      const { xml } = await currentModeler?.modeler?.saveXML({ format: true });
      const blob = new Blob([xml], { type: 'text/xml' });
      const file = new File([blob], `${currentModeler?.id}.bpmn`);
      const data = new FormData();
      data.append('file', file);

      if (currentModeler?.projectId) {
        const res = await projectApi.createNewVersion(
          { projectId: currentModeler?.projectId },
          data
        );
        if (res) {
          showNotification({
            title: 'Success!',
            message: 'Create new version for model successfully!',
            color: 'green',
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderModelsModal = () => {
    return (
      <Modal
        opened={openModels}
        onClose={() => setOpenModels(false)}
        title={<Badge size="lg">Open models from your workspace</Badge>}
        size="xl"
      >
        <Workspace name="Personal" isOpenFromEditor />
      </Modal>
    );
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
          active={openCommentSection}
          disabled={!currentModeler}
        />
        <ToolbarIcon
          icon={IconBpeResult}
          label="Evaluated Results"
          title="Open Evaluated Results"
          orientation="vertical"
          size="large"
          onClick={() => setOpenFilesList((o) => !o)}
          overflow
          disabled={!currentModeler}
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
            <Menu.Item onClick={onCreateNewVersion}>Create New Version</Menu.Item>
            <Menu.Item onClick={() => setOpenModels(true)}>Open Models</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {renderModelsModal()}
      </Group>
      <Text size="xs" align="center" weight="bold">
        Misc
      </Text>
    </Stack>
  );
};

export default MiscGroup;
