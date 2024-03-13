import NotFound from "@/components/404";
import CrashComponent from "@/components/CrashComponent";
import DefaultHomepage from "@/components/DefaultHomepage/DefaultHomepage";
import DocumentEditor from "@/components/DocumentEditor";
import ForgotPassword from "@/components/ForgotPassword";
import AppLayout from "@/components/Layouts/App/App.layout";
import AuthenticationLayout from "@/components/Layouts/Authentication";
import WorkspaceLayout from "@/components/Layouts/Workspace/Workspace.layout";
import Login from "@/components/Login";
import Project from "@/components/Project";
import ProtectedRoute from "@/components/ProtectedRoute";
import Register from "@/components/Register";
import ResetPassword from "@/components/ResetPassword";
import Workspace from "@/components/Workspace";
import Notification from "@/components/Notification";
import {
  Customization,
  Members,
  Requests,
  WorkspaceManagement,
} from "@/components/WorkspaceManagement";
import BpeBpmnModeler from "@/core/modeler/BpmnModeler";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import SurveyLayout from "@/survey/components/SurveyLayout/Survey.layout";
import {
  SurveyBuilder,
  SurveyConfiguration,
  SurveyResult,
} from "@/survey/components";
import SurveyLaunchLayout from "@/survey/components/SurveyLaunchLayout/SurveyLaunch.layout";
import SurveyLauncher from "@/survey/components/SurveyLauncher";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<ProtectedRoute />} errorElement={<CrashComponent />}>
        <Route element={<WorkspaceLayout isWorkspaceManagement={false} />}>
          <Route path="/" element={<DefaultHomepage />} />
          <Route
            path="/workspace/:workspaceName/:workspaceId"
            element={<Workspace />}
          />
          <Route path="/notification" element={<Notification />} />
        </Route>
        <Route element={<WorkspaceLayout isWorkspaceManagement={true} />}>
          <Route
            path="/management/:workspaceName/:workspaceId"
            element={<WorkspaceManagement />}
          />

          <Route
            path="/management/members/:workspaceName/:workspaceId"
            element={<Members />}
          />
          <Route
            path="/management/requests/:workspaceName/:workspaceId"
            element={<Requests />}
          />
          <Route
            path="/management/customization/:workspaceName/:workspaceId"
            element={<Customization />}
          />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/document" element={<DocumentEditor />} />
          <Route path="project/:projectName/:projectId" element={<Project />} />
        </Route>
        <Route path="/editor" element={<BpeBpmnModeler />} />
        <Route element={<SurveyLayout />}>
          <Route
            path="/:projectId/:processVersion/survey/builder"
            element={<SurveyBuilder />}
          />
          <Route
            path="/:projectId/:processVersion/survey/configuration/general"
            element={<SurveyConfiguration configOption="general" />}
          />
          <Route
            path="/:projectId/:processVersion/survey/configuration/response"
            element={<SurveyConfiguration configOption="response" />}
          />
          <Route
            path=":projectId/:processVersion/survey/result/"
            element={<SurveyResult />}
          />
        </Route>
        <Route element={<SurveyLaunchLayout />}>
          <Route path="/survey/launch" element={<SurveyLauncher />} />
        </Route>
      </Route>
      <Route
        element={<AuthenticationLayout />}
        errorElement={<CrashComponent />}
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
