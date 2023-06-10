import { createStyles } from '@mantine/core';

export const useFileCardStyle = createStyles((theme) => ({
  container: {
    cursor: 'pointer',
    borderBottom: `1px solid #dee2e6`,
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },

    '&:last-child': {
      borderBottom: 'unset',
    },
  },

  menu: {
    position: 'absolute',
    right: '8.5%',
  },

  date: {
    position: 'absolute',
    right: '34%',
  },
}));
