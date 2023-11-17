import { requestsApi } from "@/api/index";
import { DeleteModal, RequestModal } from "@/components/Modal";
import useNotification from "@/hooks/useNotification";
import { IRequests } from "@/interfaces/index";
import { requestsActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { batch } from "react-redux";
import { useParams } from "react-router-dom";

interface IModalProps {
  selectedRow?: IRequests;
  selectedRecords: IRequests[];
  setSelectedRecords: React.Dispatch<React.SetStateAction<IRequests[]>>;
  open: {
    delete: boolean;
    request: boolean;
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
  const { workspaceId } = useParams();
  const notify = useNotification();
  const dispatch = useAppDispatch();
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

  return (
    <>
      {selectedRow && (
        <RequestModal
          opened={open.request}
          onClose={() => stateHandler({ modal: "request", state: false })}
          title="Request detail"
          request={selectedRow}
        />
      )}

      <DeleteModal
        title="Delete requests from workspace"
        message="Are you sure you want to delete selected requests from workspace?"
        opened={open.delete}
        onClose={() => stateHandler({ modal: "delete", state: false })}
        objectIdList={selectedRecords.map((record) => record.id)}
        onDelete={onDeleteSelectedMembers}
      />
    </>
  );
};

export default Modal;
