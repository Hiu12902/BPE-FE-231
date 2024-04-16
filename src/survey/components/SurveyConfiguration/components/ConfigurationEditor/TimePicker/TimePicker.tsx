import { SurveyResponseConfiguration } from "@/interfaces/survey";
import { Divider, Flex } from "@mantine/core";
import { DateTimePicker, DatesProvider } from "@mantine/dates";
import { useEffect, useState } from "react";

interface TimePickerProps {
  surveyConfig: SurveyResponseConfiguration;
  setSurveyConfig: (data: SurveyResponseConfiguration) => void;
}

const TimePicker = (props: TimePickerProps) => {
  const { startDate, endDate } = props.surveyConfig;
  const [start, setStart] = useState<Date | string | null>(startDate as Date);
  const [end, setEnd] = useState<Date | string | null>(endDate as Date);
  const handleChangeStartDate = (value: Date) => {
    setStart(value);
    props.setSurveyConfig({
      ...props.surveyConfig,
      startDate: (start as Date).toISOString().substring(0, 19),
    });
  };
  const handleChangeEndDate = (value: Date) => {
    setEnd(value);
    props.setSurveyConfig({
      ...props.surveyConfig,
      startDate: (end as Date).toISOString().substring(0, 19),
    });
  };

  return (
    <DatesProvider
      settings={{ locale: "ru", firstDayOfWeek: 1, weekendDays: [0, 6] }}
    >
      <Flex justify="space-around" gap="10px">
        <Flex justify="center" align="center" gap="10px" w="100%">
          <DateTimePicker
            clearable
            w="100%"
            label="Start date"
            value={start !== null ? new Date(start) : undefined}
            placeholder="Choose start date"
            onChange={handleChangeStartDate}
          />
        </Flex>
        <Divider orientation="vertical" />
        <Flex justify="center" align="center" gap="10px" w="100%">
          <DateTimePicker
            clearable
            w="100%"
            label="End date"
            placeholder="Choose end date"
            value={end !== null ? new Date(end) : undefined}
            onChange={handleChangeEndDate}
          />
        </Flex>
      </Flex>
    </DatesProvider>
  );
};

export default TimePicker;
