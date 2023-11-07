import { ActionIcon, Divider, HoverCard, Radio, Title } from "@mantine/core";
import React from "react";
import { ReactComponent as IconFilter } from "@tabler/icons/icons/filter.svg";
import { IQueryParams } from "@/interfaces/index";
import { useFilterStyle } from "./Filter.style";

const Filter = ({
  onQueryFilter,
}: {
  onQueryFilter: (queryFilter: IQueryParams) => void;
}) => {
  const { classes } = useFilterStyle();
  const [filters, setFilters] = React.useState<string>("");

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
            queryFilter.permission = value;
            setFilters(value);
            onQueryFilter(queryFilter);
          }}
          value={filters}
          className={classes.checkboxGroup}
        >
          <Radio value="" label="All" />
          <Radio value="owner" label="Owner" />
          <Radio value="editor" label="Can edit" />
          <Radio value="sharer" label="Can share" />
          <Radio value="viewer" label="Can view" />
        </Radio.Group>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default Filter;
