import { DEFAULT_SPACING } from "@/core/toolbar/constants/size";
import { IconBpeExportLarge } from "@/core/toolbar/utils/icons/Icons";
import { getActiveTab, getEvaluatedResult } from "@/redux/selectors";
import { Group, Stack } from "@mantine/core";
import { CSSProperties, useRef } from "react";
import { useSelector } from "react-redux";
import ToolbarIcon from "../ToolbarIcon/ToolbarIcon";

const EvaluationFunctionGroup = ({ style }: { style?: CSSProperties }) => {
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const activeTab = useSelector(getActiveTab);
  const evaluatedResult =
    useSelector(getEvaluatedResult)[activeTab?.id as string];

  const encodeResult = () => {
    const encodedData = encodeURIComponent(JSON.stringify(evaluatedResult));
    downloadLinkRef.current?.setAttribute(
      "href",
      "data:application/json;charset=UTF-8," + encodedData
    );
    downloadLinkRef.current?.setAttribute(
      "download",
      `${activeTab?.model}.json`
    );
  };

  return (
    <Stack spacing={DEFAULT_SPACING} style={style}>
      <Group>
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
