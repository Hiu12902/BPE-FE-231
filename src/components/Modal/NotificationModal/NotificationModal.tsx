import useUTC from "@/hooks/useUTC";
import { INotification } from "@/interfaces/workspaces";
import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  ModalProps,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ButtonGroup } from "./components";
import useNotification from "@/hooks/useNotification";
import { notificationApi } from "@/api/index";

interface INotificationModal extends ModalProps {
  notification: INotification;
  onResponseInvitation: (result: INotification) => void;
}

const NotificationModal = ({
  opened,
  onClose,
  title,
  notification,
  onResponseInvitation,
}: INotificationModal) => {
  const convertUTC = useUTC();
  const notify = useNotification();
  const handleCancel = () => {
    onClose?.();
  };
  const onChangeStatusNotification = async (status: string) => {
    try {
      const { id, workspaceId, userId, permission } = notification;
      if (permission && workspaceId) {
        const result = await notificationApi.responseInvitation({
          id: id.toString(),
          status: status,
          workspaceId: workspaceId.toString(),
          userId: userId.toString(),
          permission: permission,
        });
        if (result) {
          onResponseInvitation?.(result);
          notify({
            type: "success",
            message: "Change status invitation successfully",
            title: "Success",
          });
          onClose?.();
        }
      }
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: "Something went wrong while changing status invitation",
        title: "Error",
      });
    }
  };

  return (
    <Modal
      centered
      opened={opened}
      onClose={handleCancel}
      title={
        <Badge size="lg" mb={5}>
          {title}
        </Badge>
      }
      styles={{
        header: {
          paddingTop: "30px",
          paddingX: "30px",
        },
        body: {
          padding: "25px 30px",
        },
        close: {
          display: " none",
        },
      }}
    >
      <Stack justify="center" align="around">
        <Stack spacing={5}>
          <Group position="apart">
            <Title order={5}>Created at</Title>
            <Text size={15}>
              {notification?.createdAt && convertUTC(notification?.createdAt)}
            </Text>
            <Title order={5}>Invite permission: </Title>
            <Badge>{notification.permission}</Badge>
            <Title order={5}>Status: </Title>
            <Badge
              color={
                notification.status === "accepted"
                  ? "teal"
                  : notification.status === "declined"
                  ? "red"
                  : "gray"
              }
            >
              {notification.status}
            </Badge>
          </Group>
        </Stack>

        <Stack spacing={5}>
          <Title order={5}>Detail</Title>
          <Text>{notification?.content}</Text>
        </Stack>
      </Stack>

      <Divider my="md" />
      <Group position="apart">
        {notification.status === "pending" &&
          notification.notificationType === "invitation" && (
            <ButtonGroup
              onChangeStatus={onChangeStatusNotification}
              notification={notification}
            />
          )}
        <Group position="right">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </Group>
      </Group>
    </Modal>
  );
};

export default NotificationModal;
