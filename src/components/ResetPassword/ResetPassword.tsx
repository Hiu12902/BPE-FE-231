import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  rem,
  PasswordInput,
  Stack,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

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
  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center" color="white">
        Reset your password
      </Title>
      <Text c="dimmed" fz="sm" ta="center" mt="sm">
        Enter your new password and confirm to reset your password!
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl" w={460}>
        <Stack>
          <PasswordInput
            required
            label="New Password"
            placeholder="Your new password"
            radius="md"
          />
          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm new password"
            radius="md"
          />
        </Stack>
        <Group position="apart" mt="lg" className={classes.controls}>
          <Button className={classes.control} fullWidth>
            Reset password
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
