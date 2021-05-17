import React, { useContext } from "react";
import { myContext } from "./Context";

const Profile = () => {
  const userObject = useContext(myContext);
  return (
    <div>
      {userObject
        ? `Welcome back, ${userObject.username}`
        : "You need to log in to see your profile"}
    </div>
  );
};

export default Profile;
