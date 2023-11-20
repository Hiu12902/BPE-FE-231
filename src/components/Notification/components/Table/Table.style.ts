import { createStyles, rem } from "@mantine/core";

export const useTableStyle = createStyles(() => ({
    select: {
        '.mantine-Select-rightSection': {
            display: 'none',
        },
        '.mantine-Select-input': {
            padding: 10,
            borderRadius: '30px',
            textAlign: 'center',
        }
    },
    buttonIcon: {
        width: rem(15),
        height: rem(15),
    },
}))