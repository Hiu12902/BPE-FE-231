import { createStyles } from '@mantine/core';

export const useProcessPortfolioStyle = createStyles(() => ({
    accordion: {
        marginTop: "20px",
        '.mantine-Accordion-content': {
        },
        '.mantine-Accordion-chevron': {
            "&[data-rotate]": {
                transform: "rotate(90deg)",
                transition: "transform 300ms ease",
            },
            display: 'none'
        }
    },
    buttonGroup: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    }
}))
