import { Button, Flex, Title } from "@mantine/core";
import { useResponseConfigStyle } from "./ResponseConfig.style";
import TimePicker from "../TimePicker";

const ResponseConfig = () => {
  const { classes } = useResponseConfigStyle();
  return (
    <Flex
      direction="column"
      justify="space-between"
      className={classes.wrapper}
    >
      <Flex className={classes.bodyWrapper}>
        {/* Survey name */}
        <Flex className={classes.sectionWrapper}>
          <Title order={4}>Survey availability</Title>
          <TimePicker />
        </Flex>
      </Flex>
      <Flex justify="space-between" m={10}>
        <Button color="red">Delete survey</Button>
        <Button>Save changes</Button>
      </Flex>
    </Flex>
  );
};

export default ResponseConfig;
