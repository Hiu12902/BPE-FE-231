import userApi from "@/api/user";
import Logo from "@/components/Logo";
import { APP_PALETTE_WIDTH } from "@/constants/theme/themeConstants";
import { getCurrentUser } from "@/redux/selectors";
import { userActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { AppShell, Box, LoadingOverlay, Navbar } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useWorkspaceLayoutStyle } from "./Workspace.style";
import { WorkspaceHeader } from "./components";
import WorkspaceNavbar from "./components/WorkspaceNavbar/WorkspaceNavbar";
import { io } from "socket.io-client";
import useNotification from "@/hooks/useNotification";

export interface IWorkspaceLayout {
  isWorkspaceManagement?: Boolean;
}

const WorkspaceLayout = ({ isWorkspaceManagement }: IWorkspaceLayout) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { workspaceId } = useParams();
  const currentUser = useSelector(getCurrentUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [workspaceManagement, setWorkspaceManagement] = useState<string>(
    currentUser.permission as string
  );

  const { classes } = useWorkspaceLayoutStyle();

  const getUser = async (workspaceId?: number) => {
    try {
      if (workspaceId) {
        const res = await userApi.getMe(workspaceId);
        if (res) {
          dispatch(userActions.setUser(res));
          if (res.permission) {
            setWorkspaceManagement(res.permission);
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
    // Kể cả có thông tin về currentUser cũng gọi lại vì tránh trường hợp navigate(-1) thì page không reload để setLoading(false)
    if (loading) {
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
    if (isWorkspaceManagement && workspaceManagement !== "owner" && !loading) {
      navigate("/404");
    }
  }, [workspaceManagement, isWorkspaceManagement]);

  // const socket = io("https://bpe.onrender.com");
  // const notify = useNotification();
  // useEffect(() => {
  //   if (currentUser && currentUser.id) {
  //     socket.on(`insertNewNotification_${currentUser?.id}`, (message) => {
  //       notify({
  //         type: "notification",
  //         message: JSON.parse(message).content,
  //         title: "New notification!",
  //       });
  //     });
  //   }
  // }, [socket]);

  if (
    // !isWorkspaceManagement && loading: Normal route
    (!isWorkspaceManagement && loading) ||
    // isWorkspaceManagement && (loading || isWorkspaceManagement): Management route
    (isWorkspaceManagement && (loading || workspaceManagement !== "owner"))
  ) {
    return <LoadingOverlay visible overlayColor="rgba(255, 255, 255, 0.5)" />;
  } else {
    return isWorkspaceManagement ? (
      <AppShell
        navbar={
          <Navbar className={classes.navbar}>
            <Logo />
            <WorkspaceNavbar mt={35} />
          </Navbar>
        }
        header={<WorkspaceHeader isWorkspaceManagement={true} />}
        className={classes.appshell}
      >
        <Box ml={APP_PALETTE_WIDTH + 10} className={classes.outlet}>
          <Outlet />
        </Box>
      </AppShell>
    ) : (
      <AppShell
        header={<WorkspaceHeader isWorkspaceManagement={false} />}
        className={classes.appshell}
      >
        <Box ml={10} className={classes.outlet}>
          <Outlet />
        </Box>
      </AppShell>
    );
  }
};

export default WorkspaceLayout;
