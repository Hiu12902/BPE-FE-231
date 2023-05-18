import projectApi from '@/api/project';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Skeleton,
  Tabs,
  Textarea,
  createStyles,
} from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as IconSave } from '@tabler/icons/icons/device-floppy.svg';

const initialContent = `
# Document
---

`;

const useStyles = createStyles(() => ({
  editor: {
    padding: 20,
  },
}));

const DocumentEditor = () => {
  const { classes } = useStyles();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('p');
  const projectName = searchParams.get('project');
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<string | undefined>(initialContent);
  const [activeTab, setActiveTab] = useState<string | null>('preview');
  useDocumentTitle(`Document - ${projectName} - BPSky`);

  const getDocumentContent = async () => {
    try {
      if (projectId) {
        const docs = await projectApi.getDocumentContent(parseInt(projectId));
        if (docs) {
          setValue(docs);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = async () => {
    try {
      if (projectId && value) {
        const blob = new Blob([value], { type: 'text/markdown' });
        const file = new File([blob], 'readme.md');
        const data = new FormData();
        data.append('file', file);
        data.append('document_link', `static/${projectId}/readme.md`);

        const res = await projectApi.saveDocument({ projectId: parseInt(projectId) }, data);
        if (res) {
          showNotification({
            title: 'Success!',
            message: 'Saved document successfully!',
            color: 'green',
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDocumentContent();
  }, []);

  return (
    <Container size="xl">
      {!loading ? (
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Group position="apart" w="100%">
              <Group spacing={0}>
                <Tabs.Tab value="editor">Editor</Tabs.Tab>
                <Tabs.Tab value="preview">Preview</Tabs.Tab>
              </Group>
              <Button mb={5} onClick={saveDocument} leftIcon={<IconSave />}>
                Save
              </Button>
            </Group>
          </Tabs.List>

          <Tabs.Panel value="editor" pt="xs">
            <Textarea value={value} onChange={(e) => setValue(e.target.value)} autosize />
          </Tabs.Panel>

          <Tabs.Panel value="preview" pt="xs">
            <ReactMarkdown
              children={value || initialContent}
              remarkPlugins={[remarkGfm]}
              className={classes.editor}
            />
          </Tabs.Panel>
        </Tabs>
      ) : (
        <Skeleton height="85vh" />
      )}
    </Container>
  );
};

export default DocumentEditor;
