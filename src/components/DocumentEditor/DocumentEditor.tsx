import projectApi from '@/api/project';
import { Skeleton } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const DocumentEditor = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('p');
  const projectName = searchParams.get('project');
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);
  useDocumentTitle(`Document - ${projectName} - BPSky`);

  const getDocumentContent = async () => {
    try {
      if (projectId) {
        const docs = await projectApi.getDocumentContent(parseInt(projectId));
        if (docs) {
          //@ts-ignore
          editorRef.current?.getInstance()?.insertText(docs);
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
      if (projectId) {
        //@ts-ignore
        const content = editorRef.current?.editorInst?.getMarkdown();
        const blob = new Blob([content], { type: 'text/markdown' });
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

  const createLastButton = () => {
    const button = document.createElement('button');

    button.className = 'toastui-editor-toolbar-icons last';
    button.style.backgroundImage = 'none';
    button.style.margin = '0';
    button.innerHTML = `<i><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-device-floppy" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
      <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M14 4l0 4l-6 0l0 -4" />
    </svg></i>`;

    button.addEventListener('click', saveDocument);

    return button;
  };

  useEffect(() => {
    getDocumentContent();
  }, []);

  return (
    <>
      <Editor
        previewStyle="vertical"
        height={loading ? '0px' : '90vh'}
        initialEditType="markdown"
        useCommandShortcut={true}
        hideModeSwitch
        ref={editorRef}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock'],
          [
            {
              el: createLastButton(),
              name: 'save',
              tooltip: 'Save Document',
            },
          ],
        ]}
      />
      {loading && <Skeleton height="85vh" />}
    </>
  );
};

export default DocumentEditor;
