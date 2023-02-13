import React from 'react';
import { Avatar, Button, Card, Divider, Group, Space, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';

const CommentCard = () => {
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
            29 Nov 2022 20:30:06
          </Text>
        </Group>
      </Card.Section>
      <Space h="xs" />
      <Card.Section>
        <Text size="sm">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est maxime explicabo nam et
          dignissimos repudiandae iure accusantium voluptatem architecto ullam.
        </Text>
      </Card.Section>
      <Space h="xs" />
      <Card.Section>
        <Group position="right">
          <Button color="red" size="xs" onClick={openDeleteModal}>
            Delete
          </Button>
        </Group>
        <Divider my="sm" />
      </Card.Section>
    </Card>
  );
};

export default CommentCard;
