import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  ModalProps,
  Text,
  Title,
} from "@mantine/core";

interface IAssignPermissionModalProps extends ModalProps {
  title: string;
  userName: string;
  frPermission: string;
  toPermission: string;
  onSendRequest?: (content: string) => void;
}

const AssignPermissionModal = ({
  opened,
  onClose,
  title,
  userName,
  frPermission,
  toPermission,
  onSendRequest,
}: IAssignPermissionModalProps) => {
  const content = `User ${userName} wanted to adjust permission, from ${frPermission} to ${toPermission}`;

  const handleCancel = () => {
    onClose?.();
  };

  const handleSendRequest = () => {
    onSendRequest?.(content);
  };

  return (
    <Modal
      centered
      opened={opened}
      onClose={handleCancel}
      size={"lg"}
      title={
        <Badge size="lg" mb={5}>
          {title}
        </Badge>
      }
      styles={{
        close: {
          display: " none",
        },
      }}
    >
      <Divider mb="xs" />
      <Text color="red" size={"md"}>
        {`You are a ${frPermission} in this workspace and you need to have higher permission for this action!`}
      </Text>
      <br />
      <Title order={5}>Send request to Workspace owner:</Title>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          margin: "10px 0",
          padding: "20px",
        }}
      >
        <Text>
          {`User ${userName} wanted to adjust permission, `}
          from
          <Badge size="md" mx={10}>
            {frPermission}
          </Badge>
          to
          <Badge size="md" mx={10}>
            {toPermission}
          </Badge>
        </Text>
      </Box>
      <Divider my="md" />
      <Group position="right">
        <Button variant="outline" w={100} onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="filled" w={100} onClick={handleSendRequest}>
          Send
        </Button>
      </Group>
    </Modal>
  );
};

export default AssignPermissionModal;
