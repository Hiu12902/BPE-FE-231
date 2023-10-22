import { createStyles } from "@mantine/core";

export const useWorkspaceItemStyle = createStyles(() => ({
    accordion: {
        ".mantine-Accordion-content": {
            padding: 0,
        },
        ".mantine-Accordion-control": {
            padding: 0,
        },
        ".mantine-Accordion-label": {
            padding: 0,
        },
        ".mantine-Accordion-chevron": {
            "&[data-rotate]": {
                transform: "rotate(90deg)",
            },
            margin: 10,
            display: "none",
        },
    },
    dropdownMenuIcon: {
        width: '20px',
        height: '20px',
    },
}));
