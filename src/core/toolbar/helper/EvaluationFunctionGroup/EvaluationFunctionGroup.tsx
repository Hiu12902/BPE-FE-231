import { DEFAULT_SPACING } from '@/core/toolbar/constants/size';
import { IconBpeExportLarge, IconBpeSaveLarge } from '@/core/toolbar/utils/icons/Icons';
import { Group, Stack, TextInput } from '@mantine/core';
import ToolbarIcon from '../ToolbarIcon/ToolbarIcon';
import { CSSProperties, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getActiveTab, getEvaluatedResult } from '@/redux/selectors';
import { openConfirmModal } from '@mantine/modals';
import projectApi from '@/api/project';
import useNotification from '@/hooks/useNotification';
import { TabVariant } from '@/redux/slices/tabs';

const EvaluationFunctionGroup = ({ style }: { style?: CSSProperties }) => {
  const activeTab = useSelector(getActiveTab);
  const evaluatedResult = useSelector(getEvaluatedResult)[activeTab?.id as string];
  const fileNameRef = useRef<HTMLInputElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const notify = useNotification();

  const handleSaveResult = async () => {
    try {
      if (!fileNameRef.current?.value) {
        notify({
          title: 'Error!',
          message: 'Please enter a valid file name!',
          type: 'error',
        });
        return;
      }
      if (
        !!evaluatedResult &&
        activeTab &&
        activeTab.projectID &&
        activeTab.model &&
        activeTab?.processId
      ) {
        console.log({
          projectID: activeTab?.projectID,
          version: activeTab?.model,
          name: fileNameRef.current.value,
          result: evaluatedResult,
          processID: activeTab?.processId,
        });

        const res = await projectApi.saveResult({
          projectID: activeTab?.projectID,
          version: activeTab?.model,
          name: fileNameRef.current.value,
          result: evaluatedResult,
          processID: activeTab?.processId,
        });
        if (res) {
          notify({
            title: 'Success!',
            message: 'Save evaluated result for model successfully!',
            type: 'success',
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openSaveResultModal = () => {
    openConfirmModal({
      title: 'Save Result',
      children: <TextInput placeholder="Name your result file" ref={fileNameRef} />,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: handleSaveResult,
    });
  };

  const encodeResult = () => {
    const encodedData = encodeURIComponent(JSON.stringify(evaluatedResult));
    downloadLinkRef.current?.setAttribute(
      'href',
      'data:application/json;charset=UTF-8,' + encodedData
    );
    downloadLinkRef.current?.setAttribute('download', `${activeTab?.model}.json`);
  };

  return (
    <Stack spacing={DEFAULT_SPACING} style={style}>
      <Group>
        <ToolbarIcon
          icon={IconBpeSaveLarge}
          label="Save Result"
          title="Save evaluated result"
          orientation="vertical"
          size="large"
          onClick={openSaveResultModal}
          disabled={activeTab?.isCompare}
        />
        <ToolbarIcon
          icon={IconBpeExportLarge}
          label="Export Result"
          title="Export evaluated result in json format"
          orientation="vertical"
          size="large"
          onClick={() => downloadLinkRef.current?.click()}
          disabled={activeTab?.isCompare}
        />
        <a ref={downloadLinkRef} download onClick={() => encodeResult()} />
      </Group>
    </Stack>
  );
};

export default EvaluationFunctionGroup;
