import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import useChatStore from '../../context/useChatStore';
import { useAuthStore } from '../../context/useAuthStore';
import { fileService } from '../../services/fileService';
import ModalWindow from '../ui/ModalWindow';
import { useInView } from 'react-intersection-observer';
import FileDownload from '../download/FileDownload';
import useAppStore from '../../context/useAppStore';
import Trail from '../animation/Trail'
import { chatService } from '../../services/chatsService';
import Spring from '../animation/Spring';
import Audio from './Audio/Audio';
import Icons from '../ui/Icons';

const Chat = React.memo(({ showDetails, setShowDetails }) => {
  const [open, setOpen] = useState(false);
  const refic = useRef(null);
  const [text, setText] = useState('');
  const [image, setImage] = useState({
    file: null,
    url: null
  });
  const [showBig, setShowBig] = useState({
    img: null,
    state: false
  });
  const [file, setFile] = useState(null);
  const [audioMessage, setAudioMessage] = useState({
    url: null,
    file: null,
  });
  const [isRecording, setRecording] = useState(false);
  const isMobile = useAppStore(state => state.isMobile);
  const audioMessageChunks = useRef([]);

  const ref = useRef(null);
  const reference = useRef();

  // const { mediaRecorder, addMe } = useChatStore();
  const chatId = useChatStore(state => state.chatId);
  const receiver = useChatStore(state => state.user);
  const currentUser = useAuthStore(state => state.currentUser);
  const { isReceiverBlocked, isUserBlocked, updateChat, chat } = useChatStore();


  const { ref: r, inView } = useInView({
    threshold: 0.5
  });

  useEffect(() => {
    console.log('Rerender chat')
  })

  const handleAddImage = (e) => {
    if (e.target.files[0]) {
      setImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const handleAddFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  // Delete message
  const changeMessageState = async (text) => {
    await chatService.changeMessageState(chatId, text)
  };

  // Like
  const messageAction = async (text) => {
    await chatService.messageAction(chatId, text);
    console.log('Message liked/disliked!')
  }

  useEffect(() => {
    setTimeout(ref.current.scrollIntoView({
      behavior: 'smooth'
    }), 500)

    console.log(ref.current)
  }, [])

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chat', chatId), (res) => {
      updateChat(res.data())
      console.log('new message')
    })

    return () => unSub()
  }, [chatId]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSend = async () => {
    if (text == '' && !audioMessage.file) return;

    let imgUrl = null;
    let fileUrl = null;
    let audioUrl = null;

    try {
      if (image.file) {
        imgUrl = await fileService.uploadFileAndGetLink(image.file, 'images');
      }

      if (file) {
        fileUrl = await fileService.uploadFileAndGetLink(file, 'files');
        console.log(fileUrl)
      }

      if (audioMessage.file) {
        audioUrl = await fileService.uploadAudio(audioMessage.file);

        await updateDoc(doc(db, 'chat', chatId), {
          messages: arrayUnion({
            senderId: currentUser.id,
            createdAt: new Date,
            audioMessage: audioUrl,
          })
        })

        const userIDs = [currentUser.id, receiver.id];

        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'userchats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();

            const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

            userChatsData.chats[chatIndex].lastMessage = 'Audio Message';
            userChatsData.chats[chatIndex].isSeen = (id === currentUser.id) ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats
            })

          }
        });

        setText('');
        setImage({
          file: null,
          url: null,
        });
        setAudioMessage({
          url: null,
          file: null,
        });
        setFile(null)

        return;
      }

      await updateDoc(doc(db, 'chat', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date,
          ...(imgUrl && { img: imgUrl }),
          ...(fileUrl && { file: fileUrl }),
        })
      });

      const userIDs = [currentUser.id, receiver.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, 'userchats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = (id === currentUser.id) ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats
          })

        }
      });
      setText('');
      setImage({
        file: null,
        url: null,
      });
      setAudioMessage({
        url: null,
        file: null,
      });
      setFile(null)
    } catch (error) {
      console.log(error)
    }
  }

  // Capture audio message

  const recordAudioMessage = async () => {
    let permission;
    try {
      permission = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(permission);
      refic.current = mediaRecorder;
      console.log(refic.current)
      console.log(mediaRecorder)

      refic.current.start();
      setRecording(true);
      console.log(refic.current.state);
      console.log('recording started')

      refic.current.ondataavailable = (e) => {
        audioMessageChunks.current.push(e.data);
        console.log(e.data)
      }

      refic.current.onstop = async (e) => {
        console.log(audioMessageChunks.current)
        const blob = new Blob(audioMessageChunks.current, { type: 'audio/ogg; codecs=opus' });
        // await fileService.uploadAudio(blob)

        // console.log(await blob.arrayBuffer())

        // const audioContext = new AudioContext();
        // const f = audioContext.createMediaStreamSource(mediaRecorder)

        // console.log(f)


        // blob to array buffer 

        // const reader = new FileReader();
        // reader.onload = () => {
        //   const arrayBuffer = reader.result; // ArrayBuffer
        //   console.log(arrayBuffer);
        // };
        // reader.readAsArrayBuffer(blob);

        audioMessageChunks.current = [];
        const audioUrl = URL.createObjectURL(blob);

        setRecording(false);
        setAudioMessage(
          {
            url: audioUrl,
            file: blob
          }
        );
        permission.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      console.log(error.message)
      permission.getTracks().forEach((track) => track.stop());
    }
  };

  const icons = useMemo(() => (
    <>
      <img key={'./img.png'} src="./img.png" alt="" onChange={handleAddImage} data-handler='onChange' />
      <img key={"./camera.png"} src="./camera.png" alt="" onChange={handleAddImage} data-handler='onChange' />
      <img key={"./video.png"} src="./video.png" alt="" onChange={handleAddImage} data-handler='onChange' />
    </>
  ), [])

  if (!chatId) {
    return <div className="chat"></div>
  }


  return (
    <div className={showDetails ? 'chat mobile' : 'chat'}>
      <div className="top">
        <div className="user" onClick={() => setShowDetails(!showDetails)} style={{
          marginLeft: isMobile && 60
        }}>
          <img src={receiver?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{receiver?.username}</span>
            <p>{receiver?.about}</p>
          </div>
        </div>
        {!isMobile && <div className="icons">
          <img src="./phone.png" alt="call" />
          <img src="./video.png" alt="video" />
          <img src="./info.png" alt="settings" onClick={() => setShowDetails(!showDetails)} />
        </div>}
      </div>
      <div ref={reference} className="center">
        <div className='inview' ref={r}></div>
        {(inView && reference.current.scrollHeight > 900 && chat?.message?.length > 10) && <svg onClick={() => ref.current.scrollIntoView({
          behavior: 'smooth'
        })} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={showDetails ? "arrowWithDetails" : "arrow"}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>}
        {chat?.messages.length == 0 && <div className='noMessages'><div className='alert'>Write a message to start a chat!</div></div>}
        {/* Message */}
        {chat?.messages?.map(message => {
          const milliseconds = message?.createdAt.seconds * 1000 + Math.floor(message?.createdAt.nanoseconds / 1e6);
          const date = new Date(milliseconds);
          return (
            <div className={message.senderId === currentUser.id ? "outer own" : 'outer'}>
              {(message?.like && message.senderId === currentUser.id) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="heart">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>}
              <div className={message.senderId === currentUser.id ? "message own" : 'message'} key={message.createdAt} onClick={async (e) => {
                e.stopPropagation();
                await messageAction(message.createdAt.seconds + message.createdAt.nanoseconds);
              }}>
                <div className="texts">
                  {/* Image */}
                  {message.img &&
                    <Spring onClick={() => setShowBig({
                      img: message.img,
                      state: true
                    })}>
                      {/* Fixxxxx */}
                      {/* <img src={message.img} alt="Message Image" onClick={() => setShowBig({
                      img: message.img,
                      state: true
                    })} /> */}
                      <img src={message.img} alt="Message Image" />
                    </Spring>
                  }
                  {/* Text */}
                  {message.text && <p className='p'>
                    {message.deleted ? <Trail>Message-deleted</Trail> : message.text}
                    {!message.deleted && <svg onClick={async (e) => {
                      e.stopPropagation(); await changeMessageState(message.text)
                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>}
                    {message.deleted && <svg onClick={async (e) => {
                      e.stopPropagation(); await changeMessageState(message.text)
                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                    </svg>
                    }
                  </p>}
                  {/* File */}
                  {message.file &&
                    <div id={message.file.name} className={message.senderId === currentUser.id ? 'message-file own' : 'message-file'}>
                      <FileDownload file={message.file} />
                      <span>{message.file.name}</span>
                    </div>}
                  {message.audioMessage && <div className={message.senderId === currentUser.id ? 'audio own' : 'audio'}>
                    <Audio audioMessage={message.audioMessage} />
                  </div>}
                  <span>{date.toLocaleString()}</span>
                </div>
              </div>
              {(message?.like && !message.senderId === currentUser.id) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="heart">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>}
            </div>
          )
        })}
        <div ref={ref}></div>
        {audioMessage.url && <div className='audioMessage'>
          {/* <audio ref={controls} src={audioMessage}></audio>
          <button onClick={() => controls.current.play()}>Start</button> */}
          <Audio audioMessage={audioMessage.url} />
        </div>}
      </div>
      <div className="bottom">
        {
          !isMobile ?
            <Icons>
              {icons}
            </Icons> : <Icons>
              <svg onChange={handleAddImage} data-handler='onChange' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
              </svg>
            </Icons>
        }
        {image.file &&
          <div className='image-preview'>
            <svg onClick={() => setImage({
              file: null,
              url: null,
            })} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="close-btn">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <p>Image:</p>
            <img src={image.url} className='img' alt='image-preview' />
          </div>}
        <input disabled={isUserBlocked || isReceiverBlocked} value={text} onChange={(e) => setText(prev => e.target.value)} type="text" placeholder={isUserBlocked || isReceiverBlocked ? 'You can not send a massage' : 'Type a message...'} />
        <label htmlFor="file" className='label-file'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="file">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
          <input disabled={isUserBlocked || isReceiverBlocked} type="file" id='file' onChange={handleAddFile} />
        </ label>
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen(prev => !prev)} />
          <div className="picker">
            <EmojiPicker onEmojiClick={(e) => setText(prev => prev + e.emoji)} open={open} theme='dark' width={isMobile ? 320 : 400} />
          </div>
        </div>
        <div className='audio' onClick={!isRecording ? recordAudioMessage : () => refic.current.stop()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={isRecording ? 'rec' : 'not-rec'}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>
        </div>
        <button disabled={isUserBlocked || isReceiverBlocked} className='sendButton' onClick={handleSend}>
          Send
        </button>
      </div>
      {showBig.state && <ModalWindow onclick={() => setShowBig(prev => ({
        img: null,
        state: false
      }))}>
        <img style={{
          height: '80%', width: '80%'
        }} src={showBig.img} alt="" onClick={(e) => e.stopPropagation()} />
      </ModalWindow>}
    </div>
  )
})

export default Chat