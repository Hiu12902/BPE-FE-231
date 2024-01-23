import { Box, Button, Group } from "@mantine/core";
import { ReactComponent as IconDelete } from "@tabler/icons/icons/trash.svg";
import { useButtonGroupStyle } from "./ButtonGroup.style";
import { IRequests } from "@/interfaces/index";

interface IButtonGroupProps {
  selectedRecords: IRequests[];
  onChangeSelectedRequestsStatus: ({
    status,
    requestId,
  }: {
    status: string;
    requestId?: number | undefined;
  }) => Promise<void>;
  stateHandler: ({ modal, state }: { modal: string; state: boolean }) => void;
}

const ButtonGroup = (props: IButtonGroupProps) => {
  const { classes } = useButtonGroupStyle();
  const { selectedRecords, onChangeSelectedRequestsStatus, stateHandler } =
    props;
  return (
    <Group>
      <Box
        display={selectedRecords?.length === 0 ? "none" : "flex"}
        sx={{
          gap: 10,
        }}
      >
        {/* <Button
          w={100}
          color="teal"
          variant="outline"
          children="Approve"
          onClick={() =>
            onChangeSelectedRequestsStatus({
              status: "approved",
            })
          }
        />
        <Button
          w={100}
          color="red"
          variant="outline"
          children="Decline"
          onClick={() =>
            onChangeSelectedRequestsStatus({
              status: "declined",
            })
          }
        /> */}
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
