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
import { useAppDispatch } from '@/redux/store';
import { projectActions } from '@/redux/slices';
import { batch, useSelector } from 'react-redux';
import { getProject } from '@/redux/selectors';

const Workspace = (workspace: IWorkspace) => {
  const dispatch = useAppDispatch();
  const projects = useSelector(getProject);
  const projectsMap = Object.keys(projects).map(function (key) {
    return projects[parseInt(key)];
  });
  const { name, isOpenFromEditor } = workspace;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAllProjects = async () => {
    try {
      const projects = await projectApi.getAllProjects();
      if (projects) {
        console.log(projects);
        
        batch(() => {
          projects.map((project: IProject) => dispatch(projectActions.setProject(project)));
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onCreateNewProject = (project: IProject) => {
    dispatch(projectActions.setProject(project));
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
    dispatch(projectActions.deleteProject(projectId));
  };

  return (
    <Box>
      <Group position="apart">
        <Title order={3}>{name} Workspace</Title>
        {!isOpenFromEditor && (
          <Group>
            <Button variant="outline" onClick={() => navigate('/editor')}>
              Open Editor
            </Button>
            <CreateProjectButton onCreateProject={onCreateNewProject} />
          </Group>
        )}
      </Group>
      <Divider my="md" />
      {loading ? (
        renderProjectsSkeleton()
      ) : projectsMap.length > 0 ? (
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
          {projectsMap.map((project) => (
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
