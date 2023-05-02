import { IWorkspace } from '@/interfaces/projects';
import { Accordion, Box, Button, Divider, Group, Title } from '@mantine/core';
import ProjectItem from '@/components/ProjectItem';
import { ReactComponent as IconChevronRight } from '@tabler/icons/icons/chevron-right.svg';
import { useEffect } from 'react';
import projectApi from '@/api/project';
import CreateProjectButton from '../CreateProjectButton/CreateProjectButton';

const Workspace = (workspace: IWorkspace) => {
  const { name, id, projects } = workspace;

  const getAllProjects = async () => {
    try {
      const projects = await projectApi.getAllProjects();
      console.log(projects);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <Box>
      <Group position="apart">
        <Title order={3}>{name} Workspace</Title>
        <CreateProjectButton />
      </Group>
      <Divider my="md" />
      <Accordion
        chevron={<IconChevronRight color="#868e96" />}
        styles={{
          chevron: {
            '&[data-rotate]': {
              transform: 'rotate(90deg)',
            },
          },
        }}
      >
        {projects.map((project) => (
          <ProjectItem {...project} key={project.id} />
        ))}
      </Accordion>
    </Box>
  );
};

export default Workspace;
