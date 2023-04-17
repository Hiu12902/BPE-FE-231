import { PALETTE_WIDTH } from '@/constants/theme/themeConstants';
import { AppShell, Box, Header, Navbar, Title } from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import AppNavbar from './components/AppNavbar';

const AppLayout = () => {
  const navigate = useNavigate();
  return (
    <AppShell
      navbar={
        <Navbar
          height="100vh"
          width={{ base: PALETTE_WIDTH }}
          p="sm"
          sx={(theme) => ({
            backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
              .background,
            top: 0,
          })}
        >
          <Title
            order={4}
            color="white"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            BPSky
          </Title>
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
      <Box style={{ marginLeft: PALETTE_WIDTH + 10, marginTop: 70 }}>
        <Outlet />
      </Box>
    </AppShell>
  );
};

export default AppLayout;
