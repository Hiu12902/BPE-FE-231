import { IQueryParams } from "@/interfaces/index";
import { ActionIcon, Divider, HoverCard, Radio, Title } from "@mantine/core";
import { ReactComponent as IconFilter } from "@tabler/icons/icons/filter.svg";
import React from "react";
import { useFilterStyle } from "./Filter.style";

const Filter = ({
  onQueryFilter,
}: {
  onQueryFilter: (queryFilter: IQueryParams) => void;
}) => {
  const { classes } = useFilterStyle();
  const [filters, setFilters] = React.useState<string>("all");

  return (
    <HoverCard width={300} shadow="md" position="bottom-end">
      <HoverCard.Target>
        <ActionIcon>
          <IconFilter width={20} height={20} />
        </ActionIcon>
      </HoverCard.Target>

      <HoverCard.Dropdown py="lg">
        <Title size={"h6"}>Filter by:</Title>
        <Divider my="xs" />
        <Radio.Group
          defaultValue=""
          onChange={(value: string) => {
            const queryFilter: IQueryParams = {};
            queryFilter.isStarred =
              value === "starred"
                ? true
                : value === "unstarred"
                ? false
                : value === "all"
                ? undefined
                : undefined;
            queryFilter.notificationType =
              value === "invitation"
                ? "invitation"
                : value === "adjust permission"
                ? "adjust permission"
                : value === "all"
                ? undefined
                : undefined;
            setFilters(value);
            onQueryFilter(queryFilter);
          }}
          value={filters}
          className={classes.checkboxGroup}
        >
          <Radio value="all" label="All" />
          <Radio value="starred" label="Starred notification" />
          <Radio value="unstarred" label="Unstarred notification" />
          <Radio value="invitation" label="Invitation notification" />
          <Radio
            value="adjust permission"
            label="Adjust permission notification"
          />
        </Radio.Group>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default Filter;
