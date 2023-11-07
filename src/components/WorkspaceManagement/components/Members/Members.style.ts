import { createStyles, rem } from "@mantine/core";

export const useMembersStyle = createStyles(() => ({
    form: {
        width: '60%',
    },
    button: {
        minWidth: rem(100),
    },
    buttonIcon: {
        width: rem(15),
        height: rem(15),
    },
    select: {
        '.mantine-Select-input': {
            borderRadius: '30px',
            textAlign: 'center',
        }
    },
}))