import userApi from "@/api/user";
import workspaceApi from "@/api/workspace";
import { IRecentlyWorkspace, IWorkspace } from "@/interfaces/workspaces";
import { getCurrentUser, getModelers, getWorkspace } from "@/redux/selectors";
import { userActions, workspaceActions } from "@/redux/slices";
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
import { EmptyRender } from "../EmptyRender";
import { SearchInput } from "../SearchInput";
import { WorkspaceItem } from "../WorkspaceItem";
import { useDefaultHomepageStyle } from "./DefaultHomepage.style";
import CreateWorkspaceButton from "../CreateWorkspaceButton";

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
  const workspaces = useSelector(getWorkspace);
  const workspacesMap = Object.keys(workspaces).map(function (key) {
    return workspaces[parseInt(key)];
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

  const onCreateNewWorkspace = (workspace: IRecentlyWorkspace) => {
    dispatch(workspaceActions.setWorkspace(workspace));
  };

  // Bắt giá trị của searchInput
  const form = useForm({
    initialValues: {
      searchInput: "",
    },
  });

  const searchValue = form.values;

  useEffect(() => {
    getUser();
    getAllWorkspaces();
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
              console.log("Submit form");
            })}
            className={classes.form}
          >
            <SearchInput />
          </form>
        </FormProvider>

        {/* Create new workspace */}
        <CreateWorkspaceButton onCreateWorkspace={onCreateNewWorkspace} />
      </Group>

      {/* Tabs */}
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
          {workspacesMap.length === 0 ? (
            EmptyRender({
              text: "You don't have any pinned projects yet!",
            })
          ) : (
            <Accordion
              variant="contained"
              chevron
              className={classes.accordion}
            >
              {workspacesMap
                // .filter((workspace) => workspace.isPinned === true)
                .map((workspace, index) => (
                  <WorkspaceItem {...workspace} key={index} />
                ))}
            </Accordion>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default DefaultHomepage;
