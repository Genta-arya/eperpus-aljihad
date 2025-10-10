import React from "react";
import Navbars from "./Navbars";

const Container = ({ children }) => {
  return (
    <>

      <div className="flex flex-col  justify-center items-center  ">{children}</div>
    </>
  );
};

export default Container;
