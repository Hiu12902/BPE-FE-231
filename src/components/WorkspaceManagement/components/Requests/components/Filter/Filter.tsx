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
  const [filters, setFilters] = React.useState<{
    type?: string;
    status?: string;
  }>({});

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
          onChange={() => {
            setFilters({});
            onQueryFilter({});
          }}
          value={filters.status || filters.type}
          className={classes.checkboxGroup}
        >
          <Radio value="" label="All" />
        </Radio.Group>
        <Divider my="xs" />

        <Radio.Group
          defaultValue=""
          onChange={(value: string) => {
            const queryFilter: IQueryParams = {};
            queryFilter.status = value;
            setFilters({
              ...filters,
              status: value,
            });
            onQueryFilter(queryFilter);
          }}
          value={filters.status}
          className={classes.checkboxGroup}
        >
          <Radio value="pending" label="Pending requests" />
          <Radio value="approved" label="Approved requests" />
          <Radio value="declined" label="Declined requests" />
        </Radio.Group>
        <Divider my="xs" />
        <Radio.Group
          defaultValue=""
          onChange={(value: string) => {
            const queryFilter: IQueryParams = {};
            queryFilter.type = value;
            setFilters({
              ...filters,
              type: value,
            });
            onQueryFilter({
              ...filters,
              type: value,
            });
          }}
          value={filters.type}
          className={classes.checkboxGroup}
        >
          <Radio value="invitation" label="Invitation requests" />
          <Radio value="adjust permission" label="Adjust permission requests" />
        </Radio.Group>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default Filter;
