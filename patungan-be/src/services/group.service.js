const Group = require("../models/group");

const createGroupService = async (data) => {
  const { groupName, groupIcon, groupColor, groupIconColor, members } = data;
  console.log(data);

  if (
    !groupName ||
    !groupIcon ||
    !groupColor ||
    !groupIconColor ||
    !members ||
    members.length === 0
  ) {
    throw new Error(
      "All required fields must be provided: groupName, groupIcon, groupColor, groupIconColor, members",
    );
  }

  const formattedMembers = members.map((member) => ({
    name: member.name,
    emoji: member.emoji || "",
    color: member.color || "#ffffff",
    light: member.light || "#ffffff",
  }));

  const group = new Group({
    name: groupName,
    icon: groupIcon,
    color: `${groupColor} ${groupIconColor}`,
    total_expenses: 0,
    expense_count: 0,
    member_count: formattedMembers.length,
    members: formattedMembers,
  });

  await group.save();
  return group;
};

module.exports = { createGroupService };
