import { Flex, Radio } from "@mantine/core";
import { useBranchingQuestionStyle } from "./BranchingQuestion.style";
import { Question } from "@/interfaces/index";

interface BranchingQuestionProps {
  data: Question;
}

const BranchingQuestion = (props: BranchingQuestionProps) => {
  const { classes } = useBranchingQuestionStyle();
  const { data } = props;
  const {
    content,
    id,
    isDeleted,
    isRequired,
    orderInSection,
    questionOptions,
    questionType,
    weight,
  } = data;

  return (
    <Radio.Group
      description="Select the option that best describes your experience."
      label={content}
      withAsterisk={isRequired}
      className={classes.option}
    >
      <Flex className={classes.option} justify="space-around">
        {questionOptions.map((option, index) => (
          <Radio
            key={index}
            value={option.id}
            label={option.content}
            className={classes.radio}
            disabled
          />
        ))}
      </Flex>
    </Radio.Group>
  );
};

export default BranchingQuestion;
