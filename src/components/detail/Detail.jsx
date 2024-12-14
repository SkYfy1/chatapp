import React, { useRef, useState } from 'react'
import './detail.css'
import { auth, db } from '../../lib/firebase'
import useChatStore from '../../context/useChatStore'
import { useAuthStore } from '../../context/useAuthStore'
import userService from '../../services/userService'
import ImageDownload from '../download/ImageDownload'
import useAppStore from '../../context/useAppStore'
import language from '../../utils/language'

const Detail = ({ setShowDetails, isMobile }) => {
  const friend = useChatStore(state => state.user);
  const lang = useAppStore();
  const { changeBlock, isReceiverBlocked, isUserBlocked, chat } = useChatStore();
  const [show, setShow] = useState({
    shared: false,
    settings: false,
    privacy: false,
    files: false
  })
  const currentUser = useAuthStore(state => state.currentUser);
  const ref = useRef();

  const handleBlock = async () => {
    if (!friend) return;

    // const userDoc = doc(db, 'users', currentUser.id);

    // await updateDoc(userDoc, {
    //   blocked: isReceiverBlocked ? arrayRemove(friend.id) : arrayUnion(friend.id)
    // })
    await userService.blockUser(isReceiverBlocked, currentUser.id, friend.id);

    changeBlock();
  };

  const images = chat.messages.filter(mes => mes.hasOwnProperty('img')).map(mes => mes.img);
  const files = chat.messages.filter(mes => mes.hasOwnProperty('file')).map(mes => mes.file);

  // const handleDownload = async (lin) => {
  //   try {
  //     const response = await fetch(lin);
  //     if (!response.ok) throw new Error("Ошибка загрузки файла");

  //     const blob = await response.blob();
  //     const url = URL.createObjectURL(blob);

  //     const link = ref.current;
  //     link.href = url;
  //     link.download = "11-2.jpg"; // Имя файла при скачивании
  //     link.click();

  //     URL.revokeObjectURL(url); // Освобождаем память
  //   } catch (error) {
  //     console.error("Ошибка при скачивании файла:", error);
  //   }
  // }

  return (
    <div className='detail'>
      <div className="user">
        {isMobile && <svg onClick={() => setShowDetails(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="arrowBack">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>}
        <img src={isUserBlocked ? "./avatar.png" : friend?.avatar} alt="avatar" />
        <h2>{friend?.username}</h2>
        <p>Lorem ipsum suk iodj fovej kavler.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>{language.settings.details[lang.language][0]}</span>
            <img onClick={() => setShow(state => ({ ...state, privacy: !state.privacy }))} src={show.privacy ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>{language.settings.details[lang.language][1]}</span>
            <img onClick={() => setShow(state => ({ ...state, settings: !state.settings }))} src={show.settings ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>{language.settings.details[lang.language][2]}</span>
            <img onClick={() => setShow(state => ({ ...state, shared: !state.shared }))} src={show.shared ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
          {show.shared && <div className="photos">
            {images.map((el) => (
              <ImageDownload image={el} key={el} />
            )
            )}
          </div>}
        </div>
        <div className="option">
          <div className="title">
            <span>{language.settings.details[lang.language][3]}</span>
            <img onClick={() => setShow(state => ({ ...state, files: !state.files }))} src={show.files ? "./arrowDown.png" : "./arrowUp.png"} alt="" />
          </div>
          {show.files &&
            <div className='file-list'>
              {files.map((file) => (
                <a href={"#" + file.name} className='file-list-elem' key={file.name}>{file.name.length > 50 ? file.name.split('.')[0].slice(0, 15) + '.' + file.name.split('.')[1] : file.name }</a>
              ))}
            </div>}
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
