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

interface IInviteModalProps extends ModalProps {
  workspaceId: number;
  onInvite: (assignPermissions: IAssignPermissions) => void;
}

interface IAssignPermissions {
  [id: number]: string;
}

const InviteModal = ({
  opened,
  onClose,
  workspaceId,
  onInvite,
}: IInviteModalProps) => {
  const [input, setInput] = useState<string>("");
  const [searchValue] = useDebouncedValue(input, 500);
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<IUser[]>([]);
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [popoverOpened, setPopoverOpened] = useState<boolean>(false);
  const [assignPermissions, setAssignPermissions] =
    useState<IAssignPermissions>({});

  const focusTrapRef = useFocusTrap();

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

  const handleAddTeammate = (user: IUser) => {
    setMembers([...members, user]);
    setPopoverOpened(false);
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
    onInvite(assignPermissions);
    onClose?.();
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
                setAssignPermissions({
                  ...assignPermissions,
                  [user.id]: value,
                });
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
              ? "Save changes"
              : "Please select permission!"
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
