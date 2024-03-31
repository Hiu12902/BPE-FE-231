import { SURVEY_NAVBAR_HEIGHT } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useGeneralConfigStyle = createStyles(() => ({
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
    },
    input: {
        marginTop: '15px',
        width: "100%",
    },
    numberInputGroup: {
        marginTop: '15px',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    numberInput: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: '10px',
        '.mantine-InputWrapper-label': {
            fontWeight: "bold",
            fontSize: "15px",
        },
    }
}))