import { Flex } from "@mantine/core";
import { useQuestionEditorStyle } from "./QuestionEditor.style";

const QuestionEditor = () => {
  const { classes } = useQuestionEditorStyle();
  return <Flex className={classes.wrapper}>QuestionEditor</Flex>;
};

export default QuestionEditor;
