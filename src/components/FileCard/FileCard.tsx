import React from 'react';
import { Box, Group, Stack, Text } from '@mantine/core';
import { IconBpeFileResult } from '../../icons/Icons';
import { useFileCardStyle } from './FileCard.style';

const FileCard = () => {
  const { classes } = useFileCardStyle();
  return (
    <Box component={Stack} spacing={0} className={classes.container} p="sm">
      <Group position="apart">
        <Group spacing={10}>
          <IconBpeFileResult height={30} width={30} />
          <Text>Project 1_ver_1.1 evaluated result</Text>
        </Group>
        <Text color="dimmed" size="sm">
          04 Nov 2022
        </Text>
      </Group>
    </Box>
  );
};

export default FileCard;
