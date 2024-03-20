import { Question } from "@/interfaces/index";
import { Flex, Radio } from "@mantine/core";
import { useCSATQuestionStyle } from "./CSATQuestion.style";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getResponse } from "@/redux/selectors";
import { responseActions } from "@/redux/slices";

interface CSATQuestionProps {
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
];

const CSATQuestion = (props: CSATQuestionProps) => {
  const { classes } = useCSATQuestionStyle();
  const { data, sectionId } = props;

  const dispatch = useDispatch();
  const { content, id, isRequired } = data;
  const [option, setOption] = useState<string>();
  const savedResponse = useSelector(getResponse);

  useEffect(() => {
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
      description="On scale of 1 - 7, 1 means not satisfied at all, 7 means very satisfied."
      label={content}
      withAsterisk={isRequired}
      className={classes.option}
      defaultValue=""
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

export default CSATQuestion;
