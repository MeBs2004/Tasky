import { createContext, useContext, useEffect } from "react";
import useAuth from "@/hooks/api/use-auth";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetWorkspaceQuery from "@/hooks/api/use-get-workspace";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/use-permissions";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  const {
    data: authData,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();

  const user = authData?.user;

  const {
    data: workspaceData,
    error: workspaceError,
    isLoading: workspaceLoading,
    refetch: refetchWorkspace,
  } = useGetWorkspaceQuery(workspaceId);

  const workspace = workspaceData?.workspace;

  useEffect(() => {
    if (workspaceError) {
      if (workspaceError.errorCode === "ACCESS_UNAUTHORIZED") {
        navigate("/");
      }
    }
  }, [navigate, workspaceError]);

  const permissions = usePermissions(user, workspace);

  const hasPermission = (permission) => permissions.includes(permission);

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        error: workspaceError || authError,
        isLoading,
        workspaceLoading,
        isFetching,
        hasPermission,
        refetchAuth,
        refetchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};
