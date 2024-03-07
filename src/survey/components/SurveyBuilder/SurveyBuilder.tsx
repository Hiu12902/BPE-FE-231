import { useCreateSurveyMutation, useSurvey } from "@/hooks/useSurvey";
import { Question } from "@/interfaces/index";
import {
  IsChangedQuestionContext,
  SelectedQuestionContext,
} from "@/survey/context/QuestionContext";
import { Flex, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSurveyBuilderStyle } from "./SurveyBuilder.style";
import { QuestionConfig, QuestionEditor } from "./components";

const SurveyBuilder = () => {
  const { classes } = useSurveyBuilderStyle();
  const { processVersion, projectId } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(
    {} as Question
  );
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const createSurveyMutation = useCreateSurveyMutation({
    onSuccess: (data) => {
      console.log("Successfully create new survey: ", data);
    },
  });

  const { data: surveyData, isLoading: surveyLoading } = useSurvey({
    processVersion: processVersion,
    projectId: projectId,
  });

  useEffect(() => {
    if (
      processVersion &&
      projectId &&
      surveyData &&
      surveyData?.message === "Survey does not exist."
    ) {
      createSurveyMutation.mutate({
        processVersionVersion: processVersion,
        projectId: Number(projectId),
      });
    }
  }, []);

  return (
    <IsChangedQuestionContext.Provider
      value={{
        isChanged: isChanged,
        setIsChanged: setIsChanged,
      }}
    >
      <SelectedQuestionContext.Provider
        value={{
          selectedQuestion: selectedQuestion,
          setSelectedQuestion: setSelectedQuestion,
        }}
      >
        <Flex className={classes.wrapper}>
          {surveyLoading ? (
            <LoadingOverlay visible overlayColor="rgba(255, 255, 255, 1)" />
          ) : (
            surveyData && (
              <>
                <QuestionConfig data={surveyData} />
                <QuestionEditor data={surveyData} />
              </>
            )
          )}
        </Flex>
      </SelectedQuestionContext.Provider>
    </IsChangedQuestionContext.Provider>
  );
};

export default SurveyBuilder;
