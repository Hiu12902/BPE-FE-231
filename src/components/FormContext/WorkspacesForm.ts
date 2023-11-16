import { createFormContext } from "@mantine/form";

interface WorkspacesFormValues {
  searchValue: string;
}

export const [WorkspacesFormProvider, useWorkspacesFormContext, useWorkspacesForm] =
  createFormContext<WorkspacesFormValues>();
