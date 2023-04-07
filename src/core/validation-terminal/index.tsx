import { Alert, Box, Group, ScrollArea, Space, Stack, Text } from '@mantine/core';

import { PALETTE_WIDTH, PROPERTIES_PANEL_WIDTH } from '@/constants/theme/themeConstants';
import { IIssue } from '@/interfaces/linting';
import { getCurrentModeler } from '@/redux/selectors';
import { useSelector } from 'react-redux';
import useGetModelerModules from '../hooks/useGetModelerModule';

const ValidationTerminal = ({ issues }: { issues: IIssue[] }) => {
  const modeler = useSelector(getCurrentModeler)?.modeler;
  const [canvas, selection, elementRegistry] = useGetModelerModules([
    'canvas',
    'selection',
    'elementRegistry',
  ]);

  const centerElement = (elementId: string) => {
    //@ts-ignore
    var bbox = elementRegistry?.get(elementId);

    //@ts-ignore
    var currentViewbox = canvas.viewbox();

    var elementMid = {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2,
    };

    //@ts-ignore
    canvas.viewbox({
      x: elementMid.x - currentViewbox.width / 2,
      y: elementMid.y - currentViewbox.height / 2,
      width: currentViewbox.width,
      height: currentViewbox.height,
    });
  };

  const onFocusElement = (id: string) => {
    //@ts-ignore
    const element = elementRegistry?.get(id);
    //@ts-ignore
    selection?.select(element);
    centerElement(id);
  };

  return (
    <Box
      style={{ marginLeft: PALETTE_WIDTH + 10, marginRight: PROPERTIES_PANEL_WIDTH + 10 }}
      pt={10}
    >
      {issues.length > 0 ? (
        <Group>
          <Text color="red" size="xs" weight={700}>
            {issues.filter((issue: IIssue) => issue.category === 'error').length} Errors
          </Text>
          <Text color="yellow" size="xs" weight={700}>
            {issues.filter((issue: IIssue) => issue.category === 'warn').length} Warnings
          </Text>
        </Group>
      ) : null}
      <Space h="xs" />
      <ScrollArea h={95}>
        <Stack spacing={5} mr={issues.length > 2 ? 20 : 0}>
          {issues.length > 0 ? (
            issues.map((issue: IIssue) => (
              <Alert
                title={
                  <Text
                    style={{ cursor: 'pointer' }}
                    underline
                    onClick={() => onFocusElement(issue.id)}
                  >{`${issue.id}:`}</Text>
                }
                color={issue.category === 'error' ? 'red' : 'yellow'}
                styles={{
                  root: { padding: '7px 10px' },
                  title: { display: 'inline-block', margin: 0 },
                  message: { display: 'inline-block', marginLeft: 10 },
                }}
              >
                {issue.message}
              </Alert>
            ))
          ) : (
            <Alert title="Your model is clean!" color="green" variant="filled">
              There are no problems with your model!
            </Alert>
          )}
        </Stack>
      </ScrollArea>
    </Box>
  );
};

export default ValidationTerminal;
