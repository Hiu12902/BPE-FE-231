import { Button, Group, Modal, ModalProps, Space, Stack, Text } from '@mantine/core';
import React from 'react';
import FileItem from '../FileItem/FileItem';

const FilesListModal = (props: ModalProps) => {
  return (
    <Modal
      {...props}
      centered
      title={<Text size="xl">Evaluated Results of project1.bpmn</Text>}
      size="lg"
    >
      <Stack spacing={0}>
        {[1, 2, 3].map((x) => (
          <FileItem id={x.toString()} />
        ))}
      </Stack>
      <Space h="md" />
      <Group position="right">
        <Button variant="subtle" onClick={props.onClose}>
          Cancel
        </Button>
        <Button>Open</Button>
      </Group>
    </Modal>
  );
};

export default FilesListModal;
