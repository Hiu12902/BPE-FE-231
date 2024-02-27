import { UserRole, UserRoleText } from "@/constants/project";
import { IUser, IUserInfoProps } from "@/interfaces/user";
import { getCurrentUser } from "@/redux/selectors";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Select,
  Text,
  createStyles,
} from "@mantine/core";
import { ReactComponent as IconUserPlus } from "@tabler/icons/icons/user-plus.svg";
import { forwardRef, useState } from "react";
import { useSelector } from "react-redux";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  },
}));

const UserInformation = forwardRef<HTMLDivElement, IUserInfoProps>(
  (props: IUserInfoProps, ref) => {
    const { classes } = useStyles();
    const currentUser = useSelector(getCurrentUser);
    const {
      id,
      name,
      email,
      avatar,
      role: userRole,
      onClick,
      onAddTeammate,
      isSearching,
      // isSelectingRole,
      isProfile,
      onChangeRole,
      isOwner,
    } = props;
    const [role, setRole] = useState(userRole);

    const onChange = (value: UserRole) => {
      setRole(value);
      onChangeRole?.(value);
    };

    return (
      <Box className={classes.user} ref={ref} onClick={onClick}>
        <Group position="apart">
          <Group>
            <Avatar
              src={!isProfile ? avatar : currentUser.avatar}
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" weight={500}>
                {name || currentUser.name}
              </Text>

              <Text color="dimmed" size="xs">
                {email || currentUser.email}
              </Text>
            </div>
          </Group>

          <Group w={100} position="center">
            {!isProfile &&
              (isSearching ? (
                <Button
                  leftIcon={<IconUserPlus width={15} height={15} />}
                  size="xs"
                  onClick={() =>
                    onAddTeammate?.({ id, name, email, avatar } as IUser)
                  }
                >
                  Add
                </Button>
              ) : isOwner ? (
                userRole !== 0 && ( // Khi người dùng là owner, chỉ hiện select role đối với những item không phải owner
                  <Select
                    data={[
                      //@ts-ignore
                      { value: UserRole.CAN_EDIT, label: "Editor" },
                      //@ts-ignore
                      { value: UserRole.CAN_SHARE, label: "Sharer" },
                      //@ts-ignore
                      { value: UserRole.CAN_VIEW, label: "Viewer" },
                      //@ts-ignore
                      // { value: UserRole.OWNER, label: "Owner" },
                    ]}
                    variant="filled"
                    size="xs"
                    w={100}
                    dropdownPosition="bottom"
                    //@ts-ignore
                    value={role}
                    //@ts-ignore
                    onChange={onChange}
                  />
                )
              ) : (
                // Khi người dùng không phải owner, hiện badge role của item
                userRole !== undefined && (
                  <Badge>{UserRoleText[userRole]}</Badge>
                )
              ))}
          </Group>
        </Group>
      </Box>
    );
  }
);

export default UserInformation;
