import firebase from "firebase/app"
import 'firebase/auth'
import db from '../db/firestore'



// Create user profile on firestore
const createUserProfile = userProfile =>
    db
        .collection('profiles')
        .doc(userProfile.uid)
        .set(userProfile)


// Get user profile
export const getUserProfile = uid => 
    db
        .collection('profiles')
        .doc(uid)
        .get()
        .then(snapshot => snapshot.data())



// Register new user
export async function register({ email, password, username, avatar }) {
    try {
        const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password)
        const userProfile = { uid: user.uid, username, email, avatar, joinedChats: []}
        await createUserProfile(userProfile)
        return userProfile

    } catch (error) {
        return Promise.reject(error.message)
    }
}


// Login user
export const login = async ({ email, password }) => {
    const { user } = await firebase.auth().signInWithEmailAndPassword(email, password)
    const userProfile = await getUserProfile(user.uid)
    return userProfile
}
    


// Logout user
export const logout = () => firebase.auth().signOut()


// Manage logged in and logged out state
export const onAuthStateChanges = onAuth =>
    firebase.auth().onIdTokenChanged(onAuth)

