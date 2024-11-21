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
          <List />
          {chatId && <Chat show={showSettings} toggle={setShowSettings}/>}
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