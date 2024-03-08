import { Option } from "@/interfaces/index";
import { Button, Flex, Input } from "@mantine/core";
import TitleInformation from "../TitleInformation";
import { useQuestionOptionsStyle } from "./QuestionOptions.style";
import { RefObject, useRef, useState } from "react";

interface QuestionOptionsProps {
  data: Option[];
  value: Option[];
  setValue: (value: Option[]) => void;
}

const OptionsList = (props: QuestionOptionsProps) => {
  const { data, value, setValue } = props;
  const { classes } = useQuestionOptionsStyle();
  // const renderData = data ? data : value;
  const renderData = value;
  return (
    <>
      {renderData.map((option, index) => {
        const editedOption = value[index];
        return (
          option && (
            <Flex key={index} className={classes.optionWrapper}>
              <Input
                w="100%"
                defaultValue={option?.content}
                value={editedOption?.content}
                onChange={(event) => {
                  const newContent = [...value];
                  newContent[index].content = event.currentTarget.value;
                  console.log("newContent: ", newContent);
                  setValue(newContent);
                }}
              />
            </Flex>
          )
        );
      })}
    </>
  );
};

const QuestionOptions = (props: QuestionOptionsProps) => {
  const { data, value, setValue } = props;
  const { classes } = useQuestionOptionsStyle();
  const [newContent, setNewContent] = useState<string>();

  return (
    <Flex direction="column" className={classes.wrapper}>
      <TitleInformation order={5} content="Options" />

      <OptionsList {...props} />

      <Flex className={classes.optionWrapper}>
        <Input
          value={newContent}
          w="100%"
          placeholder="Add new option"
          onChange={(event) => {
            setNewContent(event.currentTarget.value);
          }}
        />
      </Flex>

      <Button
        className={classes.button}
        children="Add new option"
        onClick={() => {
          const newOption = [...value];
          if (newContent) {
            newOption.push({
              content: newContent,
              orderInQuestion: value.length + 1,
            });
            setValue(newOption);
          }
          setNewContent("");
        }}
      />
    </Flex>
  );
};

export default QuestionOptions;
