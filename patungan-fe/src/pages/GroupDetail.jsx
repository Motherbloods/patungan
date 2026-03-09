import { useParams } from "react-router-dom";
import groupList from "../config/group_list";
import { GroupHeader } from "../components/GroupHeader";

function GroupDetail() {
  const { id } = useParams();

  const group = groupList.find((g) => g.id === Number(id));

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      <GroupHeader groupConfig={group} />
    </div>
  );
}

export default GroupDetail;
