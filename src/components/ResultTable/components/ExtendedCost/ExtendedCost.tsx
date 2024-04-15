import { ActionIcon, Flex, Text } from "@mantine/core";
import { ReactComponent as IconClose } from "@tabler/icons/icons/x.svg";
import { DataTable, DataTableColumn } from "mantine-datatable";

interface ExtendedCostProps {
  lane: string;
  cost: number;
}

interface TableProps {
  rows?: ExtendedCostProps[];
  onClose?: () => void;
}

const ExtendedQuality = ({ rows, onClose }: TableProps) => {
  const columns: DataTableColumn<ExtendedCostProps>[] = [
    {
      accessor: "lane",
      title: "Lane",
      width: 170,
      textAlignment: "center",
      render: (record: ExtendedCostProps) => {
        return (
          <Flex justify="center">
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.lane}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "cost",
      title: "Unit cost",
      width: 170,
      textAlignment: "center",
      render: (record: ExtendedCostProps) => {
        return (
          <Flex justify="center">
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.cost}
            </Text>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex direction="column" gap={10}>
      <Flex align="center" gap={10}>
        <ActionIcon
          onClick={onClose}
          size={20}
          color="red"
          variant="filled"
          radius={100}
          children={<IconClose />}
        />
        <Text fw="bold">Unit cost detail</Text>
      </Flex>
      <Flex>
        <DataTable
          striped={false}
          columns={columns}
          records={rows ? rows : []}
          withBorder
          loaderSize="lg"
          withColumnBorders
          borderRadius={"sm"}
          loaderVariant="dots"
          verticalSpacing={"sm"}
          loaderBackgroundBlur={5}
          horizontalSpacing={"sm"}
          verticalAlignment={"center"}
        />
      </Flex>
    </Flex>
  );
};

export default ExtendedQuality;
