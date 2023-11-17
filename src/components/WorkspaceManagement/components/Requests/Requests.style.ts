import { createStyles, rem } from "@mantine/core";

export const useRequestsStyle = createStyles(() => ({
    form: {
        width: '60%',
    },
    button: {
        minWidth: rem(100),
    },
    select: {
        '.mantine-Select-root': {
            width: 'auto'
        },
        '.mantine-Select-input': {
            textAlign: 'center',
        }
    },
}))