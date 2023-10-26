import projectApi from "@/api/project";
import useNotification from "@/hooks/useNotification";
import { IProject } from "@/interfaces/projects";
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
import { useCreateProjectButtonStyle } from "./CreateProjectButton.style";

const CreateProjectButton = ({
  workspaceId,
  onCreateProject,
}: {
  workspaceId: number;
  onCreateProject: (project: IProject) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState<string>();
  const [projectDescription, setProjectDescription] = useState<string>();
  const notify = useNotification();
  const { classes } = useCreateProjectButtonStyle();

  const onClear = () => {
    setOpen(false);
    setProjectName(undefined);
    setProjectDescription(undefined);
  };

  const onCreateNewProject = async () => {
    try {
      if (!projectName || !projectDescription) {
        notify({
          title: "Error!",
          message: `${
            !projectName && !projectDescription
              ? `Project's name and description`
              : !projectDescription
              ? `Project's description`
              : `Project's name`
          } can not be empty!`,
          type: "error",
        });
      }
      if (projectName && projectDescription) {
        const res = await projectApi.createNewProject({
          name: projectName,
          description: projectDescription,
          workspaceId: workspaceId,
        });
        if (res) {
          onClear();
          notify({
            title: "Success!",
            message: "You have successfully created a new project!",
            type: "success",
          });
          onCreateProject(res);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderNewProjectModal = () => {
    return (
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Create new Project"
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
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </Input.Wrapper>
          <Input.Wrapper label="Description" className={classes.input}>
            <Textarea
              placeholder="Description"
              minRows={3}
              maxRows={10}
              maxLength={1000}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </Input.Wrapper>
        </Group>
        <Divider my="sm" />
        <Group position="right">
          <Button variant="subtle" onClick={onClear}>
            Cancel
          </Button>
          <Button onClick={onCreateNewProject}>Create</Button>
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
        Create New Project
      </Button>
      {renderNewProjectModal()}
    </>
  );
};

export default CreateProjectButton;
