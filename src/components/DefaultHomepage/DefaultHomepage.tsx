import userApi from "@/api/user";
import workspaceApi from "@/api/workspace";
import { IWorkspace } from "@/interfaces/workspaces";
import {
  getCurrentUser,
  getModelers,
  getPinnedWorkspace,
  getWorkspace,
} from "@/redux/selectors";
import {
  pinnedWorkspaceActions,
  userActions,
  workspaceActions,
} from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import {
  Accordion,
  Button,
  Container,
  Group,
  Skeleton,
  Tabs,
  Title,
} from "@mantine/core";
import { createFormContext } from "@mantine/form";
import { useDocumentTitle } from "@mantine/hooks";
import { ReactComponent as IconPlus } from "@tabler/icons/icons/plus.svg";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import CreateWorkspaceButton from "../CreateWorkspaceButton";
import { EmptyRender } from "../EmptyRender";
import { SearchInput } from "../SearchInput";
import { WorkspaceItem } from "../WorkspaceItem";
import { useDefaultHomepageStyle } from "./DefaultHomepage.style";

export interface TSearchInput {
  searchInput: string;
}

export const [FormProvider, useFormContext, useForm] =
  createFormContext<TSearchInput>();

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

  const getUser = async () => {
    try {
      const res = await userApi.getMe();
      if (res) {
        dispatch(userActions.setUser(res));
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  // Bắt giá trị của searchInput
  const form = useForm({
    initialValues: {
      searchInput: "",
    },
  });
  const searchValue = form.values.searchInput;

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
      {/* Welcome user */}
      <Group position="apart">
        <Title>Welcome, {currentUser.name}!</Title>
      </Group>

      {/* Search input & Button create workspace */}
      <Group position="apart" className={classes.searchGroup}>
        <FormProvider form={form}>
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
            <SearchInput onCancel={onCancelSearchWorkspaces} />
          </form>
        </FormProvider>

        {/* Create new workspace */}
        <CreateWorkspaceButton onCreateWorkspace={onCreateNewWorkspace} />
      </Group>

      {isSearching ? (
        <>
          {/* Search result */}
          {searchLoading ? (
            <Skeleton height={50} mt={10} />
          ) : workspacesMap.length === 0 ? (
            EmptyRender({
              text: "No results found!",
            })
          ) : (
            <Accordion
              variant="contained"
              chevron
              className={classes.accordion}
            >
              {workspacesMap.map((workspace, index) => (
                <WorkspaceItem {...workspace} key={index} />
              ))}
            </Accordion>
          )}
        </>
      ) : (
        <>
          <Tabs className={classes.tabs} defaultValue="Recently opened">
            {/* Tabs list */}
            <Tabs.List>
              <Tabs.Tab value="Recently opened">Recently opened</Tabs.Tab>
              <Tabs.Tab value="Pinned">Pinned</Tabs.Tab>
            </Tabs.List>

            {/* Tabs panel for recently opened */}
            <Tabs.Panel value="Recently opened">
              {loading ? (
                <Skeleton height={50} mt={10} />
              ) : workspacesMap.length === 0 ? (
                EmptyRender({
                  text: "You don't have any projects yet! You can start right now by creating a new project.",
                  action: (
                    <Button
                      leftIcon={
                        <IconPlus
                          className={classes.buttonIcon}
                          onClick={() => {}}
                        />
                      }
                    >
                      New workspace
                    </Button>
                  ),
                })
              ) : (
                <Accordion
                  variant="contained"
                  chevron
                  className={classes.accordion}
                >
                  {workspacesMap.map((workspace, index) => (
                    <WorkspaceItem {...workspace} key={index} />
                  ))}
                </Accordion>
              )}
            </Tabs.Panel>

            {/* Tab panel for Pinned */}
            <Tabs.Panel value="Pinned">
              {pinnedLoading ? (
                <Skeleton height={50} mt={10} />
              ) : pinnedWorkspacesMap.length === 0 ? (
                EmptyRender({
                  text: "You don't have any pinned projects yet!",
                })
              ) : (
                <Accordion
                  variant="contained"
                  chevron
                  className={classes.accordion}
                >
                  {pinnedWorkspacesMap.map((workspace, index) => (
                    <WorkspaceItem {...workspace} key={index} />
                  ))}
                </Accordion>
              )}
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </Container>
  );
};

export default DefaultHomepage;
