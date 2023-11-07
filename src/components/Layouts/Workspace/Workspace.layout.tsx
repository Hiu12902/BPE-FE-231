import userApi from "@/api/user";
import Logo from "@/components/Logo";
import {
  APP_PALETTE_WIDTH,
  PRIMARY_COLOR,
} from "@/constants/theme/themeConstants";
import { getCurrentUser } from "@/redux/selectors";
import { userActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { AppShell, Box, Header, Navbar } from "@mantine/core";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { WorkspaceHeader } from "./components";
import WorkspaceNavbar from "./components/WorkspaceNavbar";

export interface IWorkspaceLayout {
  showNavbar?: Boolean;
}

const WorkspaceLayout = ({ showNavbar }: IWorkspaceLayout) => {
  const dispatch = useAppDispatch();
  const currentUser = useSelector(getCurrentUser);

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

  // Nếu chưa lưu currentUser email vào localStorage thì gọi API lấy thông tin user
  useEffect(() => {
    if (!currentUser.email) {
      getUser();
    }
    // Nếu có resetToken thì xóa nó đi
    if (!!localStorage.getItem("resetToken")) {
      localStorage.removeItem("resetToken");
    }
  }, [currentUser]);

  return (
    <AppShell
      navbar={
        showNavbar && (
          <Navbar
            height="100vh"
            width={{ base: APP_PALETTE_WIDTH }}
            p="sm"
            sx={(theme) => ({
              backgroundColor: theme.fn.variant({
                variant: "filled",
                color: theme.primaryColor,
              }).background,
              top: 0,
            })}
            style={{
              backgroundColor: PRIMARY_COLOR[1],
            }}
          >
            <Logo />
            <WorkspaceNavbar mt={35} />
          </Navbar>
        )
      }
      header={
        <Header height={60} fixed={false}>
          <WorkspaceHeader showNavBar={showNavbar as boolean} />
        </Header>
      }
      styles={{
        main: {
          padding: 10,
        },
      }}
    >
      <Box
        style={{
          marginLeft: showNavbar ? APP_PALETTE_WIDTH + 10 : 10,
          marginTop: 70,
          height: "90%",
        }}
      >
        <Outlet />
      </Box>
    </AppShell>
  );
};

export default WorkspaceLayout;
