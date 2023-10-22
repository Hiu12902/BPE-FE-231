import { createStyles, rem } from '@mantine/core';

export const useDefaultHomepageStyle = createStyles(() => ({
    tabs: {
        '.mantine-Tabs-tabsList': {
            marginTop: rem(15),
        },
        '.mantine-Tabs-tab': {
            fontSize: rem(18),
            width: '15%',
        },
        '.mantine-Tabs-tab[data-active="true"]': {
            fontWeight: 500,
        },
    },
    searchGroup: {
        marginTop: rem(20),
    },
    buttonIcon: {
        width: rem(15),
        height: rem(15),
    },
    accordion: {
        marginTop: rem(20),
    },
    form: {
        width: '60%'
    }
}));
