import { MantineTheme } from '@mantine/styles';

export const useErrorToastStyles = (color: string, theme: MantineTheme) => ({
  root: {
    backgroundColor: theme.colors[color][6],
    borderColor: theme.colors[color][6],
    '&::before': { backgroundColor: theme.white },
  },
  title: { color: theme.white },
  description: { color: theme.white },
  closeButton: {
    color: theme.white,
    '&:hover': { backgroundColor: theme.colors[color][6] },
  },
  icon: {
    color: theme.white,
    backgroundColor: `${theme.colors[color][6]} !important`,
  },
});
