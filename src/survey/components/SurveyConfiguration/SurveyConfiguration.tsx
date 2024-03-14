import { Flex } from "@mantine/core";
import { useSurveyConfigurationStyle } from "./SurveyConfiguration.style";
import {
  GeneralConfig,
  ResponseConfig,
} from "./components/ConfigurationEditor";
import ConfigurationOption from "./components/ConfigurationOption";
import { useSurveyInformationQuery } from "@/hooks/useSurvey";
import { useParams } from "react-router";

interface SurveyConfigurationProps {
  configOption: string;
}

const SurveyConfiguration = (props: SurveyConfigurationProps) => {
  const { configOption } = props;
  const { classes } = useSurveyConfigurationStyle();
  const { projectId, processVersion } = useParams();
  const { data: surveyInformation } = useSurveyInformationQuery({
    projectId: projectId,
    processVersionVersion: processVersion,
  });
  const surveyId = surveyInformation?.id;

  return (
    <Flex className={classes.wrapper}>
      <ConfigurationOption />
      {configOption === "general" && surveyId && (
        <GeneralConfig surveyId={surveyInformation?.id} />
      )}
      {configOption === "response" && surveyId && (
        <ResponseConfig surveyId={surveyInformation?.id} />
      )}
    </Flex>
  );
};

export default SurveyConfiguration;
