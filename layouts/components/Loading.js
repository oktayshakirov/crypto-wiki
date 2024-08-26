import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="loader-container">
      <ClipLoader color={"#e5c200"} loading={true} size={100} />
    </div>
  );
};

export default Loading;
