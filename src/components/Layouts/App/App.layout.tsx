import { APP_PALETTE_WIDTH } from '@/constants/theme/themeConstants';
import { AppShell, Box, Header, Navbar } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import AppNavbar from './components/AppNavbar';
import { useEffect } from 'react';
import userApi from '@/api/user';
import { useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '@/redux/selectors';
import { userActions } from '@/redux/slices';
import Logo from '@/components/Logo';

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const currentUser = useSelector(getCurrentUser);

  const getUser = async () => {
    try {
      const res = await userApi.getMe();
      if (res) {
        dispatch(userActions.setUser(res));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentUser.email) {
      getUser();
    }
    if (!!localStorage.getItem('resetToken')) {
      localStorage.removeItem('resetToken');
    }
  }, [currentUser]);

  return (
    <AppShell
      navbar={
        <Navbar
          height="100vh"
          width={{ base: APP_PALETTE_WIDTH }}
          p="sm"
          sx={(theme) => ({
            backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
              .background,
            top: 0,
          })}
        >
          <Logo />
          <AppNavbar mt={35} />
        </Navbar>
      }
      header={
        <Header height={60} fixed={false} pt={10}>
          <AppHeader />
        </Header>
      }
      styles={{ main: { padding: 0 } }}
    >
      <Box style={{ marginLeft: APP_PALETTE_WIDTH + 10, marginTop: 70 }}>
        <Outlet />
      </Box>
    </AppShell>
  );
};

export default AppLayout;
