import { Question } from "@/interfaces/index";
import { Grid, Input, Radio } from "@mantine/core";
import { useMultipleChoiceQuestionStyle } from "./MultipleChoiceQuestion.style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getResponse } from "@/redux/selectors";
import { responseActions } from "@/redux/slices";

interface MultipleChoiceQuestionProps {
  data: Question;
  sectionId?: number;
}

const MultipleChoiceQuestion = (props: MultipleChoiceQuestionProps) => {
  const { classes } = useMultipleChoiceQuestionStyle();
  const { data, sectionId } = props;

  const dispatch = useDispatch();
  const { content, id, isRequired, questionOptions } = data;
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
      onChange={(value: string) => {
        setOption(value);
      }}
      value={option}
    >
      <Grid className={classes.option}>
        {questionOptions.map((option) => (
          <Grid.Col span={6}>
            <Radio
              key={option.orderInQuestion}
              value={option.content}
              label={option.content}
              className={classes.radio}
              disabled={!sectionId}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Radio.Group>
  );
};

export default MultipleChoiceQuestion;
