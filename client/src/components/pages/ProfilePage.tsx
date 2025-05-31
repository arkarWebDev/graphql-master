import React from "react";
import AvatarUpload from "../profile/AvatarUpload";
import UserInfo from "../profile/UserInfo";

const ProfilePage = () => {
  return (
    <main className="layout space-y-4">
      <AvatarUpload />
      <UserInfo />
    </main>
  );
};

export default ProfilePage;
