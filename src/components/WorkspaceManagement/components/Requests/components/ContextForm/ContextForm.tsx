import { useRequestsFormContext } from "@/components/FormContext/RequestsForm";
import { useContextFormStyle } from "./ContextForm.style";
import { ActionIcon, Input } from "@mantine/core";
import { ReactComponent as IconSearch } from "@tabler/icons/icons/search.svg";
import { ReactComponent as IconCancel } from "@tabler/icons/icons/x.svg";

export interface IContextForm {
  onCancel?: () => void;
  placeholder?: string;
}

const ContextForm = ({ onCancel, placeholder }: IContextForm) => {
  const formContext = useRequestsFormContext();
  const { classes } = useContextFormStyle();
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
      {...formContext.getInputProps("searchValue")}
    />
  );
};

export default ContextForm;
