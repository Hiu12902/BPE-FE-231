import { createStyles } from '@mantine/core';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../constants/theme/themeConstants';

export const useFileCardStyle = createStyles((theme) => ({
  container: {
    borderBottom: `1px solid ${SECONDARY_COLOR[0]}`,
    '&:hover': {
      backgroundColor: PRIMARY_COLOR[2],
    },
  },
}));
