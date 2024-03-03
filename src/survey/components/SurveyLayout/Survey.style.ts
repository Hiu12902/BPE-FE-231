import { PRIMARY_COLOR, SURVEY_LAYOUT_WIDTH } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useSurveyLayoutStyle = createStyles(() => ({
    navbar: {
        height: '100vh',
        padding: '10px',
        width: SURVEY_LAYOUT_WIDTH,
        top: 0,
        backgroundColor: PRIMARY_COLOR[1],
    },
    box: {
        marginTop: '60px',
        marginLeft: SURVEY_LAYOUT_WIDTH,
    }
}));
