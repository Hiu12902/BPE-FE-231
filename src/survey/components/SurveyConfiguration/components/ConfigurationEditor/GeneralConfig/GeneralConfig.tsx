import useNotification from "@/hooks/useNotification";
import {
  useSurveyGeneralConfigQuery,
  useUpdateSurveyGeneralConfigurationMutation,
} from "@/hooks/useSurvey";
import { SurveyGeneralConfiguration } from "@/interfaces/survey";
import {
  Button,
  Flex,
  Input,
  Loader,
  LoadingOverlay,
  NumberInput,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGeneralConfigStyle } from "./GeneralConfig.style";

const GeneralConfig = ({ surveyId }: { surveyId: number }) => {
  const { classes } = useGeneralConfigStyle();
  const { projectId } = useParams();
  const notify = useNotification();

  // GET: Survey general configuration
  const {
    data: surveyGeneralConfiguration,
    isLoading,
    refetch: refetchSurveyGeneralConfiguration,
  } = useSurveyGeneralConfigQuery({
    projectId: projectId,
    surveyId: surveyId,
  });

  // UPDATE: Survey general configuration
  const generalConfigurationMutation =
    useUpdateSurveyGeneralConfigurationMutation({
      onSuccess: () => {
        refetchSurveyGeneralConfiguration();
        notify({
          message: "Survey information updated successfully.",
          type: "success",
        });
      },
    });

  const [surveyConfig, setSurveyConfig] = useState<SurveyGeneralConfiguration>(
    surveyGeneralConfiguration as SurveyGeneralConfiguration
  );

  const handleSaveSurveyChanges = () => {
    if (surveyId && projectId) {
      generalConfigurationMutation.mutate({
        surveyId: surveyId,
        projectId: Number(projectId),
        ...surveyConfig,
      });
    }
  };

  useEffect(() => {
    if (surveyGeneralConfiguration) {
      setSurveyConfig(surveyGeneralConfiguration);
    }
  }, [surveyGeneralConfiguration]);

  return !surveyGeneralConfiguration ? (
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
  ) : (
    surveyConfig && (
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
              Enter a survey name to show in search results, social media posts,
              and on browser tabs.
            </Text>
            <Input
              className={classes.input}
              placeholder="Enter survey name here..."
              defaultValue={surveyGeneralConfiguration?.name || ""}
              value={surveyConfig.name}
              onChange={(e) => {
                setSurveyConfig({
                  ...surveyConfig,
                  name: e.currentTarget.value,
                });
              }}
            />
          </Flex>
          {/* Survey description */}
          <Flex className={classes.sectionWrapper}>
            <Title order={4}>Description</Title>
            <Text c="dimmed">
              Enter a survey description to show in search results and on social
              media posts.
            </Text>
            <Textarea
              className={classes.input}
              minRows={5}
              placeholder="Enter survey description here..."
              defaultValue={surveyGeneralConfiguration?.description || ""}
              value={surveyConfig.description}
              onChange={(e) => {
                setSurveyConfig({
                  ...surveyConfig,
                  description: e.currentTarget.value,
                });
              }}
            />
          </Flex>
          {/* Criteria level */}
          <Flex className={classes.sectionWrapper}>
            <Title order={4}>Criteria level for each measurement metric</Title>
            <Text c="dimmed">
              Select criteria level for each measurement in this survey.
              Depending on the aim, properties of survey, the measurements'
              level may vary. Range value: 0 - 1.
            </Text>
            <Flex className={classes.numberInputGroup}>
              <NumberInput
                label="CSAT"
                className={classes.numberInput}
                defaultValue={surveyGeneralConfiguration?.csatWeight || 0}
                value={surveyConfig.csatWeight}
                onChange={(value) => {
                  setSurveyConfig({
                    ...surveyConfig,
                    csatWeight: Number(value),
                  });
                }}
                min={0}
                max={1}
                step={0.05}
                precision={2}
              />
              <NumberInput
                label="CES"
                className={classes.numberInput}
                defaultValue={surveyGeneralConfiguration?.cesWeight || 0}
                value={surveyConfig.cesWeight}
                onChange={(value) => {
                  setSurveyConfig({
                    ...surveyConfig,
                    cesWeight: Number(value),
                  });
                }}
                min={0}
                max={1}
                step={0.05}
                precision={2}
              />
              <NumberInput
                label="NPS"
                className={classes.numberInput}
                defaultValue={surveyGeneralConfiguration?.npsWeight || 0}
                value={surveyConfig.npsWeight}
                onChange={(value) => {
                  setSurveyConfig({
                    ...surveyConfig,
                    npsWeight: Number(value),
                  });
                }}
                min={0}
                max={1}
                step={0.05}
                precision={2}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex justify="flex-end" m={10}>
          <Button
            disabled={
              surveyConfig.name === surveyGeneralConfiguration?.name &&
              surveyConfig.description ===
                surveyGeneralConfiguration?.description &&
              surveyConfig.cesWeight ===
                surveyGeneralConfiguration?.cesWeight &&
              surveyConfig.csatWeight ===
                surveyGeneralConfiguration?.csatWeight &&
              surveyConfig.npsWeight === surveyGeneralConfiguration?.npsWeight
            }
            onClick={handleSaveSurveyChanges}
          >
            Save changes
          </Button>
        </Flex>
      </Flex>
    )
  );
};

export default GeneralConfig;
