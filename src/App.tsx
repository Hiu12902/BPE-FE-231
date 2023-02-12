import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import BpeBpmnModeler from './core/viewer/BpmnViewer';

function App() {
  return (
    <NotificationsProvider>
      <ModalsProvider>
        <BpeBpmnModeler />
      </ModalsProvider>
    </NotificationsProvider>
  );
}

export default App;
