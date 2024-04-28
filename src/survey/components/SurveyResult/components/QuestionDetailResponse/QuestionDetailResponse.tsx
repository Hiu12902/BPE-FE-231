import { QuestionNameConversion } from "@/constants/survey";
import { QuestionDetailResult } from "@/interfaces/index";
import { Flex, Text, Title } from "@mantine/core";
import { ReactComponent as IconEmpty } from "@tabler/icons/icons/mood-empty.svg";
import BarChart from "../BarChart";
import DoughnutChart from "../DoughnutChart";
import { useQuestionResponseStyle } from "./QuestionDetailResponse.style";

interface QuestionResponseProps {
  question: QuestionDetailResult;
}

const QuestionResponse = (props: QuestionResponseProps) => {
  const { question } = props;
  const { totalResponses, content, questionType, questionResponses } = question;
  const { classes } = useQuestionResponseStyle();
  const pieChartQuestion = ["branching"];
  const barChartQuestion = ["multiple_choice", "ces", "csat", "nps"];
  return (
    <Flex className={classes.wrapper}>
      <Flex w="100%" justify="space-between" gap={20}>
        <Title order={5}>{content}</Title>
        <Flex w="40%" direction="column" align="flex-end">
          <Text>{QuestionNameConversion[questionType]}</Text>
          <Text c="dimmed">
            <strong style={{ color: "#3084d7" }}>
              {totalResponses} {`response${totalResponses > 0 ? "s" : ""}`}{" "}
            </strong>{" "}
            for this question
          </Text>
        </Flex>
      </Flex>
      <Flex w="100%" justify="center">
        {pieChartQuestion.includes(questionType) ? (
          <DoughnutChart
            answers={questionResponses}
            totalResponses={totalResponses}
          />
        ) : barChartQuestion.includes(questionType) ? (
          <BarChart
            answers={questionResponses}
            questionType={questionType}
            totalResponses={totalResponses}
          />
        ) : (
          <Flex direction="column" w="100%" gap={10}>
            {questionResponses.length === 0 ? (
              <Flex direction="column" justify="center" align="center" pb={20}>
                <IconEmpty
                  color="#868e96"
                  width={50}
                  height={50}
                  stroke-width="1"
                />
                <Text c="dimmed">No responses yet</Text>
              </Flex>
            ) : (
              questionResponses.map((response) => {
                return (
                  <Flex className={classes.textResponses}>
                    {response.value}
                  </Flex>
                );
              })
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default QuestionResponse;
