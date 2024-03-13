import { WorkspaceHeader } from "@/components/Layouts/Workspace/components";
import Logo from "@/components/Logo";
import { AppShell, Box, Navbar } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useSurveyLayoutStyle } from "./Survey.style";
import { SurveyNavbar } from "./components";

const SurveyLayout = () => {
  const { classes } = useSurveyLayoutStyle();
  return (
    <AppShell
      navbar={
        <Navbar className={classes.navbar}>
          <Logo />
          <SurveyNavbar mt={35} />
        </Navbar>
      }
      header={<WorkspaceHeader isWorkspaceManagement={false} />}
      styles={{ main: { padding: 0 } }}
    >
      <Box className={classes.box}>
        <Outlet />
      </Box>
    </AppShell>
  );
};

export default SurveyLayout;
