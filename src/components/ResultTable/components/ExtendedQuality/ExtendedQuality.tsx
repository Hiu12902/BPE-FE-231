import { EvaluationResult } from "@/interfaces/evaluatedResult";
import { ActionIcon, Flex, Text } from "@mantine/core";
import { ReactComponent as IconClose } from "@tabler/icons/icons/x.svg";
import { DataTable, DataTableColumn } from "mantine-datatable";

interface TableProps {
  rows?: EvaluationResult[];
  onClose?: () => void;
}

const ExtendedQuality = ({ rows, onClose }: TableProps) => {
  const columns: DataTableColumn<EvaluationResult>[] = [
    {
      accessor: "totalQuality",
      title: "Total quality",
      width: 170,
      textAlignment: "center",
      render: (record: EvaluationResult) => {
        return (
          <Flex justify="center">
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.totalQuality}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "quality",
      title: "Internal Quality",
      width: 170,
      textAlignment: "center",
      render: (record: EvaluationResult) => {
        return (
          <Flex justify="center">
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.quality}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "externalQuality",
      title: "External Quality",
      width: 170,
      textAlignment: "center",
      render: (record: EvaluationResult) => {
        return (
          <Flex justify="center">
            <Text
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {record.externalQuality}
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
        <Text fw="bold">Quality detail</Text>
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
