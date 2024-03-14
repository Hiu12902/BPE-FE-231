import useNotification from "@/hooks/useNotification";
import {
  useDeleteSurveyMutation,
  useSurveyResponseConfigQuery,
  useUpdateSurveyResponseConfigurationMutation,
} from "@/hooks/useSurvey";
import { SurveyResponseConfiguration } from "@/interfaces/index";
import { ConfirmModal } from "@/survey/components/Modal";
import { Button, Divider, Flex, Loader, Text, Title } from "@mantine/core";
import { DateTimePicker, DatesProvider } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResponseConfigStyle } from "./ResponseConfig.style";

const ResponseConfig = ({ surveyId }: { surveyId: number }) => {
  const { classes } = useResponseConfigStyle();
  const { projectId } = useParams();
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const notify = useNotification();
  const [start, setStart] = useState<Date | string | null>(null);
  const [end, setEnd] = useState<Date | string | null>(null);

  const handleChangeStartDate = (value: Date) => {
    setStart(value);
  };

  const handleChangeEndDate = (value: Date) => {
    setEnd(value);
    setSurveyConfig({
      ...surveyConfig,
      startDate: (end as Date).toISOString().substring(0, 19),
    });
  };

  // GET: Survey Response configuration
  const {
    data: surveyResponseConfiguration,
    isLoading,
    refetch: refetchSurveyResponseConfiguration,
  } = useSurveyResponseConfigQuery({
    projectId: projectId,
    surveyId: surveyId,
  });

  // UPDATE: Survey Response configuration
  const responseConfigurationMutation =
    useUpdateSurveyResponseConfigurationMutation({
      onSuccess: () => {
        refetchSurveyResponseConfiguration();
        notify({
          message: "Survey information updated successfully.",
          type: "success",
        });
      },
    });

  const [surveyConfig, setSurveyConfig] = useState<SurveyResponseConfiguration>(
    surveyResponseConfiguration as SurveyResponseConfiguration
  );

  const deleteSurveyMutation = useDeleteSurveyMutation({
    onSuccess: (data: any) => {
      if (data.message) {
        navigate(`/editor`);
      }
    },
  });

  const handleSaveSurveyChanges = () => {
    if (surveyId && projectId) {
      responseConfigurationMutation.mutate({
        surveyId: surveyId,
        projectId: Number(projectId),
        ...surveyConfig,
      });
    }
  };

  const handleDeleteSurvey = () => {
    setOpenConfirmModal(true);
  };

  useEffect(() => {
    if (surveyResponseConfiguration) {
      setSurveyConfig(surveyResponseConfiguration);
    }
  }, [surveyResponseConfiguration]);

  useEffect(() => {
    if (start) {
      setSurveyConfig({
        ...surveyConfig,
        startDate: (start as Date).toISOString().substring(0, 19),
      });
    }
  }, [start]);

  useEffect(() => {
    if (end) {
      setSurveyConfig({
        ...surveyConfig,
        endDate: (end as Date).toISOString().substring(0, 19),
      });
    }
  }, [end]);

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
      surveyConfig && (
        <Flex
          direction="column"
          justify="space-between"
          className={classes.wrapper}
        >
          <ConfirmModal
            opened={openConfirmModal}
            onClose={() => setOpenConfirmModal(false)}
            title="Delete survey"
            message={
              <Flex direction="column">
                <Text>Please confirm your action!</Text>
                <br />
                <Text
                  variant="gradient"
                  gradient={{ from: "indigo", to: "red", deg: 45 }}
                  sx={{ fontFamily: "Greycliff CF, sans-serif" }}
                  fw={700}
                >
                  This action will remove all the survey information, section
                  and questions in the survey. Survey result will be deleted and
                  reset to default."
                </Text>
              </Flex>
            }
            onConfirm={() => {
              if (surveyId && projectId) {
                deleteSurveyMutation.mutate({
                  surveyId: surveyId,
                  projectId: projectId,
                });
                setOpenConfirmModal(false);
              }
            }}
          />
          <Flex className={classes.bodyWrapper}>
            <Flex className={classes.sectionWrapper}>
              <Title order={4}>Survey availability</Title>
              <DatesProvider
                settings={{
                  locale: "ru",
                  firstDayOfWeek: 1,
                  weekendDays: [0, 6],
                }}
              >
                <Flex justify="space-around" gap="10px">
                  <Flex justify="center" align="center" gap="10px" w="100%">
                    <DateTimePicker
                      // clearable
                      w="100%"
                      label="Start date"
                      defaultValue={
                        surveyConfig.startDate !== null
                          ? new Date(surveyConfig.startDate)
                          : undefined
                      }
                      value={start !== null ? new Date(start) : undefined}
                      placeholder="Choose start date"
                      onChange={handleChangeStartDate}
                    />
                  </Flex>
                  <Divider orientation="vertical" />
                  <Flex justify="center" align="center" gap="10px" w="100%">
                    <DateTimePicker
                      // clearable
                      w="100%"
                      label="End date"
                      placeholder="Choose end date"
                      defaultValue={
                        surveyConfig.endDate !== null
                          ? new Date(surveyConfig.endDate)
                          : undefined
                      }
                      value={end !== null ? new Date(end) : undefined}
                      onChange={handleChangeEndDate}
                    />
                  </Flex>
                </Flex>
              </DatesProvider>
            </Flex>
          </Flex>
          <Flex justify="space-between" m={10}>
            <Button color="red" onClick={handleDeleteSurvey}>
              Delete survey
            </Button>
            <Button
              disabled={
                surveyConfig.startDate === start && surveyConfig.endDate === end
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

export default ResponseConfig;
