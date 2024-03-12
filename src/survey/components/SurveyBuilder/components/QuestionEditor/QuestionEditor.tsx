import { IsChangedQuestionContextProps, Survey } from "@/interfaces/index";
import { IsChangedQuestionContext } from "@/survey/context";
import {
  Badge,
  Button,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useContext } from "react";
import QuestionSection from "../QuestionSection";
import { useQuestionEditorStyle } from "./QuestionEditor.style";

interface QuestionEditorProps {
  data?: Survey;
}

const QuestionEditor = (props: QuestionEditorProps) => {
  const { data } = props;
  const { classes } = useQuestionEditorStyle();
  // const { isFetching } = useContext(
  //   IsChangedQuestionContext
  // ) as IsChangedQuestionContextProps;
  return (
    <Flex
      className={classes.wrapper}
      direction="column"
      justify="center"
      align="center"
    >
      {/* {isFetching ? (
        <Loader />
      ) : (
        <> */}
      <Flex
        justify="space-between"
        align="center"
        className={classes.infoGroup}
      >
        <Group>
          <Badge>Draft</Badge>
          <Text c="dimmed">Last saved: Feb 3, 2024 at 2:15 AM.</Text>
        </Group>
        <Button variant="light" color="blue" children="Add New question" />
      </Flex>

      <ScrollArea className={classes.editArea}>
        {data?.questions.map((section) => (
          <QuestionSection key={section.sectionId} data={section} />
        ))}
      </ScrollArea>

      <Flex
        className={classes.buttonGroup}
        justify="space-between"
        align="center"
      >
        <Group>
          <Button variant="light" color="gray" children="Preview" />
          <Button variant="light" color="indigo" children="Publish" />
        </Group>
        <Button variant="light" color="green" children="Save" />
      </Flex>
      {/* </>
      )} */}
    </Flex>
  );
};

export default QuestionEditor;
