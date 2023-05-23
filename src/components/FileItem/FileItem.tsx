import { ActionIcon, Badge, Box, Grid, Group, Menu, Stack, Text } from '@mantine/core';
import { ReactComponent as IconFileText } from '@tabler/icons/icons/file-text.svg';
import { ReactComponent as IconFile3d } from '@tabler/icons/icons/file-3d.svg';
import { ReactComponent as IconTrash } from '@tabler/icons/icons/trash.svg';
import { ReactComponent as IconDots } from '@tabler/icons/icons/dots.svg';
import { ReactComponent as IconFileSymlink } from '@tabler/icons/icons/file-symlink.svg';
import { ReactComponent as IconCircleXFilled } from '@tabler/icons/icons/circle-x.svg';
import { useFileCardStyle } from './FileItem.style';
import { IFile } from '@/interfaces/projects';
import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';
import { useAppDispatch } from '@/redux/store';
import { modelActions, tabsSliceActions } from '@/redux/slices';
import { useNavigate } from 'react-router-dom';
import projectApi from '@/api/project';
import { openConfirmModal } from '@mantine/modals';
import { batch, useSelector } from 'react-redux';
import { getModelers } from '@/redux/selectors';

const FileItem = (props: IFile) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    variant = 'general',
    documentLink,
    xmlFileLink,
    size,
    lastSaved,
    projectName,
    projectId,
    onDeleteFile,
    canDelete,
  } = props;
  const modelers = useSelector(getModelers);
  const version = xmlFileLink?.split('/')[xmlFileLink?.split('/').length - 1].replace('.bpmn', '');
  const fileName = documentLink ? 'readme.md' : `${projectName}`;
  const { classes } = useFileCardStyle();
  const IconFile = documentLink ? IconFileText : IconFile3d;
  const isOpeningInEditor = !!modelers.find((modeler) => modeler.id === version);

  const onOpenBpmnFile = () => {
    if (xmlFileLink && version) {
      batch(() => {
        dispatch(
          modelActions.setModelers({
            modeler: undefined,
            id: version,
            projectId: projectId,
            projectName: projectName,
          })
        );
        dispatch(modelActions.setCurrentModeler(version));
      });
      navigate('/editor');
    }
  };

  const onDeleteBpmnFile = async () => {
    try {
      if (projectId && version) {
        const res = await projectApi.deleteBpmnFile({ projectId: projectId, version: version });
        if (res) {
          onDeleteFile?.(xmlFileLink ? xmlFileLink : documentLink);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openDeleteModal = () =>
    openConfirmModal({
      title: 'Delete this file',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this file? Your action will not be able to undo.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: onDeleteBpmnFile,
    });

  const onOpenDocument = () =>
    window.open(`/document?project=${projectName}&p=${projectId}`, '_blank');

  const onCloseFile = () => {
    if (version) {
      batch(() => {
        dispatch(tabsSliceActions.closeTab(version));
        dispatch(modelActions.deleteModeler(version));
      });
    }
  };

  return (
    <Box
      component={Stack}
      spacing={0}
      className={classes.container}
      p="sm"
      onDoubleClick={xmlFileLink ? onOpenBpmnFile : onOpenDocument}
    >
      <Grid>
        <Grid.Col span={5}>
          <Group spacing={10}>
            <IconFile height={30} width={30} strokeWidth="0.8" color={PRIMARY_COLOR[0]} />
            <Text size="sm">{xmlFileLink ? `${fileName}_ver_${version}.bpmn` : fileName}</Text>
          </Group>
        </Grid.Col>
        {/* {variant === 'general' && (
          <Text color="dimmed" size="sm" ml={237}>
            {size} MB
          </Text>
        )} */}
        <Grid.Col span={3}>
          <Text color="dimmed" size="sm">
            {lastSaved && new Date(lastSaved)?.toLocaleString()}
          </Text>
        </Grid.Col>
        <Grid.Col span={3}>
          {isOpeningInEditor ? (
            <Badge color="green" radius="sm">
              Currently Working
            </Badge>
          ) : null}
        </Grid.Col>
        <Grid.Col span={1}>
          {variant === 'general' && (
            <Menu shadow="md" width={200} position="left-start">
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <IconDots />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item icon={<IconFileSymlink />} onClick={onOpenBpmnFile}>
                  Open
                </Menu.Item>
                <Menu.Item
                  icon={<IconCircleXFilled />}
                  onClick={onCloseFile}
                  disabled={!isOpeningInEditor}
                >
                  Close
                </Menu.Item>
                <Menu.Item
                  color="red"
                  icon={<IconTrash />}
                  onClick={openDeleteModal}
                  disabled={!canDelete || isOpeningInEditor}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default FileItem;
