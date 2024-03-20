import { Question } from "@/interfaces/index";
import { getResponse } from "@/redux/selectors";
import { responseActions } from "@/redux/slices";
import { Flex, Radio } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNPSQuestionStyle } from "./NPSQuestion.style";

interface NPSQuestionProps {
  data: Question;
  sectionId?: number;
}

const questionOptions = [
  { content: "1" },
  { content: "2" },
  { content: "3" },
  { content: "4" },
  { content: "5" },
  { content: "6" },
  { content: "7" },
  { content: "8" },
  { content: "9" },
  { content: "10" },
];

const NPSQuestion = (props: NPSQuestionProps) => {
  const { classes } = useNPSQuestionStyle();
  const { data, sectionId } = props;

  const dispatch = useDispatch();
  const { content, id, isRequired } = data;
  const [option, setOption] = useState<string>();
  const savedResponse = useSelector(getResponse);

  useEffect(() => {
    // Check saved response (better optimization needed here, save response in local storage)
    if (sectionId) {
      if (savedResponse[sectionId]) {
        if (savedResponse[sectionId][id]) {
          setOption(savedResponse[sectionId][id].value);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (option && sectionId) {
      dispatch(
        responseActions.setSectionResponse({
          sectionId: sectionId,
          questionId: id,
          value: option,
          isRequired: isRequired,
        })
      );
    }
  }, [option]);
  return (
    <Radio.Group
      description="On scale of 1 - 10, 1 means not at all likely, 10 means extremely likely."
      label={content}
      withAsterisk={isRequired}
      className={classes.option}
      onChange={(value: string) => {
        setOption(value);
      }}
      value={option}
    >
      <Flex className={classes.option} justify="space-around">
        {questionOptions.map((option, index) => (
          <Radio
            key={index}
            value={option.content}
            label={option.content}
            className={classes.radio}
            disabled={!sectionId}
          />
        ))}
      </Flex>
    </Radio.Group>
  );
};

export default NPSQuestion;
