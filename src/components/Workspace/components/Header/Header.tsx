import { IQueryParams } from "@/interfaces/index";
import {
  ActionIcon,
  Checkbox,
  Divider,
  Flex,
  Grid,
  HoverCard,
  Title,
} from "@mantine/core";
import { ReactComponent as IconFilter } from "@tabler/icons/icons/filter.svg";
import { useState } from "react";
import { useHeaderStyle } from "./Header.style";

const Header = ({
  onQueryFilter,
}: {
  onQueryFilter: (queryFilter: IQueryParams) => void;
}) => {
  const { classes } = useHeaderStyle();
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <Grid justify="center" align="center">
      <Grid.Col span={3} pl={10}>
        <Flex justify="flex-start" children={"Name"} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Flex justify="center" children={"Owner"} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Flex justify="center" children={"Created at"} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Flex justify="flex-end">
          <HoverCard width={300} shadow="md" position="bottom-end">
            <HoverCard.Target>
              <ActionIcon>
                <IconFilter width={20} height={20} />
              </ActionIcon>
            </HoverCard.Target>

            <HoverCard.Dropdown py="lg">
              <Title size={"h6"}>Filter by:</Title>
              <Divider my="xs" />
              <Checkbox.Group
                onChange={(value: string[]) => {
                  const queryFilter: IQueryParams = {};
                  value.forEach((filter: string) => {
                    if (filter === "oldest") {
                      queryFilter.createdAt = "oldest";
                    }
                  });
                  setFilters(value);
                  onQueryFilter(queryFilter);
                }}
                value={filters}
                className={classes.checkboxGroup}
              >
                <Checkbox value="oldest" label="Lastest opened projects" />
              </Checkbox.Group>
            </HoverCard.Dropdown>
          </HoverCard>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default Header;
