import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { PortfolioProject } from "@/interfaces/index";
import { Accordion, Avatar, Flex, Grid, Text, Tooltip } from "@mantine/core";
import { ReactComponent as IconFolder } from "@tabler/icons/icons/folder.svg";
import { useState } from "react";
import ProcessList from "../ProcessList";

interface ProjectListProps {
  data: PortfolioProject[];
}

const ProjectList = (props: ProjectListProps) => {
  const { data } = props;
  const [projectId, setProjectId] = useState<number | null>();

  return (
    <>
      {data.map((item: PortfolioProject) => {
        const { id, name, ownerName } = item;
        return (
          <Accordion.Item value={id.toString()}>
            <Accordion.Control
              onClick={() => {
                setProjectId(id);
              }}
            >
              <Grid align="center" justify="center">
                {/* Project name */}
                <Grid.Col span={9}>
                  <Flex justify="flex-start" align="center">
                    <IconFolder
                      width={30}
                      height={30}
                      color={PRIMARY_COLOR[0]}
                      strokeWidth="0.8"
                    />
                    <Text
                      size="sm"
                      truncate="end"
                      style={{
                        marginLeft: 5,
                        maxWidth: "80%",
                      }}
                    >
                      {name}
                    </Text>
                  </Flex>
                </Grid.Col>

                {/* Owner */}
                <Grid.Col span={3}>
                  <Flex justify="center" align="center">
                    <Tooltip
                      label={ownerName}
                      style={{
                        border: "1px solid #ccc",
                      }}
                    >
                      <Avatar radius={50} />
                    </Tooltip>
                  </Flex>
                </Grid.Col>
              </Grid>
            </Accordion.Control>

            <ProcessList projectId={Number(projectId)} />
          </Accordion.Item>
        );
      })}
    </>
  );
};

export default ProjectList;
