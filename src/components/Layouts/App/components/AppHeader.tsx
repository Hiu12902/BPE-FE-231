import { ActionIcon, Avatar, Group, TextInput, useMantineTheme } from '@mantine/core';
import { ReactComponent as IconSearch } from '@tabler/icons/icons/search.svg';
import { ReactComponent as IconGear } from '@tabler/icons/icons/settings.svg';
import { ReactComponent as IconNotification } from '@tabler/icons/icons/bell.svg';

const AppHeader = () => {
  const theme = useMantineTheme();

  return (
    <Group position="apart">
      <div />
      <TextInput
        icon={<IconSearch width="1.1rem" />}
        radius="lg"
        size="sm"
        w={500}
        placeholder="Search..."
        rightSectionWidth={42}
      />
      <Group mr={20}>
        <ActionIcon>
          <IconGear width={30} color={theme.colors.gray[7]} />
        </ActionIcon>
        <ActionIcon>
          <IconNotification width={30} color={theme.colors.gray[7]} />
        </ActionIcon>
        <Avatar radius="xl" />
      </Group>
    </Group>
  );
};

export default AppHeader;
