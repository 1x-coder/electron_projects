import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import chatReducers from '../reducers/chatReducers'
import createAuthReducer from '../reducers/authReducers'
import createAppStatusReducer from '../reducers/appStatusReducers'
import appMiddleware from '../middlewares/appStatusMiddlewares'
import settingsReducer from '../reducers/settingsReducers'



export default function configureStore() {

    const middleware = [thunk, appMiddleware]

        const mainReducer = combineReducers({
            chats: chatReducers,
            auth: createAuthReducer,
            app: createAppStatusReducer,
            settings: settingsReducer
        })

    const rootReducer = (state, action) => {

        if (action.type === 'AUTH_LOGOUT_SUCCESS') {
            Object.keys(state).forEach(sk => {
                if (state[sk].savable) {
                    return
                }
                state[sk] = undefined
            }) 
        }

        return mainReducer(state, action)
    }

    const store = createStore(
        rootReducer,
        applyMiddleware(...middleware))

    return store
}
