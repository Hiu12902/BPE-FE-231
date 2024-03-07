import { Group, Title, TitleProps, Tooltip } from "@mantine/core";

import { ReactComponent as IconInfo } from "@tabler/icons/icons/question-circle.svg";

interface TitleInformationProps extends TitleProps {
  content: string;
  extrainfo?: string;
}

const TitleInformation = (props: TitleInformationProps) => {
  const { content, extrainfo, order, maw = 300, ...other } = props;
  return (
    <Group align="center" spacing="xs">
      <Title order={order} {...other}>
        {content}
      </Title>
      {extrainfo && (
        <Tooltip
          label={extrainfo}
          position="bottom"
          withArrow
          maw={maw}
          multiline
        >
          <Group align="center">
            <IconInfo width={15} height={15} radius={100} />
          </Group>
        </Tooltip>
      )}
    </Group>
  );
};

export default TitleInformation;
