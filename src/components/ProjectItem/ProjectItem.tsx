import projectApi from "@/api/project";
import FileItem from "@/components/FileItem";
import ShareModal from "@/components/ShareModal";
import { UserRole, UserRoleText } from "@/constants/project";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import useNotification from "@/hooks/useNotification";
import { IFile, IProject } from "@/interfaces/projects";
import { getModelers } from "@/redux/selectors";
import { projectActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  Avatar,
  Badge,
  Flex,
  Grid,
  Group,
  Skeleton,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { ReactComponent as IconAbc } from "@tabler/icons/icons/abc.svg";
import { ReactComponent as IconChevronRight } from "@tabler/icons/icons/chevron-right.svg";
import { ReactComponent as IconFilePlus } from "@tabler/icons/icons/file-plus.svg";
import { ReactComponent as IconFolder } from "@tabler/icons/icons/folder.svg";
import { ReactComponent as IconTrash } from "@tabler/icons/icons/trash.svg";
import { ReactComponent as IconUserShare } from "@tabler/icons/icons/user-plus.svg";
import { MouseEvent, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DropdownMenu from "../DropdownMenu";
import { IDropdownMenuContent } from "../DropdownMenu/DropdownMenu";
import UserInformation from "../UserInformation/UserInformation";
import { useProjectItemStyle } from "./ProjectItem.style";

const ProjectItem = (props: IProject) => {
  const { classes } = useProjectItemStyle();
  const dispatch = useAppDispatch();
  const {
    name,
    id,
    createAt,
    onDeleteProject,
    shouldGetDocuments,
    owner,
    role,
    showExtraInfo,
  } = props;
  const [files, setFiles] = useState<IFile[]>([]);
  const [projectNameRender, setProjectNameRender] = useState<
    string | undefined
  >(name);
  const [openShareModal, setOpenShareModal] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const processNameInputRef = useRef<HTMLInputElement>(null);
  const bpmnFilesCount = files.filter((file) => file.xmlFileLink).length;
  const [hoverOnDeleteBtn, setHoverOnDeleteBtn] = useState(false);
  const [loading, setLoading] = useState(true);
  const modelers = useSelector(getModelers);
  const isOpeningInEditor = !!modelers.find(
    (modeler) => modeler.projectId === id
  );
  const notify = useNotification();
  // Show extra info của Project khi & chỉ khi: (1) Role là Owner (2) showExtraInfo = true, nhưng showExtraInfo được truyền từ isOpenFromEditor ở Workspace
  const shouldShowExtraInfo =
    showExtraInfo && (role as UserRole) !== UserRole.OWNER;

  const getProjectFiles = async () => {
    try {
      if (files.length > 0) {
        return;
      }
      if (shouldGetDocuments) {
        const response = await Promise.all([
          projectApi.getProcessesByProject(id),
          projectApi.getProjectDocument(id),
        ]);
        setFiles(response.flat());
        dispatch(
          projectActions.setProcessesCount({
            projectId: id,
            versionCount: response.flat().length - 1,
          })
        );
      } else {
        const response = await projectApi.getProcessesByProject(id);
        setFiles(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onRenameProject = async () => {
    try {
      if (nameInputRef.current) {
        const res = await projectApi.renameProject(
          { projectId: id },
          { name: nameInputRef.current?.value }
        );
        if (res) {
          setProjectNameRender(nameInputRef.current?.value);
          dispatch(
            projectActions.updateProject({
              ...props,
              name: nameInputRef.current?.value,
            })
          );
          nameInputRef.current.value = "";
          notify({
            title: "Success!",
            message: "Rename project successfully!",
            type: "success",
          });
        }
      }
    } catch (err) {
      console.error(err);
      notify({
        title: "Oops!",
        message:
          "An error has occurred while trying to rename project. Please try again",
        type: "error",
      });
    }
  };

  const openRenameModal = (e: MouseEvent) => {
    e.stopPropagation();
    openConfirmModal({
      title: "Rename project",
      children: (
        <TextInput
          placeholder="Project's name"
          ref={nameInputRef}
          value={projectNameRender}
        />
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: onRenameProject,
    });
  };

  const onOpenShareModal = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenShareModal(true);
  };

  const onOpenProject = (e: MouseEvent) => {
    e.stopPropagation();
    window.open(`/${name}/${id}`, "_blank");
  };

  const openDeleteModal = (e: MouseEvent) => {
    e.stopPropagation();
    if (isOpeningInEditor) {
      return;
    }
    openConfirmModal({
      title: <Text size="lg">Delete this project</Text>,
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete this project?{" "}
          <Text span weight={600}>
            Your action will not be able to undo.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: handleDeleteProject,
    });
  };

  const onOpenCreateNewProcessModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openConfirmModal({
      title: <Badge>New Process</Badge>,
      children: (
        <TextInput label="New Process name" ref={processNameInputRef} />
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: handleCreateNewProcess,
    });
  };

  const handleCreateNewProcess = async () => {
    try {
      if (processNameInputRef.current) {
        const res = await projectApi.createNewProcess(
          { projectId: id },
          { name: processNameInputRef.current.value }
        );
        if (res) {
          const tempFiles = [...files];
          tempFiles.splice(files.length - 1, 0, res);
          setFiles(() => tempFiles);
        }
      }
    } catch (err) {
      console.error(err);
    }
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
      notify({
        title: "Oops!",
        message:
          "An error has occurred while trying to delete project. Please try again",
        type: "error",
      });
    }
  };

  const formatTimestamp = (date: Date | string) =>
    new Date(date).toLocaleString("it-IT");

  const dropdownMenuContent = [
    {
      icon: <IconUserShare className={classes.dropdownMenuIcon} />,
      children: "Share",
      onClick: onOpenShareModal,
    },
    {
      icon: <IconAbc className={classes.dropdownMenuIcon} />,
      children: "Rename",
      onClick: openRenameModal,
    },
    {
      icon: <IconFilePlus className={classes.dropdownMenuIcon} />,
      children: "New Process",
      onClick: onOpenCreateNewProcessModal,
    },
    {
      icon: <IconTrash className={classes.dropdownMenuIcon} />,
      color: "red",
      children:
        // (
        //   <Tooltip
        //     label="You are currently working on this project, make sure to close it before delete"
        //     multiline
        //     width={220}
        //     opened={isOpeningInEditor && hoverOnDeleteBtn}
        //     position="bottom"
        //   >
        //     Delete
        //   </Tooltip>
        // ),
        "Delete",
      onClick: openDeleteModal,
    },
  ];

  return (
    <Accordion.Item value={id.toString()}>
      {/* Accordion control: (1) Click to Open Inner files (2) Double click to Open project */}
      <Accordion.Control
        onClick={getProjectFiles}
        onDoubleClick={onOpenProject}
      >
        <Grid align="center">
          <ShareModal
            opened={openShareModal}
            onClose={() => setOpenShareModal(false)}
            projectId={id}
          />

          {/* Project name */}
          <Grid.Col span={shouldShowExtraInfo ? 3 : 5}>
            <Group spacing={10}>
              <IconFolder
                width={30}
                height={30}
                color={PRIMARY_COLOR[0]}
                fill={PRIMARY_COLOR[0]}
              />
              <Text
                size="sm"
                truncate="end"
                style={{
                  maxWidth: "80%",
                }}
              >
                {projectNameRender}
              </Text>
            </Group>
          </Grid.Col>

          {/* Owner avatar */}
          {shouldShowExtraInfo && (
            <Grid.Col span={2}>
              <Group>
                <Text color="dimmed" size="sm">
                  Owned by:
                </Text>
                <Tooltip label={<UserInformation {...owner} />} color="white">
                  <Avatar src={owner?.avatar} radius={50} />
                </Tooltip>
              </Group>
            </Grid.Col>
          )}

          {/* Last modified */}
          <Grid.Col span={shouldShowExtraInfo ? 4 : 4}>
            <Flex align="center" justify="flex-end" h="100%">
              <Text color="dimmed" size="sm">
                {createAt
                  ? formatTimestamp(createAt)
                      .split(",")[1]
                      .concat(" ", formatTimestamp(createAt).split(",")[0])
                  : new Date(Date.now()).toLocaleString("it-IT")}
              </Text>
            </Flex>
          </Grid.Col>

          {/* Role */}
          {shouldShowExtraInfo && (
            <Grid.Col span={2}>
              <Flex align="center" justify="center" h="100%" gap={10}>
                {role !== undefined ? (
                  <Badge size="md">{UserRoleText[role]}</Badge>
                ) : null}
              </Flex>
            </Grid.Col>
          )}

          {/* Dropdown menu */}
          <Grid.Col span={shouldShowExtraInfo ? 1 : 3}>
            <Flex justify="flex-end">
              <DropdownMenu
                dropdownMenuContent={
                  dropdownMenuContent as IDropdownMenuContent[]
                }
              />
            </Flex>
          </Grid.Col>
        </Grid>
      </Accordion.Control>

      {/* Process in Project */}
      <Accordion.Panel>
        {loading ? (
          <Accordion>
            <Skeleton height={50} mt={0} radius={0} />
          </Accordion>
        ) : (
          <Accordion
            chevron={<IconChevronRight color="#868e96" />}
            variant="separated"
            className={classes.accordion}
          >
            {files?.map((file) => (
              <FileItem
                {...file}
                role={role}
                projectName={projectNameRender}
                projectId={id}
                canDelete={bpmnFilesCount > 1}
                onDeleteFile={(id) => {
                  const tempFiles = files.filter((file) => file.id !== id);
                  setFiles(tempFiles);
                }}
                key={file.id || file.xmlFileLink || file.documentLink}
              />
            ))}
          </Accordion>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default ProjectItem;
