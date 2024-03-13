import { PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useHeaderStyle = createStyles(() => ({
    header: {
        width: '100%',
        padding: '10px',
        top: 0,
        backgroundColor: PRIMARY_COLOR[1],
    },
}));
