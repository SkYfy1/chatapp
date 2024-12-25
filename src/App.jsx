import Chat from "./components/chat/Chat"
import List from "./components/list/List"
import Detail from './components/detail/Detail'
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { useCallback, useEffect, useMemo, useState } from "react"
import { auth, db } from './lib/firebase'
import { onAuthStateChanged } from "firebase/auth"
import { useAuthStore } from "./context/useAuthStore"
import useChatStore from "./context/useChatStore"
import UserSettings from "./components/settings/UserSettings"
import { doc, onSnapshot } from "firebase/firestore"
import useAppStore from "./context/useAppStore"
import { throttle } from "lodash"

const App = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { currentUser, isLoading, fetchUserInfo, updateUserInfo } = useAuthStore();
  const chatId = useChatStore(state => state.chatId);
  const [toggle, setToggle] = useState(false);
  const checkScreen  = useAppStore(state => state.checkScreen);

  const changeSettingsState = () => {
    setShowSettings(prev => !prev)
    setToggle(prev => !prev)
  };

  // create an event listener

  useEffect(() => {
    const handleResize = throttle(() => {
      checkScreen();
    }, 600);


    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener('resize', handleResize)
  }, []);

  useEffect(() => {
    console.log('Rerender app')
  })


  // Set user data in state after checking authstate

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    }
  }, [fetchUserInfo]);



  // Get user information after updating

  useEffect(() => {
    const onSub = currentUser?.id && onSnapshot(doc(db, 'users', currentUser.id), (user) => {
      console.log('Updating state' + JSON.stringify(user.data()));
      updateUserInfo(user.data());
    });

    return () => {
      currentUser?.id && onSub();
    }
  }, [fetchUserInfo]);


  if (isLoading) {
    return <div className="loading">Loading...</div>
  };
  // const ChatComp = useMemo(() => {
  //   return <Chat showDetails={showDetails} showChats={setToggle} setShowDetails={changeDetail} />
  // }, [showDetails, setToggle, changeDetail])

  return (
    <div className='container'>
      {currentUser ? (
        <>
          {!toggle && <List toggle={setToggle} chatId={chatId} showDetails={showDetails} openSettings={changeSettingsState} />}
          {showSettings && <UserSettings close={changeSettingsState} />}
          {chatId && <Chat showDetails={showDetails} setShowDetails={setShowDetails} />}
          {showDetails && <Detail setShowDetails={setShowDetails} />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  )
}

export default App