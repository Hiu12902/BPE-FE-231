import { Section } from "@/interfaces/index";
import { Flex } from "@mantine/core";
import QuestionItem from "../QuestionItem";
import TitleInformation from "../TitleInformation";
import { useQuestionSectionStyle } from "./QuestionSection.style";

interface QuestionSectionProps {
  data: Section;
}

const QuestionSection = (props: QuestionSectionProps) => {
  const { data } = props;
  const { sectionName, sectionId, questions, orderInSurvey } = data;
  const { classes } = useQuestionSectionStyle();
  return (
    <Flex className={classes.wrapper}>
      <TitleInformation
        ml={10}
        mb={5}
        content={sectionName as string}
        order={4}
      />
      <Flex className={classes.body}>
        {questions.map((question) => (
          <QuestionItem data={question} />
        ))}
      </Flex>
    </Flex>
  );
};

export default QuestionSection;
