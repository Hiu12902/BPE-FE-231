import { EvaluationResult } from "@/interfaces/index";
import { Button, Flex, Text } from "@mantine/core";
import { values } from "lodash";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useState } from "react";
import ExtendedInfo from "../ExtendedInfo";
import ExtendedQuality from "../ExtendedQuality";
import ExtendedTransparency from "../ExtendedTransparency";

interface ITableProps {
  rows?: EvaluationResult[];
}

interface ExtendedTransperancyProps {
  view: string;
  numberOfExplicitTask: number;
  transparency: number;
}

const MainResult = ({ rows }: ITableProps) => {
  const [openTransparency, setOpenTransparency] = useState(false);
  const [openQuality, setOpenQuality] = useState(false);
  const [transparency, setTransparency] = useState<ExtendedTransperancyProps[]>(
    []
  );
  const [quality, setQuality] = useState<EvaluationResult[]>([]);

  const columns: DataTableColumn<EvaluationResult>[] = [
    {
      accessor: "name",
      title: "Start from Lane",
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
              {record.name}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "totalCycleTime",
      title: "Cycle time",
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
              {record.totalCycleTime?.toFixed(2)}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "totalQuality",
      title: "Quality",
      width: 170,
      textAlignment: "center",
      render: (record: EvaluationResult) => {
        return (
          <Button
            variant="subtle"
            onClick={() => {
              setOpenQuality(true);
              setQuality([record]);
            }}
          >
            More detail
          </Button>
        );
      },
    },
    {
      accessor: "totalCost",
      title: "Cost",
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
              {record.totalCost?.toFixed(2)}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "flexibility",
      title: "Flexibility",
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
              {record.flexibility?.toFixed(2)}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "transperancy",
      title: "Transparency",
      width: 170,
      textAlignment: "center",
      render: (record: EvaluationResult) => {
        return (
          <Button
            variant="subtle"
            onClick={() => {
              setOpenTransparency(true);
              setTransparency(values(record.transparency));
            }}
          >
            More detail
          </Button>
        );
      },
    },
    {
      accessor: "exceptionHandling",
      title: "Exception handling",
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
              {record.exceptionHandling?.toFixed(2)}
            </Text>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex direction="column" gap={10}>
      <Text fw="bold">Lane's evaluated result</Text>
      <DataTable
        striped={false}
        columns={columns}
        records={rows ? rows : []}
        borderRadius={"sm"}
        withBorder
        withColumnBorders
        horizontalSpacing={"sm"}
        verticalSpacing={"sm"}
        verticalAlignment={"center"}
        loaderVariant="dots"
        loaderSize="lg"
        loaderBackgroundBlur={5}
      />
      <Flex wrap="wrap" gap={20}>
        {openTransparency && (
          <ExtendedTransparency
            rows={transparency}
            onClose={() => setOpenTransparency(false)}
          />
        )}
        {openQuality && (
          <ExtendedQuality
            rows={quality}
            onClose={() => setOpenQuality(false)}
          />
        )}
      </Flex>
      <ExtendedInfo rows={rows} />
    </Flex>
  );
};

export default MainResult;
