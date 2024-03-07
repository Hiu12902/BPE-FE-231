import { Flex, Radio } from "@mantine/core";
import { useNPSQuestionStyle } from "./NPSQuestion.style";
import { Question } from "@/interfaces/index";

interface NPSQuestionProps {
  data: Question;
}

const NPSQuestion = (props: NPSQuestionProps) => {
  const { classes } = useNPSQuestionStyle();
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
    { content: "8" },
    { content: "9" },
    { content: "10" },
  ];
  return (
    <Radio.Group
      description="On scale of 1 - 10, 1 means not at all likely, 10 means extremely likely."
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

export default NPSQuestion;
