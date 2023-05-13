import React from 'react';
import { Avatar, Button, Card, Divider, Group, Space, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IComment } from '@/interfaces/projects';

const CommentCard = (props: IComment) => {
  const { id, userId, createAt, content } = props;
  const openDeleteModal = () =>
    openConfirmModal({
      title: 'Delete this comment',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this comment? Your action will not be able to undo.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log('Confirmed'),
    });

  return (
    <Card mb={10}>
      <Card.Section>
        <Group position="apart">
          <Group spacing={10}>
            <Avatar src={null} alt="no image here" color="indigo" />
            <Text>Zalter</Text>
          </Group>
          <Text size="sm" color="dimmed">
            {new Date(createAt).toDateString()}
          </Text>
        </Group>
      </Card.Section>
      <Space h="xs" />
      <Card.Section>
        <Text size="sm">{content}</Text>
      </Card.Section>
      <Space h="xs" />
      <Card.Section>
        {/* <Group position="right">
          <Button color="red" size="xs" onClick={openDeleteModal}>
            Delete
          </Button>
        </Group> */}
        <Divider my="sm" />
      </Card.Section>
    </Card>
  );
};

export default CommentCard;
