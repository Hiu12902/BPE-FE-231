import Logo from "@/components/Logo";
import { Header } from "@mantine/core";
import { useHeaderStyle } from "./SurveyLaunchHeader.style";

const SurveyLaunchHeader = () => {
  const { classes } = useHeaderStyle();
  return (
    <Header height={60} className={classes.header}>
      <Logo />
    </Header>
  );
};

export default SurveyLaunchHeader;
