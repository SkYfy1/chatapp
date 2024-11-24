import React from 'react'
import './detail.css'
import { auth, db } from '../../lib/firebase'
import useChatStore from '../../context/useChatStore'
import { useAuthStore } from '../../context/useAuthStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const Detail = () => {
  const friend = useChatStore(state => state.user);
  const { changeBlock, isReceiverBlocked, isUserBlocked } = useChatStore();
  const currentUser = useAuthStore(state => state.currentUser);

  const handleBlock = async () => {
    if (!friend) return;

    const userDoc = doc(db, 'users', currentUser.id);

    await updateDoc(userDoc, {
      blocked: isReceiverBlocked ? arrayRemove(friend.id) : arrayUnion(friend.id)
    })

    changeBlock();
  };

  return (
    <div className='detail'>
      <div className="user">
        <img src={isUserBlocked ?  "./avatar.png" : friend?.avatar} alt="avatar" />
        <h2>{friend?.username}</h2>
        <p>Lorem ipsum suk iodj fovej kavler.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg" alt="" />
                <span>asdadjhkasjkd.png</span>
              </div>
              <img className='download' src="./download.png" alt="Download icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg" alt="" />
                <span>asdadjhkasjkd.png</span>
              </div>
              <img className='download' src="./download.png" alt="Download icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg" alt="" />
                <span>asdadjhkasjkd.png</span>
              </div>
              <img className='download' src="./download.png" alt="Download icon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg" alt="" />
                <span>asdadjhkasjkd.png</span>
              </div>
              <img className='download' src="./download.png" alt="Download icon" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className='btn-div'>
          <button onClick={handleBlock}>{
            isUserBlocked ? 'You are blocked' : isReceiverBlocked ? "User blocked" : "Block user"
          }</button>
          <button className='logout' onClick={() => auth.signOut()}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Detail
