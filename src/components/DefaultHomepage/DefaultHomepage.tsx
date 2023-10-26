import workspaceApi from "@/api/workspace";
import { IWorkspace } from "@/interfaces/workspaces";
import {
  getCurrentUser,
  getModelers,
  getPinnedWorkspace,
  getWorkspace,
} from "@/redux/selectors";
import { pinnedWorkspaceActions, workspaceActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  Container,
  Flex,
  Grid,
  Group,
  Skeleton,
  Tabs,
  Title,
} from "@mantine/core";
import { createFormContext } from "@mantine/form";
import { useDocumentTitle } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import CreateWorkspaceButton from "../CreateWorkspaceButton";
import { EmptyRender } from "../EmptyRender";
import { IEmptyRender } from "../EmptyRender/EmptyRender";
import { SearchInput } from "../SearchInput";
import { WorkspaceItem } from "../WorkspaceItem";
import { useDefaultHomepageStyle } from "./DefaultHomepage.style";

export interface ISearchValue {
  searchValue: string;
}

export const [WorkspaceFormProvider, useWorkspaceFormContext, useForm] =
  createFormContext<ISearchValue>();

const DefaultHomepage = () => {
  useDocumentTitle("Home | BPSky");

  const { classes } = useDefaultHomepageStyle();
  const dispatch = useAppDispatch();
  const modelers = useSelector(getModelers);
  const currentUser = useSelector(getCurrentUser);
  const [loading, setLoading] = useState<Boolean>(true);
  const [pinnedLoading, setPinnedLoading] = useState<Boolean>(true);
  const [searchLoading, setSearchLoading] = useState<Boolean>(true);
  const [isSearching, setIsSearching] = useState<Boolean>(false);
  const workspaces = useSelector(getWorkspace);
  const pinnedWorkspaces = useSelector(getPinnedWorkspace);
  const workspacesMap = Object.keys(workspaces).map(function (key) {
    return workspaces[parseInt(key)];
  });
  const pinnedWorkspacesMap = Object.keys(pinnedWorkspaces).map(function (key) {
    return pinnedWorkspaces[parseInt(key)];
  });

  const getAllWorkspaces = async () => {
    try {
      const workspaces = await workspaceApi.getAllWorkspaces();
      if (workspaces) {
        batch(() => {
          workspaces.map((workspace: IWorkspace) =>
            dispatch(workspaceActions.setWorkspace(workspace))
          );
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllPinnedWorkspaces = async () => {
    try {
      const pinnedWorkspaces = await workspaceApi.getPinnedWorkspaces();
      if (pinnedWorkspaces) {
        batch(() => {
          pinnedWorkspaces.map((pinnedWorkspace: IWorkspace) =>
            dispatch(pinnedWorkspaceActions.pinWorkspace(pinnedWorkspace))
          );
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPinnedLoading(false);
    }
  };

  const onCreateNewWorkspace = (workspace: IWorkspace) => {
    dispatch(workspaceActions.setWorkspace(workspace));
  };

  const form = useForm({
    initialValues: {
      searchValue: "",
    },
  });
  const searchValue = form.values.searchValue;
  const searchWorkspaces = async () => {
    setSearchLoading(true);
    try {
      const searchResult = await workspaceApi.searchWorkspace(searchValue);
      if (searchResult) {
        batch(() => {
          searchResult.map((workspace: IWorkspace) =>
            dispatch(workspaceActions.setWorkspace(workspace))
          );
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const onCancelSearchWorkspaces = () => {
    form.reset();
    setLoading(true);
    setIsSearching(false);
    setSearchLoading(true);
    setPinnedLoading(true);

    dispatch(workspaceActions.clearWorkspaces());
    getAllWorkspaces();
    getAllPinnedWorkspaces();
  };

  const WorkspaceListRender = ({
    workspaces,
    loading,
    emptyRender,
  }: {
    workspaces: IWorkspace[];
    loading: Boolean;
    emptyRender: IEmptyRender;
  }) => {
    return (
      <>
        {loading ? (
          <Skeleton height={50} mt={10} />
        ) : workspaces.length === 0 ? (
          EmptyRender(emptyRender)
        ) : (
          <Accordion variant="contained" chevron className={classes.accordion}>
            <Accordion.Item value="recentlyOpened">
              <Accordion.Control value="recentlyOpened">
                <Grid justify="center">
                  <Grid.Col span={3}>
                    <Flex justify="flex-start">Workspace Name</Flex>
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
            {workspaces.map((workspace, index) => (
              <WorkspaceItem {...workspace} key={index} />
            ))}
          </Accordion>
        )}
      </>
    );
  };

  useEffect(() => {
    getAllWorkspaces();
    getAllPinnedWorkspaces();
    if (modelers.length === 0) {
      localStorage.removeItem("modelers");
      localStorage.removeItem("currentOpenedModeler");
    }
  }, [modelers]);

  return (
    <Container size="xl">
      <Title order={2}>Welcome, {currentUser.name}!</Title>

      {/* Search input & Button create workspace */}
      <Group position="apart" className={classes.searchGroup}>
        <WorkspaceFormProvider form={form}>
          <form
            onSubmit={form.onSubmit(() => {
              if (searchValue.length === 0) {
                onCancelSearchWorkspaces();
                return;
              }
              setIsSearching(true);
              dispatch(workspaceActions.clearWorkspaces());
              searchWorkspaces();
            })}
            className={classes.form}
          >
            <SearchInput
              onCancel={onCancelSearchWorkspaces}
              placeholder="Search workspace name, owner name, etc."
              context="workspace"
            />
          </form>
        </WorkspaceFormProvider>
        <CreateWorkspaceButton onCreateWorkspace={onCreateNewWorkspace} />
      </Group>

      {/* Search result */}
      {isSearching ? (
        <WorkspaceListRender
          workspaces={workspacesMap}
          loading={searchLoading}
          emptyRender={{
            text: "No results found!",
          }}
        />
      ) : (
        <Tabs className={classes.tabs} defaultValue="Recently opened">
          <Tabs.List>
            <Tabs.Tab value="Recently opened">Recently opened</Tabs.Tab>
            <Tabs.Tab value="Pinned">Pinned</Tabs.Tab>
          </Tabs.List>

          {/* Tabs panel for recently opened */}
          <Tabs.Panel value="Recently opened">
            <WorkspaceListRender
              workspaces={workspacesMap}
              loading={loading}
              emptyRender={{
                text: "You don't have any projects yet! You can start right now by creating a new project.",
                action: (
                  <CreateWorkspaceButton
                    onCreateWorkspace={onCreateNewWorkspace}
                  />
                ),
              }}
            />
          </Tabs.Panel>

          {/* Tab panel for Pinned */}
          <Tabs.Panel value="Pinned">
            <WorkspaceListRender
              workspaces={pinnedWorkspacesMap}
              loading={pinnedLoading}
              emptyRender={{
                text: "You don't have any pinned workspaces yet! You can start right now by pinning a workspace.",
              }}
            />
          </Tabs.Panel>
        </Tabs>
      )}
    </Container>
  );
};

export default DefaultHomepage;
