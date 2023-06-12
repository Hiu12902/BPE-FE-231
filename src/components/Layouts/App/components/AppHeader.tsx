import UserInformation from '@/components/UserInformation/UserInformation';
import { getCurrentUser } from '@/redux/selectors';
import { ActionIcon, Avatar, Badge, Container, Group, Menu, Tabs } from '@mantine/core';
import { useSelector } from 'react-redux';
import { ReactComponent as IconSignOut } from '@tabler/icons/icons/logout.svg';
import { ACCESS_TOKEN } from '@/constants/localStorageKeys';
import { openModal } from '@mantine/modals';
import ChangePasswordForm from '@/components/ChangePasswordForm';

const AppHeader = () => {
  const currentUser = useSelector(getCurrentUser);

  const onSignOut = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    window.location.reload();
  };

  const renderUserInfoModal = () => {
    return (
      <Tabs defaultValue="change-password">
        <Tabs.List>
          <Tabs.Tab value="change-password">Change Password</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="change-password">
          <Container size="xl" p={20}>
            <ChangePasswordForm />
          </Container>
        </Tabs.Panel>
      </Tabs>
    );
  };

  const openUserInfoModal = () => {
    openModal({
      title: <Badge size="xl">PROFILE</Badge>,
      children: renderUserInfoModal(),
      size: 'lg',
    });
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
            <Menu.Item onClick={openUserInfoModal}>
              <UserInformation isProfile />
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
