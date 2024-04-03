import { DEFAULT_SPACING } from "@/core/toolbar/constants/size";
import { IconSurvey } from "@/core/toolbar/utils/icons/Icons";
import useNotification from "@/hooks/useNotification";
import { getCurrentModeler } from "@/redux/selectors";
import { Group, Stack, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ToolbarIcon from "../ToolbarIcon/ToolbarIcon";

const SurveyGroup = () => {
  const currentModeler = useSelector(getCurrentModeler);
  const notify = useNotification();

  const handleLaunchSurvey = () => {
    const navigate = useNavigate();
    return () => {
      if (!currentModeler) {
        notify({
          type: "error",
          message: "Please select a process to launch survey",
        });
        return;
      }
      console.log("currentModeler? ", currentModeler);
      if (currentModeler?.role !== 0) {
        notify({
          type: "error",
          message: "You do not have permission to launch survey",
        });
        return;
      }
      navigate(
        `/${currentModeler.projectId}/${currentModeler.id}/survey/builder`
      );
    };
  };

  return (
    <Stack spacing={DEFAULT_SPACING}>
      <Group>
        <ToolbarIcon
          icon={IconSurvey}
          label="Launch Survey"
          title="Open survey builder"
          orientation="vertical"
          size="large"
          onClick={handleLaunchSurvey()}
          overflow
          disabled={
            currentModeler?.role !== undefined && currentModeler.role !== 0
          }
        />
      </Group>
      <Text size="xs" align="center" weight="bold">
        Survey
      </Text>
    </Stack>
  );
};

export default SurveyGroup;
