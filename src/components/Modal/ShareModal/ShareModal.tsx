import projectApi from "@/api/project";
import userApi from "@/api/user";
import UserInformation from "@/components/UserInformation";
import { UserRole } from "@/constants/project";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import useNotification from "@/hooks/useNotification";
import { IUser } from "@/interfaces/user";
import { getCurrentUser } from "@/redux/selectors";
import {
  Badge,
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
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { ReactComponent as IconUserOff } from "@tabler/icons/icons/user-off.svg";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface IShareModalProps extends ModalProps {
  projectId: number;
}

const ShareModal = (props: IShareModalProps) => {
  const { opened, onClose, projectId } = props;
  const [input, setInput] = useState<string>("");
  const [searchValue] = useDebouncedValue(input, 500);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [teammates, setTeammates] = useState<IUser[]>([]);
  const currentUser = useSelector(getCurrentUser);
  const notify = useNotification();

  const searchUsers = async () => {
    try {
      if (searchValue.length > 0) {
        const users = await userApi.searchUsers(searchValue);
        const userTransformed = users.map((user: IUser) => ({
          ...user,
          value: user.id?.toString(),
        }));
        setSearchResult(userTransformed);
      } else {
        setSearchResult([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    searchUsers();
  }, [searchValue]);

  const handleAddTeammate = (user: IUser) => {
    if (teammates.length < 1) {
      setTeammates(() => [
        currentUser as IUser,
        { ...user, role: UserRole.CAN_VIEW },
      ]);
    } else {
      setTeammates((team) => [...team, { ...user, role: UserRole.CAN_VIEW }]);
    }
    setPopoverOpened(false);
  };

  const handleShare = async () => {
    try {
      const payload = teammates
        .filter((user) => user.email !== currentUser?.email)
        .map((user) => ({ user_id: user.id, role: user.role }));
      const res = await projectApi.shareProject(payload, projectId);
      if (res) {
        notify({
          title: "Success!",
          message: "Share project successfully!",
          type: "success",
        });
      }
    } catch (err) {
      console.error(err);
      notify({
        title: "Error!",
        message: "Share project failed!",
        type: "error",
      });
    }
  };

  const getMembers = async () => {
    try {
      const res = await projectApi.getProjectMembers(projectId);
      if (res) {
        setTeammates(res);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setInput("");
    setSearchResult([]);
    setPopoverOpened(false);
    setTeammates([]);
    onClose?.();
  };

  useEffect(() => {
    if (opened) {
      getMembers();
    }
  }, [projectId, opened]);

  return (
    <Modal
      size="lg"
      centered
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      opened={opened}
      onClose={handleCancel}
      title={<Badge size="lg">Share This Project</Badge>}
    >
      <Popover
        opened={popoverOpened}
        position="bottom"
        width="target"
        transitionProps={{ transition: "pop" }}
        onClose={() => setPopoverOpened(false)}
      >
        <Popover.Target>
          <div onFocusCapture={() => setPopoverOpened(true)}>
            <TextInput
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
                <UserInformation
                  {...user}
                  onAddTeammate={handleAddTeammate}
                  isSearching={
                    !teammates.find((teammate) => teammate.id === user.id)
                  }
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
        {teammates.length > 0 ? (
          teammates.map((user) => (
            <UserInformation
              {...user}
              onAddTeammate={handleAddTeammate}
              isSelectingRole={user.id !== currentUser.id}
              onChangeRole={(role: UserRole) => {
                const tempTeammates = teammates.map((teammate) => {
                  return teammate.id === user.id
                    ? { ...teammate, role: role }
                    : teammate;
                });
                setTeammates(tempTeammates);
              }}
            />
          ))
        ) : (
          <Flex justify="center">
            <Skeleton width="100%" height={50} />
          </Flex>
        )}
      </Stack>

      <Divider my="md" />

      <Group position="right">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleShare}>Save</Button>
      </Group>
    </Modal>
  );
};

export default ShareModal;
