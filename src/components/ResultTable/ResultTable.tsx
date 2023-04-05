import { DataTable } from 'mantine-datatable';
import { useSelector } from 'react-redux';
import * as selectors from '@/redux/selectors';
import { keysIn, remove, round } from 'lodash';
import { EXCLUDED_FIELDS, ResultTableTitleMap } from '@/constants/result';
import { EvaluatedResultRecord } from '@/interfaces/evaluatedResult';
import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  title: {
    whiteSpace: 'unset',
  },
}));

export default function ResultTable() {
  const { classes } = useStyles();
  const evaluatedResult = useSelector(selectors.getEvaluatedResult);
  const keys = keysIn(evaluatedResult[0]);
  const keysForResult = remove(keys, (key: string) => !EXCLUDED_FIELDS.includes(key));
  return (
    <DataTable
      withBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      records={evaluatedResult}
      columns={keysForResult.map((key) => ({
        accessor: key,
        title: ResultTableTitleMap[key as keyof EvaluatedResultRecord],
        textAlignment: 'center',
        width: 50,
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
