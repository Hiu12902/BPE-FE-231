import {
  Flex,
  Title,
  Text,
  Input,
  NumberInput,
  Button,
  Textarea,
} from "@mantine/core";
import { useGeneralConfigStyle } from "./GeneralConfig.style";

const GeneralConfig = () => {
  const { classes } = useGeneralConfigStyle();
  return (
    <Flex
      direction="column"
      justify="space-between"
      className={classes.wrapper}
    >
      <Flex className={classes.bodyWrapper}>
        {/* Survey name */}
        <Flex className={classes.sectionWrapper}>
          <Title order={4}>Display name</Title>
          <Text c="dimmed">
            Enter a survey name to show in search results, social media posts,
            and on browser tabs.
          </Text>
          <Input
            className={classes.input}
            placeholder="Enter survey name here..."
          />
        </Flex>
        {/* Survey description */}
        <Flex className={classes.sectionWrapper}>
          <Title order={4}>Description</Title>
          <Text c="dimmed">
            Enter a survey description to show in search results and on social
            media posts.
          </Text>
          <Textarea
            className={classes.input}
            minRows={5}
            placeholder="Enter survey description here..."
          />
        </Flex>
        {/* Criteria level */}
        <Flex className={classes.sectionWrapper}>
          <Title order={4}>Criteria level for each measurement metric</Title>
          <Text c="dimmed">
            Select criteria level for each measurement in this survey. Depending
            on the aim, properties of survey, the measurements' level may vary.
            Range value: 0 - 1.
          </Text>
          <Flex className={classes.numberInputGroup}>
            <NumberInput
              label="CSAT"
              className={classes.numberInput}
              min={0}
              max={1}
              step={0.05}
              precision={2}
              defaultValue={0}
            />
            <NumberInput
              label="CES"
              className={classes.numberInput}
              min={0}
              max={1}
              step={0.05}
              precision={2}
              defaultValue={0}
            />
            <NumberInput
              label="NPS"
              className={classes.numberInput}
              min={0}
              max={1}
              step={0.05}
              precision={2}
              defaultValue={0}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex justify="flex-end" m={10}>
        <Button>Save changes</Button>
      </Flex>
    </Flex>
  );
};

export default GeneralConfig;
