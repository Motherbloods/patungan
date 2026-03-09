function getMember(members, uid) {
  return (
    members.find((m) => m._id === uid) ?? {
      name: uid,
      emoji: "👤",
      color: "#94A3B8",
      light: "#F1F5F9",
    }
  );
}

export function getMemberUtil(members, uid) {
  return getMember(members, uid);
}

export function getNameUtil(members, uid) {
  return getMember(members, uid).name;
}
