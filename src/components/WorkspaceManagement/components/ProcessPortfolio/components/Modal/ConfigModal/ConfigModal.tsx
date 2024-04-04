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
} from "@mantine/core";
import { ReactComponent as IconInfo } from "@tabler/icons/icons/info-circle-filled.svg";

import useNotification from "@/hooks/useNotification";
import {
  usePerformanceLevelMutation,
  usePerformanceLevelQuery,
} from "@/hooks/useProcessPortfolio";
import { HealthPerformanceLevel } from "@/interfaces/processportfolio";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ConfigModalProps extends ModalProps {
  onSave: () => void;
  setIsNAPerformanceLevel?: (value: boolean) => void;
}

const ConfigModal = (props: ConfigModalProps) => {
  const { opened, onClose, onSave, setIsNAPerformanceLevel } = props;
  const { workspaceId } = useParams();
  const [performanceChange, setPerformanceChange] =
    useState<HealthPerformanceLevel>({} as HealthPerformanceLevel);
  const notify = useNotification();

  const { data: performanceLevel, isFetching: performanceLevelFetching } =
    usePerformanceLevelQuery({
      workspaceId: Number(workspaceId),
    });

  const updatePerformanceLevel = usePerformanceLevelMutation({
    onSuccess: () => {
      onClose();
      notify({
        title: "Success",
        message: "Performance level updated successfully",
        type: "success",
      });
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (
      performanceChange.worstCycleTime !== null &&
      performanceChange.targetedCycleTime > performanceChange.worstCycleTime
    ) {
      notify({
        title: "Error",
        message: "Targeted cycle time must be less than worst cycle time",
        type: "warning",
      });
      return;
    }
    if (
      performanceChange.worstCost !== null &&
      performanceChange.targetedCost > performanceChange.worstCost
    ) {
      notify({
        title: "Error",
        message: "Targeted cost must be less than worst cost",
        type: "warning",
      });
      return;
    }
    if (performanceChange.targetedQuality < performanceChange.worstQuality) {
      notify({
        title: "Error",
        message: "Worst quality must be less than targeted quality",
        type: "warning",
      });
      return;
    }
    if (
      performanceChange.targetedFlexibility < performanceChange.worstFlexibility
    ) {
      notify({
        title: "Error",
        message: "Worst flexibility must be less than targeted flexibility",
        type: "warning",
      });
      return;
    }
    updatePerformanceLevel.mutate({
      workspaceId: Number(workspaceId),
      ...performanceChange,
    });
    onSave?.();
  };

  useEffect(() => {
    if (performanceLevel) {
      if (
        performanceLevel.worstCycleTime === null ||
        performanceLevel.worstCost === null
      ) {
        setIsNAPerformanceLevel?.(true);
      } else {
        setIsNAPerformanceLevel?.(false);
      }
      setPerformanceChange({
        ...performanceLevel,
      });
    }
  }, [performanceLevel]);

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
      <LoadingOverlay visible={performanceLevelFetching || !performanceLevel} />
      <Flex>
        <Group position="apart">
          {/* Cycle Time */}
          <Flex w="100%" gap={20} justify="space-between">
            <NumberInput
              w="50%"
              min={0}
              step={1}
              label="Targeted Cycle Time"
              defaultValue={performanceLevel?.targetedCycleTime}
              value={performanceChange?.targetedCycleTime}
              onChange={(value: number) => {
                setPerformanceChange({
                  ...performanceChange,
                  targetedCycleTime: value,
                });
              }}
            />
            <NumberInput
              w="50%"
              min={0}
              step={1}
              label="Worst Cycle Time"
              error={performanceLevel?.worstCycleTime === null}
              defaultValue={
                performanceLevel?.worstCycleTime === null
                  ? undefined
                  : performanceLevel?.worstCycleTime
              }
              value={
                performanceLevel?.worstCycleTime === null
                  ? undefined
                  : performanceLevel?.worstCycleTime
              }
              onChange={(value: number) => {
                setPerformanceChange({
                  ...performanceChange,
                  worstCycleTime: value,
                });
              }}
            />
          </Flex>
          {/* Cost */}
          <Flex w="100%" gap={20} justify="space-between">
            <NumberInput
              w="50%"
              min={0}
              step={1}
              label="Targeted Cost"
              defaultValue={performanceLevel?.targetedCost}
              value={performanceChange?.targetedCost}
              onChange={(value: number) => {
                setPerformanceChange({
                  ...performanceChange,
                  targetedCost: value,
                });
              }}
            />
            <NumberInput
              w="50%"
              min={0}
              step={1}
              label="Worst Cost"
              error={performanceLevel?.worstCost === null}
              defaultValue={
                performanceLevel?.worstCost === null
                  ? undefined
                  : performanceLevel?.worstCost
              }
              value={
                performanceLevel?.worstCost === null
                  ? undefined
                  : performanceLevel?.worstCost
              }
              onChange={(value: number) => {
                setPerformanceChange({
                  ...performanceChange,
                  worstCost: value,
                });
              }}
            />
          </Flex>
          {/* Quality */}
          <Flex w="100%" gap={20} justify="space-between">
            <NumberInput
              w="50%"
              min={0}
              max={1}
              step={0.01}
              precision={2}
              label="Targeted Quality"
              defaultValue={performanceLevel?.targetedQuality}
              value={performanceChange?.targetedQuality}
              onChange={(value: number) => {
                setPerformanceChange({
                  ...performanceChange,
                  targetedQuality: value,
                });
              }}
            />
            <NumberInput
              w="50%"
              min={0}
              max={1}
              step={0.01}
              precision={2}
              label="Worst Quality"
              defaultValue={performanceLevel?.worstQuality}
              value={performanceChange?.worstQuality}
              onChange={(value: number) => {
                setPerformanceChange({
                  ...performanceChange,
                  worstQuality: value,
                });
              }}
            />
          </Flex>
          {/* Flexibility */}
          <Flex w="100%" gap={20} justify="space-between">
            <NumberInput
              w="50%"
              min={0}
              max={1}
              step={0.01}
              precision={2}
              label="Targeted Flexibility"
              defaultValue={performanceLevel?.targetedFlexibility}
              value={performanceChange?.targetedFlexibility}
              onChange={(value: number) => {
                setPerformanceChange({
                  ...performanceChange,
                  targetedFlexibility: value,
                });
              }}
            />
            <NumberInput
              w="50%"
              min={0}
              max={1}
              step={0.01}
              precision={2}
              label="Worst Flexibility"
              defaultValue={performanceLevel?.worstFlexibility}
              value={performanceChange?.worstFlexibility}
              onChange={(value: number) => {
                setPerformanceChange({
                  ...performanceChange,
                  worstFlexibility: value,
                });
              }}
            />
          </Flex>
        </Group>
      </Flex>

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

export default ConfigModal;
