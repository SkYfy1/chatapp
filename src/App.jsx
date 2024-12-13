import Chat from "./components/chat/Chat"
import List from "./components/list/List"
import Detail from './components/detail/Detail'
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { useEffect, useState } from "react"
import { auth, db } from './lib/firebase'
import { onAuthStateChanged } from "firebase/auth"
import { useAuthStore } from "./context/useAuthStore"
import useChatStore from "./context/useChatStore"
import UserSettings from "./components/settings/UserSettings"
import { doc, onSnapshot } from "firebase/firestore"

const App = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { currentUser, isLoading, fetchUserInfo, updateUserInfo } = useAuthStore();
  const chatId = useChatStore(state => state.chatId);
  const [isMobile, setIsMobile] = useState(false);
  const [toggle, setToggle] = useState(false);

  const changeSettingsState = () => {
    setShowSettings(prev => !prev)
    setToggle(prev => !prev)
  };

  // create an event listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setIsMobile(true);
        console.log('mobile')
      } else {
        setIsMobile(false);
        console.log('pc')
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);


    return () => window.removeEventListener('resize', handleResize)
  }, []);


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

  return (
    <div className='container'>
      {currentUser ? (
        <>
          {!toggle && <List isMobile={isMobile} toggle={setToggle} chatId={chatId} showDetails={showDetails} openSettings={changeSettingsState} />}
          {showSettings && <UserSettings close={changeSettingsState} />}
          {chatId && <Chat showDetails={showDetails} isMobile={isMobile} showChats={setToggle} setShowDetails={setShowDetails} />}
          {showDetails && <Detail setShowDetails={setShowDetails} isMobile={isMobile} />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  )
}

export default App