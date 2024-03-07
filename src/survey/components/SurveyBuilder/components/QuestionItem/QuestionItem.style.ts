import { createStyles } from "@mantine/core";

export const useQuestionItemStyle = createStyles(() => ({
    wrapper: {
        width: "100%",
        padding: '20px',
    },
    body: {
        border: "1px solid #8cbbe9",
        borderRadius: "5px",
        maxHeight: "300px",
        padding: '10px',
        width: "100%",
        ':hover': {
            cursor: "pointer",
        },
    },
    questionControl: {
        gap: "10px",
        margin: "5px",
    },
    active: {
        border: "1px solid #1976d2",
        borderRadius: "5px",
        maxHeight: "300px",
        padding: '10px',
        width: "100%",
        backgroundColor: "#f3faff",
    },
    addButton: {
        float: "left"
    },
    content: {
        width: "100%",
        height: "100%",
    }
}))