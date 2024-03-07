import { Question } from "@/interfaces/index";
import { Grid, Input, Radio } from "@mantine/core";
import { useMultipleChoiceQuestionStyle } from "./MultipleChoiceQuestion.style";

interface MultipleChoiceQuestionProps {
  data: Question;
}

const MultipleChoiceQuestion = (props: MultipleChoiceQuestionProps) => {
  const { classes } = useMultipleChoiceQuestionStyle();
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
      label={content}
      withAsterisk={isRequired}
      className={classes.option}
    >
      <Grid className={classes.option}>
        {questionOptions.map((option) => (
          <Grid.Col span={6}>
            <Radio
              key={option.orderInQuestion}
              value={option.content}
              label={option.content}
              className={classes.radio}
              disabled
            />
          </Grid.Col>
        ))}
        {/* <Grid.Col span={6}>
          <Flex gap={10} align="center" h="100%">
            <ActionIcon variant="light" size="sm" radius="xl">
              <IconAdd />
            </ActionIcon>
            <Text c="dimmed" size="sm">
              Add new option
            </Text>
          </Flex>
        </Grid.Col> */}
      </Grid>
    </Radio.Group>
  );
};

export default MultipleChoiceQuestion;
