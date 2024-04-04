import { useSurveyInformationQuery } from "@/hooks/useSurvey";
import { Flex, LoadingOverlay } from "@mantine/core";
import { useEffect } from "react";
import { useParams } from "react-router";
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
  const { projectId, processVersion } = useParams();
  const { data: surveyInformation } = useSurveyInformationQuery({
    projectId: projectId,
    processVersionVersion: processVersion,
  });
  const surveyId = surveyInformation?.id;

  useEffect(() => {
    if (surveyInformation === null) {
      window.open(`/404`, "_self");
    }
  }, [surveyInformation]);

  return (
    <Flex className={classes.wrapper}>
      <LoadingOverlay visible={!surveyInformation} />
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
