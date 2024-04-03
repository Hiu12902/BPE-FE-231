import DropdownMenu from "@/components/DropdownMenu";
import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { NAVersion } from "@/interfaces/index";
import { Accordion, Flex, Grid, Text, Title } from "@mantine/core";
import { ReactComponent as IconEdit } from "@tabler/icons/icons/edit.svg";
import { ReactComponent as IconHexagons } from "@tabler/icons/icons/hexagons.svg";
import { useState } from "react";
import EditNAModal from "../EditNAModal";
import { useNAVersionItemStyle } from "./NAVersionItem.style";

interface NAVersionItemProps {
  data: NAVersion;
  refetch?: () => void;
}

const NAVersionItem = (props: NAVersionItemProps) => {
  const { data, refetch } = props;
  const { classes } = useNAVersionItemStyle();
  const {
    processVersionVersion: version,
    projectId,
    num,
    processName,
    health,
    feasibility,
    strategicImportance,
  } = data;
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  const onOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const dropdownMenuContent = [
    {
      icon: <IconEdit className={classes.dropdownMenuIcon} />,
      children: "Edit",
      onClick: onOpenEditModal,
    },
  ];

  return (
    <Flex>
      {openEditModal && (
        <EditNAModal
          data={data}
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
          <Grid.Col span={4}>
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
              <Text color={health === null ? "coral" : "dimmed"} size="sm">
                {health !== null ? health : "N/A"}
              </Text>
            </Flex>
          </Grid.Col>

          <Grid.Col span={2}>
            <Flex align="center" justify="center" gap={5}>
              <Title order={6}>Feasibility:</Title>
              <Text color={feasibility === null ? "coral" : "dimmed"} size="sm">
                {feasibility !== null ? feasibility : "N/A"}
              </Text>
            </Flex>
          </Grid.Col>

          <Grid.Col span={3}>
            <Flex align="center" justify="center" gap={5}>
              <Title order={6}>Strategic importance:</Title>
              <Text
                color={strategicImportance === null ? "coral" : "dimmed"}
                size="sm"
              >
                {strategicImportance !== null ? strategicImportance : "N/A"}
              </Text>
            </Flex>
          </Grid.Col>

          {/* Dropdown menu */}
          <Grid.Col span={1}>
            <Flex justify="space-around" align="center">
              <DropdownMenu dropdownMenuContent={dropdownMenuContent} />
            </Flex>
          </Grid.Col>
        </Grid>
      </Accordion.Control>
    </Flex>
  );
};

export default NAVersionItem;
