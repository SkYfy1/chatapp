import React, { useEffect, useState, useRef } from 'react'
import "./chatList.css"
import AddUser from './addUser/addUser'
import { useAuthStore } from '../../../context/useAuthStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import useChatStore from '../../../context/useChatStore';
import Tooltip from '../../ui/Tooltip';
import language from '../../../utils/language.js'
import useAppStore from '../../../context/useAppStore'
import { useTrail, animated } from '@react-spring/web';
import MiniAvatar from '../../ui/MiniAvatar.jsx';
import UserListElem from './userListElem/userListElem.jsx';
import Button from '../../ui/Button.jsx';
import { chatService } from '../../../services/chatsService.js';
import { toast } from 'react-toastify';


const ChatList = ({ toggle }) => {
  const [addMode, setAddMode] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [filter, setFilter] = useState('');
  const [pointer, setPointer] = useState({ pointerX: null, pointerY: null });
  const changeGroup = useAppStore((state) => state.changeGroup);
  const closeButton = useAppStore((state) => state.changeShowButton);
  const appState = useAppStore();
  const listRef = useRef(null);


  const currentUser = useAuthStore((state) => state.currentUser);
  const updateGroupInfo = useChatStore((state) => state.updateGroupInfo);
  const { userChats: chats, updateChats } = useAuthStore();
  const changeChat = useChatStore(state => state.changeChat);
  // const { changeChat } = useChatStore();
  const chatId = useChatStore(state => state.chatId);
  const [trails, api] = useTrail(chats.length, () => ({
    from: {
      opacity: 0,
      x: -100,
    },
    to: {
      opacity: 1,
      x: 0
    }
  }));

  // useEffect(() => {
  //   // console.log(chats.user?.username.toLowerCase().startsWith(filter.toLowerCase()) || chats.groupName.toLowerCase().startsWith(filter.toLowerCase()))
  // })

  const anims = currentUser?.hasOwnProperty('settings') ? currentUser?.settings?.animations : true;
  const showBtn = () => appState.changeShowButton();

  useEffect(() => {
    if (!appState.creatingGroup) {
      listRef.current.addEventListener('mouseenter', showBtn);
      listRef.current.addEventListener('mouseleave', showBtn);
    }

    return () => {
      listRef.current?.removeEventListener('mouseenter', showBtn);
      listRef.current?.removeEventListener('mouseleave', showBtn);
    }
  }, [appState.creatingGroup])

  // Updating chats, gettign receivers data (doc)

  useEffect(() => {
    // If doc in collection changes update chat list
    const unSubs = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
      const userChats = res.data().chats;
      console.log(userChats);
      console.log('sub');

      const promises = userChats.map(async (chat) => {
        if (chat.hasOwnProperty('groupMembers')) {
          const members = await Promise.all(chat.groupMembers.map(async (user) => {
            const userDocRef = doc(db, 'users', user);

            const userDocSnap = await getDoc(userDocRef);

            return userDocSnap.data();
          }));

          // If group data changes -> doc in coll updates -> update groupInfo state

          updateGroupInfo({ avatar: chat.groupAvatar, groupName: chat.groupName, members: members })

          // Members - docs in db w/ information of group users (eto documenti s bd s infoi pro userov v gruppe)

          return { ...chat, members };
        }

        const userDocRef = doc(db, 'users', chat.receiverId);

        const userDocSnap = await getDoc(userDocRef);

        const user = userDocSnap.data();

        return { ...chat, user }
      })

      const chatData = await Promise.all(promises);

      updateChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    })
    return () => unSubs()
  }, [currentUser.id]);

  // Select chat

  async function handleSelect(chat) {
    const userChats = chats.map(item => {
      if (item?.user) {
        // console.log(item)
        const { user, ...rest } = item;
        return rest;
      }

      // Tyt oni uberautsa iz chata pered obnovleniem doc chata (isSeen), chtobi ne pushnut ih na bd!
      // console.log(item)
      const { members, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

    userChats[chatIndex].isSeen = true;

    await updateDoc(doc(db, 'userchats', currentUser.id), {
      chats: userChats
    })

    chat.hasOwnProperty('user') && await changeChat(chat.chatId, chat.user);

    // Fix kostil

    chat.hasOwnProperty('groupName') && await changeChat(chat.chatId, null, { avatar: chat.groupAvatar, groupName: chat.groupName, members: chat.members });

    { appState.isMobile && toggle(); }
  }

  const createGroup = async () => {
    if (appState.groupMembers?.length >= 1) {
      await chatService.createGroupChat([...appState.groupMembers, currentUser.id], groupName);
      appState.changeGroup();
      setGroupName('');
    } else {
      toast.error('You cannot create empty group!')
    }
  };

  const handleAdd = async (fId) => {
    // Get userchat doc to find out, is the user already friend
    const userChats = doc(db, 'userchats', currentUser.id)

    const data = await getDoc(userChats)

    // console.log(data.data().chats.find(el => el.receiverId === fId));

    // Check if user already friend

    if (data.data().chats.find(el => el.receiverId === fId)) {
      toast.error('The user is already your friend')
    } else {
      await chatService.createChat(fId, currentUser.id);
      setTimeout(() => changeShow(), 1000)
    }

    setAddMode(false);
  }

  const clickButton = () => {
    changeGroup();
    closeButton();
  }

  return (
    <div className='chatList' ref={listRef}>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder='Search' value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
        <img onClick={() => setAddMode(prev => !prev)} src={addMode ? './minus.png' : "./plus.png"} alt="" className='add' />
      </div>
      {trails.map(({ ...style }, index) =>
      (
        <animated.div style={anims ? style : {}} key={index}>
          {chats?.filter((el) => el.user?.username.toLowerCase().startsWith(filter.toLowerCase()) || el.groupName.toLowerCase().startsWith(filter.toLowerCase())).map((chat) => (
            !appState.isMobile ? <Tooltip key={chat.chatId} style={pointer} text={`${language.settings.tooltip[appState.appLanguage]}${chat?.user?.username || chat?.groupName}`}>
              <div
                className="item"
                onClick={() => handleSelect(chat)}
                onMouseMove={(e) => setPointer({ pointerX: e.clientX, pointerY: e.clientY })}
                style={{
                  backgroundColor: !chat?.isSeen ? '#5183fe' : chatId === chat.chatId ? 'rgba(17, 25, 40, 0.5)' : 'transparent'
                }}
              >
                <UserListElem chat={chat} type={chat.hasOwnProperty('groupName') ? 'group' : 'chat'} />
              </div>
            </Tooltip> :
              <div
                key={chat.chatId}
                className="item"
                onClick={() => handleSelect(chat)}
                style={{
                  backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe'
                }}
              >
                <UserListElem chat={chat} type={chat.hasOwnProperty('groupName') ? 'group' : 'chat'} />
              </div>
          ))[index]}
        </animated.div>
      )
      )}
      {addMode && <AddUser handler={handleAdd} />}
      {appState.showButton &&
        <Button handler={clickButton}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
        </Button>}
      {appState.creatingGroup &&
        <div className='group'>
          <div className='groupName'>
            <h1>Enter Group Name</h1>
            <div className='groupInput'>
              <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            </div>
          </div>
          <button onClick={createGroup} className='groupBtn'>Create Group</button>
        </div>}
    </div>
  )
}

export default ChatList
