import { createStyles } from "@mantine/core";

export const useCESQuestionStyle = createStyles(() => ({
    option: {
        margin: "5px",
    },
    radio: {
        '.mantine-Radio-body': {
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            justifyItems: "center",
        },
        '.mantine-Radio-label': {
            padding: 0,
            marginBottom: 5,
        }
    }
}))