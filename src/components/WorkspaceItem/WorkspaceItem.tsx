import { notificationApi, requestsApi } from "@/api/index";
import workspaceApi from "@/api/workspace";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import useNotification from "@/hooks/useNotification";
import { IWorkspace } from "@/interfaces/workspaces";
import { getCurrentUser } from "@/redux/selectors";
import {
  notificationActions,
  pinnedWorkspaceActions,
  workspaceActions,
} from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Flex,
  Grid,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { ReactComponent as IconRename } from "@tabler/icons/icons/cursor-text.svg";
import {
  ReactComponent as IconFilePlus,
  ReactComponent as IconFolder,
} from "@tabler/icons/icons/folder.svg";
import { ReactComponent as IStar } from "@tabler/icons/icons/star.svg";
import { ReactComponent as IconTrash } from "@tabler/icons/icons/trash.svg";
import { ReactComponent as IconUserShare } from "@tabler/icons/icons/user-circle.svg";
import { RefObject, useState } from "react";
import { useSelector } from "react-redux";
import DropdownMenu from "../DropdownMenu";
import { IDropdownMenuContent } from "../DropdownMenu/DropdownMenu";
import { DeleteModal, InviteModal, RenameModal } from "../Modal";
import { AssignPermissionModal } from "../Modal/AssignPermissionModal";
import UserInformation from "../UserInformation";
import { useWorkspaceItemStyle } from "./WorkspaceItem.style";

interface IAssignPermissions {
  [id: number]: { permission: string; name: string };
}

