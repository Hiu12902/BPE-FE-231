import { Flex, Image, Modal, ModalProps, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import FileItem from '../FileItem/FileItem';
import projectApi from '@/api/project';
import { useSelector } from 'react-redux';
import { getCurrentModeler } from '@/redux/selectors';
import emptyEditor from '@/assets/empty-editor.png';

interface IResultFile {
  name?: string;
  description?: string;
  createAt?: string;
  result?: any;
}

const ResultFilesModal = (props: ModalProps) => {
  const { opened } = props;
  const currentModeler = useSelector(getCurrentModeler);
  const [files, setFiles] = useState<IResultFile[]>([]);

  const getResults = async () => {
    if (!currentModeler?.projectId || !currentModeler.id) {
      return;
    }
    try {
      const res = await projectApi.getResults({
        projectID: currentModeler.projectId,
        version: currentModeler?.id,
      });
      if (res) {
        setFiles(res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getResults();
  }, [opened]);

  const renderNoFiles = () => {
    return (
      <Flex align="center" justify="center" direction="column">
        <Image src={emptyEditor} width={120} height={120} />
        <Text color="dimmed" align="center" w="65%" size="sm">
          No results found for this model. You can start evaluating this model and save your
          results.
        </Text>
      </Flex>
    );
  };

  return (
    <Modal
      {...props}
      centered
      title={<Text size="lg">Evaluated Results of project1.bpmn</Text>}
      size="lg"
    >
      <Stack spacing={0}>
        {files.length > 0 ? files.map((file) => <FileItem {...file} />) : renderNoFiles()}
      </Stack>
    </Modal>
  );
};

export default ResultFilesModal;
