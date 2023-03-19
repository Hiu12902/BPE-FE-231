import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import BpeBpmnModeler from './core/modeler/BpmnModeler';
import { store } from '@/redux/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <NotificationsProvider>
        <ModalsProvider>
          <BpeBpmnModeler />
        </ModalsProvider>
      </NotificationsProvider>
    </Provider>
  );
}

export default App;
