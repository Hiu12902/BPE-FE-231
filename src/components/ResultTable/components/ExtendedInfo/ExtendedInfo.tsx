import { EvaluationResult } from "@/interfaces/evaluatedResult";
import { Button, Flex, Text } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useState } from "react";
import ExtendedCost from "../ExtendedCost";

interface TableProps {
  rows?: EvaluationResult[];
}

const ExtendedInfo = ({ rows }: TableProps) => {
  const [openUnitCost, setOpenUnitCost] = useState(false);
  const [unitCost, setUnitCost] = useState<{ lane: string; cost: number }[]>(
    []
  );
  const columns: DataTableColumn<EvaluationResult>[] = [
    {
      accessor: "name",
      title: "Name",
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
      accessor: "totalTasks",
      title: "Total Tasks",
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
              {record.totalTasks}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "totalNumberExplicitTasks",
      title: "Total Explicit Tasks",
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
              {record.totalNumberExplicitTasks}
            </Text>
          </Flex>
        );
      },
    },
    {
      accessor: "unitCost",
      title: "Unit Cost",
      width: 170,
      textAlignment: "center",
      render: (record: EvaluationResult) => {
        return (
          <Button
            variant="subtle"
            onClick={() => {
              setOpenUnitCost(true);
              record.unitCost && setUnitCost(record.unitCost);
            }}
          >
            More detail
          </Button>
        );
      },
    },
    {
      accessor: "numberOfOptionalTasks",
      title: "Number of Optional Tasks",
      width: 200,
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
              {record.numberOfOptionalTasks}
            </Text>
          </Flex>
        );
      },
    },
  ];

  return (
    <Flex direction="column" gap={10}>
      <Text fw="bold">More information about process version</Text>
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
      <Flex>
        {openUnitCost && (
          <ExtendedCost
            rows={unitCost}
            onClose={() => setOpenUnitCost(false)}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default ExtendedInfo;
