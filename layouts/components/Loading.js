import React from "react";
import { ScaleLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex justify-center">
      <ScaleLoader color={"#e5c200"} loading={true} size={100} />
    </div>
  );
};

export default Loading;
