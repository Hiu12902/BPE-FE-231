import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  ModalProps,
  Text,
} from "@mantine/core";

interface ConfirmModalProps extends ModalProps {
  opened: boolean;
  title?: string;
  message?: string | JSX.Element;
  onConfirm: () => void;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const { opened, title, message, onConfirm, onClose } = props;
  const handleCancel = () => {
    onClose?.();
  };
  const handleConfirm = () => {
    onConfirm();
    onClose?.();
  };
  return (
    <Modal
      size="lg"
      centered
      overlayProps={{
        blur: 3,
        opacity: 0.55,
      }}
      opened={opened}
      onClose={handleCancel}
      title={
        <Badge size="lg" mb={5} color="blue">
          {title}
        </Badge>
      }
      styles={{
        close: {
          display: " none",
        },
      }}
    >
      {message}
      <br />
      <Text span weight={600} color="red">
        Your action will not be able to undo.
      </Text>
      <Divider my="md" />
      <Group position="right">
        <Button variant="outline" onClick={handleCancel} children="Cancel" />
        <Button onClick={handleConfirm} color="red" children="Confirm" />
      </Group>
    </Modal>
  );
};

export default ConfirmModal;
