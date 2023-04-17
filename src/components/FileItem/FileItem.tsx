import { ActionIcon, Box, Group, Menu, Stack, Text } from '@mantine/core';
import { IconBpeFileResult } from '../../icons/Icons';
import { ReactComponent as IconAbc } from '@tabler/icons/icons/abc.svg';
import { ReactComponent as IconInfo } from '@tabler/icons/icons/info-circle-filled.svg';
import { ReactComponent as IconTrash } from '@tabler/icons/icons/trash.svg';
import { ReactComponent as IconDots } from '@tabler/icons/icons/dots.svg';
import { ReactComponent as IconFileSymlink } from '@tabler/icons/icons/file-symlink.svg';
import { useFileCardStyle } from './FileItem.style';
import { IFile } from '@/interfaces/projects';

const FileItem = (props: IFile) => {
  const { variant = 'general', name, size, lastUpdated } = props;
  const { classes } = useFileCardStyle();
  return (
    <Box component={Stack} spacing={0} className={classes.container} p="sm">
      <Group position="apart">
        <Group spacing={10}>
          <IconBpeFileResult height={30} width={30} />
          <Text size="sm">{name}</Text>
        </Group>
        {variant === 'general' && (
          <Text color="dimmed" size="sm" ml={237}>
            {size} MB
          </Text>
        )}
        <Text color="dimmed" size="sm" mr={30}>
          {lastUpdated?.toLocaleString()}
        </Text>
        {variant === 'general' && (
          <Menu shadow="md" width={200} position="left-start">
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<IconFileSymlink />}>Open</Menu.Item>
              <Menu.Item icon={<IconAbc />}>Rename</Menu.Item>
              <Menu.Item icon={<IconInfo />}>Detail</Menu.Item>
              <Menu.Item color="red" icon={<IconTrash />}>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Box>
  );
};

export default FileItem;
