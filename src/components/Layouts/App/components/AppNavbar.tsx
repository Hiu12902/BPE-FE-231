import BackButton from '@/components/BackButton';
import { Accordion, AccordionProps, Button, Space, createStyles } from '@mantine/core';
import { ReactComponent as IconFolder } from '@tabler/icons/icons/folder.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import projectApi from '@/api/project';
import { useEffect, useState } from 'react';
import { IProject } from '@/interfaces/projects';

interface IProps extends Partial<AccordionProps> {}

const useStyles = createStyles((theme) => ({
  control: {
    '&:hover': {
      backgroundColor: theme.colors.blue[3],
    },
  },

  item: {
    borderBottom: 'none',
  },

  label: {
    color: 'white',
    fontWeight: 600,
  },

  chevron: {
    color: 'white',
  },

  project: {
    color: 'white',
    alignItems: 'flex-start',
    '&:hover': {
      color: theme.colors.blue[6],
    },
  },

  buttonLabel: {
    fontSize: 14,
    marginRight: 40,
  },
}));

const AppNavbar = (props: IProps) => {
  const { classes } = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);

  const getAllProjects = async () => {
    try {
      const projects = await projectApi.getAllProjects();
      if (projects) {
        setProjects(projects);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const onOpenProject = (project: IProject) => {
    navigate(`/${project.name}/${project.id}`);
  };

  return (
    <>
      {location.pathname === '/document' && (
        <>
          <Space h="lg" />
          <BackButton />
        </>
      )}
      <Accordion
        defaultValue="personal"
        {...props}
        classNames={{
          item: classes.item,
          label: classes.label,
          chevron: classes.chevron,
          control: classes.control,
        }}
      >
        <Accordion.Item value="personal">
          <Accordion.Control icon={<IconFolder color="white" fill="white" />}>
            Personal
          </Accordion.Control>
          <Accordion.Panel>
            {projects.map((project) => (
              <Button
                key={project.id}
                variant="subtle"
                fullWidth
                classNames={{ root: classes.project, label: classes.buttonLabel }}
                onClick={() => onOpenProject(project)}
              >
                Project {project.name}
              </Button>
            ))}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default AppNavbar;
