import { APP_PALETTE_WIDTH, PRIMARY_COLOR } from "@/constants/theme/themeConstants";
import { createStyles } from "@mantine/core";

export const useWorkspaceLayoutStyle = createStyles(() => ({
    appshell: {
        padidng: 10,
    },
    navbar: {
        height: '100vh',
        width: APP_PALETTE_WIDTH,
        padding: '10px',
        top: 0,
        backgroundColor: PRIMARY_COLOR[1],
    },
    outlet: {
        marginTop: '30px',
        height: "90%"
    }
}));
