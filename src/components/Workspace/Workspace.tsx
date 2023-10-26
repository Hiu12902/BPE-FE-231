import projectApi from "@/api/project";
import noProjects from "@/assets/no-projects.svg";
import CreateProjectButton from "@/components/CreateProjectButton";
import ProjectItem from "@/components/ProjectItem";
import { IProject } from "@/interfaces/projects";
import { getProject } from "@/redux/selectors";
import { projectActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { createFormContext } from "@mantine/form";
import { useDocumentTitle } from "@mantine/hooks";
import { ReactComponent as IconChevronRight } from "@tabler/icons/icons/chevron-right.svg";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SearchInput } from "../SearchInput";
import { useWorkspaceStyle } from "./Workspace.style";

export interface ISearchValue {
  searchValue: string;
}

export const [ProjectFormProvider, useProjectFormContext, useForm] =
  createFormContext<ISearchValue>();

const Workspace = () => {
  useDocumentTitle("Workspace | BKSky");

  const { classes } = useWorkspaceStyle();
  const dispatch = useAppDispatch();
  const projects = useSelector(getProject);
  const projectsMap = Object.keys(projects).map(function (key) {
    return projects[parseInt(key)];
  });
  const { workspaceId, workspaceName } = useParams();
  const isOpenFromEditor = false; // temporary value
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(true);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      searchValue: "",
    },
  });
  const searchValue = form.values.searchValue;
  const searchProjects = async () => {
    setSearchLoading(true);
    try {
      const searchResult = await projectApi.searchProject({ searchValue });
      if (searchResult) {
        batch(() => {
          searchResult.map((project: IProject) =>
            dispatch(projectActions.setProject(project))
          );
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const onCancelSearchProjects = () => {
    form.reset();
    setLoading(true);
    setIsSearching(false);
    setSearchLoading(true);

    dispatch(projectActions.clearProjects());
    getAllProjects();
  };

  const getAllProjects = async () => {
    try {
      const projects = await projectApi.getAllProjects();
      if (projects) {
        batch(() => {
          projects.map((project: IProject) =>
            dispatch(projectActions.setProject(project))
          );
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onCreateNewProject = (project: IProject) => {
    dispatch(projectActions.setProject(project));
  };

  const onDeleteProject = (projectId: number) => {
    dispatch(projectActions.deleteProject(projectId));
  };

  const renderNoProjects = () => {
    return (
      <Stack w={400}>
        <Center>
          <Image src={noProjects} width={120} opacity={0.7} />
        </Center>
        <Text align="center" color="dimmed">
          You don't have any projects yet! You can start right now by creating a
          new project.
        </Text>
        <Center>
          <CreateProjectButton
            workspaceId={Number(workspaceId)}
            onCreateProject={onCreateNewProject}
          />
        </Center>
      </Stack>
    );
  };

  const renderProjectsSkeleton = () => {
    return [1, 2, 3].map((v) => <Skeleton height={50} key={v} mt={10} />);
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <Container size="xl">
      {/* Header */}
      <Title order={2}>{workspaceName}</Title>

      <Group position="apart" className={classes.searchGroup}>
        <ProjectFormProvider form={form}>
          <form
            onSubmit={form.onSubmit(() => {
              if (searchValue.length === 0) {
                onCancelSearchProjects();
                return;
              }
              setIsSearching(true);
              dispatch(projectActions.clearProjects());
              searchProjects();
            })}
            className={classes.form}
          >
            <SearchInput
              onCancel={onCancelSearchProjects}
              placeholder="Search project name, owner name, etc."
              context="project"
            />
          </form>
        </ProjectFormProvider>
        <Group>
          <Button variant="outline" onClick={() => navigate("/editor")}>
            Open Editor
          </Button>
          <CreateProjectButton
            workspaceId={Number(workspaceId)}
            onCreateProject={onCreateNewProject}
          />
        </Group>
      </Group>

      <Divider my="md" />

      {/* Projects information */}
      {loading ? (
        renderProjectsSkeleton()
      ) : projectsMap.length > 0 ? (
        <Accordion
          variant="separated"
          chevron={<IconChevronRight color="#868e96" />}
          className={classes.accordion}
        >
          {projectsMap.map((project) => (
            <ProjectItem
              {...project}
              key={project.id}
              onDeleteProject={onDeleteProject}
              shouldGetDocuments={!isOpenFromEditor}
              showExtraInfo={!isOpenFromEditor}
            />
          ))}
        </Accordion>
      ) : (
        <Center>{renderNoProjects()}</Center>
      )}
    </Container>
  );
};

export default Workspace;
