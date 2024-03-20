import { Flex, Input, Radio } from "@mantine/core";
import { useCESINQuestionStyle } from "./CESINQuestion.style";
import { Question } from "@/interfaces/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getResponse } from "@/redux/selectors";
import { responseActions } from "@/redux/slices";

interface CESINQuestionProps {
  data: Question;
  sectionId?: number;
}

const CESINQuestion = (props: CESINQuestionProps) => {
  const { classes } = useCESINQuestionStyle();
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
      label={content}
      withAsterisk={isRequired}
      className={classes.option}
    >
      <Flex className={classes.option} justify="space-around">
        <Input
          w="100%"
          disabled={!sectionId}
          className={classes.input}
          onChange={(e) => {
            setOption(e.target.value);
          }}
          value={option}
        />
      </Flex>
    </Radio.Group>
  );
};

export default CESINQuestion;
