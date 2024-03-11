import { Flex, LoadingOverlay } from "@mantine/core";
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
  const surveyLoading = false;
  return (
    <Flex className={classes.wrapper}>
      {surveyLoading ? (
        <LoadingOverlay visible overlayColor="rgba(255, 255, 255, 1)" />
      ) : (
        <>
          <ConfigurationOption />
          {configOption === "general" && <GeneralConfig />}
          {configOption === "response" && <ResponseConfig />}
        </>
      )}
    </Flex>
  );
};

export default SurveyConfiguration;
