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

interface QuestionConfigProps {
  data: Survey;
}

const QuestionConfig = (props: QuestionConfigProps) => {
  const { classes } = useQuestionConfigStyle();
  const { data } = props;
  const { survey, questions } = data;

  const { isChanged, setIsChanged } = useContext(
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

  const {
    content,
    id: questionId,
    // isDeleted: isQuestionDeleted,
    isRequired,
    orderInSection,
    questionOptions,
    questionType,
    weight,
  } = selectedQuestion;

  const {
    createdAt,
    description,
    endDate,
    id: surveyId,
    isDeleted: isSurveyDeleted,
    isPublished,
    name,
    startDate,
  } = survey;

  const [editedQuestion, setEditedQuestion] =
    useState<Question>(selectedQuestion);

  useEffect(() => {
    if (!isChanged && selectedQuestion) {
      setEditedQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  return (
    <Flex
      align="center"
      direction="column"
      justify="space-between"
      className={classes.mainWrapper}
    >
      <ScrollArea className={classes.scrollAreaWrapper}>
        <Flex
          direction="column"
          gap={20}
          w="100%"
          h="100%"
          justify="center"
          align="center"
        >
          <Flex
            align="center"
            justify="space-between"
            className={classes.sectionWrapper}
          >
            <Tooltip
              maw={300}
              multiline
              position="bottom"
              label={name}
              withArrow
            >
              <Title order={4} lineClamp={1} children={name} />
            </Tooltip>
          </Flex>

          {Object.keys(selectedQuestion).length ? (
            <>
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

              {questionType === "multiple_choice" && (
                <QuestionOptions
                  data={questionOptions}
                  value={editedQuestion?.questionOptions || []}
                  setValue={(value: Option[]) => {
                    setEditedQuestion({
                      ...editedQuestion,
                      questionOptions: value,
                    });
                    console.log("editedQuestion: ", editedQuestion);
                    setIsChanged(true);
                  }}
                />
              )}
            </>
          ) : (
            <Flex
              align="center"
              justify="center"
              direction="column"
              w="100%"
              h="100%"
            >
              <Text
                size="md"
                style={{
                  fontStyle: "italic",
                  opacity: 0.5,
                }}
                children="Select a question to start configuration"
              />
            </Flex>
          )}
        </Flex>
      </ScrollArea>

      <Button
        display={Object.keys(selectedQuestion).length ? "block" : "none"}
        disabled={!isChanged}
        color="blue"
        radius="md"
        variant="light"
        children="Apply"
        w="90%"
        m={10}
        onClick={() => {
          setIsChanged(false);
          console.log("Apply changes");
        }}
      />
    </Flex>
  );
};

export default QuestionConfig;
