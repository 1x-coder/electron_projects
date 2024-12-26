import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import HomeView from './views/Home'
import SettingsView from './views/Settings'
import WelcomeView from './views/Welcome'
import ChatView from './views/Chat'
import ChatCreateView from './views/ChatCreate'

import LoadingView from './components/shared/LoadingView'

import { listenToAuthChanged } from './actions/authActions'
import { listenToConnectionChanges } from './actions/appStatusAction'
import { checkUserConnection } from './actions/connectionAction'
import { loadInitialSettings } from './actions/settingsAction'

import StoreProvider from './store/StoreProvider'
import PrivateRoute from './components/PrivateRoute'


const ContentWrapper = ({children}) => {
  const isDarkTheme  = useSelector(({settings}) => settings.isDarkTheme);
  return (
    <div className={`content-wrapper ${isDarkTheme ? 'dark' : 'light'}`}>{children}</div>
  )
}

const ChatApp = () => {

    const dispatch = useDispatch()
    const isChecking = useSelector(({ auth }) => auth.isChecking)
    const isOnline = useSelector(({ app }) => app.isOnline)
    const user = useSelector(({auth}) => auth.user)

    useEffect(() => {
      
        dispatch(loadInitialSettings())
        const unsubFromAuth = dispatch(listenToAuthChanged())
        const unsubFromConnection = dispatch(listenToConnectionChanges())

        return () => {
            unsubFromAuth()
            unsubFromConnection()
        }
    }, [dispatch])
    
    useEffect(() => {
        let unsubFromUserConnection
        if (user?.uid) {
        unsubFromUserConnection = dispatch(checkUserConnection(user.uid))
        }

        return () => {
        unsubFromUserConnection && unsubFromUserConnection()
        }
    }, [dispatch, user])


    if (!isOnline) {
        return <LoadingView message="Application has been disconnected from the internet. Please reconnect..." />
    }
    

    if (isChecking) {
        return <LoadingView />
    }

    return (
        <Router>
            <ContentWrapper>
                <Switch>
                    <Route exact path="/">
                        <WelcomeView />
                    </Route>
                    <PrivateRoute path="/home">
                        <HomeView />
                    </PrivateRoute>
                    <PrivateRoute path="/settings">
                        <SettingsView />
                    </PrivateRoute>
                    <PrivateRoute path="/chatcreate">
                        <ChatCreateView />
                    </PrivateRoute>
                    <PrivateRoute path="/chat/:id">
                        <ChatView />
                    </PrivateRoute>
                </Switch>
            </ContentWrapper>
        </Router>
    )
}


const App = () => {
    return (
        <StoreProvider>
            <ChatApp />
        </StoreProvider>
    )
}

export default App