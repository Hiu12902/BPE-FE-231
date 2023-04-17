import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';
import { Accordion, ActionIcon, Group, Menu, Text } from '@mantine/core';
import { ReactComponent as IconFileSymlink } from '@tabler/icons/icons/file-symlink.svg';
import { ReactComponent as IconFolder } from '@tabler/icons/icons/folder.svg';
import { ReactComponent as IconAbc } from '@tabler/icons/icons/abc.svg';
import { ReactComponent as IconInfo } from '@tabler/icons/icons/info-circle-filled.svg';
import { ReactComponent as IconTrash } from '@tabler/icons/icons/trash.svg';
import { ReactComponent as IconDots } from '@tabler/icons/icons/dots.svg';
import { useState } from 'react';
import { IProject } from '@/interfaces/projects';
import FileItem from '@/components/FileItem';

const ProjectItem = (props: IProject) => {
  const { owner, lastUpdated, name, size, id, files } = props;
  const [isToggle, setIsToggle] = useState(false);
  return (
    <Accordion.Item value={id}>
      <Accordion.Control>
        <Group position="apart" onClick={() => setIsToggle((o) => !o)}>
          <Group>
            <IconFolder width={30} height={30} color={PRIMARY_COLOR[0]} fill={PRIMARY_COLOR[0]} />
            <Text size="sm">{name}</Text>
          </Group>
          <Text color="dimmed" size="sm">
            {owner}
          </Text>
          <Text color="dimmed" size="sm">
            {size} MB
          </Text>
          <Text color="dimmed" size="sm">
            {lastUpdated?.toLocaleString()}
          </Text>
          <Menu shadow="md" width={200} position="left-start">
            <Menu.Target>
              <ActionIcon variant="subtle" onClick={(e) => e.stopPropagation()}>
                <IconDots />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<IconFileSymlink />} onClick={(e) => e.stopPropagation()}>
                Open
              </Menu.Item>
              <Menu.Item icon={<IconAbc />} onClick={(e) => e.stopPropagation()}>
                Rename
              </Menu.Item>
              <Menu.Item icon={<IconInfo />} onClick={(e) => e.stopPropagation()}>
                Detail
              </Menu.Item>
              <Menu.Item color="red" icon={<IconTrash />} onClick={(e) => e.stopPropagation()}>
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {files?.map((file) => (
          <FileItem {...file} />
        ))}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default ProjectItem;
