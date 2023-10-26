import { ActionIcon, Input } from "@mantine/core";
import { ReactComponent as IconSearch } from "@tabler/icons/icons/search.svg";
import { ReactComponent as IconCancel } from "@tabler/icons/icons/x.svg";
import { useSearchInputStyle } from "./SearchInput.style";
import { useWorkspaceFormContext } from "../DefaultHomepage/DefaultHomepage";
import { useProjectFormContext } from "../Workspace/Workspace";

export interface ISearchInput {
  onCancel?: () => void;
  placeholder?: string;
  context?: "workspace" | "project" | "process";
}

const SearchInput = ({ onCancel, placeholder, context }: ISearchInput) => {
  const { classes } = useSearchInputStyle();
  const form =
    context === "workspace"
      ? useWorkspaceFormContext()
      : "project"
      ? useProjectFormContext()
      : // : "process"
        // ? useProcessFormContext()
        undefined;
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
