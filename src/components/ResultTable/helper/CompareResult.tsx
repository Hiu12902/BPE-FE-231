import { EvaluationResult } from '@/interfaces/evaluatedResult';
import {
  getActiveTab,
  getComparingResult,
  getDiagramsComparing,
  getEvaluatedResult,
  getModelers,
} from '@/redux/selectors';
import { CompareResult } from '@/redux/slices/comparing';
import {
  Group,
  Paper,
  SimpleGrid,
  Space,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  createStyles,
} from '@mantine/core';
import { ReactComponent as IconArrowDownRight } from '@tabler/icons/icons/arrow-down-right.svg';
import { ReactComponent as IconArrowUpRight } from '@tabler/icons/icons/arrow-up-right.svg';
import { ReactComponent as IconArrowsLeftRight } from '@tabler/icons/icons/arrows-left-right.svg';
import { keys, round } from 'lodash';
import { useSelector } from 'react-redux';

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

const TITLE_MAP: Record<keyof CompareResult, string> = {
  cycleTime: 'Cycle Time',
  cost: 'Cost',
  transparency: 'Transparency',
  quality: 'Quality',
  flexibility: 'Flexibility',
  exceptionHandling: 'Exception Handling',
  name: 'Name',
};

const RESULT_KEY_MAP: Record<keyof CompareResult, keyof EvaluationResult> = {
  cycleTime: 'totalCycleTime',
  cost: 'totalCost',
  transparency: 'transparency',
  quality: 'quality',
  flexibility: 'flexibility',
  exceptionHandling: 'exceptionHandling',
  name: 'name',
};

const CompareResultComponent = () => {
  const { classes } = useStyles();
  const comparingResults = useSelector(getComparingResult);
  const activeTab = useSelector(getActiveTab);
  const evaluatedResult = useSelector(getEvaluatedResult)[activeTab?.id as string];
  const { toComparedDiagram, diagramComparedTo } = useSelector(getDiagramsComparing);
  const modelers = useSelector(getModelers);
  const toComparedDiagramName = modelers.find((modeler) => modeler.id === toComparedDiagram)?.name;
  const diagramComparedToName = modelers.find((modeler) => modeler.id === diagramComparedTo)?.name;
  const compareResultKeys = keys(comparingResults?.[0]);

  const getEvaluatedResultField = (name: string, key: keyof CompareResult, index: number) => {
    const res = evaluatedResult.filter((result) => result.name === name);
    return res[index]?.[RESULT_KEY_MAP[key]];
  };

  const calculateStats = (compareResult: CompareResult) => {
    return compareResultKeys.map((key, idx) => {
      const res = compareResult[compareResultKeys[idx] as keyof CompareResult];
      const comparingStat =
        typeof res === 'number'
          ? {
              title: TITLE_MAP[key as keyof CompareResult],
              diff: res * 100,
            }
          : typeof res === 'string'
          ? undefined
          : res?.map((data) => ({
              title: TITLE_MAP[key as keyof CompareResult],
              data: data,
            }));

      if (!comparingStat) {
        return;
      }

      if (!Array.isArray(comparingStat)) {
        const DiffIcon =
          comparingStat.diff > 0
            ? IconArrowUpRight
            : comparingStat.diff === 0
            ? IconArrowsLeftRight
            : IconArrowDownRight;

        return (
          <Paper withBorder p="md" radius="md" key={idx}>
            <Group position="apart">
              <Text c="dimmed" fw={700} fz="md" className={classes.label}>
                {comparingStat?.title}
              </Text>
              <ThemeIcon
                color="gray"
                variant="light"
                sx={(theme) => ({
                  color:
                    comparingStat.diff > 0
                      ? theme.colors.teal[6]
                      : comparingStat.diff === 0
                      ? theme.colors.gray[5]
                      : theme.colors.red[6],
                })}
                size={38}
                radius="md"
              >
                <DiffIcon width={40} height={40} />
              </ThemeIcon>
            </Group>
            <Group position="apart" mt="md">
              <Text c="dimmed" fz="sm">
                {round(
                  getEvaluatedResultField(compareResult.name, key as keyof CompareResult, 0),
                  4
                )}{' '}
                comparing to{' '}
                {round(
                  getEvaluatedResultField(compareResult.name, key as keyof CompareResult, 1),
                  4
                )}
              </Text>
              <Text
                c={comparingStat.diff > 0 ? 'teal' : comparingStat?.diff === 0 ? 'gray' : 'red'}
                fw={700}
                fz="sm"
              >
                {round(comparingStat.diff, 4)}%
              </Text>
            </Group>
          </Paper>
        );
      } else {
        return comparingStat.map((transparency) => {
          const DiffIcon =
            transparency.data.pl > 0
              ? IconArrowUpRight
              : transparency.data.pl === 0
              ? IconArrowsLeftRight
              : IconArrowDownRight;

          return (
            <Paper withBorder p="md" radius="md" key={idx}>
              <Group position="apart">
                <Text c="dimmed" fw={700} fz="md" className={classes.label}>
                  {transparency.title}
                </Text>
                <ThemeIcon
                  color="gray"
                  variant="light"
                  sx={(theme) => ({
                    color:
                      transparency.data.pl > 0
                        ? theme.colors.teal[6]
                        : transparency.data.pl === 0
                        ? theme.colors.gray[5]
                        : theme.colors.red[6],
                  })}
                  size={38}
                  radius="md"
                >
                  <DiffIcon width={30} height={30} />
                </ThemeIcon>
              </Group>
              <Group position="apart" mt="md">
                <Text c="dimmed" fw={700} fz="xs" className={classes.label}>
                  {transparency.data.view}
                </Text>
                <Text
                  component="span"
                  c={
                    transparency.data.pl > 0 ? 'teal' : transparency.data.pl === 0 ? 'gray' : 'red'
                  }
                  fw={700}
                >
                  {round(transparency.data.pl * 100, 4)}%
                </Text>
              </Group>
            </Paper>
          );
        });
      }
    });
  };

  return (
    <div className={classes.root}>
      <Title order={4}>
        Diagram {toComparedDiagramName} comparing to Diagram {diagramComparedToName}
      </Title>
      <Space h="lg" />
      {comparingResults && (
        <Tabs defaultValue={comparingResults?.[0]?.name}>
          <Tabs.List>
            {comparingResults?.map((res) => (
              <Tabs.Tab value={res.name}>{res.name}</Tabs.Tab>
            ))}
          </Tabs.List>

          {comparingResults?.map((res, index) => (
            <Tabs.Panel value={res.name}>
              <Space h="lg" />
              <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                {calculateStats(res)}
              </SimpleGrid>
            </Tabs.Panel>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default CompareResultComponent;
