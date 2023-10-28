import projectApi from "@/api/project";
import CreateProjectButton from "@/components/CreateProjectButton";
import ProjectItem from "@/components/ProjectItem";
import { IProject } from "@/interfaces/projects";
import { getProject } from "@/redux/selectors";
import { projectActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Skeleton,
  Title,
} from "@mantine/core";
import { createFormContext } from "@mantine/form";
import { useDocumentTitle } from "@mantine/hooks";
import { ReactComponent as IconChevronRight } from "@tabler/icons/icons/chevron-right.svg";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EmptyRender, { IEmptyRender } from "../EmptyRender/EmptyRender";
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
  const projectsMap = Object.values(projects).sort(
    (a, b) => a.offset - b.offset
  );
  const { workspaceId, workspaceName } = useParams();
  const isOpenFromEditor = false; // temporary value
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
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
    clearProjects();
    getAllProjects();
  };

  const clearProjects = async () => {
    dispatch(projectActions.clearProjects());
  };

  const getAllProjects = async () => {
    try {
      const projects = await projectApi.getAllProjects();
      if (projects) {
        batch(() => {
          projects.map((project: IProject, index: number) =>
            dispatch(
              projectActions.setProject({
                ...project,
                offset: index,
              })
            )
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

  const ProjectListRender = ({
    projects,
    loading,
    emptyRender,
  }: {
    projects: IProject[];
    loading: Boolean;
    emptyRender: IEmptyRender;
  }) => {
    return (
      <>
        {loading ? (
          <Skeleton height={50} mt={10} />
        ) : projects.length === 0 ? (
          EmptyRender(emptyRender)
        ) : (
          <Accordion
            variant="separated"
            chevron={<IconChevronRight color="#868e96" />}
            className={classes.accordion}
          >
            <Accordion.Item value="Header">
              <Accordion.Control>
                <Grid justify="center">
                  <Grid.Col span={3}>
                    <Flex justify="center">Workspace Name</Flex>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Flex justify="center">Owner</Flex>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Flex justify="center">Last modified</Flex>
                  </Grid.Col>
                  <Grid.Col span={3} />
                </Grid>
              </Accordion.Control>
            </Accordion.Item>
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
        )}
      </>
    );
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <Container size="xl">
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

      {isSearching ? (
        <ProjectListRender
          projects={projectsMap}
          loading={searchLoading}
          emptyRender={{
            text: "No results found!",
          }}
        />
      ) : (
        <ProjectListRender
          projects={projectsMap}
          loading={loading}
          emptyRender={{
            text: "You don't have any projects yet! You can start right now by creating a new project.",
            action: (
              <CreateProjectButton
                workspaceId={Number(workspaceId)}
                onCreateProject={onCreateNewProject}
              />
            ),
          }}
        />
      )}
    </Container>
  );
};

export default Workspace;
