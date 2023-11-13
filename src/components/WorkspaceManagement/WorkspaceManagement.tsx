import { userApi } from "@/api/index";
import { getCurrentUser } from "@/redux/selectors";
import { userActions } from "@/redux/slices";
import { useAppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Members } from "./components";

const WorkspaceManagement = () => {
  const dispatch = useAppDispatch();
  const { workspaceId, workspaceName } = useParams();
  const currentUser = useSelector(getCurrentUser);
  const navigate = useNavigate();

  const getUser = async (workspaceId: number) => {
    try {
      const res = await userApi.getMe(workspaceId);
      if (res) {
        dispatch(userActions.setUser(res));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentUser.permission) {
      getUser(Number(workspaceId));
    } else if (currentUser.permission === "owner") {
      navigate(`/management/members/${workspaceName}/${workspaceId}`);
    } else {
      navigate(`/404`);
    }
  }, [currentUser]);

  return <Members />;
};

export default WorkspaceManagement;
