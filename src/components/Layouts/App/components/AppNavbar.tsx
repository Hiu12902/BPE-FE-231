import BackButton from '@/components/BackButton';
import { Accordion, AccordionProps, Button, Space, Tooltip, createStyles } from '@mantine/core';
import { ReactComponent as IconFolder } from '@tabler/icons/icons/folder.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { IProject } from '@/interfaces/projects';
import { batch, useSelector } from 'react-redux';
import { getProject } from '@/redux/selectors';
import projectApi from '@/api/project';
import { useAppDispatch } from '@/redux/store';
import { projectActions } from '@/redux/slices';
import { useEffect } from 'react';

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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  buttonInner: {
    justifyContent: 'flex-start',
  },
}));

const AppNavbar = (props: IProps) => {
  const dispatch = useAppDispatch();
  const { classes } = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const projects = useSelector(getProject);
  const projectsMap = Object.keys(projects).map(function (key) {
    return projects[parseInt(key)];
  });

  const onOpenProject = (project: IProject) => {
    navigate(`/${project.name}/${project.id}`);
  };

  const getAllProjects = async () => {
    try {
      const projects = await projectApi.getAllProjects();
      if (projects) {
        batch(() => {
          projects.map((project: IProject) => dispatch(projectActions.setProject(project)));
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (projectsMap.length === 0) {
      getAllProjects();
    }
  }, []);

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
            {projectsMap.map((project) => (
              <Tooltip label={`Project ${project.name}`} position="bottom">
                <Button
                  key={project.id}
                  variant="subtle"
                  fullWidth
                  classNames={{
                    root: classes.project,
                    label: classes.buttonLabel,
                    inner: classes.buttonInner,
                  }}
                  onClick={() => onOpenProject(project)}
                  pl={40}
                >
                  Project {project.name}
                </Button>
              </Tooltip>
            ))}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default AppNavbar;
