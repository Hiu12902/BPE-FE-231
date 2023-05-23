import { Alert, Box, Group, ScrollArea, Space, Stack, Text } from '@mantine/core';

import { PALETTE_WIDTH, PROPERTIES_PANEL_WIDTH } from '@/constants/theme/themeConstants';
import { IIssue } from '@/interfaces/linting';
import useFocusElement from '../hooks/useFocusElement';

const ValidationTerminal = ({
  issues,
  isNavbarCollapsed,
}: {
  issues: IIssue[];
  isNavbarCollapsed: boolean;
}) => {
  const focusElement = useFocusElement();

  return (
    <Box
      style={{
        marginLeft: (isNavbarCollapsed ? 30 : PALETTE_WIDTH) + 10,
        marginRight: PROPERTIES_PANEL_WIDTH + 10,
      }}
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
                    onClick={() => focusElement(issue.id)}
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
