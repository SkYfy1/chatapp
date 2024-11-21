import React from 'react'
import './detail.css'
import { auth } from '../../lib/firebase'
import useChatStore from '../../context/useChatStore'

const Detail = () => {
  const friend = useChatStore(state => state.user);

  return (
    <div className='detail'>
      <div className="user">
        <img src={friend.avatar || "./avatar.png"} alt="avatar" />
        <h2>{friend.username}</h2>
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
          <button>Block User</button>
          <button className='logout' onClick={() => auth.signOut()}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Detail
