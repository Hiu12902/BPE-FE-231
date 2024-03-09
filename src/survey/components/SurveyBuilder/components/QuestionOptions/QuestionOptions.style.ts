import { createStyles } from "@mantine/core";

export const useQuestionOptionsStyle = createStyles(() => ({
    wrapper: {
        width: '100%',
    },
    optionWrapper: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
        gap: "10px"
    },
    button: {
        width: '100%',
        border: "1px dashed #ccc",
        backgroundColor: "rgba(255, 255, 255)",
        marginBottom: 10,
        color: "#bbb",
        ':hover': {
            border: "1px dashed #1976d2",
            backgroundColor: "#f3faff",
            color: "#1976d2",
        }
    },
    dragHandle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: '15px',
        padding: "0px",
    }
}))