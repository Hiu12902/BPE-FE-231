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
  Flex,
  Badge,
} from '@mantine/core';
import { ReactComponent as GoogleIcon } from '@/icons/google.svg';
import { useNavigate } from 'react-router-dom';

const Login = (props: PaperProps) => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

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
      >
        Sign in with Google
      </Button>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
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
