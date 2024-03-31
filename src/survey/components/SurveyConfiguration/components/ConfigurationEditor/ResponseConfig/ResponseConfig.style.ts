import { SURVEY_NAVBAR_HEIGHT } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";


export const useResponseConfigStyle = createStyles(() => ({
    wrapper: {
        width: '70%',
        height: `calc(100vh - ${SURVEY_NAVBAR_HEIGHT}px)`,
        // borderLeft: '1px solid #ddd',
    },
    bodyWrapper: {
        width: "100%",
        height: "100%",
        padding: "20px",

        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "30px",
    },
    sectionWrapper: {
        width: "100%",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "left",
        gap: "20px",
    },
}))