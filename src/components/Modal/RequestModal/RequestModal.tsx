import { IRequests } from "@/interfaces/workspaces";
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
import { ReactComponent as IconArrow } from "@tabler/icons/icons/arrow-right-circle.svg";

interface IRequestModal extends ModalProps {
  request: IRequests;
}

const RequestModal = ({
  opened,
  onClose,
  title,
  request
}: IRequestModal) => {
  const handleCancel = () => {
    onClose?.();
  };

  const formatTimestamp = (date: Date | string) => {
    function convertUTCDateToLocalDate(date: Date) {
      var newDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60 * 1000
      );
      var offset = date.getTimezoneOffset() / 60;
      var hours = date.getHours();

      newDate.setHours(hours - offset);

      return newDate;
    }
    return convertUTCDateToLocalDate(new Date(date)).toLocaleString("en-GB");
  };

  return (
    <Modal
      centered
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
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
        <Group spacing={5} position="apart">
          <Title order={5}>Created at</Title>
          <Text size={15}>
            {request?.createdAt && formatTimestamp(request?.createdAt)}
          </Text>
        </Group>

        <Group spacing={5} position="apart">
          <Title order={5}>Type</Title>
          <Badge>{request.type}</Badge>
        </Group>

        <Group position="apart">
          <Title order={5}>Status</Title>
          <Group spacing={5}>
            <Badge
              color={
                request.status === "pending"
                  ? "gray"
                  : request.status === "approved"
                  ? "teal"
                  : request.status === "declined"
                  ? "red"
                  : "transparent"
              }
            >
              {request.status}
            </Badge>
          </Group>
        </Group>

        {request && request.type === "adjust permission" ? (
          <>
            <Group position="apart">
              <Title order={5}>{"Adjust permission"}</Title>
              <Group spacing={5}>
                <Badge>{request.frPermission}</Badge>
                <IconArrow width={20} height={20} />
                <Badge>{request.toPermission}</Badge>
              </Group>
            </Group>
          </>
        ) : (
          <>
            <Group position="apart">
              <Title order={5}>{"Permission assigns for invited user"}</Title>
              <Badge>{request.rcpPermission}</Badge>
            </Group>
          </>
        )}

        <Group spacing={5}>
          <Title order={5}>Detail</Title>
          <Text>{request?.content}</Text>
        </Group>
      </Stack>

      <Divider my="md" />
      <Group position="right">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </Group>
    </Modal>
  );
};

export default RequestModal;
