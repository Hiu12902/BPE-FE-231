import { NotificationsProvider } from '@mantine/notifications';

import BpeBpmnModeler from './core/viewer/BpmnViewer';

function App() {
  return (
    <NotificationsProvider>
      <BpeBpmnModeler />
    </NotificationsProvider>
  );
}

export default App;
