import { Flex, Input, Radio } from "@mantine/core";
import { useCSATINQuestionStyle } from "./CSATINQuestion.style";
import { Question } from "@/interfaces/index";

interface CSATINQuestionProps {
  data: Question;
}

const CSATINQuestion = (props: CSATINQuestionProps) => {
  const { classes } = useCSATINQuestionStyle();
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

  return (
    <Radio.Group
      label={content}
      withAsterisk={isRequired}
      className={classes.option}
    >
      <Flex className={classes.option} justify="space-around">
        <Input w="100%" disabled className={classes.input} />
      </Flex>
    </Radio.Group>
  );
};

export default CSATINQuestion;
