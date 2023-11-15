import { requestsApi } from "@/api/index";
import { DeleteModal, RequestModal } from "@/components/Modal";
import { SearchInput } from "@/components/SearchInput";
import useNotification from "@/hooks/useNotification";
import { IPagination, IQueryParams, IRequests } from "@/interfaces/index";
import { getCurrentUser, getWorkspaceRequests } from "@/redux/selectors";
import { requestsActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { Box, Button, Container, Group, Title } from "@mantine/core";
import { createFormContext } from "@mantine/form";
import { ReactComponent as IconDelete } from "@tabler/icons/icons/trash.svg";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRequestsStyle } from "./Requests.style";
import { Filter, Table } from "./components";
interface ISearchValue {
  searchValue: string;
}

interface IAssignPermissions {
  [id: number]: string;
}

export const [RequestsFormProvider, useRequestsFormContext, useForm] =
  createFormContext<ISearchValue>();

const Requests = () => {
  const dispatch = useAppDispatch();
  const notify = useNotification();
  const { workspaceId, workspaceName } = useParams();
  const { classes } = useRequestsStyle();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectionStatus, setSelectionStatus] = useState<string>("");
  const [selectedRecords, setSelectedRecords] = useState<IRequests[]>([]);
  const [openRequestModal, setOpenRequestModal] = useState<boolean>(false);
  const [selectedRow, setSelecterdRow] = useState<IRequests>();

  const requests = useSelector(getWorkspaceRequests);
  const requestsMap = Object.values(requests).sort(
    (a, b) => a.offset - b.offset
  );

  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 10,
    total: 30,
  });
  const [queryParams, setQueryParams] = useState<IQueryParams>({});

  const form = useForm({
    initialValues: {
      searchValue: "",
    },
  });
  const searchValue = form.values.searchValue;

  // const currentUser = useSelector(getCurrentUser);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (
  //     currentUser.permission !== undefined &&
  //     currentUser.permission !== "owner"
  //   )
  //     navigate(`/404`);
  // }, [currentUser]);

  const onCancelSearchRequests = () => {
    form.reset();
    setIsSearching(false);
    onReturnDefaultState();
  };

  const onReturnDefaultState = () => {
    setLoading(true);
    setSearchLoading(true);

    dispatch(requestsActions.clearRequests());
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
    onReturnDefaultState();
  };

  const getAllWorkspaceRequests = async (queryFilter?: IQueryParams) => {
    try {
      const requests = await requestsApi.getAllWorkspaceRequests(
        Number(workspaceId),
        {
          ...(queryFilter ? queryFilter : queryParams),
          keyword: searchValue,
          page:
            queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
        }
      );
      setPagination({
        ...pagination,
        page: queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
        total: requests.total,
        limit: requests.limit,
      });
      if (requests) {
        batch(() => {
          requests.data.map((member: IRequests, index: number) =>
            dispatch(
              requestsActions.setRequests({
                ...member,
                offset: index,
              })
            )
          );
        });
      }
    } catch (error) {
      console.log(error);
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
      dispatch(requestsActions.clearRequests());
      getAllWorkspaceRequests(queryFilter);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSelectedRequestsStatus = () => {
    // async ({
    //   status,
    //   requestId,
    // }: {
    //   status: string;
    //   requestId?: number;
    // }) => {
    //   try {
    //     if (status && workspaceId && (selectedRecords.length > 0 || requestId)) {
    //       if (status === "approve") {
    //         const result =
    //           status === "approve"
    //             ? await requestsApi.approveRequests({
    //                 workspaceId: workspaceId.toString(),
    //                 status: status,
    //                 requestId: selectedRecords.map((record) =>
    //                   record.id.toString()
    //                 ),
    //               })
    //             : await requestsApi.declineRequests({
    //                 workspaceId: workspaceId.toString(),
    //                 status: status,
    //                 requestId: selectedRecords.map((record) =>
    //                   record.id.toString()
    //                 ),
    //               });
    //         if (result) {
    //           result.map((item: IRequests, index: number) => {
    //             dispatch(
    //               requestsActions.setRequests({
    //                 ...item,
    //                 offset: -1 - index,
    //               })
    //             );
    //           });
    //           notify({
    //             type: "success",
    //             message:
    //               "Selected Requests have been changed status successfully",
    //             title: "Success",
    //           });
    //         }
    //       }
    //     } else {
    //       notify({
    //         type: "error",
    //         message: "Please select status for selected Requests",
    //         title: "Error",
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     notify({
    //       type: "error",
    //       message:
    //         "Something went wrong while changing status of selected Requests",
    //       title: "Error",
    //     });
    //   } finally {
    //     setSelectedRecords([]);
    //   }
  };

  const onOpenRequestModal = (row: IRequests) => {
    setOpenRequestModal(true);
    setSelecterdRow(row);
  };

  const onDeleteSelectedMembers = async (id?: number, idList?: number[]) => {
    try {
      if ((id || idList) && workspaceId) {
        const result = await requestsApi.deleteRequests({
          workspaceId: workspaceId.toString(),
          requestIdList: idList
            ? idList.map((id) => id.toString())
            : id
            ? [id.toString()]
            : [],
        });
        if (result) {
          if (id) {
            dispatch(
              requestsActions.deleteRequests({
                id: id,
              })
            );
          } else if (idList) {
            batch(() => {
              idList.map((id) =>
                dispatch(
                  requestsActions.deleteRequests({
                    id: id,
                  })
                )
              );
            });
          }
          notify({
            type: "success",
            message: "Members deleted successfully",
            title: "Success",
          });
        }
      }
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: "Something went wrong while deleting selected members",
        title: "Error",
      });
    } finally {
      setSelectedRecords([]);
    }
  };

  useEffect(() => {
    if (searchLoading) {
      getAllWorkspaceRequests();
    }
  }, [isSearching, searchLoading, pagination.page]);

  return (
    <Container size="xl">
      <Title order={1}>Requests management</Title>
      <Group spacing={10} align="center" position="apart" mt={20}>
        <RequestsFormProvider form={form}>
          <form
            onSubmit={form.onSubmit(() => {
              if (searchValue.length === 0) {
                onCancelSearchRequests();
                return;
              }
              onReturnDefaultState();
              setIsSearching(true);
            })}
            className={classes.form}
          >
            <SearchInput
              onCancel={onCancelSearchRequests}
              placeholder="Search Requests by name, etc."
              context="requests"
            />
          </form>
        </RequestsFormProvider>
      </Group>

      <Group my={20} position="apart" h={35}>
        {selectedRow && (
          <RequestModal
            opened={openRequestModal}
            onClose={() => setOpenRequestModal(false)}
            title="Request detail"
            request={selectedRow}
          />
        )}

        <DeleteModal
          title="Delete requests from workspace"
          message="Are you sure you want to delete selected requests from workspace?"
          opened={openDeleteModal as boolean}
          onClose={() => setOpenDeleteModal(false)}
          objectIdList={selectedRecords.map((record) => record.id)}
          onDelete={onDeleteSelectedMembers}
        />
        <Group>
          <Box
            display={selectedRecords?.length === 0 ? "none" : "flex"}
            sx={{
              gap: 10,
            }}
          >
            <Button
              w={100}
              color="teal"
              variant="outline"
              children="Approve"
              // onClick={
              //   () =>
              //   onChangeSelectedRequestsStatus({
              //     status: "approve",
              //   })
              // }
            />
            <Button
              w={100}
              color="red"
              variant="outline"
              children="Decline"
              // onClick={
              //   () =>
              //   onChangeSelectedRequestsStatus({
              //     status: "decline",
              //   })
              // }
            />
            <Button
              leftIcon={<IconDelete className={classes.buttonIcon} />}
              onClick={() => setOpenDeleteModal(true)}
              color="red"
              variant="outline"
              display={selectedRecords?.length === 0 ? "none" : "flex"}
              children="Delete"
            />
          </Box>
        </Group>
        <Filter onQueryFilter={onQueryFilter} />
      </Group>

      <Table
        selectedRecords={selectedRecords}
        setSelectedRecords={(selectedRecords: IRequests[]) =>
          setSelectedRecords(selectedRecords)
        }
        rows={requestsMap}
        isLoading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onChangeStatus={onChangeSelectedRequestsStatus}
        onRowClick={(row: IRequests) => {
          onOpenRequestModal(row);
        }}
      />
    </Container>
  );
};

export default Requests;
