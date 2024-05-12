import { ActionIcon, Flex, Text } from "@mantine/core";
import { ReactComponent as IconClose } from "@tabler/icons/icons/x.svg";
import { DataTable, DataTableColumn } from "mantine-datatable";

interface TableProps {
  rows?: Transparency[];
  onClose?: () => void;
}

interface Transparency {
  view: string;
  numberOfExplicitTask: number;
  transparency: number;
}

const ExtendedTransparency = ({ rows, onClose }: TableProps) => {
  const columns: DataTableColumn<Transparency>[] = [
    {
      accessor: "view",
      title: "From Lane",
      textAlignment: "center",
      width: 170,
      render: (record: Transparency) => {
        return (
          <Flex justify="center">
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.view}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "numberOfExplicitTask",
      title: "Explicit Tasks",
      textAlignment: "center",
      width: 170,
      render: (record: Transparency) => {
        return (
          <Flex justify="center">
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.numberOfExplicitTask}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "transparency",
      title: "Transparency",
      textAlignment: "center",
      width: 170,
      render: (record: Transparency) => {
        return (
          <Flex justify="center">
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.transparency.toFixed(2)}
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
          color="blue"
          variant="filled"
          radius={100}
          children={<IconClose />}
        />
        <Text fw="bold">Transparency detail</Text>
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

export default ExtendedTransparency;
