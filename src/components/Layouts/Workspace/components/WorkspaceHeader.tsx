import UserInformation from "@/components/UserInformation/UserInformation";
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
import { ReactComponent as IconSetting } from "@tabler/icons/icons/settings.svg";
import { ReactComponent as IconNotification } from "@tabler/icons/icons/bell.svg";
import { useSelector } from "react-redux";
import { ReactComponent as IconSignOut } from "@tabler/icons/icons/logout.svg";
import { ACCESS_TOKEN } from "@/constants/localStorageKeys";
import { openModal } from "@mantine/modals";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import useNotification from "@/hooks/useNotification";
import { useNavigate } from "react-router-dom";
import userApi from "@/api/user";

const WorkspaceHeader = () => {
  const currentUser = useSelector(getCurrentUser);
  const notify = useNotification();
  const navigate = useNavigate();
  const hideCancelButton = false;

  const onSignOut = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    window.location.reload();
  };

  const onChangePassword = async (password: string) => {
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
            <ChangePasswordForm changePassword={onChangePassword} />
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
    <Group
      position="right"
      align="center"
      style={{
        height: "100%",
        padding: 0,
      }}
    >
      <div />
      <Group mr={20}>
        {/* onClick: Navigate tới trang Workspace management */}
        <ActionIcon>
          <IconSetting width={25} height={25} />
        </ActionIcon>

        {/* onClick: Navigate tới trang Notification */}
        <ActionIcon>
          <IconNotification width={25} height={25} />
        </ActionIcon>

        {/* onClick: Open modal User Information */}
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

export default WorkspaceHeader;
