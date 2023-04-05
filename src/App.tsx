import { store } from '@/redux/store';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';
import BpeBpmnModeler from './core/modeler/BpmnModeler';

function App() {
  return (
    <Provider store={store}>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <Notifications />
        <ModalsProvider>
          <BpeBpmnModeler />
        </ModalsProvider>
      </MantineProvider>
    </Provider>
  );
}

export default App;
