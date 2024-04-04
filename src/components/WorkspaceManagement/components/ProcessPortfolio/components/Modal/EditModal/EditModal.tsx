import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  ModalProps,
  NumberInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { ReactComponent as IconInfo } from "@tabler/icons/icons/info-circle-filled.svg";

import {
  useVersionMeasurementsMutation,
  useVersionMeasurementsQuery,
} from "@/hooks/index";
import useNotification from "@/hooks/useNotification";
import { VersionMeasurementsUpdateBody } from "@/interfaces/index";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface EditModalProps extends ModalProps {
  onSave: () => void;
  processVersion: string;
  refetch?: () => void;
}

const EditModal = (props: EditModalProps) => {
  const { opened, onClose, onSave, processVersion, refetch } = props;
  const { workspaceId } = useParams();
  const [versionChange, setVersionChange] =
    useState<VersionMeasurementsUpdateBody>(
      {} as VersionMeasurementsUpdateBody
    );
  const notify = useNotification();

  const {
    data: versionMeasurements,
    isLoading: versionLoading,
    isFetching: versionFetching,
  } = useVersionMeasurementsQuery({
    workspaceId: Number(workspaceId),
    processVersionVersion: processVersion,
  });

  const updateVersionMeasurements = useVersionMeasurementsMutation({
    onSuccess: () => {
      onClose();
      notify({
        title: "Success",
        message: "Process version measurements updated successfully",
        type: "success",
      });
      refetch?.();
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    console.log(versionChange);
    updateVersionMeasurements.mutate({
      ...versionChange,
      workspaceId: Number(workspaceId),
      processVersionVersion: processVersion,
    });
    onSave?.();
  };

  useEffect(() => {
    if (versionMeasurements) {
      console.log(versionMeasurements);

      setVersionChange({
        ...versionChange,
        currentCycleTime:
          versionMeasurements.health === null
            ? 0
            : versionMeasurements.health.currentCycleTime,
        currentCost:
          versionMeasurements.health === null
            ? 0
            : versionMeasurements.health.currentCost,
        currentQuality:
          versionMeasurements.health === null
            ? 0
            : versionMeasurements.health.currentQuality,
        currentFlexibility:
          versionMeasurements.health === null
            ? 0
            : versionMeasurements.health.currentFlexibility,
        strategicImportance:
          versionMeasurements.strategicImportance === null
            ? 0
            : versionMeasurements.strategicImportance,
        feasibility:
          versionMeasurements.feasibility === null
            ? 0
            : versionMeasurements.feasibility,
      });
    }
  }, [versionMeasurements]);

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
      size="lg"
    >
      <LoadingOverlay
        visible={!versionMeasurements || (!versionLoading && versionFetching)}
      />
      <Stack>
        {/* Health */}
        <Flex direction="column" gap={10}>
          <Title order={4}>Health</Title>
          {/* Cycle Time */}
          <Flex w="100%" gap={20} justify="space-between">
            <TextInput
              w="50%"
              disabled
              label="Evaluated Cycle Time"
              defaultValue={
                versionMeasurements?.evaluationResult === null ||
                versionMeasurements?.evaluationResult.totalCycleTime === null
                  ? "N/A"
                  : versionMeasurements?.evaluationResult.totalCycleTime
              }
            />
            <NumberInput
              w="50%"
              min={0}
              step={1}
              label="Current Cycle Time"
              defaultValue={
                versionMeasurements?.health === null ||
                versionMeasurements?.health.currentCycleTime === null
                  ? 0
                  : versionMeasurements?.health.currentCycleTime
              }
              value={versionChange.currentCycleTime}
              onChange={(value: number) => {
                setVersionChange({
                  ...versionChange,
                  currentCycleTime: value,
                });
              }}
            />
          </Flex>

          {/* Cost */}
          <Flex w="100%" gap={20} justify="space-between">
            <TextInput
              w="50%"
              disabled
              label="Evaluated Cost"
              defaultValue={
                versionMeasurements?.evaluationResult === null ||
                versionMeasurements?.evaluationResult.totalCost === null
                  ? "N/A"
                  : versionMeasurements?.evaluationResult.totalCost
              }
            />
            <NumberInput
              w="50%"
              min={0}
              step={1}
              label="Current Cost"
              defaultValue={
                versionMeasurements?.health === null ||
                versionMeasurements?.health.currentCost === null
                  ? 0
                  : versionMeasurements?.health.currentCost
              }
              value={versionChange.currentCost}
              onChange={(value: number) => {
                setVersionChange({
                  ...versionChange,
                  currentCost: value,
                });
              }}
            />
          </Flex>

          {/* Quality */}
          <Flex w="100%" gap={20} justify="space-between">
            <TextInput
              w="50%"
              disabled
              label="Evaluated Quality"
              description="From 0 to 1"
              defaultValue={
                versionMeasurements?.evaluationResult === null ||
                versionMeasurements?.evaluationResult.totalQuality === null
                  ? "N/A"
                  : versionMeasurements?.evaluationResult.totalQuality.toFixed(
                      2
                    )
              }
            />
            <NumberInput
              w="50%"
              min={0}
              max={1}
              step={0.01}
              precision={2}
              label="Current Quality"
              description="From 0 to 1"
              defaultValue={
                versionMeasurements?.health === null ||
                versionMeasurements?.health.currentQuality === null
                  ? 0
                  : versionMeasurements?.health.currentQuality
              }
              value={versionChange.currentQuality}
              onChange={(value: number) => {
                setVersionChange({
                  ...versionChange,
                  currentQuality: value,
                });
              }}
            />
          </Flex>

          {/* Flexibility */}
          <Flex w="100%" gap={20} justify="space-between">
            <TextInput
              w="50%"
              disabled
              label="Evaluated Flexibility"
              description="From 0 to 1"
              defaultValue={
                versionMeasurements?.evaluationResult === null ||
                versionMeasurements?.evaluationResult.totalFlexibility === null
                  ? "N/A"
                  : versionMeasurements?.evaluationResult.totalFlexibility.toFixed(
                      2
                    )
              }
            />
            <NumberInput
              w="50%"
              min={0}
              max={1}
              step={0.01}
              precision={2}
              label="Current Flexibility"
              description="From 0 to 1"
              defaultValue={
                versionMeasurements?.health === null ||
                versionMeasurements?.health.currentFlexibility === null
                  ? 0
                  : versionMeasurements?.health.currentFlexibility
              }
              value={versionChange.currentFlexibility}
              onChange={(value: number) => {
                setVersionChange({
                  ...versionChange,
                  currentFlexibility: value,
                });
              }}
            />
          </Flex>
        </Flex>
        {/* Feasibility & Strategic importance */}
        <Flex w="100%" gap={20} justify="space-between">
          {/* Feasibility */}
          <Flex direction="column" w="50%">
            <Title order={4}>Feasibility</Title>
            <NumberInput
              min={0}
              max={1}
              step={0.01}
              precision={2}
              label="Expected value"
              description="From 0 to 1"
              defaultValue={
                versionMeasurements?.feasibility === null
                  ? 0
                  : versionMeasurements?.feasibility
              }
              value={versionChange?.feasibility}
              onChange={(value: number) => {
                setVersionChange({
                  ...versionChange,
                  feasibility: value,
                });
              }}
            />
          </Flex>
          {/* Strategic importance  */}
          <Flex direction="column" w="50%">
            <Title order={4}>Strategic Importance</Title>
            <NumberInput
              min={0}
              max={1}
              step={0.01}
              precision={2}
              label="Expected value"
              description="From 0 to 1"
              defaultValue={
                versionMeasurements?.strategicImportance === null
                  ? 0
                  : versionMeasurements?.strategicImportance
              }
              value={versionChange?.strategicImportance}
              onChange={(value: number) => {
                setVersionChange({
                  ...versionChange,
                  strategicImportance: value,
                });
              }}
            />
          </Flex>
        </Flex>
      </Stack>

      <Group position="right" mt="xl">
        <Button variant="light" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="light" color="blue" onClick={handleSave}>
          Save
        </Button>
      </Group>
    </Modal>
  );
};

export default EditModal;
