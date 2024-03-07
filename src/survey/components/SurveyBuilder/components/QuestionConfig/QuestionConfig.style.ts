import { SURVEY_NAVBAR_HEIGHT } from "@/constants/theme/themeConstants";
import { Box, createStyles } from "@mantine/core";

export const useQuestionConfigStyle = createStyles(() => ({
    mainWrapper: {
        width: '30%',
        height: `calc(100vh - ${SURVEY_NAVBAR_HEIGHT}px)`,
        padding: '10px',
    },
    sectionWrapper: {
        width: '100%'
    },
}))