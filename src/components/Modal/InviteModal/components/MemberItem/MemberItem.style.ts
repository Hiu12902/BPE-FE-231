import { createStyles } from "@mantine/core";

export const useMemberItemStyle = createStyles((theme) => ({
    user: {
        display: "block",
        width: "100%",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    },
    select: {
        '.mantine-Select-input': {
            textAlign: 'center',
            margin: 0,
            padding: 0,
        },
        '.mantine-Select-rightSection': {
            display: "none",
        }
    },
}));