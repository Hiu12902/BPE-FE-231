import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  ModalProps,
  Text,
} from "@mantine/core";

interface IDeleteModalProps extends ModalProps {
  title: string;
  objectId: number;
  onDelete: (id: number) => void;
}

const DeleteModal = (props: IDeleteModalProps) => {
  const { opened, onClose, title, onDelete, objectId } = props;

  const handleCancel = () => {
    onClose?.();
  };

  const handleDelete = () => {
    onDelete(objectId);
    onClose?.();
  };

  return (
    <Modal
      centered
      opened={opened}
      onClose={handleCancel}
      title={
        <Badge size="lg" mb={5} color="red">
          {title}
        </Badge>
      }
      styles={{
        close: {
          display: " none",
        },
      }}
    >
      <Text>Are you sure you want to delete this project?</Text>
      <Text span weight={600} color="red">
        Your action will not be able to undo.
      </Text>
      <Divider my="md" />
      <Group position="right">
        <Button variant="outline" onClick={handleCancel} children="Cancel" />
        <Button onClick={handleDelete} color="red" children="Delete" />
      </Group>
    </Modal>
  );
};

export default DeleteModal;