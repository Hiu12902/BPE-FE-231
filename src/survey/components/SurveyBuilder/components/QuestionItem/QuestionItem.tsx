import {
  QuestionNameConversion,
  QuestionNoConversion,
} from "@/constants/survey";
import useNotification from "@/hooks/useNotification";
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/hooks/useQuestion";
import {
  IsChangedQuestionContextProps,
  Question,
  SelectedQuestionContextProps,
} from "@/interfaces/index";
import { ConfirmModal, CreateQuestionModal } from "@/survey/components/Modal";
import {
  IsChangedQuestionContext,
  SelectedQuestionContext,
} from "@/survey/context";
import { Draggable } from "@hello-pangea/dnd";
import { ActionIcon, ActionIconProps, Badge, Box, Flex } from "@mantine/core";
import { ReactComponent as IconDrag } from "@tabler/icons/icons/dots-vertical.svg";
import { ReactComponent as IconDelete } from "@tabler/icons/icons/trash.svg";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuestionItemStyle } from "./QuestionItem.style";
import {
  CESINQuestion,
  CESQuestion,
  CSATINQuestion,
  CSATQuestion,
  MultipleChoiceQuestion,
  NPSQuestion,
  BranchingQuestion,
} from "./components";

interface AddButtonProps extends ActionIconProps {
  handleAddNewQuestion: () => void;
}

const AddButton = (props: AddButtonProps) => {
  const { classes } = useQuestionItemStyle();

  return (
    <ActionIcon
      size="md"
      radius="xl"
      color="blue"
      children="+"
      variant="filled"
      {...props}
      className={classes.addButton}
      onClick={(e) => {
        e.stopPropagation();
        props.handleAddNewQuestion();
      }}
    />
  );
};

interface QuestionItemProps {
  data: Question;
  sectionId: number;
  index: number;
}

const QuestionItem = (props: QuestionItemProps) => {
  const { classes } = useQuestionItemStyle();
  const { data, sectionId, index } = props;
  const questionType = data.questionType || "";
  const projectId = useParams().projectId;
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { selectedQuestion, setSelectedQuestion } = useContext(
    SelectedQuestionContext
  ) as SelectedQuestionContextProps;
  const { refetch, isChanged, setIsChanged } = useContext(
    IsChangedQuestionContext
  ) as IsChangedQuestionContextProps;
  const notify = useNotification();
  const [newQuestionOrder, setNewQuestionOrder] = useState<number>(0);

  const deleteQuestionMutation = useDeleteQuestionMutation({
    onSuccess: () => {
      setOpenDeleteModal(false);
      notify({
        title: "Delete question successfully",
        message: "The question has been deleted",
        type: "success",
      });
      refetch();
    },
  });

  const createQuestionMutation = useCreateQuestionMutation({
    onSuccess: () => {
      setOpenCreateModal(false);
      notify({
        title: "Create question successfully",
        message: "The question has been created",
        type: "success",
      });
      refetch();
    },
  });

  const handleDeleteQuestion = () => {
    deleteQuestionMutation.mutate({
      sectionId: sectionId,
      projectId: Number(projectId),
      questionInSectionId: data.id,
    });
  };

  const handleAddAboveQuestion = () => {
    if (index - 1 < 0) {
      setNewQuestionOrder(index);
      setOpenCreateModal(true);
      return;
    }
    setNewQuestionOrder(index - 1);
    setOpenCreateModal(true);
  };

  const handleAddBelowQuestion = () => {
    setNewQuestionOrder(index + 1);
    setOpenCreateModal(true);
  };

  const handleCreateQuestion = (data: Question) => {
    console.log("Create question with data: ", data);
    createQuestionMutation.mutate({
      sectionId: sectionId,
      projectId: Number(projectId),

      content: data.content,
      weight: data.weight,
      orderInSection: newQuestionOrder,
      isRequired: data.isRequired,
      questionType: data.questionType,
      questionOptions: data.questionOptions,
    });
  };

  const items = () => {
    return (
      <Flex
        direction="column"
        className={
          selectedQuestion.id === data.id ? classes.active : classes.body
        }
        onClick={() => {
          if (isChanged) {
            setOpenConfirmModal(true);
          } else {
            setSelectedQuestion(data);
          }
        }}
      >
        <Flex w="100%" justify="space-between" align="center">
          <AddButton
            top={-25}
            left={-25}
            handleAddNewQuestion={handleAddAboveQuestion}
          />
          <Flex className={classes.questionControl} align="center">
            <Badge
              color="blue"
              variant="filled"
              children={questionType && QuestionNameConversion[questionType]}
            />
            <ActionIcon
              variant="outline"
              color="red"
              size="sm"
              children={<IconDelete />}
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteModal(true);
              }}
            />
          </Flex>
        </Flex>
        <Box className={classes.content}>
          {questionType &&
            {
              0: <BranchingQuestion data={data} />,
              1: <CESQuestion data={data} />,
              2: <CESINQuestion data={data} />,
              3: <CSATQuestion data={data} />,
              4: <CSATINQuestion data={data} />,
              5: <NPSQuestion data={data} />,
              6: <MultipleChoiceQuestion data={data} />,
            }[QuestionNoConversion[questionType]]}
        </Box>
        <AddButton
          bottom={-25}
          left={-25}
          handleAddNewQuestion={handleAddBelowQuestion}
        />
      </Flex>
    );
  };

  return (
    <Flex className={classes.wrapper}>
      <ConfirmModal
        opened={openConfirmModal}
        title="Do you want to discard changes"
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={() => {
          setOpenConfirmModal(false);
          setSelectedQuestion(data);
          setIsChanged(false);
        }}
      />
      <ConfirmModal
        opened={openDeleteModal}
        title="Do you want to delete this question?"
        message={
          data.origin === "system"
            ? "This question is auto-generated by system when you create a survey, please highly consider before deleting this question since it will affect on the survey results."
            : "Please highly consider before deleting this question."
        }
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteQuestion}
      />
      <CreateQuestionModal
        opened={openCreateModal}
        onCreate={handleCreateQuestion}
        onClose={() => setOpenCreateModal(false)}
      />
      <Draggable key={index} index={index} draggableId={index.toString()}>
        {(provided, snapshot) => (
          <Flex
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={classes.contentWrapper}
          >
            <div {...provided.dragHandleProps} className={classes.dragHandle}>
              <IconDrag />
            </div>
            {items()}
          </Flex>
        )}
      </Draggable>
    </Flex>
  );
};

export default QuestionItem;
