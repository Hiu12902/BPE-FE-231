import { ReactComponent as AppLogo } from "@/assets/logo.svg";
import { Anchor, Center, createStyles } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  logo: {
    cursor: "pointer",

    "&:hover": {
      stroke: theme.colors.gray[3],
    },
  },
}));

const Logo = ({
  height,
  fullReload,
}: {
  height?: number;
  fullReload?: boolean;
}) => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return fullReload ? (
    <Anchor href="/">
      <Center>
        <AppLogo height={height || 40} className={classes.logo} />
      </Center>
    </Anchor>
  ) : (
    <Center>
      <AppLogo
        height={height || 40}
        className={classes.logo}
        onClick={() => navigate("/")}
      />
    </Center>
  );
};

export default Logo;
