import { createStyles } from "@mantine/core";

export const useSurveyResultStyle = createStyles(() => ({
    ces: {
        borderTop: "1px solid #d0f1e7",
        color: "#d0f1e7",
        ":hover": {
            borderTop: "1px solid #12b886",
            color: "#12b886"
        }
    },
    csat: {
        borderTop: "1px solid #ffe5dc",
        color: "#ffe5dc",
        ":hover": {
            borderTop: "1px solid #ff7f50",
            color: "#ff7f50"
        }
    },
    nps: {
        borderTop: "1px solid #dbe2fd",
        color: "#dbe2fd",
        ":hover": {
            borderTop: "1px solid #4c6ef5",
            color: "#4c6ef5"
        }
    }
}))