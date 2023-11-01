import projectApi from "@/api/project";
import FileItem from "@/components/FileItem";
import ShareModal from "@/components/ShareModal";
import { UserRoleText } from "@/constants/project";
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
  Skeleton,
  Text,
  Tooltip,
} from "@mantine/core";
import { ReactComponent as IconAbc } from "@tabler/icons/icons/abc.svg";
import { ReactComponent as IconChevronRight } from "@tabler/icons/icons/chevron-right.svg";
import { ReactComponent as IconFilePlus } from "@tabler/icons/icons/file-plus.svg";
import { ReactComponent as IconFolder } from "@tabler/icons/icons/folder.svg";
import { ReactComponent as IconTrash } from "@tabler/icons/icons/trash.svg";
import { ReactComponent as IconUserShare } from "@tabler/icons/icons/user-plus.svg";
import { MouseEvent, RefObject, useState } from "react";
import { useSelector } from "react-redux";
import DropdownMenu from "../DropdownMenu";
import { IDropdownMenuContent } from "../DropdownMenu/DropdownMenu";
import { CreateModal, DeleteModal, RenameModal } from "../Modal";
import UserInformation from "../UserInformation/UserInformation";
import { useProjectItemStyle } from "./ProjectItem.style";

const ProjectItem = (props: IProject) => {
  const { classes } = useProjectItemStyle();
  const dispatch = useAppDispatch();
  const { name, id, createAt, shouldGetDocuments = true, owner, role } = props;
  const [files, setFiles] = useState<IFile[]>([]);
  const [projectNameRender, setProjectNameRender] = useState<
    string | undefined
  >(name);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const bpmnFilesCount = files.filter((file) => file.xmlFileLink).length;
  const [hoverOnDeleteBtn, setHoverOnDeleteBtn] = useState(false);
  const [loading, setLoading] = useState(true);
  const modelers = useSelector(getModelers);
  const isOpeningInEditor = !!modelers.find(
    (modeler) => modeler.projectId === id
  );
  const notify = useNotification();

  const formatTimestamp = (date: Date | string) => {
    function convertUTCDateToLocalDate(date: Date) {
      var newDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60 * 1000
      );
      var offset = date.getTimezoneOffset() / 60;
      var hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;
    }
    return convertUTCDateToLocalDate(new Date(date)).toLocaleString();
  };

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

  const onOpenProject = (e: MouseEvent) => {
    e.stopPropagation();
    window.open(`/${name}/${id}`, "_self");
  };

  const onOpenRenameModal = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenRenameModal(true);
  };

  const onRenameProject = async (nameInputRef: RefObject<HTMLInputElement>) => {
    try {
      if (nameInputRef.current?.value.length === 0) {
        notify({
          title: "Warning!",
          message: "Project name cannot be empty!",
          type: "warning",
        });
      }
      if (nameInputRef.current && nameInputRef.current.value) {
        const updateName = nameInputRef.current.value;
        const res = await projectApi.renameProject(
          { projectId: id },
          { name: updateName }
        );
        if (res) {
          setProjectNameRender(updateName);
          dispatch(
            projectActions.updateProject({
              ...props,
              name: updateName,
            })
          );
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

  const onOpenDeleteModal = (e: MouseEvent) => {
    e.stopPropagation();
    if (isOpeningInEditor) {
      return;
    }
    setOpenDeleteModal(true);
  };

  const onDeleteProject = async (id: number) => {
    try {
      if (id) {
        const res = await projectApi.deleteProject(id);
        if (res) {
          dispatch(projectActions.deleteProject(id));
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

  const onOpenShareModal = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenShareModal(true);
  };

  const onOpenCreateModal = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenCreateModal(true);
  };

  const onCreateProcess = async (
    processNameInputRef: RefObject<HTMLInputElement>
  ) => {
    try {
      if (processNameInputRef.current && processNameInputRef.current) {
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

  const dropdownMenuContent = [
    {
      icon: <IconUserShare className={classes.dropdownMenuIcon} />,
      children: "Share",
      onClick: onOpenShareModal,
    },
    {
      icon: <IconAbc className={classes.dropdownMenuIcon} />,
      children: "Rename",
      onClick: onOpenRenameModal,
    },
    {
      icon: <IconFilePlus className={classes.dropdownMenuIcon} />,
      children: "New Process",
      onClick: onOpenCreateModal,
    },
    {
      icon: <IconTrash className={classes.dropdownMenuIcon} />,
      color: "red",
      children: (
        <Tooltip
          label="You are currently working on this project, make sure to close it before delete"
          multiline
          width={220}
          opened={isOpeningInEditor && hoverOnDeleteBtn}
          position="bottom"
          children={<Text>Delete</Text>}
        />
      ),
      onClick: onOpenDeleteModal,
    },
  ];

  return (
    <Accordion.Item value={id.toString()}>
      <Accordion.Control
        onClick={getProjectFiles}
        onDoubleClick={onOpenProject}
      >
        <Grid align="center" justify="center">
          <ShareModal
            opened={openShareModal}
            onClose={() => setOpenShareModal(false)}
            projectId={id}
          />

          <RenameModal
            opened={openRenameModal}
            onClose={() => setOpenRenameModal(false)}
            title="Rename project"
            nameRender={projectNameRender}
            onRename={onRenameProject}
          />

          <DeleteModal
            objectId={id}
            opened={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            title="Delete this project"
            onDelete={onDeleteProject}
          />

          <CreateModal
            title="Create new process"
            opened={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            onCreate={onCreateProcess}
          />

          {/* Project name */}
          <Grid.Col span={3}>
            <Flex justify="flex-start" align="center">
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
                  marginLeft: 5,
                  maxWidth: "80%",
                }}
              >
                {projectNameRender}
              </Text>
            </Flex>
          </Grid.Col>

          {/* Owner avatar */}
          <Grid.Col span={3}>
            <Flex justify="center" align="center">
              <Tooltip
                label={<UserInformation {...owner} />}
                color="white"
                style={{
                  border: "1px solid #ccc",
                }}
              >
                <Avatar src={owner?.avatar} radius={50} />
              </Tooltip>
            </Flex>
          </Grid.Col>

          {/* Last modified */}
          <Grid.Col span={3}>
            <Flex align="center" justify="center" h="100%">
              <Text color="dimmed" size="sm">
                {createAt && formatTimestamp(createAt)}
              </Text>
            </Flex>
          </Grid.Col>

          {/* Role */}
          <Grid.Col span={2}>
            <Flex justify="center" align="center" gap={10}>
              {role !== undefined && (
                <Badge size="md">{UserRoleText[role]}</Badge>
              )}
            </Flex>
          </Grid.Col>

          {/* Dropdown menu */}
          <Grid.Col span={1}>
            <Flex justify="flex-end">
              <DropdownMenu
                dropdownMenuContent={
                  dropdownMenuContent as IDropdownMenuContent[]
                }
                disabled={isOpeningInEditor}
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
