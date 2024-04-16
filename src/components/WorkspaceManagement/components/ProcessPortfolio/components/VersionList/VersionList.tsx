import { usePortfolioVersionQuery } from "@/hooks/index";
import { PortfolioVersion } from "@/interfaces/index";
import { Accordion, Skeleton } from "@mantine/core";
import { useParams } from "react-router-dom";
import VersionItem from "../VersionItem";

interface VersionListProps {
  processId: number | null;
  processName: string;
}

const VersionList = (props: VersionListProps) => {
  const { processId, processName } = props;
  const { workspaceId } = useParams();

  const {
    data: versions,
    isLoading: versionsLoading,
    refetch: versionsRefetch,
    isFetching: versionsFetching,
  } = usePortfolioVersionQuery({
    workspaceId: Number(workspaceId),
    processId: Number(processId),
  });

  return (
    <Accordion.Panel>
      {versionsLoading || !versions || versionsFetching ? (
        <Accordion>
          <Skeleton height={50} mt={0} radius={0} />
        </Accordion>
      ) : (
        <Accordion variant="contained" defaultValue={versions[0].version}>
          {versions
            .sort((a, b) => {
              return a.num - b.num;
            })
            .map((item: PortfolioVersion) => {
              return (
                <VersionItem
                  data={item}
                  refetch={versionsRefetch}
                  processName={processName}
                />
              );
            })}
        </Accordion>
      )}
    </Accordion.Panel>
  );
};

export default VersionList;
