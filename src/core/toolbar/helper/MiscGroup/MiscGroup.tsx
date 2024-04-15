import CommentSection from "@/components/CommentSection/CommentSection";
import ResultFilesModal from "@/components/ResultFilesModal";
import { getCurrentModeler, getProject } from "@/redux/selectors";
import { Badge, Group, Menu, Modal, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import { DEFAULT_SPACING } from "@/core/toolbar/constants/size";
import {
  IconBpeComment,
  IconBpeFiles,
  IconBpeResult,
} from "@/core/toolbar/utils/icons/Icons";
import ToolbarIcon from "../ToolbarIcon/ToolbarIcon";
import projectApi from "@/api/project";
import Workspace from "@/components/Workspace";
import useNotification from "@/hooks/useNotification";
import { UserRole } from "@/constants/project";

const MiscGroup = () => {
  const [openCommentSection, setOpenCommentSection] = useState(false);
  const [openFilesList, setOpenFilesList] = useState(false);
  const [openFileMenu, setOpenFileMenu] = useState(false);
  const [openModels, setOpenModels] = useState(false);
  const currentModeler = useSelector(getCurrentModeler);
  const projects = useSelector(getProject);
  const currentProject = projects[currentModeler?.projectId!];
  const notify = useNotification();

  const onCreateNewVersion = async (): Promise<void> => {
    try {
      const { xml } = await currentModeler?.modeler?.saveXML({ format: true });
      const blob = new Blob([xml], { type: "text/xml" });
      const file = new File([blob], `${currentModeler?.id}.bpmn`);
      const data = new FormData();
      data.append("file", file);

      if (currentModeler?.projectId && currentModeler?.processId) {
        const res = await projectApi.createNewVersion(
          {
            projectId: currentModeler?.projectId,
            processId: currentModeler?.processId,
          },
          data
        );
        if (res) {
          notify({
            title: "Success!",
            message: "Create new version for model successfully!",
            type: "success",
          });
        }
      }
    } catch (err) {
      console.error(err);
      // @ts-ignore
      if (err.data === "current number of versions is equal to 5") {
        notify({
          title: "Opps!",
          message:
            "The number of versions has reached limit, please delete other versions and try again!",
          type: "error",
        });
      }
    }
  };

  const renderModelsModal = () => {
    return (
      <Modal
        opened={openModels}
        onClose={() => setOpenModels(false)}
        title={<Badge size="lg">Open models from your workspace</Badge>}
        size="90%"
      >
        {/* <Workspace name="Personal" isOpenFromEditor /> */}
        <Workspace />
      </Modal>
    );
  };

  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        <CommentSection
          opened={openCommentSection}
          onClose={() => setOpenCommentSection(() => false)}
        />
        <ResultFilesModal
          opened={openFilesList}
          onClose={() => setOpenFilesList(false)}
        />
        <ToolbarIcon
          icon={IconBpeComment}
          label="Comment"
          title="Open Comment Section"
          orientation="vertical"
          size="large"
          onClick={() => setOpenCommentSection((o) => !o)}
          overflow
          active={openCommentSection}
          disabled={!currentModeler}
        />
        <ToolbarIcon
          icon={IconBpeResult}
          label="Evaluated Results"
          title="Open Evaluated Results"
          orientation="vertical"
          size="large"
          onClick={() => setOpenFilesList((o) => !o)}
          overflow
          disabled={!currentModeler}
        />
        <Menu
          shadow="md"
          opened={openFileMenu}
          onChange={setOpenFileMenu}
          position="bottom"
        >
          <Menu.Target>
            <ToolbarIcon
              icon={IconBpeFiles}
              label="Files"
              title="Open Or Create New Model"
              orientation="vertical"
              size="large"
              onClick={() => setOpenFileMenu((o) => !o)}
              overflow
            />
          </Menu.Target>

          <Menu.Dropdown
            styles={{
              zIndex: "20",
            }}
          >
            <Menu.Item
              onClick={onCreateNewVersion}
              disabled={
                !currentModeler || currentModeler.role === UserRole.CAN_VIEW
              }
            >
              Create New Version
            </Menu.Item>
            <Menu.Item onClick={() => setOpenModels(true)}>
              Open Models
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {renderModelsModal()}
      </Group>
      <Text size="xs" align="center" weight="bold">
        Misc
      </Text>
    </Stack>
  );
};

export default MiscGroup;
