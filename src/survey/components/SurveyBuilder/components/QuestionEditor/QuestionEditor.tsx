import { Survey, SurveyPublishBody } from "@/interfaces/index";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import QuestionSection from "../QuestionSection";
import { useQuestionEditorStyle } from "./QuestionEditor.style";
import { useState } from "react";
import { PublishModal } from "@/survey/components/Modal";
import { useNavigate, useParams } from "react-router-dom";
import SurveyLauncher from "@/survey/components/SurveyLauncher";
import { useDispatch } from "react-redux";
import { responseActions } from "@/redux/slices";
import { useSurveyPublishMutation } from "@/hooks/useSurvey";
import useNotification from "@/hooks/useNotification";

interface QuestionEditorProps {
  data?: Survey;
}

const QuestionEditor = (props: QuestionEditorProps) => {
  const { data } = props;
  const { projectId, processVersion } = useParams();
  const notify = useNotification();
  const { classes } = useQuestionEditorStyle();
  const dispatch = useDispatch();
  const [openPublishModal, setOpenPublishModal] = useState<boolean>(false);
  const [openPreviewModal, setPreviewModal] = useState<boolean>(false);

  const publishSurveyMutation = useSurveyPublishMutation({
    onSuccess: (data) => {
      if (data) {
        if (data.message) {
          notify({
            message: data.message,
            type: "error",
          });
        } else {
          notify({
            message: "Survey published successfully!",
            type: "success",
          });
        }
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
      <PublishModal
        opened={openPublishModal}
        title="Publish survey"
        message="Are you sure you want to publish this survey?"
        onConfirm={(data: SurveyPublishBody) => {
          handlePublish(data);
        }}
        onClose={() => setOpenPublishModal(false)}
      />
      <Flex
        justify="space-between"
        align="center"
        className={classes.infoGroup}
      >
        <Group>
          <Badge>Draft</Badge>
          <Text c="dimmed">Last saved: Feb 3, 2024 at 2:15 AM.</Text>
        </Group>
      </Flex>

      <ScrollArea className={classes.editArea}>
        {data?.questions.map((section) => (
          <QuestionSection key={section.sectionId} data={section} />
        ))}
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
        />
        <Button
          variant="light"
          color="blue"
          children="Publish"
          onClick={() => {
            setOpenPublishModal(true);
          }}
        />
      </Flex>
    </Flex>
  );
};

export default QuestionEditor;
