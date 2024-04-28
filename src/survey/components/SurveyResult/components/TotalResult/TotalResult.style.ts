import { createStyles } from "@mantine/core";

export const useTotalResultStyle = createStyles(() => ({
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
}))