import { useSurveyResultQuery } from "@/hooks/useSurvey";
import { ISurveyResult } from "@/interfaces/survey";
import { Flex, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProgressBar, Table } from "./components";

const SurveyResult = () => {
  const processVersion = useParams().processVersion;
  const [version, setVersion] = useState<string>("");
  const [result, setResult] = useState<ISurveyResult>({} as ISurveyResult);
  const { data } = useSurveyResultQuery({
    processVersion: version,
  });

  useEffect(() => {
    if (data) {
      const totalWeight = data.ces.weight + data.csat.weight + data.nps.weight;
      setResult({
        ...data,
        ces: {
          ...data.ces,
          score: Number(data.ces.score.toFixed(2)),
          weight: Number(((data.ces.weight / totalWeight) * 100).toFixed(2)),
        },
        csat: {
          ...data.csat,
          score: Number(data.csat.score.toFixed(2)),
          weight: Number(((data.csat.weight / totalWeight) * 100).toFixed(2)),
        },
        nps: {
          ...data.nps,
          score: Number(data.nps.score.toFixed(2)),
          weight: Number(((data.nps.weight / totalWeight) * 100).toFixed(2)),
        },
      });
    }
  }, [data]);

  useEffect(() => {
    if (processVersion) {
      setVersion(processVersion);
    }
  }, [processVersion]);

  return !result.ces || !result.csat || !result.nps ? (
    <LoadingOverlay visible overlayColor="rgba(255, 255, 255, 0.5)" />
  ) : (
    <Flex
      style={{
        width: "100%",
        height: "90vh",
        padding: "50px",
      }}
      direction="column"
      gap="50px"
    >
      <ProgressBar result={result} />
      <Table result={result} />
    </Flex>
  );
};

export default SurveyResult;
