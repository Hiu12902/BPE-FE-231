import { QuestionNoConversion } from "@/constants/survey";
import { Question } from "@/interfaces/index";
import { Badge, Box, Flex } from "@mantine/core";
import {
  CESINQuestion,
  CESQuestion,
  CSATINQuestion,
  CSATQuestion,
  MultipleChoiceQuestion,
  NPSQuestion,
  BranchingQuestion,
} from "../../../SurveyBuilder/components/index";
import { useQuestionItemStyle } from "./QuestionItem.style";

interface QuestionItemProps {
  data: Question;
  index: number;
}

const QuestionItem = (props: QuestionItemProps) => {
  const { data, index } = props;
  const { classes } = useQuestionItemStyle();
  const questionType = data.questionType || "";
  return (
    <Flex className={classes.body}>
      <Badge className={classes.badge}>{index}</Badge>
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
    </Flex>
  );
};

export default QuestionItem;
