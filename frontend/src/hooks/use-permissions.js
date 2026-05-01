import { useEffect, useMemo, useState } from "react";

const usePermissions = (user, workspace) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (user && workspace) {
      const member = workspace.members.find(
        (member) => member.userId?.toString() === user._id?.toString(),
      );
      if (member) {
        setPermissions(member.role.permission || []);
      }
    }
  }, [JSON.stringify(user), JSON.stringify(workspace)]);

  return useMemo(() => permissions, [permissions]);
};

export default usePermissions;
