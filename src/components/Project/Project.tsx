import {
  Accordion,
  ActionIcon,
  Container,
  Divider,
  Group,
  Space,
  Stack,
  Title,
} from '@mantine/core';
import { ReactComponent as IconInfoCircleFilled } from '@tabler/icons/icons/info-circle-filled.svg';
import { ReactComponent as IconUserShare } from '@tabler/icons/icons/user-plus.svg';
import { useParams } from 'react-router-dom';
import FileItem from '@/components/FileItem';
import { useEffect, useState } from 'react';
import { IFile } from '@/interfaces/projects';
import projectApi from '@/api/project';
import { fade } from '@mantine/core/lib/Skeleton/Skeleton.styles';
import { useDocumentTitle } from '@mantine/hooks';

const Project = () => {
  const { projectName, projectId } = useParams();
  const [openBpmnVersions, setOpenBpmnVersions] = useState(false);
  const [openDocument, setOpenDocument] = useState(false);
  const [bpmmnVerions, setBpmnVerions] = useState<IFile[]>([]);
  const [document, setDocument] = useState<IFile>();

  useDocumentTitle(`Project ${projectName} - BPSky`);

  const getBpmnVerions = async () => {
    try {
      if (bpmmnVerions.length > 0) {
        return;
      }
      if (projectId) {
        const response = await projectApi.getBpmnFilesOfProject(parseInt(projectId));
        setBpmnVerions(response);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDocument = async () => {
    try {
      if (bpmmnVerions.length > 0) {
        return;
      }
      if (projectId) {
        const response = await projectApi.getProjectDocument(parseInt(projectId));
        setDocument(response);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([getBpmnVerions(), getDocument()]);
  }, []);

  return (
    <Container size="90%">
      <Group>
        <Title order={2}>Project {projectName}</Title>
        <ActionIcon>
          <IconInfoCircleFilled />
        </ActionIcon>
        <ActionIcon>
          <IconUserShare />
        </ActionIcon>
      </Group>
      <Divider my="lg" />
      <Accordion variant="contained" chevronPosition="left" multiple>
        <Accordion.Item value="bpmnVersions">
          <Accordion.Control onClick={() => setOpenBpmnVersions((o) => !o)}>
            BPMN Versions
          </Accordion.Control>
        </Accordion.Item>
        {openBpmnVersions && (
          <Stack mt={20}>
            {bpmmnVerions?.map((file) => (
              <FileItem
                {...file}
                projectName={projectName}
                projectId={parseInt(projectId as string)}
                canDelete={bpmmnVerions.length > 1}
                onDeleteFile={(fileLink) => {
                  const tempFiles = bpmmnVerions.filter((file) => file.xmlFileLink !== fileLink);
                  setBpmnVerions(tempFiles);
                }}
              />
            ))}
          </Stack>
        )}
        <Space h="md" />
        <Accordion.Item value="document">
          <Accordion.Control onClick={() => setOpenDocument((o) => !o)}>Document</Accordion.Control>
        </Accordion.Item>
        {openDocument && (
          <Stack mt={20}>
            <FileItem
              {...document}
              projectName={projectName}
              projectId={parseInt(projectId as string)}
              canDelete={false}
            />
          </Stack>
        )}
      </Accordion>
    </Container>
  );
};

export default Project;