const initialModalState = {
  invite: false,
  rename: false,
  delete: false,
  assignPermission: false,
};

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
    permission,
  } = props;
  const [open, setOpen] = useState(initialModalState);
  const modalHandler = (modalName: string, state: boolean) => {
    setOpen({ ...initialModalState, [modalName]: state });
  };
  const [result, setResult] = useState<boolean>(true);
  const [toPermission, setToPermission] = useState<string>("");
  const [renderName, setRenderName] = useState<string | undefined>();

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

  const onPinWorkspace = async () => {
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

  const onOpenWorkspace = async () => {
    try {
      const res = await workspaceApi.openWorkspace(id);
      if (res) {
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
    if (permission && ["viewer", "sharer"].includes(permission)) {
      setToPermission("editor");
      modalHandler("assignPermission", true);
    } else {
      modalHandler("rename", true);
    }
  };

  const onOpenDeleteModal = (e: MouseEvent) => {
    e.stopPropagation();
    if (currentUser.id && currentUser.id !== ownerId) {
      return;
    }
    modalHandler("delete", true);
  };

  const onOpenInviteModal = (e: MouseEvent) => {
    e.stopPropagation();
    if (permission && ["viewer"].includes(permission)) {
      setToPermission("sharer");
      modalHandler("assignPermission", true);
    } else {
      modalHandler("invite", true);
    }
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

  const onSendInviteNotification = async (
    assignPermissions: IAssignPermissions
  ) => {
    try {
      if (Object.keys(assignPermissions).length > 0) {
        const payload = Object.keys(assignPermissions).map((id) => ({
          memberId: Number(id),
          permission: assignPermissions[Number(id)].permission,
        }));
        if (payload && id) {
          payload.map(async (item) => {
            const result = await notificationApi.sendInvitationNotification({
              workspaceId: id,
              content: `User ${currentUser.name} has invited you to join workspace ${name} with permission ${item.permission}`,
              id: item.memberId,
              permission: item.permission,
            });
            if (result) {
              dispatch(
                notificationActions.setNotification({
                  ...result,
                  offset: -1,
                })
              );
            } else {
              setResult(false);
            }
          });
          if (result)
            notify({
              title: "Success!",
              message: "Invite user to workspace successfully!",
              type: "success",
            });
        }
      } else {
        notify({
          title: "Error!",
          message: "Permission is required!",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      notify({
        title: "Error!",
        message: "Can not invite user to workspace",
        type: "error",
      });
    }
  };

  const onSendInviteRequest = async (assignPermissions: IAssignPermissions) => {
    try {
      if (Object.keys(assignPermissions).length > 0) {
        const payload = Object.keys(assignPermissions).map((id) => ({
          memberId: Number(id),
          memberName: assignPermissions[Number(id)].name,
          permission: assignPermissions[Number(id)].permission,
        }));

        if (payload && currentUser.id && id) {
          payload.map(async (item) => {
            const request = await requestsApi.sendRequest({
              workspaceId: id,
              content: `User ${currentUser.name} has invited ${item.memberName} to join workspace ${name}`,
              type: "invitation",
              rcpPermission: permission,
              recipientId: item.memberId,
              senderId: Number(currentUser.id),
            });

            if (request === "Duplicate request") {
              notify({
                title: "Error!",
                message:
                  "Send request to workspace owner failed due to duplication!",
                type: "error",
              });
            } else if (!request) {
              setResult(false);
            } else {
              notify({
                title: "Success!",
                message: `Send request to invite ${item.memberName} to our workspace successfully!`,
                type: "success",
              });
            }
          });
        }
      } else {
        notify({
          title: "Error!",
          message: "Permission is required!",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      notify({
        title: "Invite user failed!",
        message:
          "An error has occurred while trying to invite user. Please try again",
        type: "error",
      });
    } finally {
    }
  };

  const onSendAssignPerrmissionRequest = async (content: string) => {
    try {
      if (ownerId && currentUser.id) {
        const request = await requestsApi.sendRequest({
          workspaceId: id,
          type: "adjust permission",
          senderId: currentUser.id,
          recipientId: currentUser.id,
          content: content,
          frPermission: permission,
          toPermission: toPermission,
        });
        if (request === "Duplicate request") {
          notify({
            title: "Error!",
            message:
              "Send request to workspace owner failed due to duplication!",
            type: "error",
          });
        } else if (request) {
          notify({
            title: "Success!",
            message: "Send request to workspace owner successfully!",
            type: "success",
          });
        }
      }
    } catch (err) {
      console.error(err);
      notify({
        title: "Error!",
        message: "Can not send request to workspace owner",
        type: "error",
      });
    } finally {
    }
  };

  const dropdownMenuContent = [
    {
      icon: <IconUserShare className={classes.dropdownMenuIcon} />,
      children: "Share",
      onClick: onOpenInviteModal,
    },
    {
      icon: <IconRename className={classes.dropdownMenuIcon} />,
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
      display: permission === "owner",
    },
  ];

  return (
    <Accordion.Item value={id.toString()}>
      <Accordion.Control onClick={onOpenWorkspace}>
        <Grid align="center" justify="center">
          {permission && (
            <>
              {currentUser?.name && (
                <AssignPermissionModal
                  frPermission={permission}
                  toPermission={toPermission}
                  userName={currentUser.name}
                  onSendRequest={(content: string) =>
                    onSendAssignPerrmissionRequest(content)
                  }
                  opened={open.assignPermission}
                  title="Send request to adjust permission"
                  onClose={() => modalHandler("assignPermission", false)}
                />
              )}

              <InviteModal
                workspaceId={id}
                opened={open.invite}
                permission={permission}
                onInvite={onSendInviteNotification}
                onSendInviteRequest={onSendInviteRequest}
                onClose={() => modalHandler("invite", false)}
              />
            </>
          )}

          <RenameModal
            nameRender={renderName}
            title="Rename workspace"
            opened={open.rename}
            onRename={onRenameWorkspace}
            onClose={() => modalHandler("rename", false)}
          />

          <DeleteModal
            objectId={id}
            opened={open.delete}
            onDelete={onDeleteWorkspace}
            title="Delete this workspace"
            onClose={() => modalHandler("delete", false)}
            message="Are you sure you want to delete this workspace?"
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

          <Grid.Col span={2}>
            <Flex justify="center" align="center" gap={10}>
              <Badge size="md">{permission}</Badge>
            </Flex>
          </Grid.Col>

          {/* Dropdown menu */}
          <Grid.Col span={1}>
            <Flex justify="flex-end" gap={10}>
              <ActionIcon
                onClick={onPinWorkspace}
                variant="subtle"
                color="blue"
              >
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
