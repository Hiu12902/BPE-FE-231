import userApi from '@/api/user';
import {
  Badge,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Modal,
  ModalProps,
  Popover,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import UserInformation from '@/components/UserInformation';
import { IUser } from '@/interfaces/user';
import { ReactComponent as IconUserOff } from '@tabler/icons/icons/user-off.svg';
import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';
import userGroup from '@/assets/user-group.png';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '@/redux/selectors';
import { UserRole } from '@/constants/project';
import projectApi from '@/api/project';
import useNotification from '@/hooks/useNotification';

interface IShareModalProps extends ModalProps {
  projectId: number;
}

const ShareModal = (props: IShareModalProps) => {
  const { opened, onClose, projectId } = props;
  const [value, setValue] = useDebouncedState('', 500);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [teammates, setTeammates] = useState<IUser[]>([]);
  const currentUser = useSelector(getCurrentUser);
  const notify = useNotification();

  const searchUsers = async () => {
    try {
      if (value.length > 0) {
        const users = await userApi.searchUsers(value);
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
  }, [value]);

  const handleAddTeammate = (user: IUser) => {
    if (teammates.length < 1) {
      setTeammates(() => [currentUser as IUser, user]);
    } else {
      setTeammates((team) => [...team, user]);
    }
    setPopoverOpened(false);
  };

  const handleShare = async () => {
    try {
      const payload = teammates
        .slice(1, teammates.length)
        .map((user) => ({ user_id: user.id, role: UserRole.CAN_VIEW }));
      const res = await projectApi.shareProject(payload, projectId);
      if (res) {
        notify({
          title: 'Success!',
          message: 'Share project successfully!',
          type: 'success',
        });
      }
    } catch (err) {
      console.error(err);
      notify({
        title: 'Error!',
        message: 'Share project failed!',
        type: 'error',
      });
    }
  };

  const renderNoSharedUsers = () => {
    return (
      <>
        <Center>
          <Image src={userGroup} width={60} height={60} />
        </Center>
        <Center>
          <Text color="dimmed" align="center" w="80%" size="sm">
            No team yet? Search your companions and create a new team!
          </Text>
        </Center>
      </>
    );
  };

  const handleCancel = () => {
    setValue('');
    setSearchResult([]);
    setPopoverOpened(false);
    setTeammates([]);
    onClose?.();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      title={<Badge size="lg">Share This Project</Badge>}
    >
      <Popover
        opened={popoverOpened}
        position="bottom"
        width="target"
        transitionProps={{ transition: 'pop' }}
        onClose={() => setPopoverOpened(false)}
      >
        <Popover.Target>
          <div onFocusCapture={() => setPopoverOpened(true)}>
            <TextInput
              label="Search the users that you want to share this project with"
              placeholder="Input their email here"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          {searchResult.length > 0 ? (
            searchResult.map((user) => (
              <UserInformation
                {...user}
                onAddTeammate={handleAddTeammate}
                isSearching={!teammates.find((teammate) => teammate.id === user.id)}
              />
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
      <Stack>
        {teammates.length > 0
          ? teammates.map((user) => (
              <UserInformation
                {...user}
                onAddTeammate={handleAddTeammate}
                isSelectingRole={user.id !== currentUser.id}
              />
            ))
          : renderNoSharedUsers()}
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
