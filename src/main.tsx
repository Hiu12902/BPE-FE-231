import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import { store } from '@/redux/store';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <Notifications />
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
    </MantineProvider>
  </Provider>
);
