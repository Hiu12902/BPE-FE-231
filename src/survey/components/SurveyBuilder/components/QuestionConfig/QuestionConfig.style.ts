import { SURVEY_NAVBAR_HEIGHT } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useQuestionConfigStyle = createStyles(() => ({
    mainWrapper: {
        width: '30%',
        height: `calc(100vh - ${SURVEY_NAVBAR_HEIGHT}px)`,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    surveyTitle: {
        margin: "10px",
    },
    scrollAreaWrapper: {
        width: '100%',
        height: '100%',
        padding: '15px',
    },
    sectionWrapper: {
        width: '100%',
        height: '100%',
        margin: "0 0 20px 0",
    },
    unselectedQuestion: {
        width: '100%',
        height: '100%',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unselectedText: {
        fontSize: 15,
        color: '#bbb',
        fontStyle: 'italic',
    }
}))