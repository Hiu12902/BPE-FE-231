import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';
import {
  AppShell,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Header,
  Paper,
  Text,
  ThemeIcon,
  Title,
  createStyles,
} from '@mantine/core';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import loginBgImage from '@/assets/authen-bg.svg';
import registerBgImage from '@/assets/register-bg.svg';
import verificationBgImage from '@/assets/verification.png';
import { ReactComponent as IconShapes } from '@tabler/icons/icons/category-2.svg';
import { ReactComponent as IconEvaluate } from '@tabler/icons/icons/calculator.svg';
import { ReactComponent as IconSimulate } from '@tabler/icons/icons/3d-cube-sphere.svg';
import { ReactComponent as IconValidate } from '@tabler/icons/icons/discount-check.svg';

const useStyles = createStyles(
  (
    theme,
    { isRegister, isAtVerificationSent }: { isRegister?: boolean; isAtVerificationSent?: boolean }
  ) => ({
    main: {
      position: 'relative',
      backgroundImage: !isAtVerificationSent
        ? isRegister
          ? `url(${registerBgImage})`
          : `url(${loginBgImage})`
        : `url(${verificationBgImage})`,
      backgroundSize: !isAtVerificationSent ? 'cover' : '50%',
      backgroundPosition: !isAtVerificationSent ? 'bottom' : 'left',
      backgroundRepeat: 'no-repeat',
    },

    header: {
      boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;',
      backgroundColor: PRIMARY_COLOR[0],
      borderBottom: 'unset',
    },

    button: {
      borderColor: 'white',
      color: 'white',
    },

    item: {
      display: 'flex',
    },

    itemIcon: {
      padding: theme.spacing.xs,
      marginRight: theme.spacing.md,
    },

    itemTitle: {
      marginBottom: `calc(${theme.spacing.xs} / 2)`,
    },

    logo: {
      cursor: 'pointer',
    },
  })
);

interface FeatureImage {
  image: React.FC<React.SVGProps<SVGSVGElement>>;
  title: React.ReactNode;
  description: React.ReactNode;
}

const data: FeatureImage[] = [
  {
    image: IconShapes,
    title: 'Create your business processes with our tools',
    description:
      'With more than 20+ tools and all elements of BPMN 2.0 that we provide, you can create any process that you want',
  },
  {
    image: IconEvaluate,
    title: 'Evaluate your business processes with one click',
    description:
      'Evaluate you business process 6 criterias include: cycle time, cost, quality, transparency, flexibilty and exception handling',
  },
  {
    image: IconSimulate,
    title: 'Run simulation to see how your processes work',
    description: 'Simulate your process with our token simulator to see how you processes work',
  },
  {
    image: IconValidate,
    title: 'Validate your processes with the BPMN 2.0 rules',
    description:
      'Validate your processes to see if your works are fully commited to the BPMN 2.0 rules or not',
  },
];

const AuthenticationLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAtVerificationSent = location.pathname === '/verification-sent';
  const isAtForgotPassword = location.pathname === '/forgot-password';
  const isAtResetPassword = location.pathname === '/reset-password';
  const { classes, theme } = useStyles({
    isRegister: location.pathname === '/register',
    isAtVerificationSent: isAtVerificationSent,
  });
  const items = data.map((item, index) => {
    const Icon = item.image;
    return (
      <Paper p="lg" shadow="lg" radius="lg">
        <div className={classes.item} key={index}>
          <ThemeIcon variant="light" className={classes.itemIcon} size={60} radius="md">
            <Icon width={35} height={35} />
          </ThemeIcon>

          <div>
            <Text fw={700} fz="lg" className={classes.itemTitle}>
              {item.title}
            </Text>
            <Text c="dimmed">{item.description}</Text>
          </div>
        </div>
      </Paper>
    );
  });

  return (
    <AppShell
      classNames={{ main: classes.main }}
      padding="md"
      header={
        <Header height={64} p="xs" className={classes.header}>
          <Container size="xl">
            <Group position="apart">
              <Title order={4} color="white" onClick={() => navigate('/')} className={classes.logo}>
                BPSky
              </Title>
              <Group position="right">
                <Button
                  variant="outline"
                  className={classes.button}
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Button>
                <Button
                  variant="outline"
                  className={classes.button}
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </Button>
              </Group>
            </Group>
          </Container>
        </Header>
      }
    >
      <Container size="xl">
        {!isAtVerificationSent && !isAtForgotPassword && !isAtResetPassword ? (
          <Grid>
            <Grid.Col span={6}>
              <Flex align="center" justify="center" h="100%">
                <Outlet />
              </Flex>
            </Grid.Col>
            <Grid.Col span={6}>
              <Flex align="center" justify="center" h="100%" direction="column" gap={20} mt={20}>
                {items}
              </Flex>
            </Grid.Col>
          </Grid>
        ) : (
          <Flex align="center" justify="center">
            <Outlet />
          </Flex>
        )}
      </Container>
    </AppShell>
  );
};

export default AuthenticationLayout;
