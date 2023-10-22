import workspaceApi from "@/api/workspace";
import useNotification from "@/hooks/useNotification";
import { IWorkspace } from "@/interfaces/workspaces";
import {
  Button,
  Divider,
  Group,
  Modal,
  TextInput,
  Textarea,
} from "@mantine/core";
import { ReactComponent as IconPlus } from "@tabler/icons/icons/plus.svg";
import { useState } from "react";
import { useCreateWorkspaceStyle } from "./CreateWorkspaceButton.style";

const CreateWorkspaceButton = ({
  onCreateWorkspace,
}: {
  onCreateWorkspace: (workspace: IWorkspace) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState<string>();
  const [workspaceDescription, setWorkspaceDescription] = useState<string>();
  const notify = useNotification();
  const { classes } = useCreateWorkspaceStyle();

  const onClear = () => {
    setOpen(false);
    setWorkspaceName(undefined);
    setWorkspaceDescription(undefined);
  };

  const onCreateNewWorkspace = async () => {
    try {
      if (!workspaceName) {
        notify({
          title: "Error!",
          message: "Name is required!",
          type: "error",
        });
      }
      if (!workspaceDescription) {
        notify({
          title: "Error!",
          message: "Description is required!",
          type: "error",
        });
      }
      if (workspaceName && workspaceDescription) {
        const res = await workspaceApi.createWorkspace({
          workspaceName: workspaceName,
          description: workspaceDescription,
        });
        if (res) {
          onClear();
          notify({
            title: "Success!",
            message: "You have successfully created a new workspace!",
            type: "success",
          });
          onCreateWorkspace(res);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderNewWorkspaceModal = () => {
    return (
      <Modal opened={open} onClose={() => setOpen(false)} title="New Workspace">
        <Group>
          <TextInput
            className={classes.input}
            placeholder="Name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <Textarea
            className={classes.input}
            placeholder="Description"
            minRows={3}
            maxRows={10}
            maxLength={1000}
            value={workspaceDescription}
            onChange={(e) => setWorkspaceDescription(e.target.value)}
          />
        </Group>
        <Divider my="sm" />
        <Group position="right">
          <Button variant="subtle" onClick={onClear}>
            Cancel
          </Button>
          <Button onClick={onCreateNewWorkspace}>Create</Button>
        </Group>
      </Modal>
    );
  };

  return (
    <>
      <Button
        leftIcon={<IconPlus className={classes.buttonIcon} />}
        onClick={() => setOpen(true)}
      >
        New workspace
      </Button>
      {renderNewWorkspaceModal()}
    </>
  );
};

export default CreateWorkspaceButton;
