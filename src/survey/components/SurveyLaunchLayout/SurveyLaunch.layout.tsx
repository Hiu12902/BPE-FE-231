import { AppShell, Box } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useSurveyLaunchLayoutStyle } from "./SurveyLaunch.style";
import { SurveyLaunchHeader } from "./components";

const SurveyLaunchLayout = () => {
  const { classes } = useSurveyLaunchLayoutStyle();
  return (
    <AppShell
      header={<SurveyLaunchHeader />}
      styles={{ main: { padding: 0, marginBottom: 50 } }}
    >
      <Box className={classes.box}>
        <Outlet />
      </Box>
    </AppShell>
  );
};

export default SurveyLaunchLayout;
