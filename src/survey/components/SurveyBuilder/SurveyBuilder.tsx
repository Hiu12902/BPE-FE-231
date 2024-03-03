import { Flex } from "@mantine/core";
import { useSurveyBuilderStyle } from "./SurveyBuilder.style";
import { QuestionConfig, QuestionEditor } from "./components";

const SurveyBuilder = () => {
  const { classes } = useSurveyBuilderStyle();
  return (
    <Flex className={classes.wrapper}>
      <QuestionConfig />
      <QuestionEditor />
    </Flex>
  );
};

export default SurveyBuilder;
