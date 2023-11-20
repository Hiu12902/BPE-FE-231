import { createFormContext } from "@mantine/form";

interface NotificationFormValues {
    searchValue: string;
}

export const [NotificationFormProvider, useNotificationFormContext, useNotificationForm] =
    createFormContext<NotificationFormValues>();
