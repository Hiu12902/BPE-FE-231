import { SurveyInfo } from "@/interfaces/survey";
import { Divider, Flex } from "@mantine/core";
import {
  DateTimePicker,
  DatesProvider
} from "@mantine/dates";

interface TimePickerProps {
  surveyInfo: SurveyInfo;
  setSurveyInfo: (data: SurveyInfo) => void;
}

const toLocaleUTCDateString = (date: Date) => {
  const timeDiff = date.getTimezoneOffset() * 60000;
  const adjustDate = new Date(date.valueOf() - timeDiff);
  return adjustDate.toISOString();
};

const TimePicker = (props: TimePickerProps) => {
  const { startDate, endDate } = props.surveyInfo;
  const handleChangeStartDate = (value: Date) => {
    props.setSurveyInfo({
      ...props.surveyInfo,
      startDate: toLocaleUTCDateString(value),
    });
  };
  const handleChangeEndDate = (value: Date) => {
    props.setSurveyInfo({
      ...props.surveyInfo,
      startDate: toLocaleUTCDateString(value),
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
            defaultValue={new Date()}
            w="100%"
            label="Start date"
            value={startDate ? new Date(startDate) : new Date()}
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
            value={endDate ? new Date(endDate) : undefined}
            onChange={handleChangeEndDate}
          />
        </Flex>
      </Flex>
    </DatesProvider>
  );
};

export default TimePicker;
