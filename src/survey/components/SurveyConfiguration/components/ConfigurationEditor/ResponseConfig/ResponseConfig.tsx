import useNotification from "@/hooks/useNotification";
import {
  useCloseSurveyMutation,
  useDeleteSurveyMutation,
  useSurveyResponseConfigQuery,
  useUpdateSurveyResponseConfigurationMutation,
} from "@/hooks/useSurvey";
import { SurveyResponseConfiguration } from "@/interfaces/index";
import { ConfirmModal } from "@/survey/components/Modal";
import {
  Button,
  Divider,
  Flex,
  Loader,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { DateTimePicker, DatesProvider } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResponseConfigStyle } from "./ResponseConfig.style";

const ResponseConfig = ({ surveyId }: { surveyId: number }) => {
  const navigate = useNavigate();
  const notify = useNotification();
  const { classes } = useResponseConfigStyle();
  const { projectId, processVersion } = useParams();
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [configChange, setConfigChange] = useState<SurveyResponseConfiguration>(
    {} as SurveyResponseConfiguration
  );
  const [startValue, setStartValue] = useState<Date | string | null>(null);
  const [endValue, setEndValue] = useState<Date | string | null>(null);

  const toLocaleISOString = (date: Date) => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzoffset).toISOString().substring(0, 16);
  };

  // GET: Survey Response configuration
  const { data: responseConfig, refetch: refetchResponseConfig } =
    useSurveyResponseConfigQuery({
      projectId: projectId,
      surveyId: surveyId,
    });

  // UPDATE: Survey Response configuration
  const responseConfigMutation = useUpdateSurveyResponseConfigurationMutation({
    onSuccess: (data) => {
      if (data.message) {
        notify({
          message: data.message,
          type: "error",
        });
      } else {
        notify({
          message: "Survey information updated successfully.",
          type: "success",
        });
        refetchResponseConfig();
      }
    },
  });

  // POST: Close survey
  const closeSurveyMutation = useCloseSurveyMutation({
    onSuccess: (data: any) => {
      if (data) {
        notify({
          message: "Survey closed successfully.",
          type: "success",
        });
        refetchResponseConfig();
      }
    },
  });

  // DELETE: Delete survey
  const deleteSurveyMutation = useDeleteSurveyMutation({
    onSuccess: (data: any) => {
      if (data.message) {
        navigate(`/editor`);
      }
    },
  });

  const handleSaveSurveyChanges = () => {
    if (surveyId && projectId) {
      if (responseConfig?.isPublished === "published") {
        const { startDate, ...rest } = configChange;
        responseConfigMutation.mutate({
          surveyId: surveyId,
          projectId: Number(projectId),
          ...rest,
        });
      } else {
        responseConfigMutation.mutate({
          surveyId: surveyId,
          projectId: Number(projectId),
          ...configChange,
        });
      }
    }
  };

  const handleDeleteSurvey = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseSurvey = () => {
    if (processVersion && projectId) {
      closeSurveyMutation.mutate({
        processVersionVersion: processVersion,
        projectId: Number(projectId),
      });
    }
  };

  const handleChangeStartDate = (value: Date) => {
    setStartValue(value);
  };

  const handleChangeEndDate = (value: Date) => {
    setEndValue(value);
  };

  useEffect(() => {
    if (responseConfig) {
      const { startDate, endDate } = responseConfig;
      if (startDate !== null && startDate) {
        setStartValue(new Date(startDate));
      }
      if (endDate !== null && endDate) {
        setEndValue(new Date(endDate));
      }
    }
  }, [responseConfig]);

  useEffect(() => {
    if (responseConfig?.startDate !== undefined && startValue !== null) {
      if (toLocaleISOString(startValue as Date) !== responseConfig?.startDate) {
        setConfigChange({
          ...configChange,
          startDate: toLocaleISOString(startValue as Date),
        });
      } else {
        const { startDate, ...rest } = configChange;
        setConfigChange(rest);
      }
    }
  }, [startValue]);

  useEffect(() => {
    if (responseConfig?.endDate !== undefined && endValue !== null) {
      if (toLocaleISOString(endValue as Date) !== responseConfig?.endDate) {
        setConfigChange({
          ...configChange,
          endDate: toLocaleISOString(endValue as Date),
        });
      } else {
        const { endDate, ...rest } = configChange;
        setConfigChange(rest);
      }
    }
  }, [endValue]);

  return !responseConfig ? (
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
              // variant="gradient"
              // gradient={{ from: "indigo", to: "red", deg: 45 }}
              color="red"
              sx={{ fontFamily: "Greycliff CF, sans-serif" }}
              fw={700}
            >
              This action will remove all the survey information, section and
              questions in the survey. Survey result will be deleted and reset
              to default.
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
      {/* Body */}
      <Flex className={classes.bodyWrapper}>
        {/* allowMultipleResponses */}
        <Flex justify="space-between" align="center" w="100%">
          <Flex direction="column" justify="flex-start" align="left" w="100%">
            <Title order={4}>Allow respondents to send another response</Title>
            <Text c="dimmed" fz={13}>
              Let respondents send another response when they have finished the
              current one.
            </Text>
          </Flex>
          <Switch
            size="lg"
            value={configChange.allowDuplicateRespondent ? "true" : "false"}
            defaultChecked={responseConfig.allowDuplicateRespondent}
            onLabel="Yes"
            offLabel="No"
            onChange={(e) => {
              if (
                responseConfig.allowDuplicateRespondent !== e.target.checked
              ) {
                setConfigChange({
                  ...configChange,
                  allowDuplicateRespondent: e.target.checked,
                });
              } else {
                const { allowDuplicateRespondent, ...rest } = configChange;
                setConfigChange(rest);
              }
            }}
          />
        </Flex>
        {/* Send survey results to respondents */}
        <Flex justify="space-between" align="center" w="100%">
          <Flex direction="column" justify="flex-start" align="left" w="100%">
            <Title order={4}>Send survey results to respondents</Title>
            <Text c="dimmed" fz={13}>
              Send a summary of survey results to respondents after the survey
              closes.
            </Text>
          </Flex>
          <Switch
            size="lg"
            value={configChange.sendResultToRespondent ? "true" : "false"}
            defaultChecked={responseConfig.sendResultToRespondent}
            onLabel="Yes"
            offLabel="No"
            onChange={(e) => {
              if (responseConfig.sendResultToRespondent !== e.target.checked) {
                setConfigChange({
                  ...configChange,
                  sendResultToRespondent: e.target.checked,
                });
              } else {
                const { sendResultToRespondent, ...rest } = configChange;
                setConfigChange(rest);
              }
            }}
          />
        </Flex>
        {/* Start date/End date */}
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
                  disabled={responseConfig?.isPublished !== "pending"}
                  label="Start date"
                  value={startValue !== null ? new Date(startValue) : null}
                  placeholder="Choose start date"
                  onChange={handleChangeStartDate}
                />
              </Flex>
              <Divider orientation="vertical" />
              <Flex justify="center" align="center" gap="10px" w="100%">
                <DateTimePicker
                  // clearable
                  w="100%"
                  disabled={responseConfig?.isPublished === "closed"}
                  label="End date"
                  placeholder="Choose end date"
                  value={endValue !== null ? new Date(endValue) : null}
                  onChange={handleChangeEndDate}
                />
              </Flex>
            </Flex>
          </DatesProvider>
        </Flex>
      </Flex>
      {/* Button group */}
      <Flex justify="space-between" m={10}>
        <Flex gap={10}>
          <Button color="red" onClick={handleDeleteSurvey}>
            Delete survey
          </Button>
          <Button
            color="red"
            disabled={responseConfig?.isPublished === "closed"}
            onClick={handleCloseSurvey}
          >
            Close survey
          </Button>
        </Flex>
        <Button
          disabled={Object.keys(configChange).length === 0}
          onClick={handleSaveSurveyChanges}
        >
          Save changes
        </Button>
      </Flex>
    </Flex>
  );
};

export default ResponseConfig;
