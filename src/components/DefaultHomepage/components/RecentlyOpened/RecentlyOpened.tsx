import workspaceApi from "@/api/workspace";
import CreateWorkspaceButton from "@/components/CreateWorkspaceButton";
import EmptyRender from "@/components/EmptyRender/EmptyRender";
import { IPagination, IQueryParams, IWorkspace } from "@/interfaces/index";
import { getWorkspace } from "@/redux/selectors";
import { workspaceActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { Accordion, Pagination, Skeleton, rem } from "@mantine/core";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { List } from "./components";
import { Header } from "./components/Header";

const RecentlyOpened = ({
  searchValue,
  isSearching,
  onSetIsSearching,
  loading,
  onSetLoading,
  searchLoading,
  onSetSearchLoading,
}: {
  searchValue?: string;
  isSearching?: Boolean;
  onSetIsSearching: (loading: Boolean) => void;
  loading: Boolean;
  onSetLoading: (loading: Boolean) => void;
  searchLoading: Boolean;
  onSetSearchLoading: (loading: Boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const workspaces = useSelector(getWorkspace);
  const workspacesMap = Object.values(workspaces).sort(
    (a, b) => a.offset - b.offset
  );
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    total: 0,
    limit: 10,
  });
  const [queryParams, setQueryParams] = useState<IQueryParams>({});

  const emptyRender = EmptyRender(
    isSearching
      ? {
          text: "No results found!",
        }
      : {
          text: "You don't have any workspaces yet! You can start right now by creating a new workspace.",
          action: (
            <CreateWorkspaceButton
              onCreateWorkspace={(workspace) => {
                dispatch(workspaceActions.setWorkspace(workspace));
              }}
            />
          ),
        }
  );

  const onReturnDefaultState = () => {
    onSetLoading(true);
    onSetSearchLoading(true);

    dispatch(workspaceActions.clearWorkspaces());
  };

  const handlePageChange = (value: number) => {
    setPagination({ ...pagination, page: value });
    onReturnDefaultState();
  };

  const getAllWorkspaces = async (queryFilter?: IQueryParams) => {
    try {
      const workspaces = await workspaceApi.getAllWorkspaces({
        ...(queryFilter ? queryFilter : queryParams),
        keyword: searchValue,
        page: queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
      });
      if (workspaces) {
        setPagination({
          ...pagination,
          page:
            queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
          total: workspaces.total,
          limit: workspaces.limit,
        });
        batch(() => {
          workspaces.data.map((workspace: IWorkspace, index: number) =>
            dispatch(
              workspaceActions.setWorkspace({
                ...workspace,
                offset: index,
              })
            )
          );
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      onSetLoading(false);
      onSetSearchLoading(false);
      onSetIsSearching(false);
    }
  };

  const onQueryFilter = async (queryFilter: IQueryParams) => {
    try {
      onSetLoading(true);
      setQueryParams(queryFilter);
      dispatch(workspaceActions.clearWorkspaces());
      getAllWorkspaces(queryFilter);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (searchLoading) {
      getAllWorkspaces();
    }
  }, [isSearching, searchLoading, pagination.page]);

  return (
    <>
      <Accordion
        variant="contained"
        styles={{
          chevron: {
            display: "none",
          },
        }}
        mt={rem(20)}
      >
        <Accordion.Item value="recentlyOpened">
          <Accordion.Control
            children={<Header onQueryFilter={onQueryFilter} />}
          />
        </Accordion.Item>

        {loading || searchLoading ? (
          <Skeleton height={50} />
        ) : workspacesMap.length === 0 ? (
          emptyRender
        ) : (
          <>
            <List workspaces={workspacesMap} />
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
          </>
        )}
      </Accordion>
    </>
  );
};

export default RecentlyOpened;
