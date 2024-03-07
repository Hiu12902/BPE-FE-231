import { createStyles } from "@mantine/core";

export const useMultipleChoiceQuestionStyle = createStyles(() => ({
    option: {
        alignContent: "center",
        margin: "5px",
    },
    radio: {
        '.mantine-Radio-body': {
            gap: '10px'
        },
        '.mantine-Radio-label': {
            padding: 0,
        }
    }
}));