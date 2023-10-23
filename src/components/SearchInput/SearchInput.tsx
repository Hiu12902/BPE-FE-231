import { ActionIcon, Input } from "@mantine/core";
import { ReactComponent as IconSearch } from "@tabler/icons/icons/search.svg";
import { ReactComponent as IconCancel } from "@tabler/icons/icons/x.svg";
import { useSearchInputStyle } from "./SearchInput.style";
import { useFormContext } from "../DefaultHomepage/DefaultHomepage";

export interface ISearchInput {
  onCancel?: () => void;
}

const SearchInput = ({ onCancel }: ISearchInput) => {
  const { classes } = useSearchInputStyle();
  const form = useFormContext();
  return (
    <Input
      variant="filled"
      size="sm"
      radius="sm"
      placeholder="Search workspace name, description, etc."
      className={classes.searchInput}
      icon={<IconSearch className={classes.searchIcon} />}
      rightSection={
        <ActionIcon onClick={onCancel}>
          <IconCancel className={classes.searchIcon} />
        </ActionIcon>
      }
      {...form.getInputProps("searchInput")}
    />
  );
};

export default SearchInput;
