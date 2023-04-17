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

const Register = (props: PaperProps) => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder {...props} shadow="lg" w={500}>
      <Badge size="lg">Register</Badge>
      <Group position="apart">
        <Text size={30} weight={500} align="center">
          Start Using Our Tool Now
        </Text>

        <Anchor
          component="button"
          type="button"
          color="dimmed"
          size="sm"
          onClick={() => navigate('/login')}
        >
          Already have an account? Login
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
        Sign up with Google
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

          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Your password"
            value={form.values.confirmPassword}
            onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
            error={form.errors.confirmPassword && 'Passwords did not match'}
            radius="md"
          />
        </Stack>

        <Button type="submit" radius="xl" fullWidth mt="xl">
          Sign up
        </Button>
      </form>
    </Paper>
  );
};

export default Register;
