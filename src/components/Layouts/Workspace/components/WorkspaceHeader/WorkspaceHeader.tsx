import userApi from "@/api/user";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import Logo from "@/components/Logo";
import UserInformation from "@/components/UserInformation/UserInformation";
import { ACCESS_TOKEN } from "@/constants/localStorageKeys";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import useNotification from "@/hooks/useNotification";
import { getCurrentUser } from "@/redux/selectors";
import {
  ActionIcon,
  Avatar,
  Badge,
  Container,
  Group,
  Header,
  Menu,
  Tabs,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { ReactComponent as IconNotification } from "@tabler/icons/icons/bell.svg";
import { ReactComponent as IconSignOut } from "@tabler/icons/icons/logout.svg";
import { ReactComponent as IconSetting } from "@tabler/icons/icons/settings.svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface IWorkspaceHeader {
  isWorkspaceManagement?: boolean;
}

const WorkspaceHeader = ({ isWorkspaceManagement }: IWorkspaceHeader) => {
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
    <Header height={60} fixed={false}>
      <Group
        position="apart"
        align="center"
        style={{
          backgroundColor: isWorkspaceManagement ? "white" : PRIMARY_COLOR[1],
          height: "100%",
          padding: 0,
        }}
      >
        <Logo />
        <Group mr={20}>
          <ActionIcon>
            <IconSetting
              width={25}
              height={25}
              color={isWorkspaceManagement ? "#999" : "#fff"}
            />
          </ActionIcon>

          <ActionIcon>
            <IconNotification
              width={25}
              height={25}
              color={isWorkspaceManagement ? "#999" : "#fff"}
            />
          </ActionIcon>

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
    </Header>
  );
};

export default WorkspaceHeader;
