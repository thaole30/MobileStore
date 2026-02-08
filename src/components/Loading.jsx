import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <div className="loading-component">
      <ReactLoading
        type={"spin"}
        color={"gray"}
        height={50}
        width={50}
        className="loading-icon"
      />
    </div>
  );
}
