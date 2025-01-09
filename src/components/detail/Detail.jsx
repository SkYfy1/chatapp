import React, { useEffect, useRef, useState } from 'react'
import './detail.css'
import { auth, db } from '../../lib/firebase'
import { a, useSpring } from '@react-spring/web'
import useChatStore from '../../context/useChatStore'
import { useAuthStore } from '../../context/useAuthStore'
import userService from '../../services/userService'
import ImageDownload from '../download/ImageDownload'
import useAppStore from '../../context/useAppStore'
import language from '../../utils/language'
import GroupSettings from './groupDetails/groupSettings'

const Detail = ({ setShowDetails }) => {
  const friend = useChatStore(state => state.user);
  const groupInfo = useChatStore(state => state.groupInfo);
  const appState = useAppStore();
  const { changeBlock, isReceiverBlocked, isUserBlocked, chat } = useChatStore();
  const isMobile = useAppStore(state => state.isMobile);
  const [show, setShow] = useState({
    shared: false,
    settings: false,
    privacy: false,
    files: false
  })
  const currentUser = useAuthStore(state => state.currentUser);
  const ref = useRef();
  const [spring, api] = useSpring(() => ({
    from: {
      flex: 0,
      opacity: 0
    },
    to: { opacity: 1, flex: 1 },
    config: {
      duration: 700,
      frequency: 200,
    }
  }));

  useEffect(() => {
    console.log(groupInfo)
  }, [])

  const anims = currentUser.hasOwnProperty('settings') ? currentUser?.settings?.animations : true;

  // useEffect(() => {
  //   isMobile && api.start({ opacity: 1, flex: 1 })
  // }, [isMobile])

  // useEffect(() => {
  //   api.start({ opacity: 1, flex: 1 });

  //   return () => api.stop();
  // }, [])

  const handleBlock = async () => {
    if (!friend) return;

    await userService.blockUser(isReceiverBlocked, currentUser.id, friend.id);

    changeBlock();
  };

  const closeDetails = () => {
    api.start({ opacity: 0, flex: 0 });

    setTimeout(() => {
      setShowDetails(false)
    }, 600);
  }
  const images = chat.messages.filter(mes => mes.hasOwnProperty('img')).map(mes => mes.img);
  const files = chat.messages.filter(mes => mes.hasOwnProperty('file')).map(mes => mes.file);

  // if(groupInfo) {
  //   return (
  //     <div>Meow</div>
  //   );
  // }

  return (
    <a.div className='detail' style={anims ? spring : {}}>
      {friend && <div className="user">
        <svg onClick={closeDetails} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="arrowBack">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
        <img src={isUserBlocked ? "./avatar.png" : friend?.avatar} alt="avatar" />
        <h2>{friend?.username}</h2>
        <p>Lorem ipsum suk iodj fovej kavler.</p>
      </div>}
      {groupInfo && <div className="user">
        <svg onClick={closeDetails} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="arrowBack">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
        <img src={groupInfo?.avatar || "./avatar.png"} alt="avatar" />
        <h2>{groupInfo?.groupName}</h2>
        <p>{groupInfo.members.length + ' members'}</p>
      </div>}
      {groupInfo && <GroupSettings />}
      <div className="info">
        <div className="option">
          <div className="title">
            <span>{language.settings.details[appState.appLanguage][0]}</span>
            <img onClick={() => setShow(state => ({ ...state, privacy: !state.privacy }))} src={show.privacy ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>{language.settings.details[appState.appLanguage][1]}</span>
            <img onClick={() => setShow(state => ({ ...state, settings: !state.settings }))} src={show.settings ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>{language.settings.details[appState.appLanguage][2]}</span>
            <img onClick={() => setShow(state => ({ ...state, shared: !state.shared }))} src={show.shared ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
          {(show.shared && images) && <div className="photos">
            {images?.map((el) => (
              <ImageDownload image={el} key={el} />
            )
            )}
          </div>}
        </div>
        <div className="option">
          <div className="title">
            <span>{language.settings.details[appState.appLanguage][3]}</span>
            <img onClick={() => setShow(state => ({ ...state, files: !state.files }))} src={show.files ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
          {show.files &&
            <div className='file-list'>
              {files.map((file) => (
                <a href={"#" + file.name} className='file-list-elem' key={file.name}>{file.name.length > 50 ? file.name.split('.')[0].slice(0, 15) + '.' + file.name.split('.')[1] : file.name}</a>
              ))}
            </div>}
        </div>
        {friend && <div className='btn-div'>
          <button onClick={handleBlock}>{
            isUserBlocked ? 'You are blocked' : isReceiverBlocked ? (appState.appLanguage == 'en' ? "User blocked" : 'Заблоковано') : (appState.appLanguage == 'en' ? "Block user" : 'Заблокувати')
          }</button>
          <button className='logout' onClick={() => auth.signOut()}>{appState.appLanguage == 'en' ? 'Logout' : 'Вийти'}</button>
        </div>}
        {groupInfo &&
          <div className='btn-div'>
            <button onClick={handleBlock}>{
              appState.appLanguage == 'en' ? "Leave group" : 'Вийти з группи'
            }</button>
            <button className='logout' onClick={() => auth.signOut()}>{appState.appLanguage == 'en' ? 'Logout' : 'Вийти'}</button>
          </div>}
      </div>
    </ a.div>
  )
}

export default Detail
