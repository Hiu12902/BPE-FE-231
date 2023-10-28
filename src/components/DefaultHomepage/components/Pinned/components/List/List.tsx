import { WorkspaceItem } from "@/components/WorkspaceItem";
import { IWorkspace } from "@/interfaces/workspaces";

const List = ({ workspaces }: { workspaces: IWorkspace[] }) => {
  return (
    <>
      {workspaces.map((workspace, index) => (
        <WorkspaceItem {...workspace} key={index} />
      ))}
    </>
  );
};

export default List;
