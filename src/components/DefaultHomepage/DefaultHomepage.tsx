import { getCurrentUser, getModelers } from "@/redux/selectors";
import { pinnedWorkspaceActions, workspaceActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { Container, Group, Tabs, Title } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateWorkspaceButton from "../CreateWorkspaceButton";
import {
  WorkspacesFormProvider,
  useWorkspacesForm,
} from "../FormContext/WorkspacesForm";
import { useDefaultHomepageStyle } from "./DefaultHomepage.style";
import { Pinned, RecentlyOpened } from "./components";
import ContextForm from "./components/ContextForm/ContextForm";

const DefaultHomepage = () => {
  useDocumentTitle("Home | BPSky");

  const { classes } = useDefaultHomepageStyle();
  const dispatch = useAppDispatch();
  const modelers = useSelector(getModelers);
  const currentUser = useSelector(getCurrentUser);
  const [recentlyLoading, setRecentlyLoading] = useState<Boolean>(true);
  const [pinnedLoading, setPinnedLoading] = useState<Boolean>(true);
  const [searchLoading, setSearchLoading] = useState<Boolean>(true);
  const [isSearching, setIsSearching] = useState<Boolean>(false);

  const form = useWorkspacesForm({
    initialValues: {
      searchValue: "",
    },
  });
  const searchValue = form.values.searchValue;

  const onCancelSearchWorkspaces = () => {
    form.reset();
    setIsSearching(false);
    onReturnDefaultState();
  };

  const onReturnDefaultState = () => {
    setRecentlyLoading(true);
    setSearchLoading(true);
    setPinnedLoading(true);

    dispatch(workspaceActions.clearWorkspaces());
    dispatch(pinnedWorkspaceActions.clearPinnedWorkspaces());
  };

  useEffect(() => {
    if (modelers.length === 0) {
      localStorage.removeItem("modelers");
      localStorage.removeItem("currentOpenedModeler");
    }
  }, [modelers]);

  return (
    <Container size="xl">
      <Title order={2}>Welcome, {currentUser.name}!</Title>

      <Group position="apart" className={classes.searchGroup}>
        <WorkspacesFormProvider form={form}>
          <form
            onSubmit={form.onSubmit(() => {
              if (searchValue.length === 0) {
                onCancelSearchWorkspaces();
                return;
              }
              onReturnDefaultState();
              setIsSearching(true);
            })}
            className={classes.form}
          >
            <ContextForm
              onCancel={onCancelSearchWorkspaces}
              placeholder="Search workspace name, owner name, etc."
            />
          </form>
        </WorkspacesFormProvider>
        <CreateWorkspaceButton
          onCreateWorkspace={(workspace) => {
            dispatch(
              workspaceActions.setWorkspace({
                ...workspace,
                offset: -1,
                permission: "owner",
              })
            );
          }}
        />
      </Group>

      <Tabs className={classes.tabs} defaultValue="Recently opened">
        <Tabs.List>
          <Tabs.Tab value="Recently opened">Recently opened</Tabs.Tab>
          <Tabs.Tab value="Pinned">Pinned</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel
          value="Recently opened"
          children={
            <RecentlyOpened
              searchValue={searchValue}
              isSearching={isSearching}
              onSetIsSearching={(loading) => {
                setIsSearching(loading);
              }}
              loading={recentlyLoading}
              onSetLoading={(loading) => {
                setRecentlyLoading(loading);
              }}
              searchLoading={searchLoading}
              onSetSearchLoading={(loading) => {
                setSearchLoading(loading);
              }}
            />
          }
        />
        <Tabs.Panel
          value="Pinned"
          children={
            <Pinned
              searchValue={searchValue}
              isSearching={isSearching}
              onSetIsSearching={(loading) => {
                setIsSearching(loading);
              }}
              loading={pinnedLoading}
              onSetLoading={(loading) => {
                setPinnedLoading(loading);
              }}
              searchLoading={searchLoading}
              onSetSearchLoading={(loading) => {
                setSearchLoading(loading);
              }}
            />
          }
        />
      </Tabs>
    </Container>
  );
};

export default DefaultHomepage;
