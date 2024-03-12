import { Divider, Flex } from "@mantine/core";
import {
  DatePickerInput,
  DatesProvider,
  TimeInput
} from "@mantine/dates";

const TimePicker = () => {
  return (
    <DatesProvider
      settings={{ locale: "ru", firstDayOfWeek: 1, weekendDays: [0, 6] }}
    >
      <Flex justify="space-around" gap="10px">
        <Flex justify="center" align="center" gap="10px" w="100%">
          <TimeInput label="Start time" />
          <DatePickerInput
            clearable
            defaultValue={new Date()}
            w="100%"
            label="Start date"
            placeholder="Choose start date"
          />
        </Flex>
        <Divider orientation="vertical" />
        <Flex justify="center" align="center" gap="10px" w="100%">
          <TimeInput label="End time" />
          <DatePickerInput
            clearable
            w="100%"
            label="End date"
            placeholder="Choose end date"
          />
        </Flex>
      </Flex>
    </DatesProvider>
  );
};

export default TimePicker;
