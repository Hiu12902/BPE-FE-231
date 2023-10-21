import userApi from "@/api/user";
import { getCurrentUser } from "@/redux/selectors";
import { userActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { AppShell, Box, Header } from "@mantine/core";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { WorkspaceHeader } from "./components";

const WorkspaceLayout = () => {
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
      header={
        <Header height={60} fixed={false}>
          <WorkspaceHeader />
        </Header>
      }
      styles={{
        main: {
          padding: 10,
        },
      }}
    >
      <Box style={{ marginLeft: 10, marginTop: 70 }}>
        <Outlet />
      </Box>
    </AppShell>
  );
};

export default WorkspaceLayout;
