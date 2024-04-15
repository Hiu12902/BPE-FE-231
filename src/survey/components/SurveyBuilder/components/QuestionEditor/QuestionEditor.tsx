import useNotification from "@/hooks/useNotification";
import { useSurveyPublishMutation } from "@/hooks/useSurvey";
import {
  IsChangedQuestionContextProps,
  Survey,
  SurveyPublishBody,
} from "@/interfaces/index";
import { responseActions } from "@/redux/slices";
import { PublishModal } from "@/survey/components/Modal";
import SurveyLauncher from "@/survey/components/SurveyLauncher";
import { IsChangedQuestionContext } from "@/survey/context";
import {
  Badge,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import QuestionSection from "../QuestionSection";
import { useQuestionEditorStyle } from "./QuestionEditor.style";

interface QuestionEditorProps {
  data?: Survey;
}

const QuestionEditor = (props: QuestionEditorProps) => {
  const { data } = props;
  const dispatch = useDispatch();
  const notify = useNotification();
  const { classes } = useQuestionEditorStyle();
  const { projectId, processVersion } = useParams();
  const [openPreviewModal, setPreviewModal] = useState<boolean>(false);
  const [openPublishModal, setOpenPublishModal] = useState<boolean>(false);
  const { refetch, isFetching } = useContext(
    IsChangedQuestionContext
  ) as IsChangedQuestionContextProps;

  const publishSurveyMutation = useSurveyPublishMutation({
    onSuccess: (res) => {
      if (res) {
        if (res.message) {
          notify({
            message: res.message,
            type: "error",
          });
        } else {
          notify({
            message:
              data?.survey.isPublished === "closed"
                ? "Survey published successfully!"
                : "Change publish configuration successfully",
            type: "success",
          });
        }
        refetch();
      }
    },
  });

  const handlePublish = (data: SurveyPublishBody) => {
    if (projectId && processVersion) {
      publishSurveyMutation.mutate({
        ...data,
        projectId: Number(projectId),
        processVersionVersion: processVersion,
      });
    }
  };

  const handlePreview = () => {
    setPreviewModal(true);
  };

  return (
    <Flex
      className={classes.wrapper}
      direction="column"
      justify="center"
      align="center"
      id="tour_editor"
    >
      <Modal
        opened={openPreviewModal}
        onClose={() => {
          setPreviewModal(false);
          dispatch(responseActions.deleteResponse());
        }}
        fullScreen
      >
        <Flex direction="column" justify="center" align="center">
          <Title order={3} color="blue">
            Survey preview
          </Title>
          <SurveyLauncher preview={true} />
        </Flex>
      </Modal>
      {openPublishModal && (
        <PublishModal
          opened={openPublishModal}
          title="Publish survey"
          message="Are you sure you want to publish this survey?"
          onConfirm={(data: SurveyPublishBody) => {
            handlePublish(data);
          }}
          onClose={() => setOpenPublishModal(false)}
          projectId={Number(projectId)}
        />
      )}
      <Flex
        justify="space-between"
        align="center"
        className={classes.infoGroup}
      >
        <Group id="tour_survey_status">
          <Title order={5}>Survey status:</Title>
          {data?.survey.isPublished === "closed" ? (
            <Badge color="red">Closed</Badge>
          ) : data?.survey.isPublished === "published" ? (
            <Badge color="green">Published</Badge>
          ) : data?.survey.isPublished === "pending" ? (
            <Badge color="blue">Pending</Badge>
          ) : (
            <></>
          )}
        </Group>
      </Flex>

      <ScrollArea className={classes.editArea}>
        {publishSurveyMutation.isPending ||
        !data?.survey.isPublished ||
        isFetching ? (
          <Flex>
            <LoadingOverlay visible />
          </Flex>
        ) : data?.survey.isPublished !== "closed" ? (
          <Flex
            w="100%"
            h="50vh"
            justify="center"
            align="center"
            direction="column"
          >
            {data?.survey.isPublished === "published" ? (
              <Text
                children={
                  <p>
                    This survey is <strong>published</strong>. You can preview
                    the survey by clicking the button below.
                  </p>
                }
              />
            ) : data?.survey.isPublished === "pending" ? (
              <Text
                children={
                  <p>
                    This survey is <strong>pending</strong>. You can preview the
                    survey by clicking the button below.
                  </p>
                }
              />
            ) : (
              <></>
            )}
            <Text
              mt={10}
              italic
              c="dimmed"
              fz={13}
              children="You can close survey in Configuration > Survey response."
            />
          </Flex>
        ) : (
          <>
            {data?.questions.map((section) => (
              <QuestionSection key={section.sectionId} data={section} />
            ))}
          </>
        )}
      </ScrollArea>

      <Flex
        className={classes.buttonGroup}
        justify="space-between"
        align="center"
      >
        <Button
          variant="light"
          color="green"
          children="Preview"
          onClick={handlePreview}
          id="tour_preview"
        />
        <Button
          variant="light"
          color="blue"
          children="Publish"
          disabled={data?.survey.isPublished === "published"}
          onClick={() => {
            setOpenPublishModal(true);
          }}
          id="tour_publish"
        />
      </Flex>
    </Flex>
  );
};

export default QuestionEditor;
