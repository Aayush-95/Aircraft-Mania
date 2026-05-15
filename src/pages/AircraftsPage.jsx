import React from "react";
import CompanyCard from "../ui/cards/CompanyCard";
import airbusLogo from "../assets/airbusLogo.png";
import boeingLogo from "../assets/boeingLogo.png";
import embraerLogo from "../assets/embraerLogo.png";

const AircraftsPage = () => {
  return (
    <>
      <div className="mainContainer flex flex-col items-center">
        <div className="header m-4">
          <h1 className="popularAircraftCompanies text-4xl font-medium">
            Popular Aircraft Companies
          </h1>
        </div>
        <div className="cardsDiv flex flex-row justify-evenly flex-wrap border-2">
          <CompanyCard
            companyname="Airbus"
            country="France"
            specialization="Commercial Aviation"
            aircraftsCount="26"
            companyLogo={airbusLogo}
          />

          <CompanyCard
            companyname="Boeing"
            country="United States"
            specialization="Commercial & Military Aviation"
            aircraftsCount="31"
            companyLogo={boeingLogo}
          />

          <CompanyCard
            companyname="Embraer"
            country="Brazil"
            specialization="Regional & Business Jets"
            aircraftsCount="18"
            companyLogo={embraerLogo}
          />
        </div>
      </div>
    </>
  );
};

export default AircraftsPage;
