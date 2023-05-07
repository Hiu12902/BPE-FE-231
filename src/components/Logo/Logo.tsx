import { ReactComponent as AppLogo } from '@/assets/logo.svg';
import { Anchor, Center, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  logo: {
    cursor: 'pointer',

    '&:hover': {
      stroke: theme.colors.gray[3],
    },
  },
}));

const Logo = () => {
  const { classes } = useStyles();
  return (
    <Anchor href="/">
      <Center>
        <AppLogo height={40} className={classes.logo} />
      </Center>
    </Anchor>
  );
};

export default Logo;
