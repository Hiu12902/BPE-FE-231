import { EXCLUDED_FIELDS, ResultTableTitleMap } from '@/constants/result';
import { EvaluatedResultRecord, EvaluationResult } from '@/interfaces/evaluatedResult';
import * as selectors from '@/redux/selectors';
import { Button, Group, Space, Stack, Title, createStyles } from '@mantine/core';
import { keysIn, remove, round, values } from 'lodash';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CompareResultComponent from './helper/CompareResult';
import ResultDetailSteps from './helper/ResultDetailSteps';

const useStyles = createStyles(() => ({
  table: {
    'thead > tr > th >div': {
      whiteSpace: 'unset',
      overflow: 'unset',
      textOverflow: 'unset',
    },
  },
}));

export default function ResultTable({
  evaluatedResult,
}: {
  evaluatedResult: EvaluatedResultRecord[];
}) {
  const { classes } = useStyles();
  const keys = keysIn(evaluatedResult[0]);
  const keysForResult = remove(keys, (key: string) => !EXCLUDED_FIELDS.includes(key));
  const [openUnitCost, setOpenUnitCost] = useState(false);
  const [openTransparency, setOpenTransparency] = useState(false);
  const [unitCost, setUnitCost] = useState<{ lane: string; cost: number }[]>([]);
  const [transparency, setTransparency] = useState<
    { view: string; numberOfExplicitTask: number; transparency: number }[]
  >([]);
  const currentModeler = useSelector(selectors.getCurrentModeler);
  const activeTab = useSelector(selectors.getActiveTab);

  return !activeTab?.isCompare ? (
    <>
      <Stack>
        <Title order={4}>
          Evaluated Result of Diagram {currentModeler?.id.replace('mantine-', '')}
        </Title>
        <DataTable
          withBorder
          borderRadius="sm"
          withColumnBorders
          striped
          highlightOnHover
          className={classes.table}
          records={evaluatedResult}
          columns={keysForResult.map((key) => ({
            accessor: key,
            title: ResultTableTitleMap[key as keyof EvaluationResult],
            textAlignment: 'center',
            width: 50,
            ellipsis: false,
            render: (record: EvaluationResult) => {
              if (typeof record[key as keyof EvaluationResult] === 'number') {
                return round(record[key as keyof EvaluationResult] as number, 4);
              } else if (typeof record[key as keyof EvaluationResult] !== 'string') {
                return (
                  <Button
                    variant="subtle"
                    onClick={() => {
                      if (key === 'unitCost') {
                        if (openTransparency) {
                          setOpenTransparency(false);
                        }
                        setOpenUnitCost(true);
                        record.unitCost && setUnitCost(record.unitCost);
                      } else if (key === 'transparency') {
                        if (openUnitCost) {
                          setOpenUnitCost(false);
                        }
                        setOpenTransparency(true);
                        record.transparency && setTransparency(values(record.transparency));
                      }
                    }}
                  >
                    Detail
                  </Button>
                );
              }

              return record[key as keyof EvaluatedResultRecord];
            },
          }))}
        />
      </Stack>
      <Space h={50} />
      {!(openUnitCost || openTransparency) ? (
        <>
          <Title order={4}>Evaluated Result Detail</Title>
          <Space h="sm" />
          <ResultDetailSteps />
        </>
      ) : (
        openUnitCost && (
          <Stack>
            <Title order={4}>Unit Cost</Title>
            <DataTable
              withBorder
              borderRadius="sm"
              withColumnBorders
              striped
              highlightOnHover
              className={classes.table}
              records={unitCost}
              columns={[
                {
                  accessor: 'lane',
                  title: 'Lane',
                  textAlignment: 'left',
                },
                {
                  accessor: 'cost',
                  title: 'Unit Cost',
                  textAlignment: 'center',
                },
              ]}
            />
            <Group position="right">
              <Button
                onClick={() => {
                  setOpenUnitCost(false);
                }}
              >
                Close
              </Button>
            </Group>
          </Stack>
        )
      )}
      {openTransparency && (
        <Stack>
          <Title order={4}>Transparency</Title>
          <DataTable
            withBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            className={classes.table}
            records={transparency}
            columns={[
              {
                accessor: 'view',
                title: 'View',
                textAlignment: 'left',
              },
              {
                accessor: 'numberOfExplicitTask',
                title: 'Explicit Tasks',
                textAlignment: 'center',
              },
              {
                accessor: 'transparency',
                title: 'Transparency',
                textAlignment: 'center',
              },
            ]}
          />
          <Group position="right">
            <Button
              onClick={() => {
                setOpenTransparency(false);
              }}
            >
              Close
            </Button>
          </Group>
        </Stack>
      )}
    </>
  ) : (
    <CompareResultComponent />
  );
}
