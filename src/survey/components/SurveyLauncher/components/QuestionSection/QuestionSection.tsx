import { useQuestionInSectionQuery } from "@/hooks/useQuestion";
import { responseActions } from "@/redux/slices";
import { Flex, Loader } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import QuestionItem from "../QuestionItem";

interface QuestionSectionProps {
  sectionId: number;
}

const QuestionSection = (props: QuestionSectionProps) => {
  const { sectionId } = props;
  const dispatch = useDispatch();

  const { data, isLoading, isFetching } = useQuestionInSectionQuery({
    sectionId: sectionId,
  });

  useEffect(() => {
    // isFetching==false khi fetch lần đầu, isFetching==true khi refetch, refetch khi back/next nên không cần dispatch để set lại response trong store
    if (data) {
      data.questions.forEach((question) => {
        const { id: questionId, isRequired } = question;
        if (question.isRequired !== undefined) {
          dispatch(
            responseActions.setSectionResponse({
              sectionId: sectionId,
              questionId: questionId,
              isRequired: isRequired,
              value: undefined,
            })
          );
        }
      });
    }
  }, [data]);

  return isLoading ? (
    <Flex w="100%" m={20} justify="center" align="center">
      <Loader />
    </Flex>
  ) : (
    <Flex
      direction="column"
      style={{
        width: "100%",
        padding: "20px",
        gap: "20px",
      }}
    >
      {data ? (
        data.questions.map((question, questionIndex) => {
          return (
            <QuestionItem
              data={question}
              sectionId={sectionId}
              index={questionIndex + 1}
            />
          );
        })
      ) : (
        <Flex direction="column">
          <p>No data found!</p>
        </Flex>
      )}
    </Flex>
  );
};

export default QuestionSection;
