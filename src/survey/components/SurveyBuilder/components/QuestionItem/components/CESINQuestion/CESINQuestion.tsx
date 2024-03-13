import { Flex, Input, Radio } from "@mantine/core";
import { useCESINQuestionStyle } from "./CESINQuestion.style";
import { Question } from "@/interfaces/index";

interface CESINQuestionProps {
  data: Question;
}

const CESINQuestion = (props: CESINQuestionProps) => {
  const { classes } = useCESINQuestionStyle();
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

export default CESINQuestion;
