import { Avatar, Button, Card, Divider, Group, Space, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IComment } from '@/interfaces/projects';
import projectApi from '@/api/project';
import { useSelector } from 'react-redux';
import { getCurrentModeler } from '@/redux/selectors';

const CommentCard = (props: IComment) => {
  const { id, author, createAt, content, canDelete, onDeleteComment } = props;
  const currentModeler = useSelector(getCurrentModeler);

  const handleDeleteComment = async () => {
    try {
      if (!currentModeler || !currentModeler.projectId) {
        return;
      }
      const res = await projectApi.deleteComment({
        projectID: currentModeler.projectId,
        xmlFileLink: `static/${currentModeler?.projectId}/${currentModeler?.id}.bpmn`,
        id: id,
      });

      if (res) {
        onDeleteComment?.(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      onConfirm: handleDeleteComment,
    });

  return (
    <Card mb={10}>
      <Card.Section>
        <Group position="apart">
          <Group spacing={10}>
            <Avatar src={author?.avatar} alt="no image here" radius={50} />
            <Text size="sm">@{author?.email}</Text>
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
      {canDelete && (
        <Card.Section>
          <Group position="right">
            <Button color="red" size="xs" onClick={openDeleteModal}>
              Delete
            </Button>
          </Group>
          <Divider my="sm" />
        </Card.Section>
      )}
    </Card>
  );
};

export default CommentCard;
