import { Container, Stack } from '@mantine/core';
import Workspace from '@/components/Workspace';

const MainScreen = () => {
  return (
    <Container size="xl">
      <Stack>
        <Workspace name="Personal" />
      </Stack>
    </Container>
  );
};

export default MainScreen;
