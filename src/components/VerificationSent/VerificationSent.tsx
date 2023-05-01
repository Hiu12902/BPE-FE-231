import userApi from '@/api/user';
import { Anchor, Button, Paper, Stack, Text, Title, createStyles } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
  linkDisabled: {
    pointerEvents: 'none',
    textDecoration: 'underline',
    color: theme.colors.gray[7],
  },
}));

const VerificationSent = ({ email }: { email: string }) => {
  const { classes, cx } = useStyles();
  const [seconds, setSeconds] = useState(60);
  const interval = useInterval(() => setSeconds((s) => s - 1), 1000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      interval.stop();
    }
  }, [seconds]);

  const onResendVerificationEmail = async () => {
    try {
      const res = await userApi.resendVerificationEmail({ email: email });
      if (res) {
        setSeconds(60);
        interval.start();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper w={550} shadow="sm" p="md" radius="md">
      <Stack>
        <Title order={2}>Verification link sent!</Title>
        <Text>
          We emailed a confirmation link to{' '}
          <Text span weight={600}>
            {email}
          </Text>
          . Check your email for a link to sign in.
        </Text>
        <Text>
          Didn't get a confimation email? Check your spam folder or{' '}
          <Anchor
            className={cx({ [classes.linkDisabled]: interval.active })}
            onClick={onResendVerificationEmail}
          >
            Send again!
          </Anchor>{' '}
          after{' '}
          <Text span weight={600}>
            {seconds}
          </Text>{' '}
          seconds
        </Text>
      </Stack>
    </Paper>
  );
};

export default VerificationSent;
