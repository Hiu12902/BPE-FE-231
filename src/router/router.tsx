import ForgotPassword from '@/components/ForgotPassword/ForgotPassword';
import AppLayout from '@/components/Layouts/App/App.layout';
import AuthenticationLayout from '@/components/Layouts/Authentication';
import Login from '@/components/Login';
import MainScreen from '@/components/MainScreen/MainScreen';
import Register from '@/components/Register';
import ResetPassword from '@/components/ResetPassword/ResetPassword';
import VerificationSent from '@/components/VerificationSent/VerificationSent';
import BpeBpmnModeler from '@/core/modeler/BpmnModeler';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<AppLayout />}>
        <Route path="/" element={<MainScreen />} />
      </Route>
      <Route path="/tool" element={<BpeBpmnModeler />} />
      <Route element={<AuthenticationLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verification-sent" element={<VerificationSent />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
    </Route>
  )
);

export default router;
