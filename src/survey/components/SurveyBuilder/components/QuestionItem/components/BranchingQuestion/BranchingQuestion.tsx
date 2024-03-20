import { Flex, Radio } from "@mantine/core";
import { useBranchingQuestionStyle } from "./BranchingQuestion.style";
import { Question, Response } from "@/interfaces/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { responseActions } from "@/redux/slices";
import { getResponse } from "@/redux/selectors";

interface BranchingQuestionProps {
  data: Question;
  sectionId?: number;
}

const BranchingQuestion = (props: BranchingQuestionProps) => {
  const { data, sectionId } = props;
  const dispatch = useDispatch();
  const [option, setOption] = useState<string>();
  const savedResponse = useSelector(getResponse);
  const { classes } = useBranchingQuestionStyle();
  const { content, id, isRequired, questionOptions } = data;

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
      dispatch(responseActions.setBranch(option === "Yes"));
    }
  }, [option]);

  return (
    <Radio.Group
      description="Select the option that best describes your experience."
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

export default BranchingQuestion;
