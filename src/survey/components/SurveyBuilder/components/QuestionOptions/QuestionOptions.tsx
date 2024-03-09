import { Option } from "@/interfaces/index";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Flex, Input } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { ReactComponent as IconDrag } from "@tabler/icons/icons/dots-vertical.svg";
import { ReactComponent as IconAdd } from "@tabler/icons/icons/plus.svg";
import { ReactComponent as IconX } from "@tabler/icons/icons/x.svg";
import { useEffect, useState } from "react";
import TitleInformation from "../TitleInformation";
import { useQuestionOptionsStyle } from "./QuestionOptions.style";

interface QuestionOptionsProps {
  value: Option[];
  setValue: (value: Option[]) => void;
}

const QuestionOptions = (props: QuestionOptionsProps) => {
  const { value, setValue } = props;
  const { classes } = useQuestionOptionsStyle();
  const [newOption, setNewOption] = useState<string>();
  const [state, handlers] = useListState(value);

  const handleAddNewOption = () => {
    // const newValue = [...value];
    if (newOption) {
      handlers.append({
        content: newOption,
      });
      // newValue.push({
      //   content: newOption,
      //   orderInQuestion: value.length + 1,
      // });
      // setValue(newValue);
    }
    setNewOption("");
  };
  const handleDeleteOption = (index: number) => {
    // const newValue = [...value];
    // newValue.splice(index, 1);
    handlers.remove(index);
    // setValue(newValue);
  };
  useEffect(() => {
    setValue(state);
    console.log("state: ", state);
  }, [state]);

  const items: JSX.Element[] = state.map((option, index) => {
    return (
      <Draggable key={index} index={index} draggableId={index.toString()}>
        {(provided, snapshot) => (
          <Flex
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={classes.optionWrapper}
          >
            <div {...provided.dragHandleProps} className={classes.dragHandle}>
              <IconDrag />
            </div>
            <Input
              w="100%"
              value={option?.content}
              onChange={(event) => {
                const newValue = [...value];
                newValue[index].content = event.currentTarget.value;
                console.log("newValue: ", newValue);
                setValue(newValue);
              }}
            />
            <IconX
              style={{ cursor: "pointer", width: "25px" }}
              onClick={() => handleDeleteOption(index)}
            />
          </Flex>
        )}
      </Draggable>
    );
  });

  return (
    <Flex direction="column" gap="5px" className={classes.wrapper}>
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          handlers.reorder({ from: source.index, to: destination?.index || 0 });
        }}
      >
        <TitleInformation order={5} content="Options" />
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Flex className={classes.optionWrapper}>
          <Input
            value={newOption}
            w="100%"
            placeholder="Enter new option"
            onChange={(event) => {
              setNewOption(event.currentTarget.value);
            }}
          />
          <IconAdd
            style={{ cursor: "pointer", width: "23px" }}
            onClick={handleAddNewOption}
          />
        </Flex>
      </DragDropContext>
      {/* <Flex direction="column" gap="5px" className={classes.wrapper}>
        <TitleInformation order={5} content="Options" />

        {value.map((option, index) => {
          return (
            option && (
              <Flex key={index} className={classes.optionWrapper}>
                <Input
                  w="100%"
                  value={option?.content}
                  onChange={(event) => {
                    const newValue = [...value];
                    newValue[index].content = event.currentTarget.value;
                    console.log("newValue: ", newValue);
                    setValue(newValue);
                  }}
                />
                <IconX
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteOption(index)}
                />
              </Flex>
            )
          );
        })}

        <Flex className={classes.optionWrapper}>
          <Input
            value={newOption}
            w="100%"
            placeholder="Enter new option"
            onChange={(event) => {
              setNewOption(event.currentTarget.value);
            }}
          />
          <IconAdd style={{ cursor: "pointer" }} onClick={handleAddNewOption} />
        </Flex>
      </Flex> */}
    </Flex>
  );
};

export default QuestionOptions;
