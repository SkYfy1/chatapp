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
import useAppStore from "./context/useAppStore"
import { throttle } from "lodash"
import userService from "./services/userService"

const App = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { currentUser, isLoading, fetchUserInfo, updateUserInfo } = useAuthStore();
  const chatId = useChatStore(state => state.chatId);
  const [showList, setShowList] = useState(false);
  const checkScreen = useAppStore(state => state.checkScreen);

  const changeSettingsState = () => {
    setShowSettings(prev => !prev)
    setShowList(prev => !prev)
  };

  // create an event listener

  useEffect(() => {
    const handleResize = throttle(() => {
      checkScreen();
    }, 600);

    checkScreen();

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
  }, [currentUser?.id]);




  // Change online status

  useEffect(() => {
    currentUser?.id && userService.changeStatus(currentUser.id, 'online');

    return () => {
      userService.changeStatus(currentUser?.id, 'offline')
    }
  }, [currentUser?.id]);

  useEffect(() => {
    const listener = async (e) => {
      e.preventDefault()
      await userService.changeStatus(currentUser.id, 'offline');
      console.log('changing status')
    }

    // Event when page closing (making some time for beforeunload async firebase update)
    const listener2 = () => {
      function sleep(delay) {
        const start = new Date().getTime();
        while (new Date().getTime() < start + delay);
      }
      // unloading won't finish until 3 full seconds pass!
      sleep(3000);
    }
    window.addEventListener('unload', listener2);
    window.addEventListener('beforeunload', listener);

    return () => {window.removeEventListener('beforeunload', listener); window.removeEventListener('unload', listener2);}
  }, [currentUser]);



  if (isLoading) {
    return <div className="loading">Loading...</div>
  };

  return (
    <div className='container'>
      {currentUser ? (
        <>
          {!showList && <List toggle={setShowList} chatId={chatId} showDetails={showDetails} openSettings={changeSettingsState} />}
          {showSettings && <UserSettings close={changeSettingsState} />}
          {chatId && <Chat showDetails={showDetails} setShowDetails={setShowDetails}/>}
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