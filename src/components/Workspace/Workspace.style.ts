import { createStyles, rem } from '@mantine/core';

export const useWorkspaceStyle = createStyles((theme) => ({
    accordion: {
        '.mantine-Accordion-content': {
            padding: rem(5),
        },
        '.mantine-Accordion-chevron': {
            "&[data-rotate]": {
                transform: "rotate(90deg)",
                transition: "transform 300ms ease",
            },
            display: "none",
        }
    }
}));
