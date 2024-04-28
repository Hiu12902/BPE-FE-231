import { useSurveyResultQuery } from "@/hooks/useSurvey";
import { QuestionDetailResult } from "@/interfaces/index";
import { Flex, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSurveyResultStyle } from "./SurveyResult.style";
import { TotalResult } from "./components";
import QuestionDetailResponse from "./components/QuestionDetailResponse";

const SurveyResult = () => {
  const processVersion = useParams().processVersion;
  const [version, setVersion] = useState<string>("");
  const { data: surveyResult, isLoading: surveyResultLoading } =
    useSurveyResultQuery({
      processVersion: version,
    });

  useEffect(() => {
    if (processVersion) {
      setVersion(processVersion);
    }
  }, [processVersion]);

  const { classes } = useSurveyResultStyle();
  return (
    <Flex className={classes.wrapper}>
      <LoadingOverlay visible={surveyResultLoading} />
      {surveyResult && (
        <>
          <TotalResult {...surveyResult} />
          {surveyResult?.questions?.map((question: QuestionDetailResult) => {
            return (
              <QuestionDetailResponse key={question.id} question={question} />
            );
          })}
        </>
      )}
    </Flex>
  );
};

export default SurveyResult;
