import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { PortfolioProcess } from "@/interfaces/index";
import { Accordion, Flex, Grid, Text } from "@mantine/core";
import { ReactComponent as IconFile3d } from "@tabler/icons/icons/file-3d.svg";
import VersionList from "../VersionList";

interface ProcessItemProps {
  processId: number | null;
  data: PortfolioProcess;
}

const ProcessItem = (props: ProcessItemProps) => {
  const { id, name, lastSaved } = props.data;
  const formatTimestamp = (date: Date | string) => {
    function convertUTCDateToLocalDate(date: Date) {
      var newDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60 * 1000
      );
      var offset = date.getTimezoneOffset() / 60;
      var hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;
    }
    return convertUTCDateToLocalDate(new Date(date)).toLocaleString();
  };

  return (
    <Accordion.Item value={id?.toString()}>
      <Accordion.Control
        styles={{
          padding: 0,
          margin: 0,
        }}
      >
        <Grid align="center" justify="center">
          {/* Project name */}
          <Grid.Col span={9}>
            <Flex justify="flex-start" align="center">
              <IconFile3d
                width={30}
                height={30}
                strokeWidth="0.8"
                color={PRIMARY_COLOR[0]}
              />
              <Text
                size="sm"
                truncate="end"
                style={{
                  marginLeft: 5,
                  maxWidth: "80%",
                }}
              >
                {name}
              </Text>
            </Flex>
          </Grid.Col>

          {/* Last modified */}
          <Grid.Col span={3}>
            <Flex align="center" justify="center" h="100%">
              <Text color="dimmed" size="sm">
                {formatTimestamp(lastSaved)}
              </Text>
            </Flex>
          </Grid.Col>
        </Grid>
      </Accordion.Control>
      <VersionList processId={Number(props.processId)} />
    </Accordion.Item>
  );
};

export default ProcessItem;
