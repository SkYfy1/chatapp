import React, { useEffect, useMemo, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import useChatStore from '../../context/useChatStore';
import { useAuthStore } from '../../context/useAuthStore';
import { fileService } from '../../services/fileService';
import ModalWindow from '../ui/ModalWindow';
import { useInView } from 'react-intersection-observer';
import useAppStore from '../../context/useAppStore';
import { chatService } from '../../services/chatsService';
import Audio from './Audio/Audio';
import Icons from '../ui/Icons';
import Message from './Message/Message';

const Chat = React.memo(({ showDetails, setShowDetails, groupDetails, setGroupDetails }) => {
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

  const chatId = useChatStore(state => state.chatId);
  const groupInfo = useChatStore(state => state.groupInfo) // !!!!!!!!!!
  const receiver = useChatStore(state => state.user);
  const currentUser = useAuthStore(state => state.currentUser);
  const { isReceiverBlocked, isUserBlocked, updateChat, chat } = useChatStore();


  const { ref: r, inView } = useInView({
    threshold: 0.5
  });

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

  useEffect(() => {
    setTimeout(ref.current.scrollIntoView({
      behavior: 'smooth'
    }), 500)

    console.log(ref.current)
  }, [])

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chat', chatId), (res) => {
      updateChat(res.data())
      // console.log('new message')
    })

    return () => unSub()
  }, [chatId]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const showChatDetails = () => setShowDetails(!showDetails);

  const showGroupDetails = () => setGroupDetails(!groupDetails);

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

        let userIDs = [currentUser.id, receiver?.id];

        if (groupInfo) {
          userIDs = groupInfo.members.map(memb => memb.id)
        }

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

      let userIDs = [currentUser.id, receiver?.id];

      if (groupInfo) {
        userIDs = groupInfo.members.map(memb => memb.id)
      }

      // console.log('userIds')
      // console.log(userIDs)

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
    [<img key={'./img.png'} src="./img.png" alt="" onChange={handleAddImage} data-handler='onChange' />,
    <img key={"./camera.png"} src="./camera.png" alt="" onChange={handleAddImage} data-handler='onChange' />,
    <img key={"./video.png"} src="./video.png" alt="" onChange={handleAddImage} data-handler='onChange' />]
  ), []);

  const icon = useMemo(() => (
    <svg onChange={handleAddImage} data-handler='onChange' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  ), []);

  if (!chatId) {
    return <div className="chat"></div>
  }


  return (
    <div className={showDetails ? 'chat mobile' : 'chat'}>
      <div className="top">
        <div className="user" onClick={showChatDetails} style={{
          marginLeft: isMobile && 60
        }}>
          <img src={receiver?.avatar || groupInfo?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{groupInfo?.groupName || receiver.username}</span>
            {receiver?.about && <p>{receiver?.about}</p>}
            {groupInfo?.members && <p>{groupInfo?.members.length + ' members'}</p>}
          </div>
        </div>
        {!isMobile && <div className="icons">
          <img src="./phone.png" alt="call" />
          <img src="./video.png" alt="video" />
          {/* Detail button */}
          <img src="./info.png" alt="settings" onClick={showChatDetails} />
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
          return (<Message message={message} setShowBig={(value) => setShowBig(value)} />)
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
              {icon}
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