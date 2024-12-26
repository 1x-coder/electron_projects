import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'


const PrivateRoute = ({ children, ...rest }) => {

    const user = useSelector(({auth}) => auth.user)
    const onlyChild = React.Children.only(children)
    
    return (
        <Route
            {...rest}
            render={props =>
                user ?
                    React.cloneElement(onlyChild, { ...rest, ...props }) :
                    <Redirect to="/" />
            }     
        />
    )
}

export default PrivateRoute