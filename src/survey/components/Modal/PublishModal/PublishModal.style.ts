import { createStyles } from "@mantine/core";

export const usePublishModalStyle = createStyles(() => ({
    link: {
        'mantine-Input-input': {
            ":disabled": {
                color: "black",
            },
        },
        '.mantine-Input-rightSection': {
            ":disabled": {
                display: "flex",
            },
        },
    }
}))