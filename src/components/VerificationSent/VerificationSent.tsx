import { Anchor, Paper, Stack, Text, Title } from '@mantine/core';

const VerificationSent = () => {
  return (
    <Paper w={400} shadow="sm" p="md">
      <Stack>
        <Title order={2}>Verification link sent!</Title>
        <Text>
          We emailed a confirmation link to <b>abc@gmail.com</b>. Check your email for a link to
          sign in.
        </Text>
        <Text>
          Didn't get a confimation email? Check your spam folder or <Anchor>Send again!</Anchor>
        </Text>
      </Stack>
    </Paper>
  );
};

export default VerificationSent;
