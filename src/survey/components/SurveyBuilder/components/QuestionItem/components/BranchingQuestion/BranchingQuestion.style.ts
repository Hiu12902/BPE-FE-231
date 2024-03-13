import { createStyles } from "@mantine/core";

export const useBranchingQuestionStyle = createStyles(() => ({
    option: {
        margin: "5px",
        width: "100%",
    },
    radio: {
        '.mantine-Radio-body': {
            marginTop: "15px",
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