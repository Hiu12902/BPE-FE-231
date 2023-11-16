import { createFormContext } from "@mantine/form";

interface ProjectsFormValues {
  searchValue: string;
}

export const [ProjectsFormProvider, useProjectsFormContext, useProjectsForm] =
  createFormContext<ProjectsFormValues>();
