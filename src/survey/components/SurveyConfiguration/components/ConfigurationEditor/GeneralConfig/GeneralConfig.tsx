import {
  useSurveyInformationQuery,
  useUpdateSurveyGeneralConfigurationMutation,
} from "@/hooks/useSurvey";
import { SurveyInfo } from "@/interfaces/survey";
import {
  Button,
  Flex,
  Input,
  Loader,
  NumberInput,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGeneralConfigStyle } from "./GeneralConfig.style";
import useNotification from "@/hooks/useNotification";

const GeneralConfig = () => {
  const { classes } = useGeneralConfigStyle();
  const { projectId, processVersion } = useParams();
  const {
    data: surveyInformation,
    isLoading,
    refetch: refetchSurveyInformation,
  } = useSurveyInformationQuery({
    projectId: projectId,
    processVersionVersion: processVersion,
  });

  const generalConfigurationMutation =
    useUpdateSurveyGeneralConfigurationMutation({
      onSuccess: () => {
        const notify = useNotification();
        notify({
          message: "Survey information updated successfully.",
          type: "success",
        });
        refetchSurveyInformation();
      },
    });

  const [surveyInfo, setSurveyInfo] = useState<SurveyInfo>(
    surveyInformation as SurveyInfo
  );

  const handleSaveSurveyChanges = () => {
    if (surveyInformation?.id && projectId) {
      generalConfigurationMutation.mutate({
        surveyId: surveyInformation?.id,
        projectId: Number(projectId),
        ...surveyInfo,
      });
    }
  };

  useEffect(() => {
    if (surveyInformation) {
      setSurveyInfo(surveyInformation);
    }
  }, [surveyInformation]);

  if (isLoading) {
    return (
      <Flex
        style={{
          height: "screen",
          width: "70%",
        }}
        align="center"
        justify="center"
      >
        <Loader />
      </Flex>
    );
  } else {
    return (
      surveyInfo && (
        <Flex
          direction="column"
          justify="space-between"
          className={classes.wrapper}
        >
          <Flex className={classes.bodyWrapper}>
            {/* Survey name */}
            <Flex className={classes.sectionWrapper}>
              <Title order={4}>Display name</Title>
              <Text c="dimmed">
                Enter a survey name to show in search results, social media
                posts, and on browser tabs.
              </Text>
              <Input
                className={classes.input}
                placeholder="Enter survey name here..."
                defaultValue={surveyInformation?.name || ""}
                value={surveyInfo.name}
                onChange={(e) => {
                  setSurveyInfo({ ...surveyInfo, name: e.currentTarget.value });
                }}
              />
            </Flex>
            {/* Survey description */}
            <Flex className={classes.sectionWrapper}>
              <Title order={4}>Description</Title>
              <Text c="dimmed">
                Enter a survey description to show in search results and on
                social media posts.
              </Text>
              <Textarea
                className={classes.input}
                minRows={5}
                placeholder="Enter survey description here..."
                defaultValue={surveyInformation?.description || ""}
                value={surveyInfo.description}
                onChange={(e) => {
                  setSurveyInfo({
                    ...surveyInfo,
                    description: e.currentTarget.value,
                  });
                }}
              />
            </Flex>
            {/* Criteria level */}
            <Flex className={classes.sectionWrapper}>
              <Title order={4}>
                Criteria level for each measurement metric
              </Title>
              <Text c="dimmed">
                Select criteria level for each measurement in this survey.
                Depending on the aim, properties of survey, the measurements'
                level may vary. Range value: 0 - 1.
              </Text>
              <Flex className={classes.numberInputGroup}>
                <NumberInput
                  label="CSAT"
                  className={classes.numberInput}
                  min={0}
                  max={1}
                  step={0.05}
                  precision={2}
                  defaultValue={0}
                />
                <NumberInput
                  label="CES"
                  className={classes.numberInput}
                  min={0}
                  max={1}
                  step={0.05}
                  precision={2}
                  defaultValue={0}
                />
                <NumberInput
                  label="NPS"
                  className={classes.numberInput}
                  min={0}
                  max={1}
                  step={0.05}
                  precision={2}
                  defaultValue={0}
                />
              </Flex>
            </Flex>
          </Flex>
          <Flex justify="flex-end" m={10}>
            <Button
              disabled={
                surveyInfo.name === surveyInformation?.name &&
                surveyInfo.description === surveyInformation?.description
              }
              onClick={handleSaveSurveyChanges}
            >
              Save changes
            </Button>
          </Flex>
        </Flex>
      )
    );
  }
};

export default GeneralConfig;
