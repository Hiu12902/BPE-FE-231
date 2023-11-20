import { membersApi } from "@/api/index";
import userApi from "@/api/user";
import { EmptyRender } from "@/components/EmptyRender";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { IUser } from "@/interfaces/user";
import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Modal,
  ModalProps,
  Popover,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue, useFocusTrap } from "@mantine/hooks";
import { ReactComponent as IconUserOff } from "@tabler/icons/icons/user-off.svg";
import { useEffect, useState } from "react";
import { MemberItem } from "./components";
import useNotification from "@/hooks/useNotification";

interface IInviteModalProps extends ModalProps {
  permission?: string;
  workspaceId: number;
  onInvite: (assignPermissions: IAssignPermissions) => void;
  onSendInviteRequest?: (assignPermissions: IAssignPermissions) => void;
}

interface IAssignPermissions {
  [id: number]: { permission: string; name: string };
}

const InviteModal = ({
  opened,
  onClose,
  onInvite,
  permission,
  workspaceId,
  onSendInviteRequest,
}: IInviteModalProps) => {
  const notify = useNotification();
  const focusTrapRef = useFocusTrap();
  const [input, setInput] = useState<string>("");
  const [searchValue] = useDebouncedValue(input, 500);
  const [members, setMembers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [popoverOpened, setPopoverOpened] = useState<boolean>(false);
  const [assignPermissions, setAssignPermissions] =
    useState<IAssignPermissions>({});

  const searchUsers = async () => {
    try {
      if (searchValue.length > 0) {
        const users = await userApi.searchUsers(searchValue, workspaceId);
        if (users) {
          const userTransformed = users.map((user: IUser) => ({
            ...user,
            value: user.id?.toString(),
          }));
          setSearchResult(userTransformed);
        }
      } else {
        setSearchResult([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getMembers = async () => {
    try {
      const members = await membersApi.getAllWorkspaceMembers(
        Number(workspaceId)
      );
      if (members) {
        setMembers(members.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeammate = (user: IUser) => {
    setMembers([...members, user]);
    setPopoverOpened(false);
  };

  const handleCancel = () => {
    setInput("");
    setMembers([]);
    setLoading(true);
    setSearchResult([]);
    setPopoverOpened(false);
    setAssignPermissions({});
    onClose?.();
  };

  const handleInvite = () => {
    if (permission === "viewer") {
      onSendInviteRequest?.(assignPermissions);
    } else {
      onInvite(assignPermissions);
    }
    handleCancel();
  };

  const convertPermission = (permission: string) => {
    switch (permission) {
      case "owner":
        return 0;
      case "editor":
        return 1;
      case "sharer":
        return 2;
      case "viewer":
        return 3;
      default:
        return undefined;
    }
  };

  const validateInvitedPermission = (invitedPermission: string) => {
    const convertedPermission = convertPermission(invitedPermission);
    const convertedUserPermission = convertPermission(permission || "");
    if (
      convertedUserPermission !== undefined &&
      convertedPermission !== undefined
    ) {
      if (convertedUserPermission <= convertedPermission) {
        return true;
      } else return false;
    }
    return false;
  };

  useEffect(() => {
    searchUsers();
  }, [searchValue]);

  useEffect(() => {
    if (opened) {
      getMembers();
    }
  }, [workspaceId, opened]);

  return (
    <Modal
      size="lg"
      centered
      opened={opened}
      onClose={handleCancel}
      title={<Badge size="lg">Invite other user to workspace</Badge>}
    >
      <Popover
        opened={popoverOpened}
        position="bottom"
        width="target"
        transitionProps={{ transition: "pop" }}
        onClose={() => setPopoverOpened(false)}
      >
        <Popover.Target>
          <div onFocusCapture={() => setPopoverOpened(true)} ref={focusTrapRef}>
            <TextInput
              data-autofocus
              label="Search the users that you want to share this project with"
              placeholder="Input their email here"
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          {searchResult.length > 0 ? (
            searchResult.map((user) => (
              <>
                <MemberItem
                  {...user}
                  onAddTeammate={handleAddTeammate}
                  isSearching={!members.find((member) => member.id === user.id)}
                />
                <Divider my="xs" />
              </>
            ))
          ) : (
            <Center>
              <Group>
                <IconUserOff stroke={PRIMARY_COLOR[0]} width={20} height={20} />
                <Text color="dimmed" size="sm">
                  No users found
                </Text>
              </Group>
            </Center>
          )}
        </Popover.Dropdown>
      </Popover>

      <Divider my="md" />

      <Stack h={300}>
        {loading ? (
          <Skeleton width="100%" height={50} />
        ) : members.length > 0 ? (
          members.map((user) => (
            <MemberItem
              {...user}
              isSelectingRole={true}
              onChangePermission={(value: string) => {
                const validPermission = validateInvitedPermission(value);
                if (validPermission) {
                  setAssignPermissions({
                    ...assignPermissions,
                    [user.id]: {
                      permission: value,
                      name: user.name as string,
                    },
                  });
                } else {
                  notify({
                    message: "You can't assign permission higher than yours!",
                    type: "error",
                  });
                }
              }}
            />
          ))
        ) : (
          <Flex justify="center">
            <EmptyRender text="No members found" />
          </Flex>
        )}
      </Stack>

      <Divider my="md" />

      <Group position="right">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Tooltip
          label={
            Object.keys(assignPermissions).length > 0
              ? permission === "viewer"
                ? "This invitation need to be approved by the workspace owner."
                : "Save changes"
              : "Please select valid permission!"
          }
          position="top"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "auto",
            }}
          >
            <Button
              onClick={handleInvite}
              disabled={
                Object.keys(assignPermissions).length > 0 ? false : true
              }
            >
              Save
            </Button>
          </Box>
        </Tooltip>
      </Group>
    </Modal>
  );
};

export default InviteModal;
