import { createStyles, Title, Text, Button, Container, Group, rem } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(120),
    backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
    height: '100vh',
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(120),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color: theme.colors[theme.primaryColor][3],

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),
    color: theme.white,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(540),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color: theme.colors[theme.primaryColor][1],
  },
}));

const NotFound = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>404 Not Found</div>
        <Title className={classes.title}>Page Not Found</Title>
        <Text size="lg" align="center" className={classes.description}>
          The page you want to visit does not exist!
        </Text>
        <Group position="center">
          <Button variant="white" size="md" onClick={() => navigate('/', { replace: true })}>
            Back to Home page
          </Button>
        </Group>
      </Container>
    </div>
  );
};
export default NotFound;
