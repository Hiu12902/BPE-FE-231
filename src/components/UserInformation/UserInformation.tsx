import { IUser, IUserInfoProps } from '@/interfaces/user';
import { getCurrentUser } from '@/redux/selectors';
import { Avatar, Box, Button, Group, Select, Text, createStyles } from '@mantine/core';
import { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as IconUserPlus } from '@tabler/icons/icons/user-plus.svg';
import { UserRole } from '@/constants/project';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },
}));

const UserInformation = forwardRef<HTMLDivElement, IUserInfoProps>((props: IUserInfoProps, ref) => {
  const { classes } = useStyles();
  const currentUser = useSelector(getCurrentUser);
  const {
    id,
    name,
    email,
    avatar,
    onClick,
    onAddTeammate,
    isSearching,
    isSelectingRole,
    isProfile,
  } = props;

  return (
    <Box className={classes.user} ref={ref} onClick={onClick}>
      <Group position="apart">
        <Group>
          <Avatar src={avatar || currentUser.avatar} radius="xl" />

          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {name || currentUser.name}
            </Text>

            <Text color="dimmed" size="xs">
              {email || currentUser.email}
            </Text>
          </div>
        </Group>
        {!isProfile &&
          (isSearching ? (
            <Button
              leftIcon={<IconUserPlus width={15} height={15} />}
              size="xs"
              onClick={() => onAddTeammate?.({ id, name, email, avatar } as IUser)}
            >
              Add
            </Button>
          ) : (
            isSelectingRole && (
              <Select
                data={[
                  //@ts-ignore
                  { value: UserRole.CAN_EDIT, label: 'Editor' },
                  //@ts-ignore
                  { value: UserRole.CAN_SHARE, label: 'Sharer' },
                  //@ts-ignore
                  { value: UserRole.CAN_VIEW, label: 'Viewer' },
                  //@ts-ignore
                  { value: UserRole.OWNER, label: 'Owner' },
                ]}
                variant="filled"
                size="xs"
                w={100}
                dropdownPosition="bottom"
                //@ts-ignore
                defaultValue={UserRole.CAN_VIEW}
              />
            )
          ))}
      </Group>
    </Box>
  );
});

export default UserInformation;
