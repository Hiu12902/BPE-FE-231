import workspaceApi from "@/api/workspace";
import EmptyRender from "@/components/EmptyRender/EmptyRender";
import { IPagination, IQueryParams, IWorkspace } from "@/interfaces/index";
import { getPinnedWorkspace } from "@/redux/selectors";
import { pinnedWorkspaceActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { Accordion, Pagination, Skeleton, rem } from "@mantine/core";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { List } from "./components";
import { Header } from "./components/Header";

const Pinned = ({
  searchValue,
  isSearching,
  loading,
  onSetLoading,
  searchLoading,
  onSetSearchLoading,
}: {
  searchValue?: string;
  isSearching?: Boolean;
  loading: Boolean;
  onSetLoading: (loading: Boolean) => void;
  searchLoading: Boolean;
  onSetSearchLoading: (loading: Boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const pinnedWorkspaces = useSelector(getPinnedWorkspace);
  const pinnedWorkspacesMap = Object.values(pinnedWorkspaces).sort(
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
          text: "You don't have any pinned workspaces yet! You can start right now by pinning a workspace.",
        }
  );

  const onReturnDefaultState = () => {
    onSetLoading(true);
    onSetSearchLoading(true);

    dispatch(pinnedWorkspaceActions.clearPinnedWorkspaces());
  };

  const handlePageChange = (value: number) => {
    setPagination({ ...pagination, page: value });
    onReturnDefaultState();
  };

  const getAllPinnedWorkspaces = async (queryFilter?: IQueryParams) => {
    try {
      const pinnedWorkspaces = await workspaceApi.getAllWorkspaces({
        ...(queryFilter ? queryFilter : queryParams),
        keyword: searchValue,
        page: queryFilter || searchValue ? 1 : pagination.page,
        pinned: "true",
      });
      if (pinnedWorkspaces) {
        setPagination({
          ...pagination,
          page: queryFilter || searchValue ? 1 : pagination.page,
          total: pinnedWorkspaces.total,
          limit: pinnedWorkspaces.limit,
        });
        batch(() => {
          pinnedWorkspaces.data.map(
            (pinnedWorkspace: IWorkspace, index: number) =>
              dispatch(
                pinnedWorkspaceActions.pinWorkspace({
                  ...pinnedWorkspace,
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
    }
  };

  const onQueryFilter = async (queryFilter: IQueryParams) => {
    try {
      setQueryParams(queryFilter);
      onReturnDefaultState();
      getAllPinnedWorkspaces(queryFilter);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (searchLoading) {
      getAllPinnedWorkspaces();
    }
  }, [isSearching, searchLoading, pagination.page]);

  return (
    <>
      <Accordion variant="contained" chevron mt={rem(20)}>
        <Accordion.Item value="pinned">
          <Accordion.Control
            children={<Header onQueryFilter={onQueryFilter} />}
          />
        </Accordion.Item>

        {loading || searchLoading ? (
          <Skeleton height={50} />
        ) : pinnedWorkspacesMap.length === 0 ? (
          emptyRender
        ) : (
          <List workspaces={pinnedWorkspacesMap} />
        )}

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
      </Accordion>
    </>
  );
};

export default Pinned;
