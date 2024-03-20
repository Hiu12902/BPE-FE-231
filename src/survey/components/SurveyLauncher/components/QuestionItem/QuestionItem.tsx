import { QuestionNoConversion } from "@/constants/survey";
import { Question } from "@/interfaces/index";
import { Badge, Box, Flex, Loader } from "@mantine/core";
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
  sectionId?: number;
}

const QuestionItem = (props: QuestionItemProps) => {
  const { data, index, sectionId } = props;
  const { classes } = useQuestionItemStyle();
  const questionType = data.questionType || "";

  return !data ? (
    <Flex justify="center">
      <Loader />
    </Flex>
  ) : (
    <Flex className={classes.body} id={`question-${sectionId}-${data.id}`}>
      <Badge className={classes.badge}>Question {index}</Badge>
      <Box className={classes.content}>
        {questionType &&
          {
            0: <BranchingQuestion data={data} sectionId={sectionId} />,
            1: <CESQuestion data={data} sectionId={sectionId} />,
            2: <CESINQuestion data={data} sectionId={sectionId} />,
            3: <CSATQuestion data={data} sectionId={sectionId} />,
            4: <CSATINQuestion data={data} sectionId={sectionId} />,
            5: <NPSQuestion data={data} sectionId={sectionId} />,
            6: <MultipleChoiceQuestion data={data} sectionId={sectionId} />,
          }[QuestionNoConversion[questionType]]}
      </Box>
    </Flex>
  );
};

export default QuestionItem;
