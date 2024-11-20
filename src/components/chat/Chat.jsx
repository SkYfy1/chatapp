import React, { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import useChatStore from '../../context/useChatStore';

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(null)
  const [text, setText] = useState('');
  const ref = useRef(null);
  const chatId = useChatStore(state => state.chatId);
  const receiver = useChatStore(state => state.user);

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

  // useEffect(() => {
  //   console.log("Chat id:", chatId)
  // })

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={receiver.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{receiver.username}</span>
            <p>Lorem Ipsum adalah text contoh digunakan didalam industri pencetakan dan typesetting.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages.length == 0 && <div className='noMessages'><div className='alert'>Write a message to start a chat!</div></div>}
        {chat?.messages?.map(message => (
          <div className="message own" key={message?.createAt}>
            <div className="texts">
              {message.image && <img src={message.image} alt="Message Image" />}
              <p>
                {message.text}
              </p>
              {/* <span>{message.createdAt}</span> */}
            </div>
          </div>
        ))}
        <div ref={ref}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./video.png" alt="" />
        </div>
        <input value={text} onChange={(e) => setText(prev => e.target.value)} type="text" placeholder='Type a message...' />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen(prev => !prev)} />
          <div className="picker">
            <EmojiPicker onEmojiClick={(e) => setText(prev => prev + e.emoji)} open={open} />
          </div>
        </div>
        <button className='sendButton'>
          Send
        </button>
      </div>
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
