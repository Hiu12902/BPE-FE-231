import UserInformation from '@/components/UserInformation/UserInformation';
import { getCurrentUser } from '@/redux/selectors';
import { ActionIcon, Avatar, Group, Menu } from '@mantine/core';
import { useSelector } from 'react-redux';
import { ReactComponent as IconSignOut } from '@tabler/icons/icons/logout.svg';
import { ACCESS_TOKEN } from '@/constants/localStorageKeys';

const AppHeader = () => {
  const currentUser = useSelector(getCurrentUser);

  const onSignOut = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    window.location.reload();
  };

  return (
    <Group position="apart">
      <div />
      <Group mr={20}>
        <Menu>
          <Menu.Target>
            <ActionIcon>
              <Avatar src={currentUser.avatar} radius="xl" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>
              <UserInformation />
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" icon={<IconSignOut />} onClick={onSignOut}>
              Sign Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default AppHeader;
