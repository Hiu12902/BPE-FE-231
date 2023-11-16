import { createFormContext } from "@mantine/form";

interface RequestsFormValues {
  searchValue: string;
}

export const [RequestsFormProvider, useRequestsFormContext, useRequestsForm] =
  createFormContext<RequestsFormValues>();
