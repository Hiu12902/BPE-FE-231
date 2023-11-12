import { PRIMARY_COLOR } from '@/constants/theme/themeConstants';
import { createStyles } from '@mantine/core';

export const useWorkspaceNavbarStyle = createStyles(() => ({
    accordion: {
        '.mantine-Accordion-chevron': {
            "&[data-rotate]": {
                transform: "rotate(90deg)",
                transition: "transform 300ms ease",
            },
            display: 'none'
        },
        '.mantine-Accordion-item': {
            borderRadius: "5px",
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
