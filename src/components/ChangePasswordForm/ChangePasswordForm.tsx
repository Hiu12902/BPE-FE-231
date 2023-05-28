import { PasswordInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

const ChangePasswordForm = () => {
  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validate: {
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack>
        <PasswordInput
          required
          label="New Password"
          placeholder="Your new password"
          value={form.values.password}
          onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
          error={form.errors.password && 'Password should include at least 6 characters'}
          radius="md"
        />

        <PasswordInput
          required
          label="Confirm New Password"
          placeholder="Your new password"
          value={form.values.confirmPassword}
          onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
          error={form.errors.confirmPassword && 'Passwords did not match'}
          radius="md"
        />
      </Stack>
    </form>
  );
};

export default ChangePasswordForm;
