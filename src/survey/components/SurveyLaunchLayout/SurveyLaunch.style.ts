import { SURVEY_LAYOUT_WIDTH, SURVEY_NAVBAR_HEIGHT } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useSurveyLaunchLayoutStyle = createStyles(() => ({
    box: {
        marginTop: SURVEY_NAVBAR_HEIGHT,
        marginLeft: SURVEY_LAYOUT_WIDTH,
        marginRight: SURVEY_LAYOUT_WIDTH,
        // backgroundColor: "#eee",
    }
}))