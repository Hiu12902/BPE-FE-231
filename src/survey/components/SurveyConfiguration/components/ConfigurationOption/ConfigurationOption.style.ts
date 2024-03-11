import { SURVEY_NAVBAR_HEIGHT } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useConfigurationOptionStyle = createStyles(() => ({
    mainWrapper: {
        width: '30%',
        height: `calc(100vh - ${SURVEY_NAVBAR_HEIGHT}px)`,
        padding: '10px',

        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    sectionWrapper: {
        width: '100%',
        padding: "10px",
        border: '1px solid #fff',
        ':hover': {
            border: '1px solid #1976d2',
            borderRadius: '10px',
        }
    },
    activeSection: {
        width: '100%',
        padding: "10px",
        borderRadius: '10px',
        border: '1px solid #fff',
        backgroundColor: '#e7f5ff',
    }
}))