import React, { useState } from 'react';
import { Button, Dialog, DialogProps, ScrollArea, Stack, Textarea } from '@mantine/core';
import { PROPERTIES_PANEL_WIDTH, TOOLBAR_HEIGHT } from '../../constants/theme/themeConstants';
import CommentCard from '../CommentCard/CommentCard';

const CommentSection = (props: DialogProps) => {
  const { opened, onClose } = props;
  const [comment, setComment] = useState<string>('');

  return (
    <Dialog
      opened={opened}
      onClose={onClose}
      position={{ top: TOOLBAR_HEIGHT, right: PROPERTIES_PANEL_WIDTH }}
    >
      <ScrollArea style={{ height: `62vh` }} mx="-sm" px="sm">
        {[1, 2, 3].map((x) => (
          <CommentCard />
        ))}
      </ScrollArea>
      <Stack>
        <Textarea
          label="Your comment"
          cols={8}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <Button fullWidth disabled={comment.length < 1}>
          Submit
        </Button>
      </Stack>
    </Dialog>
  );
};

export default CommentSection;
