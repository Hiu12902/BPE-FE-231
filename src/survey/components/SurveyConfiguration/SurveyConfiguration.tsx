import { Flex } from "@mantine/core";
import { useSurveyConfigurationStyle } from "./SurveyConfiguration.style";
import {
  GeneralConfig,
  ResponseConfig,
} from "./components/ConfigurationEditor";
import ConfigurationOption from "./components/ConfigurationOption";

interface SurveyConfigurationProps {
  configOption: string;
}

const SurveyConfiguration = (props: SurveyConfigurationProps) => {
  const { configOption } = props;
  const { classes } = useSurveyConfigurationStyle();
  return (
    <Flex className={classes.wrapper}>
      <ConfigurationOption />
      {configOption === "general" && <GeneralConfig />}
      {configOption === "response" && <ResponseConfig />}
    </Flex>
  );
};

export default SurveyConfiguration;
