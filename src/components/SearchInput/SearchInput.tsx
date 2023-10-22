import { Input } from "@mantine/core";
import { ReactComponent as IconSearch } from "@tabler/icons/icons/search.svg";
import { useSearchInputStyle } from "./SearchInput.style";
import { useFormContext } from "../DefaultHomepage/DefaultHomepage";

export interface TSearchInput {
  name?: string;
  value?: string;
}

const SearchInput = () => {
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
      {...form.getInputProps("searchInput")}
    />
  );
};

export default SearchInput;
