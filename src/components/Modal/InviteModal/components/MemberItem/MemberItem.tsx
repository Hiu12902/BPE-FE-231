import { IUser, IUserInfoProps } from "@/interfaces/user";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { ReactComponent as IconUserPlus } from "@tabler/icons/icons/user-plus.svg";
import { forwardRef, useState } from "react";
import { useMemberItemStyle } from "./MemberItem.style";

const MemberItem = forwardRef<HTMLDivElement, IUserInfoProps>(
  (
    {
      id,
      name,
      email,
      avatar,
      permission,

      onClick,
      onAddTeammate,
      isSearching,
      isSelectingRole,
      onChangePermission,
    }: IUserInfoProps,
    ref
  ) => {
    const { classes } = useMemberItemStyle();
    const [userPermission, setUserPermission] = useState<string>();

    const handleChange = (value: string) => {
      setUserPermission(value);
      onChangePermission?.(value);
    };

    return (
      <Box className={classes.user} ref={ref} onClick={onClick}>
        <Group position="apart">
          <Group>
            <Avatar
              src={
                avatar
                  ? avatar
                  : `https://ui-avatars.com/api/?name=${name?.replace(
                      " ",
                      "_"
                    )}&background=random&color=fff`
              }
              radius="xl"
            />

            <Stack spacing={5}>
              <Text size="sm" weight={500}>
                {name}
              </Text>

              <Text color="dimmed" size="xs">
                {email}
              </Text>
            </Stack>
          </Group>

          {permission && permission !== null ? (
            <Badge color="blue" variant="light" mx={!isSelectingRole ? 5 : 20}>
              {permission}
            </Badge>
          ) : isSearching ? (
            <Button
              leftIcon={<IconUserPlus width={15} height={15} />}
              size="xs"
              onClick={() =>
                onAddTeammate?.({ id, name, email, avatar } as IUser)
              }
            >
              Add
            </Button>
          ) : isSelectingRole ? (
            <Select
              className={classes.select}
              dropdownPosition="bottom"
              variant="filled"
              size="xs"
              w={100}
              data={[
                {
                  value: "editor",
                  label: "Can edit",
                },
                {
                  value: "sharer",
                  label: "Can share",
                },
                {
                  value: "viewer",
                  label: "Can view",
                },
              ]}
              placeholder={"Permission"}
              value={userPermission}
              onChange={handleChange}
            />
          ) : (
            <></>
          )}
        </Group>
      </Box>
    );
  }
);

export default MemberItem;
