import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { useAppDispatch } from "@/redux/store";
import { Accordion, ActionIcon, Flex, Grid, Group, Text } from "@mantine/core";
import { ReactComponent as IconAbc } from "@tabler/icons/icons/abc.svg";
import { ReactComponent as IconFilePlus } from "@tabler/icons/icons/file-arrow-left.svg";
import { ReactComponent as IconFolder } from "@tabler/icons/icons/folder.svg";
import { ReactComponent as IconTrash } from "@tabler/icons/icons/trash.svg";
import { ReactComponent as IconUserShare } from "@tabler/icons/icons/user-plus.svg";
import DropdownMenu from "../DropdownMenu";
import { IDropdownMenuContent } from "../DropdownMenu/DropdownMenu";
import { useWorkspaceItemStyle } from "./WorkspaceItem.style";
import { ReactComponent as IStar } from "@tabler/icons/icons/star.svg";
import { IWorkspace } from "@/interfaces/workspaces";
import { openConfirmModal } from "@mantine/modals";
import userApi from "@/api/user";
import workspaceApi from "@/api/workspace";
import { userActions, workspaceActions } from "@/redux/slices";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCurrentUser, getWorkspace } from "@/redux/selectors";
import useNotification from "@/hooks/useNotification";

const WorkspaceItem = (props: IWorkspace) => {
  const { classes } = useWorkspaceItemStyle();
  const dispatch = useAppDispatch();
  const currentUser = useSelector(getCurrentUser);
  const workspace = useSelector(getWorkspace);
  const notify = useNotification();
  const { id, name, description, createdAt, ownerId } = props;

  const getUser = async () => {
    try {
      const res = await userApi.getMe();
      if (res) {
        dispatch(userActions.setUser(res));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTimestamp = (date: Date | string) =>
    new Date(date).toLocaleString("it-IT");

  const handleDeleteWorkspace = async () => {
    console.log("Before delete workspace: ", workspace);
    try {
      if (id) {
        const res = await workspaceApi.deleteWorkspace(id);
        if (res) {
          dispatch(workspaceActions.deleteWorkspace(id));
          notify({
            title: "Success!",
            message: "Project has been deleted successfully",
            type: "success",
          });
          console.log("After delete workspace: ", workspace);
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

  const openDeleteModal = (e: MouseEvent) => {
    e.stopPropagation();
    // if (currentUser.id && (currentUser.id !== ownerId)) {
    //   openConfirmModal({
    //     title: <Text size="lg">Delete this Workspace</Text>,
    //     centered: true,
    //     children: (
    //       <Text>
    //         You are not the owner of this workspace.{" "}
    //         <Text span weight={600}>
    //           You cannot delete this workspace.
    //         </Text>
    //       </Text>
    //     ),
    //     labels: { confirm: "OK", cancel: "Cancel" },
    //     confirmProps: { color: "blue" },
    //     onConfirm: () => {},
    //   });
    // } else {
    openConfirmModal({
      title: <Text size="lg">Delete this Workspace</Text>,
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete this workspace?{" "}
          <Text span weight={600}>
            Your action will not be able to undo.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: handleDeleteWorkspace,
    });
    // }
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
      onClick: () => {
        console.log("Open rename modal");
      },
      disabled: true,
    },
    {
      icon: <IconFilePlus className={classes.dropdownMenuIcon} />,
      children: "Open",
      onClick: () => {
        console.log("Open workspace - Navigate to workspace page");
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

  useEffect(() => {
    getUser();
  }, []);

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
                {name}
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
              <ActionIcon
                onClick={() => console.log("Pinned this workspace")}
                variant="subtle"
                color="blue"
              >
                <IStar
                  width={20}
                  height={20}
                  color={PRIMARY_COLOR[0]}
                  fill={true ? PRIMARY_COLOR[0] : "transparent"} // Cần bổ sung logic isPinned
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
