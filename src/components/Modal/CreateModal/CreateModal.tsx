import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  ModalProps,
  TextInput,
} from "@mantine/core";
import { RefObject, useRef } from "react";

interface ICreateModalProps extends ModalProps {
  title: string;
  onCreate: (nameInputRef: RefObject<HTMLInputElement>) => void;
}

const CreateModal = (props: ICreateModalProps) => {
  const { opened, onClose, title, onCreate } = props;
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const handleCancel = () => {
    onClose?.();
  };

  const handleCreate = () => {
    onCreate(nameInputRef);
    onClose?.();
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
        close: {
          display: " none",
        },
      }}
    >
      <TextInput placeholder="Name" ref={nameInputRef} />
      <Divider my="md" />
      <Group position="right">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleCreate}>Create</Button>
      </Group>
    </Modal>
  );
};

export default CreateModal;
