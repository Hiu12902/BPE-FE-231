import userApi from '@/api/user';
import useNotification from '@/hooks/useNotification';
import { Button, Group, PasswordInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

interface IProps {
  hideCancelButton?: boolean;
}

const ChangePasswordForm = ({ hideCancelButton }: IProps) => {
  const notify = useNotification();
  const navigate = useNavigate();
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

  const changePassword = async () => {
    try {
      const res = await userApi.changePassword(form.values.password);
      if (res) {
        !hideCancelButton
          ? notify({
              title: 'Success',
              message: 'Your password has been updated!',
              type: 'success',
            })
          : navigate('/');
      }
    } catch (err) {
      console.error(err);
      notify({
        title: 'Somethings went wrong',
        message: 'Try again later',
        type: 'error',
      });
    }
  };

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
        {hideCancelButton ? (
          <Button disabled={!form.isValid()} onClick={changePassword}>
            Reset password
          </Button>
        ) : (
          <Group position="right">
            <Button variant="subtle">Cancel</Button>
            <Button disabled={!form.isValid()} onClick={changePassword}>
              Reset password
            </Button>
          </Group>
        )}
      </Stack>
    </form>
  );
};

export default ChangePasswordForm;
