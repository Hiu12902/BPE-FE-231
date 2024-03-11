import { Flex, Text, Title } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useConfigurationOptionStyle } from "./ConfigurationOption.style";

const ConfigurationOption = () => {
  const { classes } = useConfigurationOptionStyle();
  const pathname = useLocation().pathname;
  const isGeneral = pathname.split("/")[5] === "general";
  const navigate = useNavigate();
  return (
    <Flex className={classes.mainWrapper}>
      <Flex
        direction="column"
        className={isGeneral ? classes.activeSection : classes.sectionWrapper}
        onClick={() => {
          const currentPathname = pathname;
          if (!isGeneral) {
            const newPathname = currentPathname.replace("response", "general");
            navigate(newPathname);
          }
        }}
      >
        <Title order={4}>General</Title>
        <Text c="dimmed">Title, description</Text>
      </Flex>

      <Flex
        direction="column"
        className={isGeneral ? classes.sectionWrapper : classes.activeSection}
        onClick={() => {
          const currentPathname = pathname;
          if (isGeneral) {
            const newPathname = currentPathname.replace("general", "response");
            navigate(newPathname);
          }
        }}
      >
        <Title order={4}>Survey response</Title>
        <Text c="dimmed">Survey expiration, incomplete responses</Text>
      </Flex>
    </Flex>
  );
};

export default ConfigurationOption;
