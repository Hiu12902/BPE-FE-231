import NotFound from '@/components/404';
import CrashComponent from '@/components/CrashComponent';
import ForgotPassword from '@/components/ForgotPassword';
import AppLayout from '@/components/Layouts/App/App.layout';
import AuthenticationLayout from '@/components/Layouts/Authentication';
import Login from '@/components/Login';
import MainScreen from '@/components/MainScreen';
import ProtectedRoute from '@/components/ProtectedRoute';
import Register from '@/components/Register';
import ResetPassword from '@/components/ResetPassword';
import BpeBpmnModeler from '@/core/modeler/BpmnModeler';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<ProtectedRoute />} errorElement={<CrashComponent />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<MainScreen />} />
        </Route>
        <Route path="/editor" element={<BpeBpmnModeler />} />
      </Route>
      <Route element={<AuthenticationLayout />} errorElement={<CrashComponent />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
