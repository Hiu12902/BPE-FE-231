import { Question } from "@/interfaces/index";
import { Flex, Radio } from "@mantine/core";
import { useCSATQuestionStyle } from "./CSATQuestion.style";

interface CSATQuestionProps {
  data: Question;
}

const CSATQuestion = (props: CSATQuestionProps) => {
  const { classes } = useCSATQuestionStyle();
  const { data } = props;
  const {
    content,
    id,
    isDeleted,
    isRequired,
    orderInSection,
    questionType,
    weight,
  } = data;
  const questionOptions = [
    { content: "1" },
    { content: "2" },
    { content: "3" },
    { content: "4" },
    { content: "5" },
    { content: "6" },
    { content: "7" },
  ];

  return (
    <Radio.Group
      description="On scale of 1 - 7, 1 means not satisfied at all, 7 means very satisfied."
      label={content}
      withAsterisk={isRequired}
      className={classes.option}
    >
      <Flex className={classes.option} justify="space-around">
        {questionOptions.map((option, index) => (
          <Radio
            key={index}
            value={option.content}
            label={option.content}
            className={classes.radio}
          />
        ))}
      </Flex>
    </Radio.Group>
  );
};

export default CSATQuestion;
