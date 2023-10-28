import workspaceApi from "@/api/workspace";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import useNotification from "@/hooks/useNotification";
import { IWorkspace } from "@/interfaces/workspaces";
import { getCurrentUser, getPinnedWorkspace } from "@/redux/selectors";
import { pinnedWorkspaceActions, workspaceActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  ActionIcon,
  Avatar,
  Divider,
  Flex,
  Grid,
  Group,
  Input,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { ReactComponent as IconAbc } from "@tabler/icons/icons/abc.svg";
import { ReactComponent as IconFilePlus } from "@tabler/icons/icons/file-arrow-left.svg";
import { ReactComponent as IconFolder } from "@tabler/icons/icons/folder.svg";
import { ReactComponent as IStar } from "@tabler/icons/icons/star.svg";
import { ReactComponent as IconTrash } from "@tabler/icons/icons/trash.svg";
import { ReactComponent as IconUserShare } from "@tabler/icons/icons/user-plus.svg";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import DropdownMenu from "../DropdownMenu";
import { IDropdownMenuContent } from "../DropdownMenu/DropdownMenu";
import { useWorkspaceItemStyle } from "./WorkspaceItem.style";
import UserInformation from "../UserInformation";

const WorkspaceItem = (props: IWorkspace) => {
  const { classes } = useWorkspaceItemStyle();
  const dispatch = useAppDispatch();
  const currentUser = useSelector(getCurrentUser);
  const workspaces = useSelector(getPinnedWorkspace);
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
  const nameInputRef = useRef<HTMLInputElement>(null);
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

  const onRenameWorkspace = async () => {
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

  const openRenameModal = (e: MouseEvent) => {
    e.stopPropagation();
    openConfirmModal({
      title: "Rename workspace",
      children: (
        <Input.Wrapper label="Name">
          <TextInput
            placeholder="New name for workspace..."
            ref={nameInputRef}
            value={renderName}
          />
        </Input.Wrapper>
      ),
      centered: true,
      labels: {
        confirm: "Confirm",
        cancel: "Cancel",
      },
      onConfirm: onRenameWorkspace,
      overlayProps: {
        opacity: 0.55,
        blur: 3,
      },
    });
  };

  const openDeleteModal = (e: MouseEvent) => {
    e.stopPropagation();
    if (currentUser.id && currentUser.id !== ownerId) {
      openConfirmModal({
        title: <Text size="lg">Delete this Workspace</Text>,
        centered: true,
        children: (
          <Text>
            You are not the owner of this workspace.{" "}
            <Text span weight={600}>
              You cannot delete this workspace.
            </Text>
          </Text>
        ),
        labels: { confirm: "OK", cancel: "Cancel" },
        confirmProps: { color: "blue" },
        onConfirm: () => {},
      });
    } else {
      openConfirmModal({
        title: (
          <Text
            size="lg"
            color="red"
            style={{
              fontWeight: "bold",
            }}
          >
            Delete this Workspace
          </Text>
        ),
        centered: true,
        children: (
          <>
            <Text>Are you sure you want to delete this workspace?</Text>
            <Text span weight={600}>
              Your action will not be able to undo.
            </Text>
            <Divider my="sm" />
          </>
        ),
        labels: { confirm: "Delete", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onConfirm: onDeleteWorkspace,
      });
    }
  };

  const dropdownMenuContent = [
    {
      icon: <IconUserShare className={classes.dropdownMenuIcon} />,
      children: "Share",
      onClick: () => {
        console.log("Open Share modal");
      },
      disabled: true,
    },
    {
      icon: <IconAbc className={classes.dropdownMenuIcon} />,
      children: "Rename",
      onClick: openRenameModal,
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
      onClick: openDeleteModal,
    },
  ];

  return (
    <Accordion.Item value={id.toString()}>
      {/* Accordion control: (1) Click to Open Inner files (2) Double click to Open project */}
      <Accordion.Control onDoubleClick={(e) => onOpenWorkspace(e)}>
        <Grid align="center" justify="center">
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
          {true && (
            <Grid.Col span={3}>
              <Flex justify="center" align="center">
                <Text color="dimmed" size="sm">
                  Owned by:
                </Text>
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
          )}

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
