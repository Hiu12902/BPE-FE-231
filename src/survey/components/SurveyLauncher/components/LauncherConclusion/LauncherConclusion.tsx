import { Button, Flex, Title, Text } from "@mantine/core";

const LauncherConclusion = () => {
  return (
    <Flex
      direction="column"
      gap={30}
      justify="space-between"
      style={{
        margin: "30px",
      }}
    >
      <Flex direction="column" gap={10} justify="center" align="center">
        <Title order={3}>Thank you for your submission!</Title>
        <Text>
          Your feedback is incredibly valuable and will help us improve our
          products/services. Rest assured that your responses are confidential
          and will only be used for research purposes. Thanks again for your
          time and participation!". Survey result will be sent to you via your
          provided email after this survey closed.
        </Text>
      </Flex>
      <Flex justify="center">
        <Button>Submit your feedback</Button>
      </Flex>
    </Flex>
  );
};

export default LauncherConclusion;
