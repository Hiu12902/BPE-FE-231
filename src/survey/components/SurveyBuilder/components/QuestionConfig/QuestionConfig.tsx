import {
  IsChangedQuestionContextProps,
  Question,
  SelectedQuestionContextProps,
} from "@/interfaces/index";
import { Survey } from "@/interfaces/survey";
import {
  IsChangedQuestionContext,
  SelectedQuestionContext,
} from "@/survey/context";
import { Button, Flex, Switch, Text, Title, Tooltip } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import NumberInputCustom from "../NumberInputCustom";
import QuestionTypePicker from "../QuestionTypePicker";
import TitleInformation from "../TitleInformation";
import { useQuestionConfigStyle } from "./QuestionConfig.style";

interface QuestionConfigProps {
  data: Survey;
}

const QuestionConfig = (props: QuestionConfigProps) => {
  const { classes } = useQuestionConfigStyle();
  const [sectionPosition, setSectionPosition] = useState<number>(0);
  const [criteriaLevel, setCriteriaLevel] = useState<number>(0);
  const { data } = props;
  const { survey, questions } = data;

  const { isChanged, setIsChanged } = useContext(
    IsChangedQuestionContext
  ) as IsChangedQuestionContextProps;
  const { selectedQuestion, setSelectedQuestion } = useContext(
    SelectedQuestionContext
  ) as SelectedQuestionContextProps;

  const {
    content,
    id: questionId,
    isDeleted: isQuestionDeleted,
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

  const [editedQuestion, setEditedQuestion] = useState<Question | undefined>(
    selectedQuestion
  );

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
      <Flex
        direction="column"
        justify="flex-start"
        align="center"
        gap={40}
        w="100%"
        mt={10}
      >
        <Flex
          align="center"
          justify="space-between"
          className={classes.sectionWrapper}
        >
          <Tooltip maw={300} multiline position="bottom" label={name} withArrow>
            <Title order={4} lineClamp={1} children={name} />
          </Tooltip>
        </Flex>

        {editedQuestion?.questionType && (
          <QuestionTypePicker
            value={editedQuestion?.questionType}
            setValue={(value: string) => {
              // Thay đổi value trên editedQuestion
              setEditedQuestion({
                ...editedQuestion,
                questionType: value,
              });
              // Thể hiện là question đã bị thay đổi
              setIsChanged(true);
            }}
          />
        )}

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

          <Switch />
        </Flex>

        {/* Position in section */}
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
            value={sectionPosition}
            onChange={(value) => setSectionPosition(value)}
            min={0}
            max={10}
            step={1}
          />
        </Flex>

        {/* Criteria level */}
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
            value={criteriaLevel}
            onChange={(value) => setCriteriaLevel(value)}
            min={0}
            max={1}
            step={0.1}
            precision={2}
          />
        </Flex>
      </Flex>
      {/* Apply button */}
      <Button
        color="blue"
        radius="md"
        variant="light"
        children="Apply"
        fullWidth
        onClick={() => {
          setIsChanged(false);
          console.log("Apply changes");
        }}
      />
    </Flex>
  );
};

export default QuestionConfig;
