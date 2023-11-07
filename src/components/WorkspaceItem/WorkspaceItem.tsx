import workspaceApi from "@/api/workspace";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import useNotification from "@/hooks/useNotification";
import { IWorkspace } from "@/interfaces/workspaces";
import { getCurrentUser } from "@/redux/selectors";
import { pinnedWorkspaceActions, workspaceActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  ActionIcon,
  Avatar,
  Flex,
  Grid,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { ReactComponent as IconAbc } from "@tabler/icons/icons/abc.svg";
import { ReactComponent as IconFilePlus } from "@tabler/icons/icons/file-arrow-left.svg";
import { ReactComponent as IconFolder } from "@tabler/icons/icons/folder.svg";
import { ReactComponent as IStar } from "@tabler/icons/icons/star.svg";
import { ReactComponent as IconTrash } from "@tabler/icons/icons/trash.svg";
import { ReactComponent as IconUserShare } from "@tabler/icons/icons/user-plus.svg";
import { RefObject, useState } from "react";
import { useSelector } from "react-redux";
import DropdownMenu from "../DropdownMenu";
import { IDropdownMenuContent } from "../DropdownMenu/DropdownMenu";
import { DeleteModal, RenameModal, ShareModal } from "../Modal";
import UserInformation from "../UserInformation";
import { useWorkspaceItemStyle } from "./WorkspaceItem.style";

const WorkspaceItem = (props: IWorkspace) => {
  const { classes } = useWorkspaceItemStyle();
  const dispatch = useAppDispatch();
  const currentUser = useSelector(getCurrentUser);
  const notify = useNotification();
  const {
    id,
    name,
    openedAt,
    isPinned,
    ownerId,
    ownerAvatar,
    ownerEmail,
    ownerName,
  } = props;
  const [renderName, setRenderName] = useState<string | undefined>();

  const [openShareModal, setOpenShareModal] = useState(false);
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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

  const togglePin = async () => {
    try {
      if (isPinned) {
        const res = await workspaceApi.pinWorkspace(id);
        if (res) {
          dispatch(pinnedWorkspaceActions.unpinWorkspace({ id }));
          notify({
            title: "Success!",
            message: "Project has been unpinned successfully",
            type: "success",
          });
        }
      } else {
        const res = await workspaceApi.pinWorkspace(id);
        if (res) {
          dispatch(
            pinnedWorkspaceActions.pinWorkspace({
              ...props,
              isPinned: true,
            })
          );
          notify({
            title: "Success!",
            message: "Project has been pinned successfully",
            type: "success",
          });
        }
      }
      dispatch(workspaceActions.updatePinWorkspace(props));
    } catch (err) {
      console.error(err);
      notify({
        title: "Pin workspace failed!",
        message:
          "An error has occurred while trying to pin workspace. Please try again",
        type: "error",
      });
    }
  };

  const onOpenWorkspace = async (e: any) => {
    try {
      const res = await workspaceApi.openWorkspace(id);
      if (res) {
        e.stopPropagation();
        window.open(`workspace/${name}/${id}`, "_self");
      }
    } catch (error) {
      console.log(error);
      notify({
        title: "Open workspace failed!",
        message:
          "Something went wrong while trying to open workspace. Please try again",
        type: "error",
      });
    }
  };

  const onOpenRenameModal = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenRenameModal(true);
  };

  const onRenameWorkspace = async (
    nameInputRef: RefObject<HTMLInputElement>
  ) => {
    try {
      if (nameInputRef.current?.value.length === 0) {
        notify({
          title: "Warning!",
          message: "Please enter a name for your workspace",
          type: "warning",
        });
      }
      if (nameInputRef.current && nameInputRef.current.value) {
        const updateName = nameInputRef.current.value;
        const res = await workspaceApi.updateWorkspaceName({
          workspaceId: id,
          name: updateName,
        });
        if (res) {
          setRenderName(updateName);
          dispatch(
            workspaceActions.updateWorkspace({
              ...props,
              name: updateName,
            })
          );
          notify({
            title: "Success!",
            message: "Project has been renamed successfully",
            type: "success",
          });
        }
      }
    } catch (err) {
      console.error(err);
      notify({
        title: "Oops!",
        message:
          "An error has occurred while trying to rename your workspace. Please try again",
        type: "error",
      });
    }
  };

  const onOpenDeleteModal = (e: MouseEvent) => {
    e.stopPropagation();
    if (currentUser.id && currentUser.id !== ownerId) {
      return;
    }
    setOpenDeleteModal(true);
  };

  const onDeleteWorkspace = async () => {
    try {
      if (id) {
        const res = await workspaceApi.deleteWorkspace(id);
        if (res) {
          dispatch(workspaceActions.deleteWorkspace({ id }));
          dispatch(pinnedWorkspaceActions.unpinWorkspace({ id }));
          notify({
            title: "Success!",
            message: "Project has been deleted successfully",
            type: "success",
          });
        }
      }
    } catch (err) {
      console.error(err);
      notify({
        title: "Oops!",
        message:
          "An error has occurred while trying to delete workspace. Please try again",
        type: "error",
      });
    }
  };

  const onOpenShareModal = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenShareModal(true);
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
      children: "Open",
      onClick: onOpenWorkspace,
    },
    {
      icon: <IconTrash className={classes.dropdownMenuIcon} />,
      color: "red",
      children: "Delete",
      onClick: onOpenDeleteModal,
    },
  ];

  return (
    <Accordion.Item value={id.toString()}>
      <Accordion.Control onDoubleClick={(e) => onOpenWorkspace(e)}>
        <Grid align="center" justify="center">
          <ShareModal
            opened={openShareModal}
            onClose={() => setOpenShareModal(false)}
            projectId={id}
          />

          <RenameModal
            opened={openRenameModal}
            onClose={() => setOpenRenameModal(false)}
            title="Rename workspace"
            nameRender={renderName}
            onRename={onRenameWorkspace}
          />

          <DeleteModal
            objectId={id}
            opened={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            title="Delete this workspace"
            message="Are you sure you want to delete this workspace?"
            onDelete={onDeleteWorkspace}
          />

          {/* Project name */}
          <Grid.Col span={3}>
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
                {renderName === undefined ? name : renderName}
              </Text>
            </Group>
          </Grid.Col>

          {/* Owner avatar */}
          <Grid.Col span={3}>
            <Flex justify="center" align="center">
              <Tooltip
                label={
                  <UserInformation
                    {...{
                      id: ownerId,
                      name: ownerName,
                      email: ownerEmail,
                      avatar: ownerAvatar,
                    }}
                  />
                }
                color="white"
                style={{
                  border: "1px solid #ccc",
                }}
              >
                <Avatar src={ownerAvatar} radius={50} />
              </Tooltip>
            </Flex>
          </Grid.Col>

          {/* Last modified */}
          <Grid.Col span={3}>
            <Flex justify="center">
              <Text color="dimmed" size="sm">
                {openedAt && formatTimestamp(openedAt)}
              </Text>
            </Flex>
          </Grid.Col>

          {/* Dropdown menu */}
          <Grid.Col span={3}>
            <Flex justify="flex-end" gap={10}>
              <ActionIcon onClick={togglePin} variant="subtle" color="blue">
                <IStar
                  width={20}
                  height={20}
                  color={PRIMARY_COLOR[0]}
                  fill={isPinned ? PRIMARY_COLOR[0] : "transparent"}
                />
              </ActionIcon>
              <DropdownMenu
                dropdownMenuContent={
                  dropdownMenuContent as IDropdownMenuContent[]
                }
              />
            </Flex>
          </Grid.Col>
        </Grid>
      </Accordion.Control>
    </Accordion.Item>
  );
};

export default WorkspaceItem;
