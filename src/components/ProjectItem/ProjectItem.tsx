import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';
import {
  Accordion,
  ActionIcon,
  Flex,
  Grid,
  Group,
  Menu,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { ReactComponent as IconUserShare } from '@tabler/icons/icons/user-plus.svg';
import { ReactComponent as IconFolder } from '@tabler/icons/icons/folder.svg';
import { ReactComponent as IconAbc } from '@tabler/icons/icons/abc.svg';
import { ReactComponent as IconInfo } from '@tabler/icons/icons/info-circle-filled.svg';
import { ReactComponent as IconTrash } from '@tabler/icons/icons/trash.svg';
import { ReactComponent as IconDots } from '@tabler/icons/icons/dots.svg';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { IFile, IProject } from '@/interfaces/projects';
import FileItem from '@/components/FileItem';
import projectApi from '@/api/project';
import { openConfirmModal } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import ShareModal from '@/components/ShareModal';
import { useSelector } from 'react-redux';
import { getModelers } from '@/redux/selectors';

const ProjectItem = (props: IProject) => {
  const { name, id, createAt, onDeleteProject, shouldGetDocuments } = props;
  const [files, setFiles] = useState<IFile[]>([]);
  const [projectNameRender, setProjectNameRender] = useState<string | undefined>(name);
  const [openShareModal, setOpenShareModal] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const bpmnFilesCount = files.filter((file) => file.xmlFileLink).length;
  const [hoverOnDeleteBtn, setHoverOnDeleteBtn] = useState(false);
  const modelers = useSelector(getModelers);
  const isOpeningInEditor = !!modelers.find((modeler) => modeler.projectId === id);

  const getProjectFiles = async () => {
    try {
      if (files.length > 0) {
        return;
      }
      if (shouldGetDocuments) {
        const response = await Promise.all([
          projectApi.getBpmnFilesOfProject(id),
          projectApi.getProjectDocument(id),
        ]);
        setFiles(response.flat());
      } else {
        const response = await projectApi.getBpmnFilesOfProject(id);
        setFiles(response);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onRenameProject = async () => {
    try {
      if (nameInputRef.current) {
        const res = await projectApi.renameProject(
          { projectId: id },
          { name: nameInputRef.current.value }
        );
        if (res) {
          setProjectNameRender(nameInputRef.current.value);
          nameInputRef.current.value = '';
          showNotification({
            title: 'Success!',
            message: 'Rename project successfully!',
            color: 'green',
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openRenameModal = (e: MouseEvent) => {
    e.stopPropagation();
    openConfirmModal({
      title: 'Rename project',
      children: <TextInput placeholder="Project's name" ref={nameInputRef} value={name} />,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: onRenameProject,
    });
  };

  const onOpenShareModal = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenShareModal(true);
  };

  const onOpenProject = (e: MouseEvent) => {
    e.stopPropagation();
    window.open(`/${name}/${id}`, '_blank');
  };

  const openDeleteModal = (e: MouseEvent) => {
    e.stopPropagation();
    if (isOpeningInEditor) {
      return;
    }
    openConfirmModal({
      title: 'Delete this project',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this project? Your action will not be able to undo.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: handleDeleteProject,
    });
  };

  const handleDeleteProject = async () => {
    try {
      if (id) {
        const res = await projectApi.deleteProject(id);
        if (res) {
          onDeleteProject?.(id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Accordion.Item value={id.toString()}>
      <Accordion.Control onClick={getProjectFiles} onDoubleClick={onOpenProject}>
        <Grid>
          <ShareModal opened={openShareModal} onClose={() => setOpenShareModal(false)} />
          <Grid.Col span={5}>
            <Group>
              <IconFolder width={30} height={30} color={PRIMARY_COLOR[0]} fill={PRIMARY_COLOR[0]} />
              <Text size="sm">{projectNameRender}</Text>
            </Group>
          </Grid.Col>
          {/* <Text color="dimmed" size="sm">
            {owner}
          </Text>
          <Text color="dimmed" size="sm">
            {size} MB
          </Text> */}
          <Grid.Col span={6}>
            <Flex align="center" h="100%">
              <Text color="dimmed" size="sm">
                Last updated:{' '}
                {createAt
                  ? new Date(createAt)?.toLocaleString()
                  : new Date(Date.now()).toLocaleString()}
              </Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span={1}>
            <Menu shadow="md" width={200} position="left-start">
              <Menu.Target>
                <ActionIcon variant="subtle" onClick={(e) => e.stopPropagation()}>
                  <IconDots />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                <Menu.Item icon={<IconUserShare />} onClick={onOpenShareModal}>
                  Share
                </Menu.Item>
                <Menu.Item icon={<IconAbc />} onClick={openRenameModal}>
                  Rename
                </Menu.Item>
                <Menu.Item icon={<IconInfo />} onClick={(e) => e.stopPropagation()}>
                  Detail
                </Menu.Item>
                <Tooltip
                  label="You are currently working on this project, make sure to close it before delete"
                  multiline
                  width={220}
                  opened={isOpeningInEditor && hoverOnDeleteBtn}
                  position="bottom"
                >
                  <Menu.Item
                    color="red"
                    icon={<IconTrash />}
                    onClick={openDeleteModal}
                    onMouseEnter={() => setHoverOnDeleteBtn(true)}
                    onMouseLeave={() => setHoverOnDeleteBtn(false)}
                  >
                    Delete
                  </Menu.Item>
                </Tooltip>
              </Menu.Dropdown>
            </Menu>
          </Grid.Col>
        </Grid>
      </Accordion.Control>
      <Accordion.Panel>
        {files?.map((file) => (
          <FileItem
            {...file}
            projectName={projectNameRender}
            projectId={id}
            canDelete={bpmnFilesCount > 1}
            onDeleteFile={(fileLink) => {
              const tempFiles = files.filter((file) => file.xmlFileLink !== fileLink);
              setFiles(tempFiles);
            }}
          />
        ))}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default ProjectItem;
