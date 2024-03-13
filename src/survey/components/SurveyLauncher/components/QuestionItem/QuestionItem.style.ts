import { createStyles } from "@mantine/core";

export const useQuestionItemStyle = createStyles(() => ({
    body: {
        border: "1px solid #8cbbe9",
        borderRadius: "5px",
        maxHeight: "300px",
        gap: "20px",

        width: "100%",
    },
    content: {
        width: "100%",
        height: "100%",

        padding: "20px",
    },
    badge: {
        marginTop: "5px",
        marginLeft: "5px",
    }
}))