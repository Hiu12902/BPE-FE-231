import { Button, Flex, Loader, Title, Text } from "@mantine/core";
import { useResponseConfigStyle } from "./ResponseConfig.style";
import TimePicker from "../TimePicker";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteSurveyMutation,
  useSurveyInformationQuery,
  useUpdateSurveyGeneralConfigurationMutation,
} from "@/hooks/useSurvey";
import { useEffect, useState } from "react";
import useNotification from "@/hooks/useNotification";
import { SurveyInfo } from "@/interfaces/index";
import { ConfirmModal } from "@/survey/components/Modal";
import { useQueryClient } from "@tanstack/react-query";

const ResponseConfig = () => {
  const { classes } = useResponseConfigStyle();
  const { projectId, processVersion } = useParams();
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const navigate = useNavigate();
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

  const deleteSurveyMutation = useDeleteSurveyMutation({
    onSuccess: (data: any) => {
      if (data.message) {
        navigate(`/editor`);
      }
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

  const handleDeleteSurvey = () => {
    setOpenConfirmModal(true);
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
              if (surveyInformation?.id && projectId) {
                deleteSurveyMutation.mutate({
                  surveyId: surveyInformation?.id,
                  projectId: projectId,
                });
                setOpenConfirmModal(false);
              }
            }}
          />
          <Flex className={classes.bodyWrapper}>
            <Flex className={classes.sectionWrapper}>
              <Title order={4}>Survey availability</Title>
              <TimePicker
                surveyInfo={surveyInfo}
                setSurveyInfo={(data: SurveyInfo) => {
                  setSurveyInfo(data);
                }}
              />
            </Flex>
          </Flex>
          <Flex justify="space-between" m={10}>
            <Button color="red" onClick={handleDeleteSurvey}>
              Delete survey
            </Button>
            <Button onClick={handleSaveSurveyChanges}>Save changes</Button>
          </Flex>
        </Flex>
      )
    );
  }
};

export default ResponseConfig;
