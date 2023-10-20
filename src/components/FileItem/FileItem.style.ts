import { createStyles } from '@mantine/core';

export const useFileCardStyle = createStyles((theme) => ({
  container: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
  },
}));
