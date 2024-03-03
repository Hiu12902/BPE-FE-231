import { Button, Flex, Switch, Text, Title, Tooltip } from "@mantine/core";
import { useState } from "react";
import NumberInputCustom from "../NumberInputCustom";
import TitleInformation from "../TitleInformation";
import { useQuestionConfigStyle } from "./QuestionConfig.style";
import QuestionTypePicker from "../QuestionTypePicker";

const QuestionConfig = () => {
  const { classes } = useQuestionConfigStyle();
  const [sectionPosition, setSectionPosition] = useState<number>(0);
  const [criteriaLevel, setCriteriaLevel] = useState<number>(0);
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      className={classes.mainWrapper}
    >
      <Flex
        direction="column"
        align="center"
        justify="flex-start"
        gap={40}
        w="100%"
      >
        {/* Title */}
        <Flex
          align="center"
          justify="space-between"
          className={classes.sectionWrapper}
        >
          <Tooltip
            maw={300}
            multiline
            position="bottom"
            label={"Survey for Project Khởi tạo survey"}
            withArrow
          >
            <Title order={4} lineClamp={1}>
              Survey for Project Khởi tạo survey
            </Title>
          </Tooltip>
        </Flex>

        {/* Question type picker */}
        <QuestionTypePicker />

        {/* Required question */}
        <Flex
          align="center"
          justify="space-between"
          className={classes.sectionWrapper}
        >
          <TitleInformation
            order={5}
            content="Response required"
            extrainfo="Survey respondents have to answer this question"
          />

          <Switch />
        </Flex>

        {/* Position in section */}
        <Flex
          align="center"
          justify="space-between"
          className={classes.sectionWrapper}
        >
          <TitleInformation
            order={5}
            content="Position in section"
            extrainfo="Position of the question in the current section."
          />
          <NumberInputCustom
            value={sectionPosition}
            onChange={(value) => setSectionPosition(value)}
            min={0}
            max={10}
            step={1}
          />
        </Flex>

        {/* Criteria level */}
        <Flex
          align="center"
          justify="space-between"
          className={classes.sectionWrapper}
        >
          <Flex direction="column">
            <TitleInformation
              order={5}
              content="Criteria level"
              extrainfo="Level of importance of the question in the survey. 0 being the least important and 1 being the most important."
            />
            <Text c="dimmed" size={12}>
              Please enter value in range 0-1
            </Text>
          </Flex>
          <NumberInputCustom
            value={criteriaLevel}
            onChange={(value) => setCriteriaLevel(value)}
            min={0}
            max={1}
            step={0.1}
            precision={2}
          />
        </Flex>
      </Flex>
      {/* Apply button */}
      <Button
        color="blue"
        variant="filled"
        radius="md"
        fullWidth
        children="Apply"
      />
    </Flex>
  );
};

export default QuestionConfig;
