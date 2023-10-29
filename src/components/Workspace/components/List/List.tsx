import ProjectItem from "@/components/ProjectItem";
import { IProject } from "@/interfaces/projects";
import { projectActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";

const List = ({ projects }: { projects: IProject[] }) => {
  const dispatch = useAppDispatch();

  const onDeleteProject = (projectId: number) => {
    dispatch(projectActions.deleteProject(projectId));
  };

  return (
    <>
      {projects.map((project) => (
        <ProjectItem
          {...project}
          key={project.id}
          onDeleteProject={onDeleteProject}
          //   shouldGetDocuments={!isOpenFromEditor}
          //   showExtraInfo={!isOpenFromEditor}
        />
      ))}
    </>
  );
};

export default List;
