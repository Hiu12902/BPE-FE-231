import {
  IsChangedQuestionContextProps,
  Option,
  Question,
  Section,
  SelectedQuestionContextProps,
  Survey,
} from "@/interfaces/index";
import {
  IsChangedQuestionContext,
  SelectedQuestionContext,
} from "@/survey/context";
import {
  Button,
  Flex,
  Input,
  ScrollArea,
  Switch,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { ReactComponent as IconV } from "@tabler/icons/icons/check.svg";
import { ReactComponent as IconX } from "@tabler/icons/icons/x.svg";
import { useContext, useEffect, useState } from "react";
import NumberInputCustom from "../NumberInputCustom";
import QuestionOptions from "../QuestionOptions";
import QuestionTypePicker from "../QuestionTypePicker";
import TitleInformation from "../TitleInformation";
import { useQuestionConfigStyle } from "./QuestionConfig.style";
import { useUpdateQuestionMutation } from "@/hooks/useQuestion";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface QuestionConfigProps {
  data: Survey;
}

const QuestionConfig = (props: QuestionConfigProps) => {
  const { data } = props;
  const { survey, questions } = data;
  const projectId = useParams().projectId;
  const { classes } = useQuestionConfigStyle();

  const { isChanged, setIsChanged, refetch } = useContext(
    IsChangedQuestionContext
  ) as IsChangedQuestionContextProps;
  const { selectedQuestion, setSelectedQuestion } = useContext(
    SelectedQuestionContext
  ) as SelectedQuestionContextProps;

  const maxOrderInSection = (): number => {
    let max = 0;
    questions.forEach((section: Section) => {
      if (section.questions.includes(selectedQuestion)) {
        max = section.questions.length;
      }
    });
    return max;
  };

  const sectionId = (): number => {
    let id = 0;
    questions.forEach((section: Section) => {
      if (section.questions.includes(selectedQuestion)) {
        id = section.sectionId;
      }
    });
    return id;
  };

  const {
    content,
    isRequired,
    orderInSection,
    questionOptions,
    questionType,
    weight,
  } = selectedQuestion;

  const [editedQuestion, setEditedQuestion] =
    useState<Question>(selectedQuestion);

  useEffect(() => {
    if (!isChanged && selectedQuestion) {
      setEditedQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  const {
    mutate: updateQuestion,
    isError: updateError,
    isSuccess: updateSuccess,
  } = useUpdateQuestionMutation({
    onSuccess: (data: any) => {
      console.log("Update question success: ", data);
      refetch();
    },
    onSettled: () => {
      console.log("Update question settled");
    },
  });

  const handleApplyChanges = () => {
    const { questionOptions, questionType } = editedQuestion;
    // kiểm tra nếu questionType là multiple_choice thì questionOptions phải có ít nhất 2 option
    if (
      questionType === "multiple_choice" &&
      (!questionOptions || (questionOptions && questionOptions.length < 2))
    ) {
      console.log("Question must have at least 2 options: ", questionOptions);
      return;
    }

    // Ghi đè orderInQuestion của những option được gửi đi
    if (questionOptions) {
      questionOptions.forEach((option, index) => {
        option.orderInQuestion = index;
      });
    }

    // kiểm tra và xóa đi những field không thay đổi
    Object.keys(selectedQuestion).forEach((field) => {
      if (
        selectedQuestion[field as keyof Question] ===
        editedQuestion[field as keyof Question]
      ) {
        delete editedQuestion[field as keyof Question];
      }
    });
    // nếu sau khi xóa còn field thì gọi API update question
    if (Object.keys(editedQuestion).length > 0) {
      console.log("Changes detected, editedQuestion: ", editedQuestion);
      updateQuestion({
        sectionId: sectionId(),
        projectId: Number(projectId),
        questionInSectionId: selectedQuestion.id,
        ...editedQuestion,
      });
      console.log(
        "Body: ",
        JSON.stringify({
          sectionId: sectionId(),
          projectId: Number(projectId),
          questionInSectionId: selectedQuestion.id,
          ...editedQuestion,
        })
      );
    } else {
      console.log("No changes detected");
    }

    setSelectedQuestion({} as Question);
    setIsChanged(false);
  };

  return (
    <Flex className={classes.mainWrapper}>
      {/* Survey title */}
      <Flex className={classes.surveyTitle}>
        <Tooltip
          maw={300}
          multiline
          position="bottom"
          label={survey.name}
          withArrow
        >
          <Title order={4} lineClamp={1} children={survey.name} />
        </Tooltip>
      </Flex>
      {/* Scroll area appears when a question is selected */}
      {Object.keys(selectedQuestion).length ? (
        <ScrollArea className={classes.scrollAreaWrapper}>
          {/* Content */}
          <Flex direction="column" className={classes.sectionWrapper}>
            <TitleInformation order={5} content="Content" />
            <Input
              defaultValue={content}
              value={editedQuestion.content}
              onChange={(event) => {
                setEditedQuestion({
                  ...editedQuestion,
                  content: event.currentTarget.value,
                });
                setIsChanged(true);
              }}
            />
          </Flex>
          {/* questionType */}
          <Flex className={classes.sectionWrapper}>
            <QuestionTypePicker
              defaultValue={questionType}
              value={editedQuestion?.questionType || ""}
              setValue={(value: string) => {
                setEditedQuestion({
                  ...editedQuestion,
                  questionType: value,
                });
                setIsChanged(true);
              }}
            />
          </Flex>
          {/* isRequired */}
          <Flex
            align="center"
            justify="space-between"
            className={classes.sectionWrapper}
          >
            <TitleInformation
              order={5}
              content="Response required"
              extrainfo="Survey respondents have to answer this question"
            />

            <Switch
              defaultChecked={isRequired}
              checked={editedQuestion?.isRequired}
              onChange={(event) => {
                setEditedQuestion({
                  ...editedQuestion,
                  isRequired: event.target.checked,
                });
                setIsChanged(true);
              }}
              color="blue"
              size="md"
              thumbIcon={
                editedQuestion?.isRequired ? (
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
          {/* orderInSection */}
          <Flex
            align="center"
            justify="space-between"
            className={classes.sectionWrapper}
          >
            <TitleInformation
              order={5}
              content="Position in section"
              extrainfo="Position of the question in the current section."
            />
            <NumberInputCustom
              defaultValue={orderInSection}
              value={editedQuestion?.orderInSection || 0}
              onChange={(value) => {
                setEditedQuestion({
                  ...editedQuestion,
                  orderInSection: value,
                });
                setIsChanged(true);
              }}
              min={0}
              max={maxOrderInSection()}
              step={1}
            />
          </Flex>
          {/* Weight */}
          <Flex
            align="center"
            justify="space-between"
            className={classes.sectionWrapper}
          >
            <Flex direction="column">
              <TitleInformation
                order={5}
                content="Criteria level"
                extrainfo="Level of importance of the question in the survey. 0 being the least important and 1 being the most important."
              />
              <Text c="dimmed" size={12}>
                Please enter value in range 0-1
              </Text>
            </Flex>
            <NumberInputCustom
              defaultValue={weight}
              value={editedQuestion?.weight || 0}
              onChange={(value) => {
                setEditedQuestion({
                  ...editedQuestion,
                  weight: value,
                });
                setIsChanged(true);
              }}
              min={0}
              max={1}
              step={0.1}
              precision={2}
            />
          </Flex>
          {/* questionOptions */}
          {editedQuestion.questionType === "multiple_choice" && (
            <Flex className={classes.sectionWrapper}>
              <QuestionOptions
                value={questionOptions}
                setValue={(value: Option[]) => {
                  setEditedQuestion({
                    ...editedQuestion,
                    questionOptions: value,
                  });
                }}
              />
            </Flex>
          )}
        </ScrollArea>
      ) : (
        // If no question is selected
        <Flex className={classes.unselectedQuestion}>
          <Text
            className={classes.unselectedText}
            children="Select a question to start configuration"
          />
        </Flex>
      )}

      <Button
        display={Object.keys(selectedQuestion).length ? "block" : "none"}
        disabled={!isChanged}
        color="blue"
        radius="md"
        variant="light"
        children="Apply"
        w="90%"
        m={10}
        onClick={handleApplyChanges}
      />
    </Flex>
  );
};

export default QuestionConfig;
