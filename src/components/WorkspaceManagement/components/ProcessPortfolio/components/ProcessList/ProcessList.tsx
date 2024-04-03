import { EmptyRender } from "@/components/EmptyRender";
import { usePortfolioProcessQuery } from "@/hooks/index";
import { PortfolioProcess } from "@/interfaces/index";
import { Accordion, Flex, Grid, Skeleton, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProcessItem from "../ProcessItem/ProcessItem";

interface ProcessListProps {
  projectId: number | null;
}

const ProcessList = (props: ProcessListProps) => {
  const { projectId } = props;
  const { workspaceId } = useParams();
  const [processId, setProcessId] = useState<number | null>();

  const { data: processes } = usePortfolioProcessQuery({
    workspaceId: Number(workspaceId),
    projectId: Number(projectId),
  });

  useEffect(() => {
    if (projectId !== null) {
      setProcessId(null);
    }
  }, [projectId]);

  return (
    <Accordion.Panel>
      {!processes ? (
        <Accordion>
          <Skeleton height={50} mt={0} radius={0} />
        </Accordion>
      ) : (
        <Accordion
          variant="contained"
          styles={{
            control: {
              backgroundColor: "white",
            },
            content: {
              backgroundColor: "white",
            },
          }}
          transitionDuration={0}
          value={processId?.toString()}
          onChange={(value) => {
            setProcessId(Number(value));
          }}
        >
          {/* <Accordion.Item value="heading">
            <Accordion.Control>
              <Grid align="center" justify="center">
                <Grid.Col span={9}>
                  <Flex justify="flex-start" align="center">
                    <Text size="md">Process Name</Text>
                  </Flex>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Flex align="center" justify="center" h="100%">
                    <Text size="md">Last modified</Text>
                  </Flex>
                </Grid.Col>
              </Grid>
            </Accordion.Control>
          </Accordion.Item> */}

          {processes.length > 0 ? (
            processes.map((item: PortfolioProcess) => {
              return <ProcessItem data={item} processId={Number(processId)} />;
            })
          ) : (
            <Accordion.Item value="0">
              <Accordion.Control>
                <EmptyRender text="There is no process in this project. Please create new process!" />
              </Accordion.Control>
            </Accordion.Item>
          )}
        </Accordion>
      )}
    </Accordion.Panel>
  );
};

export default ProcessList;
