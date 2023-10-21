import userApi from "@/api/user";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import UserInformation from "@/components/UserInformation/UserInformation";
import useNotification from "@/hooks/useNotification";
import { getCurrentUser } from "@/redux/selectors";
import {
  ActionIcon,
  Avatar,
  Badge,
  Container,
  Group,
  Menu,
  Tabs,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { ReactComponent as IconSignOut } from "@tabler/icons/icons/logout.svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const currentUser = useSelector(getCurrentUser);
  const notify = useNotification();
  const navigate = useNavigate();
  const hideCancelButton = false;

  const onSignOut = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const changePassword = async (password: string) => {
    try {
      const res = await userApi.changePassword(password);
      if (res) {
        !hideCancelButton
          ? notify({
              title: "Success",
              message: "Your password has been updated!",
              type: "success",
            })
          : navigate("/");
      }
    } catch (err) {
      console.error(err);
      notify({
        title: "Somethings went wrong while changing your password!",
        message: "Try again later",
        type: "error",
      });
    }
  };

  const renderUserInfoModal = () => {
    return (
      <Tabs defaultValue="change-password">
        <Tabs.List>
          <Tabs.Tab value="change-password">Change Password</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="change-password">
          <Container size="xl" p={20}>
            <ChangePasswordForm changePassword={changePassword} />
          </Container>
        </Tabs.Panel>
      </Tabs>
    );
  };

  const openUserInfoModal = () => {
    openModal({
      title: <Badge size="xl">PROFILE</Badge>,
      children: renderUserInfoModal(),
      size: "lg",
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
