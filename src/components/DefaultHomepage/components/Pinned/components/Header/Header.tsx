import { IQueryParams } from "@/interfaces/index";
import { getCurrentUser } from "@/redux/selectors";
import { ActionIcon, Checkbox, Flex, Grid, HoverCard } from "@mantine/core";
import { ReactComponent as IconFilter } from "@tabler/icons/icons/filter.svg";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHeaderStyle } from "./Header.style";

const Header = ({
  onQueryFilter,
}: {
  onQueryFilter: (queryFilter: IQueryParams) => void;
}) => {
  const { classes } = useHeaderStyle();
  const { id } = useSelector(getCurrentUser);
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
        <Flex justify="center" children={"Last modified"} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Flex justify="flex-end">
          <HoverCard width={200} shadow="md" position="bottom-end">
            <HoverCard.Target>
              <ActionIcon>
                <IconFilter width={20} height={20} />
              </ActionIcon>
            </HoverCard.Target>

            <HoverCard.Dropdown>
              <Checkbox.Group
                onChange={(value: string[]) => {
                  const queryFilter: IQueryParams = {};
                  value.forEach((filter: string) => {
                    if (filter === "owner") {
                      queryFilter.ownerId = id;
                    }
                    if (filter === "oldest") {
                      queryFilter.openedAt = "oldest";
                    }
                  });
                  setFilters(value);
                  onQueryFilter(queryFilter);
                }}
                value={filters}
                className={classes.checkboxGroup}
              >
                <Checkbox value="owner" label="Workspace của tôi" />
                <Checkbox value="oldest" label="Được mở cuối cùng" />
              </Checkbox.Group>
            </HoverCard.Dropdown>
          </HoverCard>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default Header;
