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
} from '@mantine/core';
import { ReactComponent as GoogleIcon } from '@/icons/google.svg';
import { useNavigate } from 'react-router-dom';
import { IUserSignup } from '@/interfaces/user';
import userApi from '@/api/user';
import { useState } from 'react';
import VerificationSent from '../VerificationSent/VerificationSent';

const Register = (props: PaperProps) => {
  const navigate = useNavigate();
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const form = useForm<IUserSignup>({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      name: (val) => (val.length < 1 ? 'Name must not be empty' : null),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  const onSignUp = async (user: IUserSignup) => {
    try {
      delete user.confirmPassword;
      const res = await userApi.signUp(user);
      if (res) {
        setSignUpSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return signUpSuccess ? (
    <VerificationSent email={form.values.email} />
  ) : (
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

      <Divider label="Or continue with email" labelPosition="center" my="md" />

      <form onSubmit={form.onSubmit(onSignUp)}>
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

          <TextInput
            required
            label="Name"
            placeholder="John Doe"
            value={form.values.name}
            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
            error={form.errors.name}
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
