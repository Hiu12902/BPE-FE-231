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

interface IRenameModalProps extends ModalProps {
  title: string;
  nameRender?: string;
  onRename: (nameInputRef: RefObject<HTMLInputElement>) => void;
}

const RenameModal = (props: IRenameModalProps) => {
  const { opened, onClose, title, onRename, nameRender } = props;
  const nameInputRef = useRef<HTMLInputElement>(null);
  const handleCancel = () => {
    onClose?.();
  };

  const handleRename = () => {
    onRename(nameInputRef);
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
      <TextInput
        placeholder="Name"
        ref={nameInputRef}
        value={nameRender}
      />
      <Divider my="md" />
      <Group position="right">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleRename}>Save</Button>
      </Group>
    </Modal>
  );
};

export default RenameModal;
