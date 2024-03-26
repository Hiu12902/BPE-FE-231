import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import useNotification from "@/hooks/useNotification";
import { useActivateVersionMutation } from "@/hooks/useProcessPortfolio";
import { PortfolioProcess, PortfolioVersion } from "@/interfaces/index";
import { Accordion, Flex, Grid, Switch, Text, Title } from "@mantine/core";
import { ReactComponent as IconHexagons } from "@tabler/icons/icons/hexagons.svg";
import { useParams } from "react-router-dom";

interface VersionItemProps {
  data: PortfolioVersion;
  refetch?: () => void;
}

const VersionItem = (props: VersionItemProps) => {
  const { data, refetch } = props;
  const { version, health, feasibility, strategicImportance, isActive } = data;
  const notify = useNotification();
  const { workspaceId } = useParams();

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

  return (
    <Accordion.Item value={version}>
      <Accordion.Control
        onClick={() => {}}
        styles={{
          padding: 0,
          margin: 0,
        }}
      >
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
                {version}
              </Text>
            </Flex>
          </Grid.Col>

          <Grid.Col span={2}>
            <Flex align="center" justify="center" gap={5}>
              <Title order={6}>Heatlh:</Title>
              <Text color="dimmed" size="sm">
                {health !== null ? health : "N/A"}
              </Text>
            </Flex>
          </Grid.Col>

          <Grid.Col span={2}>
            <Flex align="center" justify="center" gap={5}>
              <Title order={6}>Feasibility:</Title>
              <Text color="dimmed" size="sm">
                {feasibility !== null ? feasibility : "N/A"}
              </Text>
            </Flex>
          </Grid.Col>

          <Grid.Col span={3}>
            <Flex align="center" justify="center" gap={5}>
              <Title order={6}>Strategic importance:</Title>
              <Text color="dimmed" size="sm">
                {strategicImportance !== null ? strategicImportance : "N/A"}
              </Text>
            </Flex>
          </Grid.Col>

          {/* Dropdown menu */}
          <Grid.Col span={1}>
            <Flex justify="flex-end">
              <Switch
                onLabel="Active"
                offLabel="Inactive"
                defaultChecked={isActive}
                checked={isActive}
                disabled={isActive}
                onChange={(e) => {
                  if (isActive) {
                    notify({
                      title: "This version is active!",
                      message:
                        "You can not deactivate it! Please activate another version instead.",
                      type: "warning",
                    });
                  } else {
                    if (workspaceId) {
                      activateVersionMutation.mutate({
                        workspaceId: Number(workspaceId),
                        processVersionVersion: version,
                      });
                    }
                  }
                }}
              />
            </Flex>
          </Grid.Col>
        </Grid>
      </Accordion.Control>
    </Accordion.Item>
  );
};

export default VersionItem;
