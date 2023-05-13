import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
  Badge,
  Alert,
  createStyles,
} from '@mantine/core';
import { ReactComponent as GoogleIcon } from '@/icons/google.svg';
import { ReactComponent as IconAlertCircle } from '@tabler/icons/icons/alert-circle.svg';
import { useNavigate } from 'react-router-dom';
import { IUserSignin } from '@/interfaces/user';
import userApi from '@/api/user';
import { useDocumentTitle, useInterval, useLocalStorage } from '@mantine/hooks';
import { ACCESS_TOKEN } from '@/constants/localStorageKeys';
import { useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
  linkDisabled: {
    pointerEvents: 'none',
    textDecoration: 'underline',
    color: theme.colors.gray[7],
  },
}));

const Login = (props: PaperProps) => {
  useDocumentTitle('Sign in - BPSky');
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const [, setAccessToken] = useLocalStorage({ key: ACCESS_TOKEN });
  const [error, setError] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [userEmail, setUserEmail] = useState<string>();
  const interval = useInterval(() => setSeconds((s) => s - 1), 1000);
  const form = useForm<IUserSignin>({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const onUserSignIn = async (user: IUserSignin) => {
    try {
      const accessToken = await userApi.signIn(user);
      if (accessToken) {
        setAccessToken(accessToken);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      //@ts-ignore
      if (err.data === 'Your account has not been verified') {
        setNotVerified(true);
        setError(false);
        setUserEmail(user.email);
      } else {
        setError(true);
        setNotVerified(false);
      }
    }
  };

  const onResendVerificationEmail = async () => {
    try {
      if (userEmail) {
        const res = await userApi.resendVerificationEmail({ email: userEmail });
        if (res) {
          setSeconds(60);
          interval.start();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (seconds === 0) {
      interval.stop();
    }
  }, [seconds]);

  return (
    <Paper radius="md" p="xl" withBorder {...props} shadow="lg" w={500}>
      <Badge size="lg">Login</Badge>
      <Group position="apart">
        <Text size={30} weight={500} align="center">
          Welcome Back!
        </Text>

        <Anchor
          component="button"
          type="button"
          color="dimmed"
          size="sm"
          onClick={() => navigate('/register')}
        >
          Don't have an account? Register
        </Anchor>
      </Group>

      <Group grow mb="md" mt="md"></Group>

      <Button
        leftIcon={<GoogleIcon width={20} height={20} />}
        variant="default"
        color="gray"
        fullWidth
        size="md"
        radius="md"
        onClick={() =>
          window.location.replace(import.meta.env.VITE_API_HOST + '/auth/login/google')
        }
      >
        Sign in with Google
      </Button>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(onUserSignIn)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="hello@gmail.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />

          {error ? (
            <Alert icon={<IconAlertCircle width="1rem" height="1rem" />} color="red">
              Please check your email or password and try again!
            </Alert>
          ) : null}

          {notVerified ? (
            <Alert icon={<IconAlertCircle width="1rem" height="1rem" />} color="red">
              Your account hasn't been verified yet! Click{' '}
              <Anchor
                onClick={onResendVerificationEmail}
                className={cx({ [classes.linkDisabled]: interval.active })}
              >
                Here
              </Anchor>{' '}
              to receive a verification email!{' '}
              {interval.active && <Text span>(can resend after {seconds} seconds)</Text>}
            </Alert>
          ) : null}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            size="sm"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </Anchor>
          <Button type="submit" radius="xl" size="md" w={200}>
            Sign in
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default Login;
