import { Stack, Group, Text } from '@mantine/core';
import { DEFAULT_SPACING } from '../../constants/size';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { IconBpeComment, IconBpeResult } from '../../utils/icons/Icons';
import CommentSection from '../../../../components/CommentSection/CommentSection';
import { useState } from 'react';
import FilesListModal from '../../../../components/FilesListModal/FilesListModal';

const MiscGroup = () => {
  const [openCommentSection, setOpenCommentSection] = useState(false);
  const [openFilesList, setOpenFilesList] = useState(false);

  return (
    <Stack spacing={DEFAULT_SPACING - 2}>
      <Group>
        <CommentSection
          opened={openCommentSection}
          onClose={() => setOpenCommentSection(() => false)}
        />
        <FilesListModal opened={openFilesList} onClose={() => setOpenFilesList(false)} />
        <ToolbarIcon
          icon={IconBpeComment}
          label="Comment"
          title="Open Comment Section"
          orientation="vertical"
          size="large"
          onClick={() => setOpenCommentSection((o) => !o)}
        />
        <ToolbarIcon
          icon={IconBpeResult}
          label="Evaluated Results"
          title="Open Evaluated Results"
          orientation="vertical"
          size="large"
          onClick={() => setOpenFilesList((o) => !o)}
        />
      </Group>
      <Text size="xs" align="center">
        Misc
      </Text>
    </Stack>
  );
};

export default MiscGroup;
