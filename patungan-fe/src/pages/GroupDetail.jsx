import { useParams } from "react-router-dom";
import groupList from "../config/group_list";

function GroupDetail() {
  const { id } = useParams();

  const group = groupList.find((g) => g.id === Number(id));

  return (
    <div>
      <h1>group {group?.name}</h1>
    </div>
  );
}

export default GroupDetail;
