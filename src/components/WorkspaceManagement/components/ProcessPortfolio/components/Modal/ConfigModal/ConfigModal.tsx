import {
    ActionIcon,
    Badge,
    Button,
    Container,
    Flex,
    Group,
    Modal,
    ModalProps,
    NumberInput,
    Stack,
} from "@mantine/core";
import { ReactComponent as IconInfo } from "@tabler/icons/icons/info-circle-filled.svg";

import { useForm } from "@mantine/form";
import { keys } from "lodash";

interface ConfigModalProps extends ModalProps {
  onSave: () => void;
}

interface UserInputProps {
  cycleTime: number | undefined;
  cost: number | undefined;
  quality: number | undefined;
  flexibility: number | undefined;
}

interface UserInputForm {
  target: UserInputProps;
  worst: UserInputProps;
}

const UserInputFormTitleMap: Record<keyof UserInputForm, string> = {
  target: "Target",
  worst: "Worst",
};

const UserInputFormLableMap: Record<keyof UserInputProps, string> = {
  cycleTime: "Cycle Time",
  cost: "Cost",
  quality: "Quality",
  flexibility: "Flexibility",
};

const ConfigModal = (props: ConfigModalProps) => {
  const { opened, onClose, onSave } = props;
  const userInputForm = useForm<UserInputForm>({
    initialValues: {
      target: {
        cycleTime: undefined,
        cost: undefined,
        flexibility: 100,
        quality: 100,
      },
      worst: {
        cycleTime: undefined,
        cost: undefined,
        flexibility: 0,
        quality: 0,
      },
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
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
            children={"Configure Perfomance Level"}
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
      size="lg"
    >
      <Container>
        <Stack>
          <Group position="apart">
            {keys(userInputForm.values).map((key) => (
              <Stack>
                {keys(userInputForm.values[key as keyof UserInputForm]).map(
                  (subkey) => (
                    <NumberInput
                      label={`${
                        UserInputFormTitleMap[key as keyof UserInputForm]
                      } ${
                        UserInputFormLableMap[subkey as keyof UserInputProps]
                      }`}
                      {...userInputForm.getInputProps(`${key}.${subkey}`)}
                    />
                  )
                )}
              </Stack>
            ))}
          </Group>
        </Stack>
      </Container>

      <Group position="right" mt="xl">
        <Button
          variant="light"
          color="blue"
          onClick={handleSave}
          disabled={
            !userInputForm.values.target.cycleTime ||
            !userInputForm.values.target.cost ||
            !userInputForm.values.target.flexibility ||
            !userInputForm.values.target.quality ||
            !userInputForm.values.worst.cycleTime ||
            !userInputForm.values.worst.cost ||
            !userInputForm.values.worst.flexibility ||
            !userInputForm.values.worst.quality
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

export default ConfigModal;
