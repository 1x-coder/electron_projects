import React from 'react'
import Navbar from '../components/Navbar'



const BaseLayout = ({children, ...props}) => {

  return (
    <>
      <Navbar {...props}/>
      {children}
    </>
  )
}
export default BaseLayout


function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component'
}

export const withBaseLayout = (Component, config) => props => {
  const viewName = getDisplayName(Component)
  return (
    <>
      <Navbar {...config} view={viewName} />
      <Component {...props} />
    </>
  )
}

