import { useUpdateQuestionMutation } from "@/hooks/useQuestion";
import {
  IsChangedQuestionContextProps,
  Question,
  Section,
  SelectedQuestionContextProps,
} from "@/interfaces/index";
import {
  IsChangedQuestionContext,
  SelectedQuestionContext,
} from "@/survey/context";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Flex } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionItem from "../QuestionItem";
import TitleInformation from "../TitleInformation";
import { useQuestionSectionStyle } from "./QuestionSection.style";

interface QuestionSectionProps {
  data: Section;
}

const QuestionSection = (props: QuestionSectionProps) => {
  const { data } = props;
  const { sectionName, sectionId, questions } = data;
  const { classes } = useQuestionSectionStyle();
  const projectId = useParams().projectId;
  const { refetch } = useContext(
    IsChangedQuestionContext
  ) as IsChangedQuestionContextProps;
  const { setSelectedQuestion } = useContext(
    SelectedQuestionContext
  ) as SelectedQuestionContextProps;

  const [state, handlers] = useListState(questions);
  const { mutate: updateQuestion } = useUpdateQuestionMutation({
    onSuccess: (data: any) => {
      console.log("Update question success: ", data);
      refetch();
    },
    onSettled: () => {
      console.log("Update question settled");
    },
  });

  const handleUpdateQuestionOrder = ({
    fromIndex,
    destinationIndex,
  }: {
    fromIndex: number;
    destinationIndex: number;
  }) => {
    const moveQuestion = state[fromIndex];
    updateQuestion({
      sectionId: sectionId,
      projectId: Number(projectId),
      orderInSection: destinationIndex,
      questionInSectionId: moveQuestion.id,
    });
    setSelectedQuestion({} as Question);
  };

  useEffect(() => {
    if (questions) {
      handlers.setState(questions);
    }
  }, [data]);

  return (
    <Flex className={classes.wrapper} id="tour_section">
      {/* <TitleInformation
        ml={10}
        mb={5}
        content={sectionName as string}
        order={4}
      /> */}
      <Flex className={classes.body}>
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            handlers.reorder({
              from: source.index,
              to: destination?.index || 0,
            });
            if (
              destination?.index !== undefined &&
              destination?.index !== source.index
            ) {
              handleUpdateQuestionOrder({
                fromIndex: source.index,
                destinationIndex: destination.index,
              });
            }
          }}
        >
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {state.map((question, index) => (
                  <QuestionItem
                    data={question}
                    sectionId={sectionId}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Flex>
    </Flex>
  );
};

export default QuestionSection;
