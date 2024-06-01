import { requestsApi } from "@/api/index";
import projectApi from "@/api/project";
import CreateProjectButton from "@/components/CreateProjectButton";
import useNotification from "@/hooks/useNotification";
import { IPagination, IQueryParams } from "@/interfaces/common";
import { IProject } from "@/interfaces/projects";
import { getCurrentUser, getProject } from "@/redux/selectors";
import { projectActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  Pagination,
  Skeleton,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { ReactComponent as IconInformation } from "@tabler/icons/icons/info-circle.svg";
import { ReactComponent as IconPlus } from "@tabler/icons/icons/plus.svg";
import { ReactComponent as IconSetting } from "@tabler/icons/icons/settings.svg";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EmptyRender from "../EmptyRender/EmptyRender";
import {
  ProjectsFormProvider,
  useProjectsForm,
} from "../FormContext/ProjectsForm";
import { AssignPermissionModal } from "../Modal/AssignPermissionModal";
import { useWorkspaceStyle } from "./Workspace.style";
import { Header, List } from "./components";
import ContextForm from "./components/ContextForm/ContextForm";

const initialModalState = {
  assignPermission: false,
};

const Workspace = () => {
  useDocumentTitle("Workspace | BKSky");

  const { classes } = useWorkspaceStyle();
  const dispatch = useAppDispatch();
  const projects = useSelector(getProject);
  const projectsMap = Object.values(projects).sort(
    (a, b) => a.offset - b.offset
  );
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(
    useParams().workspaceId
  );
  const [workspaceName, setWorkspaceName] = useState<string | undefined>(
    useParams().workspaceName
  );
  // const { workspaceId, workspaceName } =
  //   useParams() !== undefined
  //     ? useParams()
  //     : JSON.parse(localStorage.getItem("lastOpenedWorkspace") as string);
  const [toPermission, setToPermission] = useState<string>("");
  const [open, setOpen] = useState(initialModalState);
  const modalHandler = (modal: string, value: boolean) => {
    setOpen({
      ...initialModalState,
      [modal]: value,
    });
  };
  const currentUser = useSelector(getCurrentUser);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const notify = useNotification();

  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    total: 0,
    limit: 10,
  });
  const [queryParams, setQueryParams] = useState<IQueryParams>({});

  const form = useProjectsForm({
    initialValues: {
      searchValue: "",
    },
  });

  const searchValue = form.values.searchValue;
  const permission = currentUser.permission || "";

  const formatTimestamp = (date: Date) => {
    function convertUTCDateToLocalDate(date: Date) {
      var newDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60 * 1000
      );
      var offset = date.getTimezoneOffset() / 60;
      var hours = date.getHours();

      newDate.setHours(hours + offset);

      return newDate;
    }
    return convertUTCDateToLocalDate(new Date(date)).toISOString();
  };

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
        createAt: formatTimestamp(new Date()),
        role: 0,
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

  const onSendAssignPerrmissionRequest = async (content: string) => {
    try {
      if (currentUser.id && permission) {
        const request = await requestsApi.sendRequest({
          workspaceId: Number(workspaceId),
          type: "adjust permission",
          senderId: currentUser.id,
          recipientId: currentUser.id,
          content: content,
          frPermission: permission,
          toPermission: toPermission,
        });
        if (request === "Duplicate request") {
          notify({
            title: "Error!",
            message:
              "Send request to workspace owner failed due to duplication!",
            type: "error",
          });
        } else if (request) {
          notify({
            title: "Success!",
            message: "Send request to workspace owner successfully!",
            type: "success",
          });
        }
      }
    } catch (err) {
      console.error(err);
      notify({
        title: "Error!",
        message: "Can not send request to workspace owner",
        type: "error",
      });
    } finally {
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
    if (searchLoading && workspaceId) {
      getAllProjects();
    }
  }, [isSearching, searchLoading, pagination.page, workspaceId]);

  // Open from editor can't get workspaceId and workspaceName
  useEffect(() => {
    if (workspaceId && workspaceName) {
      localStorage.setItem(
        "lastOpenedWorkspace",
        JSON.stringify({
          workspaceId: workspaceId,
          workspaceName: workspaceName,
        })
      );
    }
    if (!workspaceId || !workspaceName) {
      const { workspaceId, workspaceName } = JSON.parse(
        localStorage.getItem("lastOpenedWorkspace") as string
      );
      setWorkspaceId(workspaceId);
      setWorkspaceName(workspaceName);
    }
  }, []);

  return (
    <Container size="xl">
      <Group align="center" spacing={10}>
        <Title order={2}>{workspaceName}</Title>
        <Group spacing={5}>
          <Tooltip label="Workspace information">
            <ActionIcon>
              <IconInformation width={20} height={20} color="#111" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Workspace management">
            <ActionIcon
              display={currentUser.permission === "owner" ? "flex" : "none"}
              onClick={() => {
                window.open(
                  `/management/members/${workspaceName}/${workspaceId}`,
                  "_blank"
                );
              }}
            >
              <IconSetting width={20} height={20} color="#111" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Group position="apart" className={classes.searchGroup}>
        <ProjectsFormProvider form={form}>
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
            <ContextForm
              onCancel={onCancelSearchProjects}
              placeholder="Search projects name, etc."
            />
          </form>
        </ProjectsFormProvider>
        <Group>
          <Button variant="outline" onClick={() => navigate("/editor")}>
            Open Editor
          </Button>
          {permission && !["owner", "editor"].includes(permission) ? (
            <Button
              leftIcon={<IconPlus />}
              onClick={() => {
                setToPermission("editor");
                modalHandler("assignPermission", true);
              }}
            >
              Create New Project
            </Button>
          ) : (
            <CreateProjectButton
              workspaceId={Number(workspaceId)}
              onCreateProject={onCreateNewProject}
            />
          )}
        </Group>
      </Group>

      <Divider my="md" />
      <Accordion variant="contained" chevron className={classes.accordion}>
        <Accordion.Item value="header">
          <Accordion.Control
            children={<Header onQueryFilter={onQueryFilter} />}
          />
        </Accordion.Item>

        {currentUser?.name && permission && (
          <AssignPermissionModal
            frPermission={permission}
            toPermission={toPermission}
            userName={currentUser.name}
            onSendRequest={(content: string) =>
              onSendAssignPerrmissionRequest(content)
            }
            opened={open.assignPermission}
            title="Send request to adjust permission"
            onClose={() => modalHandler("assignPermission", false)}
          />
        )}

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
              action: ["owner", "editor"].includes(permission) && (
                <CreateProjectButton
                  workspaceId={Number(workspaceId)}
                  onCreateProject={onCreateNewProject}
                />
              ),
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
