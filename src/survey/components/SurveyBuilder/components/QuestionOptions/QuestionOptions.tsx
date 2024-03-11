import { IsChangedQuestionContextProps, Option } from "@/interfaces/index";
import { IsChangedQuestionContext } from "@/survey/context";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Flex, Input } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { ReactComponent as IconDrag } from "@tabler/icons/icons/dots-vertical.svg";
import { ReactComponent as IconAdd } from "@tabler/icons/icons/plus.svg";
import { ReactComponent as IconX } from "@tabler/icons/icons/x.svg";
import { useContext, useEffect, useState } from "react";
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

  const { isChanged, setIsChanged } = useContext(
    IsChangedQuestionContext
  ) as IsChangedQuestionContextProps;

  const handleAddNewOption = () => {
    if (newOption) {
      handlers.append({
        id: "new",
        content: newOption,
      });
    }
    setNewOption("");
    setIsChanged(true);
  };
  const handleDeleteOption = (index: number) => {
    handlers.remove(index);
    setIsChanged(true);
  };
  useEffect(() => {
    if (!isChanged) {
      // Khi thay đổi value & isChanged=false nghĩa là có sự thay đổi selectedQuestion, dẫn tới editedQuestion và truyền value vào -> Cần update state mới, nếu không state sẽ bị kẹt lại ở câu MC cũ
      handlers.setState(value);
    }
  }, [value]);
  useEffect(() => {
    if (isChanged) {
      // Khi thay đổi state & isChanged=true nghĩa là có sự thêm/xóa option -> Cần update editedQuestion
      setValue(state);
    }
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
          setIsChanged(true);
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
    </Flex>
  );
};

export default QuestionOptions;
