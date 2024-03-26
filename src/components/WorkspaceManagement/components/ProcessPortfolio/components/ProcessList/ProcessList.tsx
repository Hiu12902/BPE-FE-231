import { usePortfolioProcessQuery } from "@/hooks/index";
import { PortfolioProcess } from "@/interfaces/index";
import { Accordion, Skeleton } from "@mantine/core";
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
          {processes.map((item: PortfolioProcess) => {
            return <ProcessItem data={item} processId={Number(processId)} />;
          })}
        </Accordion>
      )}
    </Accordion.Panel>
  );
};

export default ProcessList;
