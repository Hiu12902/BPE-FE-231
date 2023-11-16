import { createFormContext } from "@mantine/form";

interface MembersFormValues {
  searchValue: string;
}

export const [MembersFormProvider, useMembersFormContext, useMembersForm] =
  createFormContext<MembersFormValues>();
