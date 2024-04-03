import {
  ActionIcon,
  Alert,
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

import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import useDetachModel from "@/core/hooks/useDetachModel";
import {
  useVersionMeasurementsMutation,
  useVersionMeasurementsQuery,
} from "@/hooks/index";
import useNotification from "@/hooks/useNotification";
import { NAVersion, VersionMeasurementsUpdateBody } from "@/interfaces/index";
import { getActiveTab } from "@/redux/selectors";
import { modelActions, tabsSliceActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

interface EditNAModalProps extends ModalProps {
  onSave: () => void;
  data: NAVersion;
}

const EditNAModal = (props: EditNAModalProps) => {
  const { opened, onClose, onSave, data } = props;
  const {
    processVersionVersion: version,
    projectId,
    num,
    processName,
    processId,
  } = data;
  const { workspaceId } = useParams();
  const [versionChange, setVersionChange] =
    useState<VersionMeasurementsUpdateBody>(
      {} as VersionMeasurementsUpdateBody
    );
  const notify = useNotification();
  const dispatch = useAppDispatch();
  const detach = useDetachModel();
  const activeTab = useSelector(getActiveTab);
  const navigate = useNavigate();
  const { data: versionMeasurements, isFetching: versionFetching } =
    useVersionMeasurementsQuery({
      workspaceId: Number(workspaceId),
      processVersionVersion: version,
    });

  const updateVersionMeasurements = useVersionMeasurementsMutation({
    onSuccess: () => {
      onClose();
      notify({
        title: "Success",
        message: "Process version measurements updated successfully",
        type: "success",
      });
      onSave?.();
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
      processVersionVersion: version,
    });
  };

  const onOpenBpmnFile = () => {
    if (version) {
      batch(() => {
        dispatch(
          modelActions.setModelers({
            modeler: undefined,
            id: version,
            projectId: projectId,
            name: `${processName}_ver_${num}_test`,
            processId: processId,
            role: 0,
          })
        );
        detach();
        dispatch(modelActions.setCurrentModeler(version));
        if (activeTab?.id !== version) {
          dispatch(tabsSliceActions.setActiveTab(version));
        }
      });
      navigate("/editor");
    }
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
      <LoadingOverlay visible={!versionMeasurements || versionFetching} />
      <Stack>
        {/* Health */}
        <Flex direction="column" gap={10}>
          <Title order={4}>Health</Title>
          <Alert
            style={{
              borderLeft: `5px solid ${PRIMARY_COLOR[0]}`,
            }}
          >
            This process version is lack of evaluated result.{" "}
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => {
                onOpenBpmnFile();
              }}
            >
              Click here
            </span>{" "}
            to generate the evaluation result.
          </Alert>
          {/* Cycle Time */}
          <Flex w="100%" gap={20} justify="space-between">
            <TextInput
              w="50%"
              disabled
              label="Evaluated Cycle Time"
              error={
                versionMeasurements?.evaluationResult === null ||
                versionMeasurements?.evaluationResult.totalCycleTime === null
              }
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
              error={
                versionMeasurements?.health === null ||
                versionMeasurements?.health.currentCycleTime === null
              }
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
              error={
                versionMeasurements?.evaluationResult === null ||
                versionMeasurements?.evaluationResult.totalCost === null
              }
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
              error={
                versionMeasurements?.health === null ||
                versionMeasurements?.health.currentCost === null
              }
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
              error={
                versionMeasurements?.evaluationResult === null ||
                versionMeasurements?.evaluationResult.totalQuality === null
              }
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
              error={
                versionMeasurements?.health === null ||
                versionMeasurements?.health.currentQuality === null
              }
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
              error={
                versionMeasurements?.evaluationResult === null ||
                versionMeasurements?.evaluationResult.totalFlexibility === null
              }
              defaultValue={
                versionMeasurements?.evaluationResult === null ||
                versionMeasurements?.evaluationResult.totalFlexibility === null
                  ? "N/A"
                  : versionMeasurements?.evaluationResult.totalFlexibility
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
              error={
                versionMeasurements?.health === null ||
                versionMeasurements?.health.currentFlexibility === null
              }
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
              error={versionMeasurements?.feasibility === null}
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
              error={versionMeasurements?.strategicImportance === null}
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

export default EditNAModal;
