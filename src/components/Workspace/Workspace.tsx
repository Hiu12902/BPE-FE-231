import { IWorkspace } from '@/interfaces/projects';
import { Accordion, Box, Button, Divider, Group, Title } from '@mantine/core';
import ProjectItem from '@/components/ProjectItem';
import { ReactComponent as IconChevronRight } from '@tabler/icons/icons/chevron-right.svg';

const Workspace = (workspace: IWorkspace) => {
  const { name, id, projects } = workspace;
  return (
    <Box>
      <Group position="apart">
        <Title order={3}>{name} Workspace</Title>
        <Button>Create New Project</Button>
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
