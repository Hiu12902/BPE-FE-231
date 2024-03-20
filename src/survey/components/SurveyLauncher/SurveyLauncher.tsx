import { SURVEY_NAVBAR_HEIGHT } from "@/constants/theme/themeConstants";
import useNotification from "@/hooks/useNotification";
import { useSectionQuery } from "@/hooks/useSection";
import { useSurveySubmissionMutation } from "@/hooks/useSurvey";
import { getBranch, getResponse } from "@/redux/selectors";
import { responseActions } from "@/redux/slices";
import { Button, Flex, Group, Loader, Stepper } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ConfirmModal } from "../Modal";
import { LauncherConclusion, LauncherIntroduction } from "./components";
import QuestionSection from "./components/QuestionSection";

interface SectionMapStep {
  [step: number]: number;
}

const SurveyLauncher = ({ preview }: { preview?: boolean }) => {
  const [SecMapStep, setSecMapStep] = useState<SectionMapStep>({});
  const [step, setStep] = useState<number>(0);
  const dispatch = useDispatch();
  const notify = useNotification();
  const branch = useSelector(getBranch);
  const response = useSelector(getResponse);
  const [openConfirmBack, setOpenConfirmBack] = useState<boolean>(false);

  const handleChangeStep = (stepIndex: number) => {
    if (step > stepIndex) {
      prevStep();
    } else if (step < stepIndex) {
      nextStep();
    } else {
      return;
    }
  };

  const nextStep = () => {
    var isRequired: boolean = false;

    if (Object.keys(response).length > 0) {
      console.log(response);
      Object.keys(response).forEach((sectionId) => {
        const section = response[Number(sectionId)];

        if (!isRequired && section) {
          Object.keys(section).forEach((questionId) => {
            const question = section[Number(questionId)];

            if (!isRequired && question.isRequired && !question.value) {
              notify({
                message: "Please answer all required questions",
                type: "error",
              });
              // navigate to question
              window.scrollTo({
                top:
                  (document.getElementById(
                    `question-${sectionId}-${questionId}`
                  )?.offsetTop as number) -
                  SURVEY_NAVBAR_HEIGHT -
                  20,
                behavior: "smooth",
              });
              // highlight color of question
              const questionElement = document.getElementById(
                `question-${sectionId}-${questionId}`
              );
              if (questionElement) {
                questionElement.style.backgroundColor = "#ffeeee";
              }
              isRequired = true;
            } else {
              // remove highlight color of question
              const questionElement = document.getElementById(
                `question-${sectionId}-${questionId}`
              );
              if (questionElement) {
                questionElement.style.backgroundColor = "";
              }
            }
          });
        }
      });
    }

    if (!isRequired) {
      setStep((curr) => (curr < 4 ? curr + 1 : curr));
    }
  };
  const prevStep = () => {
    setOpenConfirmBack(true);
  };
  const [processVersion, setProcessVersion] = useState<string>("");
  const version = useParams().processVersion;

  const { data, isFetching } = useSectionQuery({
    processVersion: processVersion,
  });

  const section = data?.sections;
  const survey = data?.survey;

  useEffect(() => {
    if (version) {
      setProcessVersion(version);
    }
  }, [version]);

  useEffect(() => {
    if (section && !isFetching) {
      setSecMapStep({
        1: section[0].id,
        3: section[3].id,
      });
      if (branch !== undefined) {
        setSecMapStep({
          ...SecMapStep,
          2: section[!branch ? 1 : 2].id,
        });
      }
    }
  }, [section, branch]);

  const surveySubmitMutation = useSurveySubmissionMutation({
    onSuccess: (data) => {
      notify({
        message: "Survey submitted successfully",
        type: "success",
      });
      // setLastestResponse(data.responseId);
    },
    onError: (error) => {
      notify({
        message: "Failed to submit survey",
        type: "error",
      });
    },
  });

  const handleSubmit = (email: string, name: string) => {
    const answers: any[] = [];
    if (response) {
      Object.keys(response).forEach((sectionId) => {
        const section = response[Number(sectionId)];
        if (section) {
          Object.keys(section).forEach((questionId) => {
            const question = section[Number(questionId)];
            if (question) {
              answers.push({
                questionInSectionId: Number(questionId),
                value: question.value,
              });
            }
          });
        }
      });
    }
    if (email.length <= 0) {
      notify({
        message: "Please enter email before submitting your response!",
        type: "warning",
      });
      return;
    }
    if (name.length <= 0) {
      notify({
        message: "Please enter your nickname before submitting your response!",
        type: "warning",
      });
      return;
    }
    surveySubmitMutation.mutate({
      processVersionVersion: processVersion,
      email: email,
      fullName: name,
      answers: answers,
    });
  };

  return !section || !survey ? (
    <Flex w="100%" justify="center" mt={250} align="center">
      <Loader />
    </Flex>
  ) : (
    <Flex
      direction="column"
      justify="space-between"
      align="center"
      style={{
        width: "100%",
      }}
    >
      <ConfirmModal
        opened={openConfirmBack}
        onClose={() => setOpenConfirmBack(false)}
        title="Discard changes and go back"
        onConfirm={() => {
          dispatch(responseActions.deleteSectionResponse(SecMapStep[step]));
          setStep((curr) => (curr > 0 ? curr - 1 : curr));
        }}
        message="Are you sure you want to discard your changes? This action will reset your current progress in this section."
      />
      <Stepper
        active={step}
        onStepClick={(stepIndex: number) => handleChangeStep(stepIndex)}
        breakpoint="sm"
        styles={{
          root: {
            width: "100%",
            marginTop: "30px",
          },
          content: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            fontSize: 25,
            fontFamily: "Greycliff CF, sans-serif",
          },
        }}
      >
        <Stepper.Step label="First step" description="Introduction" />
        <Stepper.Step label="Second step" description="About your role" />
        <Stepper.Step label="Third step" description="About your experience" />
        <Stepper.Step label="Fourth step" description="About your promotion" />
        <Stepper.Completed> </Stepper.Completed>
      </Stepper>

      <Flex
        style={{
          boxShadow: `rgba(3, 102, 214, 0.3) 0px 0px 0px 2px`,
          borderRadius: "5px",
          margin: "20px",
          width: "100%",
        }}
      >
        {step === 0 ? (
          <LauncherIntroduction
            name={survey.name}
            description={survey.description}
          />
        ) : step === 1 ? (
          <QuestionSection sectionId={section[0].id} />
        ) : step === 2 ? (
          <QuestionSection sectionId={section[!branch ? 1 : 2].id} />
        ) : step === 3 ? (
          <QuestionSection sectionId={section[3].id} />
        ) : step === 4 ? (
          <LauncherConclusion
            preview={preview}
            onSubmit={(email: string, name: string) => {
              handleSubmit(email, name);
            }}
          />
        ) : (
          <></>
        )}
      </Flex>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={step === 4}>
          Next
        </Button>
      </Group>
    </Flex>
  );
};

export default SurveyLauncher;
