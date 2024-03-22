import { ISurveyResult } from "@/interfaces/survey";
import { Badge, Flex, Progress, Title, Tooltip } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";

interface ProgressBarProps {
  result: ISurveyResult;
}

const ProgressBar = (props: ProgressBarProps) => {
  const { result } = props;
  const [hoverSection, setHoverSection] = useState<string>("");
  const [debounce] = useDebouncedValue(hoverSection, 100);
  return (
    <Flex direction="column" gap={30}>
      {/* Overall bar */}
      <Flex align="center">
        <Flex w="10%" justify="flex-end" px={20}>
          <Badge size="md" variant="outline">
            Overall
          </Badge>
        </Flex>
        <Flex w="90%">
          <Progress
            radius={0}
            size="xl"
            w="100%"
            bg="#d0f1e7"
            sections={[
              {
                value: result?.ces?.score * 100,
                color: "teal",
                label: "CES",
                tooltip: `${(
                  (result?.ces?.score / 100) *
                  result?.ces?.weight
                ).toFixed(3)}/1.0`,
                onMouseEnter: () => setHoverSection("ces"),
                onMouseLeave: () => setHoverSection(""),
              },
            ]}
          />
          <Progress
            radius={0}
            size="xl"
            w="100%"
            bg="#ffe5dc"
            sections={[
              {
                value: result?.csat?.score * 100,
                color: "coral",
                label: "CSAT",
                tooltip: `CSAT - ${(
                  (result?.csat?.score / 100) *
                  result?.csat?.weight
                ).toFixed(3)}/1.0`,
                onMouseEnter: () => setHoverSection("csat"),
                onMouseLeave: () => setHoverSection(""),
              },
            ]}
          />
          <Progress
            radius={0}
            size="xl"
            w="100%"
            bg="#dbe2fd"
            sections={[
              {
                value: result?.nps?.score * 100,
                color: "indigo",
                label: "NPS",
                tooltip: `NPS - ${(
                  (result?.nps?.score / 100) *
                  result?.nps?.weight
                ).toFixed(3)}/1.0`,
                onMouseEnter: () => setHoverSection("nps"),
                onMouseLeave: () => setHoverSection(""),
              },
            ]}
          />
        </Flex>
        {/* <Progress
          size="xl"
          w="100%"
          sections={[
            {
              value: result?.ces?.score * result?.ces?.weight,
              color: "teal",
              label: "CES",
              tooltip: "CES",
              // tooltip: `CES - ${(
              //   (result?.ces?.score / 100) *
              //   result?.ces?.weight
              // ).toFixed(3)}`,
            },
            {
              value: result?.csat?.score * result?.csat?.weight,
              color: "coral",
              label: "CSAT",
              tooltip: "CSAT",
              // tooltip: `CSAT - ${(
              //   (result?.csat?.score / 100) *
              //   result?.csat?.weight
              // ).toFixed(3)}`,
            },
            {
              value: result?.nps?.score * result?.nps?.weight,
              color: "indigo",
              label: "NPS",
              tooltip: "NPS",
              // tooltip: `NPS - ${(
              //   (result?.nps?.score / 100) *
              //   result?.nps?.weight
              // ).toFixed(3)}`,
            },
          ]}
        /> */}
      </Flex>
      {/* Detail factors bar */}
      <Flex gap={30} direction="column">
        {/* CES */}
        <Flex
          justify="center"
          align="center"
          opacity={debounce === "" ? 1 : debounce === "ces" ? 1 : 0.2}
        >
          <Flex w="10%" justify="flex-end" px={20}>
            <Badge
              size="md"
              variant="outline"
              color="teal"
              // variant="gradient"
              // gradient={{ from: "teal", to: "lime", deg: 100 }}
            >
              CES
            </Badge>
          </Flex>
          <Flex w="90%">
            <Progress
              animate={debounce === "ces"}
              radius={0}
              size="xl"
              w="100%"
              bg="#d0f1e7"
              sections={[
                {
                  value: result?.ces?.score * 100,
                  color: "teal",
                  tooltip: (
                    <Flex direction="column">
                      <Title order={5}>Customer effort score</Title>
                      <Title order={6}>Score: {result?.ces?.score}/1.0</Title>
                      <Title order={6}>
                        Weight: {result?.ces?.weight}% of overall
                      </Title>
                    </Flex>
                  ),
                },
              ]}
            />
          </Flex>
        </Flex>
        {/* CSAT */}
        <Flex
          justify="center"
          align="center"
          opacity={debounce === "" ? 1 : debounce === "csat" ? 1 : 0.2}
        >
          <Flex w="10%" justify="flex-end" px={20}>
            <Badge
              size="md"
              variant="outline"
              color="orange"
              // variant="gradient"
              // gradient={{ from: "coral", to: "yellow", deg: 100 }}
            >
              CSAT
            </Badge>
          </Flex>
          <Flex w="90%">
            <Progress
              animate={debounce === "csat"}
              radius={0}
              size="xl"
              w="100%"
              bg="#ffe5dc"
              sections={[
                {
                  value: result?.csat?.score * 100,
                  color: "coral",
                  tooltip: (
                    <Flex direction="column">
                      <Title order={5}>Customer effort score</Title>
                      <Title order={6}>Score: {result?.csat?.score}/1.0</Title>
                      <Title order={6}>
                        Weight: {result?.csat?.weight}% of overall
                      </Title>
                    </Flex>
                  ),
                },
              ]}
            />
          </Flex>
        </Flex>
        {/* NPS */}
        <Flex
          justify="center"
          align="center"
          opacity={debounce === "" ? 1 : debounce === "nps" ? 1 : 0.2}
        >
          <Flex w="10%" justify="flex-end" px={20}>
            <Badge
              size="md"
              variant="outline"
              color="indigo"
              // variant="gradient"
              // gradient={{ from: "cyan", to: "indigo", deg: 105 }}
            >
              NPS
            </Badge>
          </Flex>
          <Flex w="90%">
            <Progress
              animate={debounce === "nps"}
              radius={0}
              size="xl"
              w="100%"
              bg="#dbe2fd"
              sections={[
                {
                  value: result?.nps?.score * 100,
                  color: "indigo",
                  tooltip: (
                    <Flex direction="column">
                      <Title order={5}>Customer effort score</Title>
                      <Title order={6}>Score: {result?.nps?.score}/1.0</Title>
                      <Title order={6}>
                        Weight: {result?.nps?.weight}% of overall
                      </Title>
                    </Flex>
                  ),
                },
              ]}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProgressBar;
