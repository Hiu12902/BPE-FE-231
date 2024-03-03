import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useSurveyNavbarStyle = createStyles(() => ({
    accordion: {
        '.mantine-Accordion-chevron': {
            display: 'none'
        },
        '.mantine-Accordion-item': {
            borderRadius: '5px',
            marginTop: '20px',
        }
    },
    item: {
        border: "none",
        ":hover": {
            backgroundColor: PRIMARY_COLOR[0],
            borderRadius: "5px",
        },
    },
    control: {
        padding: '0 15px',
        color: PRIMARY_COLOR[3],
        backgroundColor: PRIMARY_COLOR[1],
        borderRadius: "5px",
        ":hover": {
            backgroundColor: PRIMARY_COLOR[0],
        },
    },
}));
