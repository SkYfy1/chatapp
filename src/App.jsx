import Chat from "./components/chat/Chat"
import List from "./components/list/List"
import Detail from './components/detail/Detail'
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { useEffect, useState } from "react"
import { auth } from './lib/firebase'
import { onAuthStateChanged } from "firebase/auth"
import { useAuthStore } from "./context/useAuthStore"
import useChatStore from "./context/useChatStore"

const App = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { currentUser, isLoading, fetchUserInfo } = useAuthStore();
  const chatId = useChatStore(state => state.chatId);
  const [isMobile, setIsMobile] = useState(false);
  const [toggle, setToggle] = useState(false);

  // create an event listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);


    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // console.log(chatId)

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    }
  }, [fetchUserInfo])

  // console.log(currentUser)

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className='container'>
      {currentUser ? (
        <>
          {!toggle && <List isMobile={isMobile} toggle={setToggle} chatId={chatId}/>}
          {chatId && <Chat show={showSettings} isMobile={isMobile} showChats={setToggle} toggle={setShowSettings} />}
          {showSettings && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  )
}

export default App