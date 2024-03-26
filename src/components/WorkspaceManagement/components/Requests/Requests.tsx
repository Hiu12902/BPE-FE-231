import { requestsApi } from "@/api/index";
import {
  RequestsFormProvider,
  useRequestsForm,
} from "@/components/FormContext/RequestsForm";
import useNotification from "@/hooks/useNotification";
import { IPagination, IQueryParams, IRequests } from "@/interfaces/index";
import { getWorkspaceRequests } from "@/redux/selectors";
import { requestsActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { Container, Group, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useRequestsStyle } from "./Requests.style";
import { ButtonGroup, ContextForm, Filter, Modal, Table } from "./components";

const Requests = () => {
  const notify = useNotification();
  const dispatch = useAppDispatch();
  const { classes } = useRequestsStyle();
  const socket = io("https://bpe.onrender.com");
  const requests = useSelector(getWorkspaceRequests);
  const { workspaceId } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelecterdRow] = useState<IRequests>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IQueryParams>({});
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [selectedRecords, setSelectedRecords] = useState<IRequests[]>([]);

  const initialModalState = {
    delete: false,
    request: false,
  };
  const [open, setOpen] = useState(initialModalState);
  const modalHandler = ({
    modal,
    state,
  }: {
    modal: string;
    state: boolean;
  }) => {
    setOpen({
      ...initialModalState,
      [modal]: state,
    });
  };

  const requestsMap = Object.values(requests).sort(
    (a, b) => a.offset - b.offset
  );
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 10,
    total: 30,
  });
  const form = useRequestsForm({
    initialValues: {
      searchValue: "",
    },
  });
  const searchValue = form.values.searchValue;

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
      if (requests && requests.data) {
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

  const onChangeSelectedRequestsStatus = async ({
    status,
    requestId,
  }: {
    status: string;
    requestId?: number;
  }) => {
    try {
      if (status && workspaceId && (selectedRecords.length > 0 || requestId)) {
        const result =
          status === "approved"
            ? await requestsApi.approveRequests({
                workspaceId: workspaceId.toString(),
                requestIdList: requestId
                  ? [requestId.toString()]
                  : selectedRecords.map((record) => record.id.toString()),
              })
            : await requestsApi.declineRequests({
                workspaceId: workspaceId.toString(),
                requestIdList: requestId
                  ? [requestId.toString()]
                  : selectedRecords.map((record) => record.id.toString()),
              });
        if (result) {
          result.map((item: IRequests, index: number) => {
            dispatch(
              requestsActions.setRequests({
                ...item,
                offset: -1 - index,
              })
            );
          });
          notify({
            type: "success",
            message: "Selected Requests have been changed status successfully",
            title: "Success",
          });
        }
      } else {
        notify({
          type: "error",
          message: "Please select status for selected Requests",
          title: "Error",
        });
      }
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message:
          "Something went wrong while changing status of selected Requests",
        title: "Error",
      });
    } finally {
      setSelectedRecords([]);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected");
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    socket.on("message", (message) => {
      console.log(message);
    });
    socket.on("insertNewRequest", (message) => {
      dispatch(
        requestsActions.setRequests({
          ...JSON.parse(message),
          offset: -1,
        })
      );
    });
  }, [socket]);

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
            <ContextForm
              onCancel={onCancelSearchRequests}
              placeholder="Search requests name, etc."
            />
          </form>
        </RequestsFormProvider>
      </Group>

      <Group my={20} position="apart" h={35}>
        <Modal
          open={open}
          stateHandler={modalHandler}
          selectedRow={selectedRow}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
        />
        <ButtonGroup
          selectedRecords={selectedRecords}
          onChangeSelectedRequestsStatus={onChangeSelectedRequestsStatus}
          stateHandler={modalHandler}
        />
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
          modalHandler({ modal: "request", state: true });
          setSelecterdRow(row);
        }}
      />
    </Container>
  );
};

export default Requests;
