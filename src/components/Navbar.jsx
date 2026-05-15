import React from "react";
import SearchBarNav from "../ui/elements/SearchBarNav";

const Navbar = () => {
  return (
    <>
      <div className="mainNavPanel bg-(--bg-secondary) flex flex-row justify-between items-center h-16">
        <div className="navContentRight flex flex-row gap-3 m-10">
            <h3>
                Aircraft Mania
            </h3>
        </div>
        <div className="navContentLeft flex flex-row gap-5 m-10 items-center">
          <p className="searchBar"><SearchBarNav /></p>
          <p className="categories">Categories</p>
          <p className="companies">Companies</p>
          <p className="suggest">Suggest an Aircraft</p>
          <p className="aboutUS">About Us</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
