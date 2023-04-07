import { createStyles, getStylesRef } from '@mantine/core';

export const useToolbarIconStyle = createStyles((theme, _params) => ({
  icon: { ref: getStylesRef('icon'), color: theme.black },
  label: {
    ref: getStylesRef('label'),
    color: theme.black,
  },
  labelOverFlow: {
    width: 50,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  labelHorizon: {
    textAlign: 'left',
  },
  button: {
    borderRadius: 3,
    '&:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    },
    [`&:active .${getStylesRef('label')}`]: { transform: 'translateY(2px)' },
    [`&:active .${getStylesRef('icon')}`]: { transform: 'translateY(2px)' },
  },
  buttonDisabled: {
    pointerEvents: 'none',
    [`.${getStylesRef('label')}`]: {
      opacity: 0.4,
    },
    [`.${getStylesRef('icon')}`]: {
      opacity: 0.4,
    },
  },
  buttonActive: {
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
  },
}));
