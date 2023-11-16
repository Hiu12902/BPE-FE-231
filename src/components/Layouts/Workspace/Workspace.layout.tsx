import userApi from "@/api/user";
import Logo from "@/components/Logo";
import {
  APP_PALETTE_WIDTH,
  PRIMARY_COLOR,
} from "@/constants/theme/themeConstants";
import { getCurrentUser } from "@/redux/selectors";
import { userActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { AppShell, Box, Header, LoadingOverlay, Navbar } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { WorkspaceHeader } from "./components";
import WorkspaceNavbar from "./components/WorkspaceNavbar";

export interface IWorkspaceLayout {
  showNavbar?: Boolean;
}

const WorkspaceLayout = ({ showNavbar }: IWorkspaceLayout) => {
  const dispatch = useAppDispatch();
  const currentUser = useSelector(getCurrentUser);
  const { workspaceId } = useParams();
  const [wsPermission, setWsPermission] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const getUser = async (workspaceId?: number) => {
    try {
      if (workspaceId) {
        const res = await userApi.getMe(workspaceId);
        if (res) {
          dispatch(userActions.setUser(res));
          if (res.permission) {
            setWsPermission(res.permission);
          }
        }
      } else {
        const res = await userApi.getMe();
        if (res) {
          dispatch(userActions.setUser(res));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser.email) {
      getUser();
    }
    if (!currentUser.permission && workspaceId && !loading) {
      getUser(Number(workspaceId));
    }
    if (!!localStorage.getItem("resetToken")) {
      localStorage.removeItem("resetToken");
    }
  }, [currentUser]);

  useEffect(() => {
    if (showNavbar && wsPermission !== "owner" && !loading) {
      navigate("/404");
    }
  }, [wsPermission, showNavbar]);

  if (
    (!showNavbar && loading) ||
    (showNavbar && (loading || wsPermission !== "owner"))
  ) {
    return <LoadingOverlay visible overlayColor="rgba(255, 255, 255, 0.5)" />;
  } else {
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
  }
};

export default WorkspaceLayout;
