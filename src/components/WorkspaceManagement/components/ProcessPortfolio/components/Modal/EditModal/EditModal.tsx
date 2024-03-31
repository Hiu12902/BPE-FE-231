import {
    ActionIcon,
    Badge,
    Button,
    Flex,
    Group,
    Modal,
    ModalProps,
    NumberInput,
    Title,
} from "@mantine/core";
import { ReactComponent as IconInfo } from "@tabler/icons/icons/info-circle-filled.svg";

import { useForm } from "@mantine/form";
import { keys } from "lodash";

interface EditModalProps extends ModalProps {
  onSave: () => void;
}

interface HealthInputProps {
  cycleTime: number | undefined;
  cost: number | undefined;
  quality: number | undefined;
  flexibility: number | undefined;
}

interface UserInputForm {
  heatlh: HealthInputProps;
  feasibility: number | undefined;
  strategicImportance: number | undefined;
}

const UserInputTitleMap: Record<keyof UserInputForm, string> = {
  heatlh: "Health",
  feasibility: "Feasibility",
  strategicImportance: "Strategic Importance",
};

const HealthLabelMap: Record<keyof HealthInputProps, string> = {
  cycleTime: "Cycle Time",
  cost: "Cost",
  quality: "Quality",
  flexibility: "Flexibility",
};

const EditModal = (props: EditModalProps) => {
  const { opened, onClose, onSave } = props;
  const userInputForm = useForm<UserInputForm>({
    initialValues: {
      heatlh: {
        cycleTime: undefined,
        cost: undefined,
        flexibility: undefined,
        quality: undefined,
      },
      feasibility: undefined,
      strategicImportance: undefined,
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    console.log(userInputForm);
    onSave?.();
  };

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
      size="xl"
    >
      <Flex justify="center" w="100%" gap={20} direction="column">
        {/* Health input */}
        <Flex direction="column" justify="center" align="start" w="100%">
          <Title order={4}>Health</Title>
          {keys(userInputForm.values.heatlh).map((subkey) => {
            return (
              <Flex justify="space-between" gap={20} w="100%">
                <NumberInput
                  w="50%"
                  label={`Evaluated ${
                    HealthLabelMap[subkey as keyof HealthInputProps]
                  } `}
                  disabled
                />
                <NumberInput
                  w="50%"
                  label={`Expected ${
                    HealthLabelMap[subkey as keyof HealthInputProps]
                  } `}
                  {...userInputForm.getInputProps(`health.${subkey}`)}
                />
              </Flex>
            );
          })}
        </Flex>
        {/* Feasibility & strategic importance input */}
        <Flex gap={20} align="start" w="100%">
          <Flex direction="column" w="100%">
            <Title order={4}>Feasibility</Title>
            <NumberInput
              label={`Expected value`}
              {...userInputForm.getInputProps("feasibility")}
            />
          </Flex>
          <Flex direction="column" w="100%">
            <Title order={4}>Strategic Importance</Title>
            <NumberInput
              label={`Expected value`}
              {...userInputForm.getInputProps("strategicImportance")}
            />
          </Flex>
        </Flex>
      </Flex>

      <Group position="right" mt="xl">
        <Button
          variant="light"
          color="blue"
          onClick={handleSave}
          disabled={
            !userInputForm.values.heatlh.cycleTime ||
            !userInputForm.values.heatlh.cost ||
            !userInputForm.values.heatlh.flexibility ||
            !userInputForm.values.heatlh.quality ||
            !userInputForm.values.feasibility ||
            !userInputForm.values.strategicImportance
          }
        >
          Save
        </Button>
        <Button variant="light" onClick={handleClose}>
          Cancel
        </Button>
      </Group>
    </Modal>
  );
};

export default EditModal;
