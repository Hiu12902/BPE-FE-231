import { showNotification } from '@mantine/notifications';
import { ReactComponent as IconCircleCheckFilled } from '@tabler/icons/icons/circle-check.svg';
import { ReactComponent as IconCircleX } from '@tabler/icons/icons/circle-x.svg';
import { ReactComponent as IconAlertCircle } from '@tabler/icons/icons/alert-circle.svg';
import { useMantineTheme } from '@mantine/core';
import { ReactNode } from 'react';

export default function useNotification() {
  const theme = useMantineTheme();
  const getTheme = (type: 'success' | 'error' | 'warning') => {
    switch (type) {
      case 'success':
        return { icon: IconCircleCheckFilled, color: theme.colors.blue };
      case 'error':
        return { icon: IconCircleX, color: theme.colors.red };
      case 'warning':
        return { icon: IconAlertCircle, color: theme.colors.yellow };
      default:
        return { icon: IconCircleCheckFilled, color: theme.colors.blue };
    }
  };

  const notify = (props: {
    type: 'success' | 'error' | 'warning';
    message?: ReactNode;
    title?: ReactNode;
  }) => {
    const { type, message, title } = props;
    const { icon: Icon, color } = getTheme(type);
    return showNotification({
      title: title,
      message: message,
      icon: <Icon stroke={theme.white} />,
      styles: (theme) => ({
        root: {
          backgroundColor: color[1],
          borderColor: color[6],
          borderWidth: 2,
        },

        title: { color: theme.black },
        description: { color: theme.black, fontWeight: 600 },
        closeButton: {
          color: theme.black,
          '&:hover': { backgroundColor: color[2] },
        },
        icon: {
          backgroundColor: color[6],
          borderColor: color[6],
        },
      }),
    });
  };

  return notify;
}
