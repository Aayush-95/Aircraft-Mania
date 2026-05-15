import React from "react";

const CompanyCard = ({
  companyLogo,
  companyname,
  country,
  specialization,
  aircraftsCount
}) => {
  return (
    <>
      <div className="cardHolder rounded-2xl border-2 h-[20%] w-[20%] p-5">
        <div className="image h-48 w-full overflow-hidden">
          <img src={companyLogo} alt="" sizes="" srcset="" className="w-full h-full object-contain"/>
        </div>
        <div className="info">
          <div className="name">
            <p className="companyName">{companyname}</p>
            <p className="country">{country}</p>
            <p className="specialization">{specialization}</p>
            <p className="aircraftCount">{aircraftsCount} Aircraft Models</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyCard;
