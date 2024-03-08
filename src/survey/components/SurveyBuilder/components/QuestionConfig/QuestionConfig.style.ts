import { SURVEY_NAVBAR_HEIGHT } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useQuestionConfigStyle = createStyles(() => ({
    mainWrapper: {
        width: '30%',
        height: `calc(100vh - ${SURVEY_NAVBAR_HEIGHT}px)`,
    },
    scrollAreaWrapper: {
        width: '100%',
        height: '100%',
        padding: '10px 20px',
    },
    sectionWrapper: {
        width: '100%',
    },
}))