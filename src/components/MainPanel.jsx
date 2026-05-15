import React from 'react'

const MainPanel = ({children}) => {
  return (
    <>
        <div className="mainPanel">
            {children}
        </div>
    </>
  )
}

export default MainPanel