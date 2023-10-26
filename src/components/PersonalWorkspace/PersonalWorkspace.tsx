import { Container, Stack } from "@mantine/core";
import Workspace from "@/components/Workspace";
import { useDocumentTitle } from "@mantine/hooks";
import { useSelector } from "react-redux";
import { getModelers } from "@/redux/selectors";
import { useEffect } from "react";

const PersonalWorkspace = () => {
  useDocumentTitle("Personal Workspace | BPSky");
  const modelers = useSelector(getModelers);

  useEffect(() => {
    if (modelers.length === 0) {
      localStorage.removeItem("modelers");
      localStorage.removeItem("currentOpenedModeler");
    }
  }, [modelers]);

  return (
    <Container size="xl">
      <Stack>
        <Workspace />
      </Stack>
    </Container>
  );
};

export default PersonalWorkspace;
