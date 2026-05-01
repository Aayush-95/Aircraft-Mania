import React from 'react'

const HomePageButton = ({children}) => {
  return (
    <div className="homePageButton border rounded-3xl p-2.5 hover:cursor-pointer">
        {children}
    </div>
  )
}

export default HomePageButton