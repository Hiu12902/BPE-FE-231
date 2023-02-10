import { createStyles } from '@mantine/core';

export const usePaletteNavbarStyles = createStyles((theme, _params, getRef) => ({
  label: { ref: getRef('label'), color: theme.white },
  chevron: { ref: getRef('chevron'), color: theme.white },
  control: {
    [`&:hover .${getRef('label')}`]: { color: 'black' },
    [`&:hover .${getRef('chevron')}`]: { color: 'black' },
  },
}));
