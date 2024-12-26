import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import JoinChatsList from '../components/JoinChatsList'
import AvailableChatsList from '../components/AvailableChatsList'
import TitleContainer from '../components/shared/TitleContainer'
import { fetchChats } from '../actions/chatActions'
import { withBaseLayout } from '../layouts/BaseLayout'
import Notification from '../utils/notifications'


const Home = () => {

  const dispatch = useDispatch()
  const joinedChats = useSelector(state => state.chats.joined)
  const availableChats = useSelector(state =>state.chats.available)

  useEffect(() => {
    Notification.setup()
    dispatch(fetchChats())
  }, [dispatch])

  return (
    <div className="row no-gutters fh">
      <div className="col-3 fh">
        <JoinChatsList chats={ joinedChats } />
      </div>
      <div className="col-9 fh">
        <TitleContainer text="Choose Your Channel">
          <Link to='/chatcreate' className='btn btn-sm btn-outline-primary'>New</Link>
        </TitleContainer>
        <div className="container-fluid">
          <AvailableChatsList chats={ availableChats } />
        </div>
      </div>
    </div>
  )
}

export default withBaseLayout(Home)