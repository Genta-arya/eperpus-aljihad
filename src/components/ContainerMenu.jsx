import React from "react";
import Navigation from "./Navigation";
import { Helmet } from "react-helmet-async";

const ContainerMenu = ({ children, text }) => {
  return (
    <>
   
      <div className="mt-2">
        <Navigation text={text} />
      </div>
      <div className=" bg-white pl-2 mt-4">
        <div className=" py-2  ">{children}</div>
      </div>
    </>
  );
};

export default ContainerMenu;
