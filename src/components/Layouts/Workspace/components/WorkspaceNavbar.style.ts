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
        }
    },
    control: {
        padding: "0px 10px",
        backgroundColor: PRIMARY_COLOR[1],
        ":hover": {
            backgroundColor: PRIMARY_COLOR[0],
            borderRadius: "5px",
        },
    },
    item: {
        border: "none",
        ":hover": {
            backgroundColor: PRIMARY_COLOR[0],
            borderRadius: "5px",
        },
    },
    activeControl: {
        padding: "0px 10px",
        backgroundColor: PRIMARY_COLOR[0],
        borderRadius: "5px",
    },
    activeItem: {
        backgroundColor: PRIMARY_COLOR[0],
        borderRadius: "5px",
    },
}));
