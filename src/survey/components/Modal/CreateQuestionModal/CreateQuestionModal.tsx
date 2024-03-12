import {
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  Input,
  Modal,
  ModalProps,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { useCreateQuestionModalStyle } from "./CreateQuestionModal.style";
import { Question, Option } from "@/interfaces/index";
import { useState } from "react";
import {
  NumberInputCustom,
  QuestionOptions,
  QuestionTypePicker,
} from "../../SurveyBuilder/components";
import { ReactComponent as IconV } from "@tabler/icons/icons/check.svg";
import { ReactComponent as IconX } from "@tabler/icons/icons/x.svg";
import useNotification from "@/hooks/useNotification";

interface CreateQuestionModalProps extends ModalProps {
  opened: boolean;
  onCreate: (data: Question) => void;
}

const CreateQuestionModal = (props: CreateQuestionModalProps) => {
  const { opened, onCreate, onClose } = props;
  const { classes } = useCreateQuestionModalStyle();
  const [newQuestion, setNewQuestion] = useState({
    isRequired: false,
    weight: 0,
  } as Question);
  const notify = useNotification();
  const handleCancel = () => {
    onClose?.();
  };
  const handleConfirm = () => {
    if (!newQuestion.content) {
      notify({
        type: "warning",
        title: "Content is Required",
        message: "Please enter content to create a new question!",
      });
      return;
    }
    if (!newQuestion.questionType) {
      notify({
        type: "warning",
        title: "Question type is Required",
        message: "Please choose question type to create a new question!",
      });
      return;
    }
    onCreate(newQuestion);
    setNewQuestion({
      isRequired: false,
      weight: 0,
    } as Question);
    onClose?.();
  };
  return (
    <Modal
      size="70%"
      centered
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      opened={opened}
      onClose={handleCancel}
      title={
        <Badge size="lg" mb={5} color="blue">
          Create new question
        </Badge>
      }
      styles={{
        content: {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        },
        body: {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        close: {
          display: " none",
        },
      }}
    >
      <Flex direction="column" justify="flex-start">
        {/* Content */}
        <Flex direction="column" className={classes.sectionWrapper}>
          <Title order={5} children="Content" />
          <Input
            data-autofocus
            placeholder="Enter question content here..."
            value={newQuestion.content}
            onChange={(event) => {
              setNewQuestion({
                ...newQuestion,
                content: event.currentTarget.value,
              });
            }}
          />
        </Flex>
        {/* Question type */}
        <Flex className={classes.sectionWrapper}>
          <QuestionTypePicker
            value={newQuestion?.questionType || ""}
            setValue={(value: string) => {
              setNewQuestion({
                ...newQuestion,
                questionType: value,
              });
            }}
          />
        </Flex>
        {/* isRequired */}
        <Flex
          align="center"
          justify="space-between"
          className={classes.sectionWrapper}
        >
          <Flex direction="column">
            <Title order={5} children="Response required" />

            <Text size={12} c="dimmed">
              If enabled, user must answer this question
            </Text>
          </Flex>
          <Switch
            defaultChecked={false}
            checked={newQuestion?.isRequired}
            onChange={(event) => {
              setNewQuestion({
                ...newQuestion,
                isRequired: event.target.checked,
              });
            }}
            color="blue"
            size="md"
            thumbIcon={
              newQuestion?.isRequired ? (
                <IconV
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                  color="blue"
                />
              ) : (
                <IconX
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                  color="gray"
                />
              )
            }
          />
        </Flex>
        {/* Weight */}
        <Flex
          align="center"
          justify="space-between"
          className={classes.sectionWrapper}
        >
          <Flex direction="column">
            <Title order={5} children="Criteria level" />
            <Text c="dimmed" size={12}>
              Please enter value in range 0-1
            </Text>
          </Flex>
          <NumberInputCustom
            defaultValue={0}
            value={newQuestion?.weight || 0}
            onChange={(value) => {
              setNewQuestion({
                ...newQuestion,
                weight: value,
              });
            }}
            min={0}
            max={1}
            step={0.1}
            precision={2}
          />
        </Flex>
        {/* questionOptions */}
        {newQuestion.questionType === "multiple_choice" && (
          <Flex className={classes.sectionWrapper}>
            <QuestionOptions
              value={newQuestion.questionOptions || []}
              setValue={(value: Option[]) => {
                setNewQuestion({
                  ...newQuestion,
                  questionOptions: value,
                });
              }}
            />
          </Flex>
        )}
      </Flex>
      <Flex direction="column">
        <Divider my="md" />
        <Group position="right">
          <Button variant="outline" onClick={handleCancel} children="Cancel" />
          <Button onClick={handleConfirm} color="red" children="Create" />
        </Group>
      </Flex>
    </Modal>
  );
};

export default CreateQuestionModal;
