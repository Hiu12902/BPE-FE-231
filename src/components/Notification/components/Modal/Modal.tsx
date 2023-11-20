import { notificationApi } from "@/api/index";
import { DeleteModal, NotificationModal } from "@/components/Modal";
import useNotification from "@/hooks/useNotification";
import { INotification } from "@/interfaces/index";
import { getNotifications } from "@/redux/selectors";
import { notificationActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { batch, useSelector } from "react-redux";

interface IModalProps {
  selectedRow?: INotification;
  selectedRecords: INotification[];
  setSelectedRecords: React.Dispatch<React.SetStateAction<INotification[]>>;
  open: {
    delete: boolean;
    notification: boolean;
  };
  stateHandler: ({ modal, state }: { modal: string; state: boolean }) => void;
}

const Modal = (props: IModalProps) => {
  const {
    open,
    stateHandler,
    selectedRow,
    selectedRecords,
    setSelectedRecords,
  } = props;
  const notify = useNotification();
  const dispatch = useAppDispatch();
  const notifications = useSelector(getNotifications);
  const notificationsMap = Object.values(notifications).sort(
    (a, b) => a.offset - b.offset
  );
  const onReadNotification = async (id: number) => {
    try {
      const result = await notificationApi.readNotification({
        id: id.toString(),
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
      }
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: "Something went wrong while reading notification",
        title: "Error",
      });
    }
  };
  const onDeleteSelectedNotifications = async (
    id?: number,
    idList?: number[]
  ) => {
    try {
      if (idList) {
        const result = await notificationApi.deleteNotification({
          idList: idList ? idList.map((id) => id.toString()) : [],
        });
        if (result) {
          batch(() => {
            idList.map((id) =>
              dispatch(
                notificationActions.deleteNotification({
                  id: id,
                })
              )
            );
          });
          notify({
            type: "success",
            message: "Notifications deleted successfully",
            title: "Success",
          });
        }
      }
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: "Something went wrong while deleting selected Notifications",
        title: "Error",
      });
    } finally {
      setSelectedRecords([]);
    }
  };
  useEffect(() => {
    if (open.notification && selectedRow?.isRead === false) {
      onReadNotification(selectedRow?.id as number);
    }
  }, [open.notification]);

  return (
    <>
      {selectedRow && (
        <NotificationModal
          title="Notification detail"
          opened={open.notification}
          notification={selectedRow}
          onResponseInvitation={(result: INotification) => {
            dispatch(
              notificationActions.setNotification({
                ...result,
                offset: notificationsMap.find(
                  (notification) => notification.id === result.id
                )?.offset as number,
              })
            );
          }}
          onClose={() => stateHandler({ modal: "notification", state: false })}
        />
      )}

      <DeleteModal
        title="Delete notifications"
        message="Are you sure you want to delete selected notifications?"
        opened={open.delete}
        onClose={() => stateHandler({ modal: "delete", state: false })}
        objectIdList={selectedRecords.map((record) => record.id)}
        onDelete={onDeleteSelectedNotifications}
      />
    </>
  );
};

export default Modal;
