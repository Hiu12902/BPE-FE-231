import workspaceApi from "@/api/workspace";
import useNotification from "@/hooks/useNotification";
import { IWorkspace } from "@/interfaces/workspaces";
import {
  Button,
  Divider,
  Group,
  Input,
  Modal,
  TextInput,
  Textarea,
} from "@mantine/core";
import { ReactComponent as IconPlus } from "@tabler/icons/icons/plus.svg";
import { useState } from "react";
import { useCreateWorkspaceButtonStyle } from "./CreateWorkspaceButton.style";

const CreateWorkspaceButton = ({
  onCreateWorkspace,
}: {
  onCreateWorkspace: (workspace: IWorkspace) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState<string>();
  const [workspaceDescription, setWorkspaceDescription] = useState<string>();
  const notify = useNotification();
  const { classes } = useCreateWorkspaceButtonStyle();

  const onClear = () => {
    setOpen(false);
    setWorkspaceName(undefined);
    setWorkspaceDescription(undefined);
  };

  const onCreateNewWorkspace = async () => {
    try {
      if (!workspaceName || !workspaceDescription) {
        notify({
          title: "Error!",
          message: `${
            !workspaceName && !workspaceDescription
              ? `Project's name and description`
              : !workspaceDescription
              ? `Project's description`
              : `Project's name`
          } can not be empty!`,
          type: "error",
        });
      }
      if (workspaceName && workspaceDescription) {
        const res = await workspaceApi.createWorkspace({
          name: workspaceName,
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
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Create new Workspace"
        centered
        overlayProps={{
          blur: 3,
          opacity: 0.55,
        }}
      >
        <Group>
          <Input.Wrapper label="Name" className={classes.input}>
            <TextInput
              placeholder="Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </Input.Wrapper>
          <Input.Wrapper label="Description" className={classes.input}>
            <Textarea
              placeholder="Description"
              minRows={3}
              maxRows={10}
              maxLength={1000}
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
            />
          </Input.Wrapper>
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
