import { EXCLUDED_FIELDS, ResultTableTitleMap } from '@/constants/result';
import { EvaluatedResultRecord } from '@/interfaces/evaluatedResult';
import { createStyles } from '@mantine/core';
import { keysIn, remove, round } from 'lodash';
import { DataTable } from 'mantine-datatable';

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
  return (
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
        title: ResultTableTitleMap[key as keyof EvaluatedResultRecord],
        textAlignment: 'center',
        width: 50,
        ellipsis: false,
        render: (record: EvaluatedResultRecord) => {
          if (typeof record[key as keyof EvaluatedResultRecord] === 'number') {
            return round(record[key as keyof EvaluatedResultRecord] as number, 4);
          }
          return record[key as keyof EvaluatedResultRecord];
        },
      }))}
    />
  );
}
