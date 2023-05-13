import { IProject, IWorkspace } from '@/interfaces/projects';
import {
  Accordion,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import ProjectItem from '@/components/ProjectItem';
import { ReactComponent as IconChevronRight } from '@tabler/icons/icons/chevron-right.svg';
import { useEffect, useState } from 'react';
import projectApi from '@/api/project';
import CreateProjectButton from '@/components/CreateProjectButton';
import noProjects from '@/assets/no-projects.svg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getModelers } from '@/redux/selectors';

const Workspace = (workspace: IWorkspace) => {
  const { name, isOpenFromEditor } = workspace;
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const modelers = useSelector(getModelers);
  const navigate = useNavigate();

  const getAllProjects = async () => {
    try {
      const projects = await projectApi.getAllProjects();
      if (projects) {
        setProjects(projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onCreateNewProject = (project: IProject) => {
    setProjects((prjs) => [project, ...prjs]);
  };

  const renderNoProjects = () => {
    return (
      <Stack w={400}>
        <Center>
          <Image src={noProjects} width={120} opacity={0.7} />
        </Center>
        <Text align="center" color="dimmed">
          You don't have any projects yet! You can start right now by creating a new project.
        </Text>
        <Center>
          <CreateProjectButton onCreateProject={onCreateNewProject} />
        </Center>
      </Stack>
    );
  };

  const renderProjectsSkeleton = () => {
    return [1, 2, 3].map((v) => <Skeleton height={50} key={v} mt={10} />);
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const onDeleteProject = (projectId: number) => {
    const newProjects = projects.filter((p) => p.id !== projectId);
    setProjects(() => newProjects);
  };

  return (
    <Box>
      <Group position="apart">
        <Title order={3}>{name} Workspace</Title>
        {!isOpenFromEditor && (
          <Group>
            <Button
              variant="outline"
              onClick={() => navigate('/editor')}
              disabled={modelers.length < 1}
            >
              Open Editor
            </Button>
            <CreateProjectButton onCreateProject={onCreateNewProject} />
          </Group>
        )}
      </Group>
      <Divider my="md" />
      {loading ? (
        renderProjectsSkeleton()
      ) : projects.length > 0 ? (
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
            <ProjectItem
              {...project}
              key={project.id}
              onDeleteProject={onDeleteProject}
              shouldGetDocuments={!isOpenFromEditor}
            />
          ))}
        </Accordion>
      ) : (
        <Center>{renderNoProjects()}</Center>
      )}
    </Box>
  );
};

export default Workspace;
