import { notificationApi } from "@/api/index";
import {
  NotificationFormProvider,
  useNotificationForm,
} from "@/components/FormContext/NotificationForm";
import useNotification from "@/hooks/useNotification";
import { INotification, IPagination, IQueryParams } from "@/interfaces/index";
import { getCurrentUser, getNotifications } from "@/redux/selectors";
import { notificationActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { Container, Group, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useNotificationStyle } from "./Notification.style";
import { ButtonGroup, ContextForm, Filter, Modal, Table } from "./components";
import { io } from "socket.io-client";

const Notification = () => {
  const notify = useNotification();
  const dispatch = useAppDispatch();
  const notifications = useSelector(getNotifications);
  const currentUser = useSelector(getCurrentUser);
  const { classes } = useNotificationStyle();

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelecterdRow] = useState<INotification>();
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IQueryParams>({});
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [selectedRecords, setSelectedRecords] = useState<INotification[]>([]);

  const initialModalState = {
    notification: false,
    delete: false,
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

  const notificationsMap = Object.values(notifications).sort(
    (a, b) => a.offset - b.offset
  );
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 10,
    total: 30,
  });
  const form = useNotificationForm({
    initialValues: {
      searchValue: "",
    },
  });
  const searchValue = form.values.searchValue;

  const onCancelSearchNotification = () => {
    form.reset();
    setIsSearching(false);
    onReturnDefaultState();
  };

  const onReturnDefaultState = () => {
    setLoading(true);
    setSearchLoading(true);

    dispatch(notificationActions.clearNotification());
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
    onReturnDefaultState();
  };

  const getUserNotification = async (queryFilter?: IQueryParams) => {
    try {
      const notifications = await notificationApi.getUserNotification({
        ...(queryFilter ? queryFilter : queryParams),
        keyword: searchValue,
        page: queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
      });
      setPagination({
        ...pagination,
        page: queryFilter || (searchValue && isSearching) ? 1 : pagination.page,
        total: notifications.total,
        limit: notifications.limit,
      });
      if (notifications) {
        batch(() => {
          notifications.data.map((notification: INotification, index: number) =>
            dispatch(
              notificationActions.setNotification({
                ...notification,
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
      setIsSearching(false);
      setSearchLoading(false);
    }
  };

  const onStarNotification = async ({
    status,
    id,
  }: {
    status: boolean;
    id: number;
  }) => {
    try {
      const result = await notificationApi.starNotification({
        id: id,
        status: status,
      });
      if (result) {
        dispatch(
          notificationActions.setNotification({
            ...result,
            offset: notificationsMap.find(
              (notification) => notification.id === id
            )?.offset,
          })
        );
        notify({
          type: "success",
          message: "Change status of selected Notification successfully",
          title: "Success",
        });
      }
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: "Something went wrong while star selected Notification",
        title: "Error",
      });
    }
  };

  const onQueryFilter = async (queryFilter: IQueryParams) => {
    try {
      setLoading(true);
      setQueryParams(queryFilter);
      dispatch(notificationActions.clearNotification());
      getUserNotification(queryFilter);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchLoading) {
      getUserNotification();
    }
  }, [isSearching, searchLoading, pagination.page]);

  const socket = io("https://bpe.onrender.com");
  useEffect(() => {
    if (currentUser && currentUser.id) {
      socket.on(`insertNewNotification_${currentUser?.id}`, (message) => {
        dispatch(
          notificationActions.setNotification({
            ...JSON.parse(message),
            offset: -1,
          })
        );
      });
    }
  }, [socket]);

  return (
    <Container size="xl">
      <Title order={1}>Notification</Title>
      <Group spacing={10} align="center" position="apart" mt={20}>
        <NotificationFormProvider form={form}>
          <form
            onSubmit={form.onSubmit(() => {
              if (searchValue.length === 0) {
                onCancelSearchNotification();
                return;
              }
              onReturnDefaultState();
              setIsSearching(true);
            })}
            className={classes.form}
          >
            <ContextForm
              onCancel={onCancelSearchNotification}
              placeholder="Search notification name, etc."
            />
          </form>
        </NotificationFormProvider>
        <Group spacing={10}>
          <ButtonGroup
            selectedRecords={selectedRecords}
            stateHandler={modalHandler}
          />
          <Filter onQueryFilter={onQueryFilter} />
        </Group>
      </Group>

      <Group my={20} position="apart">
        <Modal
          open={open}
          stateHandler={modalHandler}
          selectedRow={selectedRow}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
        />
      </Group>

      <Table
        selectedRecords={selectedRecords}
        setSelectedRecords={(selectedRecords: INotification[]) =>
          setSelectedRecords(selectedRecords)
        }
        rows={notificationsMap}
        isLoading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onChangeStatus={onStarNotification}
        onRowClick={(row: INotification) => {
          modalHandler({ modal: "notification", state: true });
          setSelecterdRow(row);
        }}
      />
    </Container>
  );
};

export default Notification;
