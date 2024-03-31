import { createStyles } from "@mantine/core";

export const usePublishModalStyle = createStyles(() => ({
    link: {
        '.mantine-Input-input': {
            '&:disabled': {
                color: "black",
                opacity: 1
            }
        },
    }
}))