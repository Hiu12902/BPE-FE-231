import DropdownMenu from "@/components/DropdownMenu";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import useNotification from "@/hooks/useNotification";
import { useActivateVersionMutation } from "@/hooks/useProcessPortfolio";
import { PortfolioProcess, PortfolioVersion } from "@/interfaces/index";
import { Accordion, Badge, Flex, Grid, Text, Title } from "@mantine/core";
import { ReactComponent as IconEdit } from "@tabler/icons/icons/edit.svg";
import { ReactComponent as IconHexagons } from "@tabler/icons/icons/hexagons.svg";
import { ReactComponent as IconActivate } from "@tabler/icons/icons/toggle-right.svg";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EditModal } from "../Modal";
import { useVersionItemStyle } from "./VersionItem.style";

interface VersionItemProps {
  data: PortfolioVersion;
  processName: string;
  refetch?: () => void;
}

const VersionItem = (props: VersionItemProps) => {
  const { data, refetch, processName } = props;
  const { classes } = useVersionItemStyle();
  const {
    version,
    health,
    feasibility,
    strategicImportance,
    isActive,
    processId,
    num,
  } = data;
  const notify = useNotification();
  const { workspaceId } = useParams();
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  const activateVersionMutation = useActivateVersionMutation({
    onSuccess: (data: PortfolioProcess) => {
      notify({
        title: "Activate process version successfully",
        message:
          "Now you can start working on it, start editing and generating process portfolio!",
        type: "success",
      });
      refetch?.();
    },
    onError: (error) => {
      notify({
        message: "Failed to activate process version, please try agian later!",
        type: "error",
      });
    },
  });

  const onActivateProcess = () => {
    if (workspaceId) {
      activateVersionMutation.mutate({
        workspaceId: Number(workspaceId),
        processId: processId,
        processVersionVersion: version,
      });
    }
  };

  const onOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const dropdownMenuContent = [
    {
      icon: <IconActivate className={classes.dropdownMenuIcon} />,
      children: "Activate process version",
      onClick: onActivateProcess,
      disabled: isActive,
    },
    {
      icon: <IconEdit className={classes.dropdownMenuIcon} />,
      children: "Edit",
      onClick: onOpenEditModal,
    },
  ];

  return (
    <Accordion.Item value={version}>
      {openEditModal && (
        <EditModal
          processVersion={version}
          opened={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
          }}
          onSave={() => {
            setOpenEditModal(false);
            refetch?.();
          }}
        />
      )}
      <Accordion.Control>
        <Grid align="center" justify="center">
          {/* Project name */}
          <Grid.Col span={3}>
            <Flex justify="flex-start" align="center">
              <IconHexagons
                width={30}
                height={30}
                color={PRIMARY_COLOR[0]}
                strokeWidth="0.8"
              />
              <Text
                size="sm"
                truncate="end"
                style={{
                  marginLeft: 5,
                  maxWidth: "80%",
                }}
              >
                {`${processName}_ver_${num}.bpmn`}
              </Text>
            </Flex>
          </Grid.Col>

          <Grid.Col span={2}>
            <Flex align="center" justify="center" gap={5}>
              <Title order={6}>Heatlh:</Title>
              <Text color="dimmed" size="sm">
                {health !== null ? health.toFixed(2) : "N/A"}
              </Text>
            </Flex>
          </Grid.Col>

          <Grid.Col span={2}>
            <Flex align="center" justify="center" gap={5}>
              <Title order={6}>Feasibility:</Title>
              <Text color="dimmed" size="sm">
                {feasibility !== null ? feasibility.toFixed(2) : "N/A"}
              </Text>
            </Flex>
          </Grid.Col>

          <Grid.Col span={3}>
            <Flex align="center" justify="center" gap={5}>
              <Title order={6}>Strategic importance:</Title>
              <Text color="dimmed" size="sm">
                {strategicImportance !== null
                  ? strategicImportance.toFixed(2)
                  : "N/A"}
              </Text>
            </Flex>
          </Grid.Col>

          {/* Dropdown menu */}
          <Grid.Col span={2}>
            <Flex justify="space-around" align="center">
              {isActive ? (
                <Badge variant="filled" color="teal">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" color="gray">
                  Inactive
                </Badge>
              )}

              <DropdownMenu dropdownMenuContent={dropdownMenuContent} />
            </Flex>
          </Grid.Col>
        </Grid>
      </Accordion.Control>
    </Accordion.Item>
  );
};

export default VersionItem;
