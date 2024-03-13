import { Section } from "@/interfaces/index";
import { Flex } from "@mantine/core";
import QuestionItem from "../QuestionItem";

interface QuestionSectionProps {
  data: Section;
}

const QuestionSection = (props: QuestionSectionProps) => {
  const { data } = props;
  return (
    <Flex
      direction="column"
      style={{
        width: "100%",
        padding: "20px",
        gap: "20px",
      }}
    >
      {data ? (
        data.questions.map((question, questionIndex) => {
          return <QuestionItem data={question} index={questionIndex + 1} />;
        })
      ) : (
        <Flex direction="column">
          <p>No data found!</p>
        </Flex>
      )}
    </Flex>
  );
};

export default QuestionSection;
