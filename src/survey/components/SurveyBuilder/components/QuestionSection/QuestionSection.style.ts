import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useQuestionSectionStyle = createStyles(() => ({
    wrapper: {
        flexDirection: "column",
        alignItems: "left",
        margin: "20px 0"
    },
    body: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: "5px",

        borderRadius: "5px",
        // backgroundColor: "#e7f5ff",
        border: "1px solid #eee",
        ':hover': {
            // backgroundColor: "#f3faff",
            border: "1px solid #bbb",
        }
    }
}))