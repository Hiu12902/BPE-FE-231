import {
  createStyles,
  Paper,
  Title,
  Text,
  Container,
  rem,
} from '@mantine/core';
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChangePasswordForm from '../ChangePasswordForm/ChangePasswordForm';

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse',
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
}));

const ResetPassword = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');
  const firstload = useRef(true);

  useEffect(() => {
    if (firstload.current) {
      firstload.current = false;
    }
  }, [firstload.current]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('resetToken', JSON.stringify(token));
    } else if (!firstload.current) {
      navigate('/login');
    }
  }, [token]);

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center" color="white">
        Reset your password
      </Title>
      <Text c="dimmed" fz="sm" ta="center" mt="sm">
        Enter your new password and confirm to reset your password!
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl" w={460}>
        <ChangePasswordForm hideCancelButton />
      </Paper>
    </Container>
  );
};

export default ResetPassword;
