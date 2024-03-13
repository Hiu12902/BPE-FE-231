import { Button, Flex, Group, Stepper, Title } from "@mantine/core";
import { useState } from "react";
import data from "./data.json";
import { LauncherConclusion, LauncherIntroduction } from "./components";
import QuestionSection from "./components/QuestionSection";

const SurveyLauncher = () => {
  const { section_1, section_2, section_3, section_4 } = data;
  const [step, setStep] = useState<number>(0);
  const nextStep = () => setStep((curr) => (curr < 4 ? curr + 1 : curr));
  const prevStep = () => setStep((curr) => (curr > 0 ? curr - 1 : curr));

  return (
    <Flex
      direction="column"
      justify="space-between"
      align="center"
      style={{
        width: "100%",
      }}
    >
      <Stepper
        active={step}
        onStepClick={setStep}
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
          border: "1px solid #ccc",
          borderRadius: "5px",
          margin: "20px",
          width: "100%",
        }}
      >
        {step === 0 ? (
          <LauncherIntroduction />
        ) : step === 1 ? (
          <QuestionSection data={section_1} />
        ) : step === 2 ? (
          <QuestionSection data={section_2} />
        ) : step === 3 ? (
          <QuestionSection data={section_4} />
        ) : step === 4 ? (
          <LauncherConclusion />
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
