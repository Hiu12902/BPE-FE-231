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
  Divider,
  Flex,
  Grid,
  Group,
  Input,
  Text,
  TextInput,
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

const WorkspaceItem = (props: IWorkspace) => {
  const { classes } = useWorkspaceItemStyle();
  const dispatch = useAppDispatch();
  const currentUser = useSelector(getCurrentUser);
  const notify = useNotification();
  const { id, name, createdAt, ownerId, isPinned } = props;
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [renderName, setRenderName] = useState<string | undefined>(name);

  const formatTimestamp = (date: Date | string) =>
    new Date(date).toLocaleString("it-IT");

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
        title: "Oops!",
        message:
          "An error has occurred while trying to pin workspace. Please try again",
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
      onClick: () => {
        console.log("Open selected workspace");
      },
      disabled: true,
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
      <Accordion.Control>
        <Grid align="center" justify="center">
          {/* Project name */}
          <Grid.Col span={3}>
            <Group
              spacing={10}
              onClick={() => console.log("Open selected workspace")}
            >
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
                {renderName}
              </Text>
            </Group>
          </Grid.Col>

          {/* Owner avatar */}
          {true && (
            <Grid.Col span={3}>
              <Flex justify="center">
                <Text color="dimmed" size="sm">
                  Owned by: {ownerId}
                </Text>
              </Flex>
            </Grid.Col>
          )}

          {/* Last modified */}
          <Grid.Col span={3}>
            <Flex justify="center">
              <Text color="dimmed" size="sm">
                {createdAt
                  ? formatTimestamp(createdAt)
                      .split(",")[1]
                      .concat(" ", formatTimestamp(createdAt).split(",")[0])
                  : new Date(Date.now()).toLocaleString("it-IT")}
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
