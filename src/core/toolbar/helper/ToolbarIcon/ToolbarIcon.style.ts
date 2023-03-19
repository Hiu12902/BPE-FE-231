import { createStyles } from '@mantine/core';

export const useToolbarIconStyle = createStyles((theme, _params, getRef) => ({
  icon: { ref: getRef('icon'), color: theme.black },
  label: { ref: getRef('label'), color: theme.black },
  button: {
    borderRadius: 3,
    '&:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    },
    [`&:active .${getRef('label')}`]: { transform: 'translateY(2px)' },
    [`&:active .${getRef('icon')}`]: { transform: 'translateY(2px)' },
  },
  buttonDisabled: {
    pointerEvents: 'none',
    [`.${getRef('label')}`]: {
      opacity: 0.4,
    },
    [`.${getRef('icon')}`]: {
      opacity: 0.4,
    },
  },
  buttonActive: {
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
  },
}));
