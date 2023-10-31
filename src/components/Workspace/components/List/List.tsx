import ProjectItem from "@/components/ProjectItem";
import { IProject } from "@/interfaces/projects";

const List = ({ projects }: { projects: IProject[] }) => {
  return (
    <>
      {projects.map((project) => (
        <ProjectItem
          {...project}
          key={project.id}
          // onDeleteProject={onDeleteProject}
          //   shouldGetDocuments={!isOpenFromEditor}
          //   showExtraInfo={!isOpenFromEditor}
        />
      ))}
    </>
  );
};

export default List;
