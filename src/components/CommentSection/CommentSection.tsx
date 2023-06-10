import { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Center,
  Dialog,
  DialogProps,
  Flex,
  Image,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { PROPERTIES_PANEL_WIDTH, TOOLBAR_HEIGHT } from '@/constants/theme/themeConstants';
import CommentCard from '../CommentCard/CommentCard';
import { useSelector } from 'react-redux';
import { getCurrentModeler, getCurrentUser } from '@/redux/selectors';
import projectApi from '@/api/project';
import { IComment } from '@/interfaces/projects';
import noComments from '@/assets/no-comments.svg';

const CommentSection = (props: DialogProps) => {
  const { opened, onClose } = props;
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<IComment[]>([]);
  const currentModeler = useSelector(getCurrentModeler);
  const currentUser = useSelector(getCurrentUser);
  const endOfCommentsRef = useRef<HTMLDivElement>(null);

  const getModelComments = async () => {
    try {
      if (!currentModeler?.projectId || !currentModeler.processId) {
        return;
      }
      const comments = await projectApi.getModelsComments({
        projectID: currentModeler?.projectId?.toString() as string,
        version: currentModeler?.id,
        processID: currentModeler?.processId,
      });
      if (comments) {
        setComments(comments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getModelComments();
  }, [currentModeler?.id]);

  useEffect(() => {
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [endOfCommentsRef.current, comments]);

  const handleComment = async () => {
    try {
      if (currentModeler && currentModeler?.processId) {
        const res = await projectApi.comment({
          projectID: currentModeler?.projectId?.toString() as string,
          version: currentModeler?.id,
          content: comment,
          processID: currentModeler?.processId,
        });
        if (res) {
          setComments((comments) => [
            ...comments,
            {
              id: (comments[comments.length - 1]?.id || -1) + 1,
              content: comment,
              createAt: new Date().toISOString(),
              author: {
                id: currentUser.id,
                avatar: currentUser.avatar,
                email: currentUser.email,
              },
            },
          ]);
          setComment('');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDeleteComment = (commentId: number) => {
    const tempComments = comments.filter((comment) => comment.id !== commentId);
    setComments(tempComments);
  };

  const renderNoComments = () => {
    return (
      <Stack>
        <Center>
          <Image src={noComments} width={90} height={90} />
        </Center>
        <Center>
          <Text color="dimmed" align="center" w="80%" size="md">
            This model hasn't had any comments yet!
          </Text>
        </Center>
      </Stack>
    );
  };

  return (
    <Dialog
      opened={opened}
      onClose={onClose}
      position={{ top: TOOLBAR_HEIGHT, right: PROPERTIES_PANEL_WIDTH }}
    >
      <ScrollArea style={{ height: `62vh` }} mx="-sm" px="sm">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              {...comment}
              canDelete={currentUser?.email === comment.author?.email}
              onDeleteComment={onDeleteComment}
            />
          ))
        ) : (
          <Flex h="62vh" w="100%" align="center" justify="center">
            {renderNoComments()}
          </Flex>
        )}
        <div ref={endOfCommentsRef}></div>
      </ScrollArea>
      <Stack>
        <Textarea
          label={<Badge mb={5}>Your comment</Badge>}
          cols={8}
          maxLength={160}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <Button fullWidth disabled={comment.length < 1} onClick={handleComment}>
          Submit
        </Button>
      </Stack>
    </Dialog>
  );
};

export default CommentSection;
