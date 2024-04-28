import { createStyles } from "@mantine/core";

export const useQuestionResponseStyle = createStyles(() => ({
    wrapper: {
        padding: "15px 20px",
        borderRadius: "10px",
        border: "1px solid #1976d2",
        backgroundColor: "#ffffff",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "80%",
        gap: "20px",
    },
    textResponses: {
        padding: "10px",
        border: "1px solid #5e9fe0",
        borderRadius: "5px",
        backgroundColor: "#ffffff",
        width: "100%",
    }
}))