import { showNotification } from "@mantine/notifications";
import { ReactComponent as IconCircleCheckFilled } from "@tabler/icons/icons/circle-check.svg";
import { ReactComponent as IconCircleX } from "@tabler/icons/icons/circle-x.svg";
import { ReactComponent as IconAlertCircle } from "@tabler/icons/icons/alert-circle.svg";
import { useMantineTheme } from "@mantine/core";
import { ReactNode } from "react";

export default function useNotification() {
  const theme = useMantineTheme();
  const getTheme = (type: "success" | "error" | "warning" | "notification") => {
    switch (type) {
      case "success":
        return { icon: IconCircleCheckFilled, color: theme.colors.blue };
      case "error":
        return { icon: IconCircleX, color: theme.colors.red };
      case "warning":
        return { icon: IconAlertCircle, color: theme.colors.yellow };
      case "notification":
        return { icon: IconAlertCircle, color: theme.colors.teal };
      default:
        return { icon: IconCircleCheckFilled, color: theme.colors.blue };
    }
  };

  const notify = (props: {
    type: "success" | "error" | "warning" | "notification";
    message?: ReactNode;
    title?: ReactNode;
  }) => {
    const { type, message, title } = props;
    const { icon: Icon, color } = getTheme(type);
    return showNotification({
      title: title,
      message: message,
      icon: <Icon stroke={theme.white} />,
      onClick: () => {
        if (type === "notification") window.open(`/notification`);
      },
      autoClose: 3000,
      styles: (theme) => ({
        root: {
          backgroundColor: color[0],
        },
        title: { color: color[9], fontSize: 16, fontWeight: 600 },
        description: { color: color[9] },
        closeButton: {
          color: color[9],
          "&:hover": { backgroundColor: color[2] },
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
