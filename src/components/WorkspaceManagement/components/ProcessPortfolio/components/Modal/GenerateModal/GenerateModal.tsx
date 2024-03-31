import { usePortfolioProjectQuery } from "@/hooks/index";
import {
    Accordion,
    ActionIcon,
    Badge,
    Button,
    Divider,
    Flex,
    LoadingOverlay,
    Modal,
    ModalProps,
    Stepper
} from "@mantine/core";
import { ReactComponent as IconInfo } from "@tabler/icons/icons/info-circle-filled.svg";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ProjectList from "../../ProjectList";

interface GenerateModalProps extends ModalProps {
  onGenerate: () => void;
}

const GenerateModal = (props: GenerateModalProps) => {
  const { opened, onClose, onGenerate } = props;
  const { workspaceId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const nextStep = () =>
    setActiveStep((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const handleClose = () => {
    onClose();
  };

  const handleGenerate = () => {
    onGenerate?.();
  };

  const { data: projects } = usePortfolioProjectQuery({
    workspaceId: workspaceId,
  });

  return (
    <Modal
      centered
      overlayProps={{
        blur: 3,
        opacity: 0.65,
      }}
      onClose={handleClose}
      opened={opened}
      title={
        <Flex align="center" gap={6}>
          <Badge
            fz={15}
            variant="light"
            children={"Configure process version"}
          />
          <ActionIcon
            variant="subtle"
            radius="xl"
            color="blue"
            children={
              <IconInfo
                style={{
                  width: "15px",
                  height: "15px",
                }}
              />
            }
          />
        </Flex>
      }
      size="90%"
    >
      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        breakpoint="sm"
        allowNextStepsSelect={false}
        size="sm"
      >
        <Stepper.Step label="Select models" description="Select 2 exact models">
          {/* <Alert style={{ borderLeft: `5px solid ${PRIMARY_COLOR[0]}` }}>
            Hint: only models opened in editor are shown here
          </Alert> */}
          <Divider my="sm" />
          {projects ? (
            <Accordion
              variant="contained"
              chevron
              //   className={classes.accordion}
              transitionDuration={0}
            >
              <ProjectList data={projects.data} />
            </Accordion>
          ) : (
            <Flex>
              <LoadingOverlay visible />
            </Flex>
          )}
        </Stepper.Step>
        <Stepper.Step
          label="Input performance level"
          description="Input your desired values"
        >
          <Flex></Flex>
        </Stepper.Step>
      </Stepper>

      <Flex justify="flex-end" mt="xl">
        <Flex w="50%" justify="flex-end" gap={20}>
          <Button
            variant="light"
            color="blue"
            onClick={prevStep}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            variant="light"
            color="blue"
            onClick={nextStep}
            disabled={activeStep === 1}
          >
            Next
          </Button>
        </Flex>
        <Flex w="45%" justify="flex-end" gap={20}>
          <Button variant="light" onClick={handleGenerate}>
            Generate
          </Button>
          <Button variant="light" onClick={handleClose}>
            Cancel
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default GenerateModal;
