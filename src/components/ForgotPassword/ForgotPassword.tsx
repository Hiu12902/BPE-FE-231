import userApi from '@/api/user';
import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  rem,
  Alert,
} from '@mantine/core';
import { ReactComponent as IconArrowLeft } from '@tabler/icons/icons/arrow-left.svg';
import { useRef, useState } from 'react';
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

const ForgotPassword = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async () => {
    try {
      if (!emailRef?.current?.value) {
        return;
      }
      const res = await userApi.resetPassword(emailRef.current.value);
      if (res) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center" color="white">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center" mt="sm">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl" w={460}>
        {success ? (
          <Alert>
            We have sent an email which contain reset password link to the email that you entered,
            please check your inbox
          </Alert>
        ) : (
          <TextInput label="Your email" placeholder="me@gmail.com" required ref={emailRef} />
        )}
        <Group position="apart" mt="lg" className={classes.controls}>
          <Anchor color="dimmed" size="sm" className={classes.control}>
            <Center inline>
              <IconArrowLeft width={rem(12)} />
              <Box ml={5} onClick={() => navigate('/login')}>
                Back to the login page
              </Box>
            </Center>
          </Anchor>
          {!success && (
            <Button className={classes.control} onClick={resetPassword}>
              Send Recovery Mail
            </Button>
          )}
        </Group>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
