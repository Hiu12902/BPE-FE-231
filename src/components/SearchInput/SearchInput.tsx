import { ActionIcon, Input } from "@mantine/core";
import { ReactComponent as IconSearch } from "@tabler/icons/icons/search.svg";
import { ReactComponent as IconCancel } from "@tabler/icons/icons/x.svg";
import { useWorkspaceFormContext } from "../DefaultHomepage/DefaultHomepage";
import { useProjectFormContext } from "../Workspace/Workspace";
import { useSearchInputStyle } from "./SearchInput.style";
import { useMembersFormContext } from "../WorkspaceManagement/components/Members/Members";

export interface ISearchInput {
  onCancel?: () => void;
  placeholder?: string;
  context?: "workspace" | "project" | "process" | "members";
}

const SearchInput = ({ onCancel, placeholder, context }: ISearchInput) => {
  const { classes } = useSearchInputStyle();
  const form =
    context === "workspace"
      ? useWorkspaceFormContext()
      : context === "project"
      ? useProjectFormContext()
      : context === "members"
      ? useMembersFormContext()
      : null;
  return (
    <Input
      variant="filled"
      size="sm"
      radius="sm"
      placeholder={placeholder ? placeholder : "Search..."}
      className={classes.searchInput}
      icon={<IconSearch className={classes.searchIcon} />}
      rightSection={
        <ActionIcon onClick={onCancel}>
          <IconCancel className={classes.searchIcon} />
        </ActionIcon>
      }
      {...form?.getInputProps("searchValue")}
    />
  );
};

export default SearchInput;
