import { Container, Stack } from '@mantine/core';
import Workspace from '@/components/Workspace';
import { useDocumentTitle } from '@mantine/hooks';

const MainScreen = () => {
  useDocumentTitle('Home - BPSky');

  return (
    <Container size="xl">
      <Stack>
        <Workspace name="Personal" />
      </Stack>
    </Container>
  );
};

export default MainScreen;
