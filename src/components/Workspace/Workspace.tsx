import projectApi from "@/api/project";
import CreateProjectButton from "@/components/CreateProjectButton";
import { IPagination, IQueryParams } from "@/interfaces/common";
import { IProject } from "@/interfaces/projects";
import { getCurrentUser, getProject } from "@/redux/selectors";
import { projectActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  Button,
  Container,
  Divider,
  Group,
  Pagination,
  Skeleton,
  Title,
} from "@mantine/core";
import { createFormContext } from "@mantine/form";
import { useDocumentTitle } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EmptyRender from "../EmptyRender/EmptyRender";
import { SearchInput } from "../SearchInput";
import { useWorkspaceStyle } from "./Workspace.style";
import { Header, List } from "./components";

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
  const currentUser = useSelector(getCurrentUser);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    total: 0,
    limit: 10,
  });
  const [queryParams, setQueryParams] = useState<IQueryParams>({});

  const form = useForm({
    initialValues: {
      searchValue: "",
    },
  });

  const searchValue = form.values.searchValue;

  const onCancelSearchProjects = () => {
    form.reset();
    setIsSearching(false);
    onReturnDefaultState();
  };

  const onReturnDefaultState = () => {
    setLoading(true);
    setSearchLoading(true);

    dispatch(projectActions.clearProjects());
  };

  const onCreateNewProject = (project: IProject) =>
    dispatch(
      projectActions.setProject({
        ...project,
        offset: -1,
        role: project.ownerId === currentUser.id ? 0 : undefined,
      })
    );

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
    onReturnDefaultState();
  };

  const getAllProjects = async (queryFilter?: IQueryParams) => {
    try {
      const projects = await projectApi.getAllProjects(Number(workspaceId), {
        ...(queryFilter ? queryFilter : queryParams),
        keyword: searchValue,
        page: queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
      });
      if (projects) {
        setPagination({
          ...pagination,
          page:
            queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
          total: projects.total,
          limit: projects.limit,
        });
        batch(() => {
          projects.data.map((project: IProject, index: number) =>
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
      setSearchLoading(false);
      setIsSearching(false);
    }
  };

  const onQueryFilter = async (queryFilter: IQueryParams) => {
    try {
      setLoading(true);
      setQueryParams(queryFilter);
      dispatch(projectActions.clearProjects());
      getAllProjects(queryFilter);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchLoading) {
      getAllProjects();
    }
  }, [isSearching, searchLoading, pagination.page]);

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
              onReturnDefaultState();
              setIsSearching(true);
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
      <Accordion variant="contained" chevron className={classes.accordion}>
        <Accordion.Item value="header">
          <Accordion.Control
            children={<Header onQueryFilter={onQueryFilter} />}
          />
        </Accordion.Item>
        <List projects={projectsMap} />
        {loading || searchLoading ? (
          <Skeleton height={50} mt={10} />
        ) : projectsMap.length === 0 ? (
          isSearching ? (
            EmptyRender({
              text: "No results found",
            })
          ) : (
            EmptyRender({
              text: "You don't have any projects yet! You can start right now by creating a new project.",
              action: onCreateNewProject,
            })
          )
        ) : (
          <Accordion.Item value="pagination">
            <Accordion.Control
              children={
                <Pagination
                  value={pagination.page}
                  total={Math.ceil(pagination.total / pagination.limit)}
                  onChange={handlePageChange}
                />
              }
            />
          </Accordion.Item>
        )}
      </Accordion>
    </Container>
  );
};

export default Workspace;
