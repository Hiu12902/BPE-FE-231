import { INotification } from "@/interfaces/index";
import { Button, Group } from "@mantine/core";

interface IButtonGroupProps {
  notification: INotification;
  onChangeStatus: (status: string) => void;
}

const ButtonGroup = (props: IButtonGroupProps) => {
  const { notification, onChangeStatus } = props;
  return (
    <Group spacing={10}>
      <Button
        w={100}
        color="teal"
        variant={notification.status === "accepted" ? "filled" : "outline"}
        disabled={notification.status === "declined"}
        children="Accepted"
        onClick={(e) => {
          e.stopPropagation();
          onChangeStatus("accepted");
        }}
      />

      <Button
        w={100}
        color="red"
        variant={notification.status === "declined" ? "filled" : "outline"}
        disabled={notification.status === "accepted"}
        children="Declined"
        onClick={(e) => {
          e.stopPropagation();
          onChangeStatus("declined");
        }}
      />
    </Group>
  );
};

export default ButtonGroup;
