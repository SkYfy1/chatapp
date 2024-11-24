import React, { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import useChatStore from '../../context/useChatStore';
import { useAuthStore } from '../../context/useAuthStore';
import { imageService } from '../../services/imageService';
import ModalWindow from '../ui/ModalWindow';

const Chat = ({ show, toggle }) => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(null)
  const [text, setText] = useState('');
  const [image, setImage] = useState({
    file: null,
    url: null
  });
  const [showBig, setShowBig] = useState({
    img: null,
    state: false
  });

  const { isReceiverBlocked, isUserBlocked } = useChatStore();

  const handleAddImage = (e) => {
    if (e.target.files[0]) {
      setImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  };


  const ref = useRef(null);


  const chatId = useChatStore(state => state.chatId);
  const receiver = useChatStore(state => state.user);
  const currentUser = useAuthStore(state => state.currentUser);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  useEffect(() => {
    ref.current.scrollIntoView({
      behavior: 'smooth'
    })
  }, [])

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chat', chatId), (res) => {
      // console.log('Response', res.data())
      setChat(res.data())
    })

    return () => unSub()
  }, [chatId])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSend = async () => {
    if (text == '') return;

    let imgUrl = null;

    try {
      if (image.file) {
        imgUrl = await imageService.uploadImageAndGetLink(image, 'images');
        console.log(imgUrl)
      }

      await updateDoc(doc(db, 'chat', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date,
          ...(imgUrl && { img: imgUrl }),
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
      })
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   console.log(new Date(chat?.messages[0].createdAt.seconds))
  // })

  const showModal = (imgUrl) => {

  }

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={receiver?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{receiver?.username}</span>
            <p>Lorem Ipsum adalah text contoh digunakan didalam industri pencetakan dan typesetting.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="call" />
          <img src="./video.png" alt="video" />
          <img src="./info.png" alt="settings" onClick={() => toggle(!show)} />
        </div>
      </div>
      <div className="center">
        {chat?.messages.length == 0 && <div className='noMessages'><div className='alert'>Write a message to start a chat!</div></div>}
        {chat?.messages?.map(message => {
          const milliseconds = message?.createdAt.seconds * 1000 + Math.floor(message?.createdAt.nanoseconds / 1e6);
          const date = new Date(milliseconds);
          return (
            <div className={message.senderId === currentUser.id ? "message own" : 'message'} key={message.createdAt}>
              <div className="texts">
                {message.img && <img src={message.img} alt="Message Image" onClick={() => setShowBig({
                  img: message.img,
                  state: true
                })} />}
                <p>
                  {message.text}
                </p>
                <span>{date.toLocaleString()}</span>
              </div>
            </div>
          )
        })}
        <div ref={ref}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="img">
            <img src="./img.png" alt="" />
            <input type="file" id='img' style={{ display: 'none' }} onChange={handleAddImage} />
          </label>
          <img src="./camera.png" alt="" />
          <img src="./video.png" alt="" />
        </div>
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
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen(prev => !prev)} />
          <div className="picker">
            <EmojiPicker onEmojiClick={(e) => setText(prev => prev + e.emoji)} open={open} />
          </div>
        </div>
        <button disabled={isUserBlocked || isReceiverBlocked} className='sendButton' onClick={handleSend}>
          Send
        </button>
      </div>
      {showBig.state && <ModalWindow onclick={() => setShowBig(prev => ({
        img: null,
        state: false
      }))}>
        <img src={showBig.img} alt="" onClick={(e) => e.stopPropagation()} />
      </ModalWindow>}
    </div>
  )
}

export default Chat


// <div className="message">
//           <img src="./avatar.png" alt="" />
//           <div className="texts">
//             <p>
//               Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien. Lorem Ipsum har vært bransjens standard for dummytekst helt siden 1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å lage et prøveeksemplar av en bok.
//             </p>
//             <span>1 min ago</span>
//           </div>
//         </div>
//         <div className="message own">
//           <div className="texts">
//             <img src="https://png.pngtree.com/background/20230513/original/pngtree-the-forest-in-japan-has-red-foliage-with-stones-and-leaves-picture-image_2507712.jpg" alt="" />
//             <p>
//               Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien. Lorem Ipsum har vært bransjens standard for dummytekst helt siden 1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å lage et prøveeksemplar av en bok.
//             </p>
//             <span>1 min ago</span>
//           </div>
//         </div>
//         <div className="message">
//           <img src="./avatar.png" alt="" />
//           <div className="texts">
//             <p>
//               Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien. Lorem Ipsum har vært bransjens standard for dummytekst helt siden 1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å lage et prøveeksemplar av en bok.
//             </p>
//             <span>1 min ago</span>
//           </div>
//         </div>
//         <div className="message own">
//           <div className="texts">
//             <p>
//               Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien. Lorem Ipsum har vært bransjens standard for dummytekst helt siden 1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å lage et prøveeksemplar av en bok.
//             </p>
//             <span>1 min ago</span>
//           </div>
//         </div>
//         <div className="message own">
//           <div className="texts">
//             <p>
//               Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien. Lorem Ipsum har vært bransjens standard for dummytekst helt siden 1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å lage et prøveeksemplar av en bok.
//             </p>
//             <span>1 min ago</span>
//           </div>
//         </div>
//         <div className="message">
//           <img src="./avatar.png" alt="" />
//           <div className="texts">
//             <p>
//               Lorem Ipsum er rett og slett dummytekst fra og for trykkeindustrien. Lorem Ipsum har vært bransjens standard for dummytekst helt siden 1500-tallet, da en ukjent boktrykker stokket en mengde bokstaver for å lage et prøveeksemplar av en bok.
//             </p>
//             <span>1 min ago</span>
//           </div>
//         </div>
