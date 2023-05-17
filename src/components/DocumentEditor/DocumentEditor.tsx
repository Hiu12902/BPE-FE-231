import projectApi from '@/api/project';
import { ActionIcon, Skeleton } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
//@ts-ignore
import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as IconSave } from '@tabler/icons/icons/device-floppy.svg';

const initialContent = `
# Document
---
`;

const DocumentEditor = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('p');
  const projectName = searchParams.get('project');
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<string | undefined>(initialContent);
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

  const saveButton = {
    name: 'title2',
    keyCommand: 'title2',
    render: () => {
      return (
        <ActionIcon aria-label="Insert title2" onClick={saveDocument}>
          <IconSave />
        </ActionIcon>
      );
    },
  };

  useEffect(() => {
    getDocumentContent();
  }, []);

  return (
    <div data-color-mode="light">
      <MDEditor value={value} onChange={setValue} extraCommands={[saveButton]} />
      {loading && <Skeleton height="85vh" />}
    </div>
  );
};

export default DocumentEditor;
