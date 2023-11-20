import { INotification } from "@/interfaces/index";
import { Box, Button, Group } from "@mantine/core";
import { ReactComponent as IconDelete } from "@tabler/icons/icons/trash.svg";
import { useButtonGroupStyle } from "./ButtonGroup.style";

interface IButtonGroupProps {
  selectedRecords: INotification[];
  stateHandler: ({ modal, state }: { modal: string; state: boolean }) => void;
}

const ButtonGroup = (props: IButtonGroupProps) => {
  const { classes } = useButtonGroupStyle();
  const { selectedRecords, stateHandler } = props;
  return (
    <Group>
      <Box
        display={selectedRecords?.length === 0 ? "none" : "flex"}
        sx={{
          gap: 10,
        }}
      >
        <Button
          color="red"
          children="Delete"
          variant="outline"
          leftIcon={<IconDelete className={classes.buttonIcon} />}
          display={selectedRecords?.length === 0 ? "none" : "flex"}
          onClick={() => stateHandler({ modal: "delete", state: true })}
        />
      </Box>
    </Group>
  );
};

export default ButtonGroup;
