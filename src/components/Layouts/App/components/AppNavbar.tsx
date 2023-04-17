import { Accordion, AccordionProps, Button, createStyles } from '@mantine/core';
import { ReactComponent as IconFolder } from '@tabler/icons/icons/folder.svg';

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
  return (
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
          {[1, 2, 3, 4, 5].map((v) => (
            <Button
              key={v}
              variant="subtle"
              fullWidth
              classNames={{ root: classes.project, label: classes.buttonLabel }}
            >
              Project {v}
            </Button>
          ))}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default AppNavbar;
