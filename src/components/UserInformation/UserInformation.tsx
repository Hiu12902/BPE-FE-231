import { getCurrentUser } from '@/redux/selectors';
import {  Avatar, Box, Group, Text, createStyles } from '@mantine/core';
import { useSelector } from 'react-redux';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },
}));

const UserInformation = () => {
  const { classes } = useStyles();
  const currentUser = useSelector(getCurrentUser);

  return (
    <Box className={classes.user}>
      <Group>
        <Avatar src={currentUser.avatar} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {currentUser.name}
          </Text>

          <Text color="dimmed" size="xs">
            {currentUser.email}
          </Text>
        </div>
      </Group>
    </Box>
  );
};

export default UserInformation;
