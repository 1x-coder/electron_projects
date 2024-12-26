import db from '../db/firestore'
import firebase from 'firebase/app'


const extractSnapshotData = snapshot =>
    snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        

// @desc    Get chats
// @access  Private
export const fetchChats = () =>
  db
    .collection('chats')
    .get()
    .then(extractSnapshotData)


// @desc    Create new chat
// @access  Private
export const createChat = chat =>
  db
    .collection('chats')
    .add(chat)
    .then(docRef => docRef.id)
   

// @desc    Update chat
// @access  Private
export const joinChat = async (userId, chatId) => {
  const userRef = db.doc(`profiles/${userId}`)
  const chatRef = db.doc(`chats/${chatId}`)

  await userRef.update({joinedChats: firebase.firestore.FieldValue.arrayUnion(chatRef)})
  await chatRef.update({joinedUsers: firebase.firestore.FieldValue.arrayUnion(userRef)})
}


// @desc    Subscribe chat
// @access  Private
export const subscribeToChat = (chatId, onSubsribe) =>
  db
    .collection('chats')
    .doc(chatId)
    .onSnapshot(snapshot => {
      const chat = {id: snapshot.id, ...snapshot.data()}
      onSubsribe(chat);
    })


// @desc    Subscribe profile
// @access  Private    
export const subscribeToProfile = (uid, onSubsribe) =>
  db
    .collection('profiles')
    .doc(uid)
    .onSnapshot(snapshot => onSubsribe(snapshot.data()))


// @desc    Create message collection and add chatId
// @access  Private    
export const sendChatMessage = (message, chatId) =>
  db
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .doc(message.timestamp)
    .set(message)


// @desc    Subscribe message 
// @access  Private    
export const subscribeToMessages = (chatId, onSubscribe) =>
  db
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .onSnapshot(snapshot => onSubscribe(snapshot.docChanges()))