import { EvaluatedResultRecord } from "@/interfaces/evaluatedResult";
import * as selectors from "@/redux/selectors";
import { Box, Space, Stack, Title } from "@mantine/core";
import { useSelector } from "react-redux";
import MainResult from "./components/MainResult";
import CompareResultComponent from "./helper/CompareResult";
import ResultDetailSteps from "./helper/ResultDetailSteps";

export default function ResultTable({
  evaluatedResult,
}: {
  evaluatedResult: EvaluatedResultRecord[];
}) {
  const activeTab = useSelector(selectors.getActiveTab);

  return !activeTab?.isCompare ? (
    <>
      <Stack>
        <Title order={4}>{activeTab?.label}</Title>
        <MainResult rows={evaluatedResult} />
      </Stack>
      <Space h={50} />
      <Box>
        <Title order={4}>Evaluated Result Detail</Title>
        <Space h="sm" />
        <ResultDetailSteps />
      </Box>
    </>
  ) : (
    <CompareResultComponent />
  );
}
