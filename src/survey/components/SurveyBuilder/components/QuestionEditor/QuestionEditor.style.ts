import { SURVEY_NAVBAR_HEIGHT } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useQuestionEditorStyle = createStyles(() => ({
    wrapper: {
        width: '70%',
        height: `calc(100vh - ${SURVEY_NAVBAR_HEIGHT}px)`,
        borderLeft: '1px solid #ddd',
    },
    infoGroup: {
        width: '100%',
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    buttonGroup: {
        width: '100%',
        padding: '10px',
        borderTop: '1px solid #ddd',
    },
    editArea: {
        width: '100%',
        height: '100%',
        padding: '10px 25px 10px 20px',
    },
}))