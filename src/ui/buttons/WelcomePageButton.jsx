import React from 'react'

const HomePageButton = ({children}) => {
  return (
    <div className="homePageButton border rounded-md p-2.5 hover:cursor-pointer hover:bg-blue-200 transition-colors duration-300 ease-in-out">
        {children}
    </div>
  )
}

export default HomePageButton