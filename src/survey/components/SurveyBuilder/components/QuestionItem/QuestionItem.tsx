import {
  QuestionNameConversion,
  QuestionNoConversion,
} from "@/constants/survey";
import {
  IsChangedQuestionContextProps,
  Question,
  SelectedQuestionContextProps,
} from "@/interfaces/index";
import { ActionIcon, ActionIconProps, Badge, Box, Flex } from "@mantine/core";
import { ReactComponent as IconDelete } from "@tabler/icons/icons/trash.svg";
import { useContext } from "react";
import { useQuestionItemStyle } from "./QuestionItem.style";
import {
  CESINQuestion,
  CESQuestion,
  CSATINQuestion,
  CSATQuestion,
  MultipleChoiceQuestion,
  NPSQuestion,
} from "./components";
import BranchingQuestion from "./components/BranchingQuestion";
import {
  IsChangedQuestionContext,
  SelectedQuestionContext,
} from "@/survey/context";

const AddButton = (props: ActionIconProps) => {
  const { classes } = useQuestionItemStyle();

  return (
    <ActionIcon
      size="md"
      radius="xl"
      color="blue"
      children="+"
      variant="filled"
      {...props}
      className={classes.addButton}
    />
  );
};

interface QuestionItemProps {
  data: Question;
}

const QuestionItem = (props: QuestionItemProps) => {
  const { classes } = useQuestionItemStyle();
  const { data } = props;
  const questionType = data.questionType || "";
  const { selectedQuestion, setSelectedQuestion } = useContext(
    SelectedQuestionContext
  ) as SelectedQuestionContextProps; // Typecasting để tránh ts báo lỗi null
  const { isChanged, setIsChanged } = useContext(
    IsChangedQuestionContext
  ) as IsChangedQuestionContextProps;

  return (
    <Flex direction="column" className={classes.wrapper}>
      <Flex
        direction="column"
        className={
          selectedQuestion.id === data.id ? classes.active : classes.body
        }
        onClick={() => {
          if (isChanged) {
            console.log("Do you want to discard changes?");
          } else {
            setSelectedQuestion(data);
          }
        }}
      >
        <Flex w="100%" justify="space-between" align="center">
          <AddButton top={-25} left={-25} />
          <Flex className={classes.questionControl} align="center">
            <Badge
              color="blue"
              variant="filled"
              children={questionType && QuestionNameConversion[questionType]}
            />
            <ActionIcon
              variant="outline"
              color="red"
              size="sm"
              children={<IconDelete />}
            />
          </Flex>
        </Flex>
        <Box className={classes.content}>
          {questionType &&
            {
              0: <BranchingQuestion data={data} />,
              1: <CESQuestion data={data} />,
              2: <CESINQuestion data={data} />,
              3: <CSATQuestion data={data} />,
              4: <CSATINQuestion data={data} />,
              5: <NPSQuestion data={data} />,
              6: <MultipleChoiceQuestion data={data} />,
            }[QuestionNoConversion[questionType]]}
        </Box>
        <AddButton bottom={-25} left={-25} />
      </Flex>
    </Flex>
  );
};

export default QuestionItem;
