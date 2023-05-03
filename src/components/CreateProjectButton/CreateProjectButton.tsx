import projectApi from '@/api/project';
import { IProject } from '@/interfaces/projects';
import { Button, Divider, Group, Modal, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';

const CreateProjectButton = ({
  onCreateProject,
}: {
  onCreateProject: (project: IProject) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState<string>();

  const onClear = () => {
    setOpen(false);
    setProjectName(undefined);
  };

  const onCreateNewProject = async () => {
    try {
      if (projectName) {
        const res = await projectApi.createNewProject(projectName);
        if (res) {
          onClear();
          showNotification({
            title: 'Success!',
            message: 'You have successfully created a new project!',
            color: 'green',
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
      <Modal opened={open} onClose={() => setOpen(false)} title="New Project">
        <TextInput
          placeholder="Project's name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
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
      <Button onClick={() => setOpen(true)}>Create New Project</Button>
      {renderNewProjectModal()}
    </>
  );
};

export default CreateProjectButton;
