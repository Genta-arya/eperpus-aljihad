import React from "react";
import Navbars from "./Navbars";

const Container = ({ children }) => {
  return (
    <>

      <div className="container flex justify-center items-center ">{children}</div>
    </>
  );
};

export default Container;
