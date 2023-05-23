import { createStyles, getStylesRef } from '@mantine/core';

export const usePaletteNavbarStyles = createStyles((theme, _params) => ({
  label: { ref: getStylesRef('label'), color: theme.white },
  chevron: { ref: getStylesRef('chevron'), color: theme.white },
  control: {
    [`&:hover .${getStylesRef('label')}`]: { color: 'black' },
    [`&:hover .${getStylesRef('chevron')}`]: { color: 'black' },
  },

  unCollapseBtn: {
    backgroundColor: 'white',
    color: 'black',
    position: 'absolute',
    left: 8,
    border: '1px solid #dee2e6',
  },
}));
