import { doc, onSnapshot } from "firebase/firestore";
import { useAuthStore } from "../../../../context/useAuthStore";
import "../chatList.css";
import { db } from "../../../../lib/firebase";
import { useEffect } from "react";
import MiniAvatar from "../../../ui/MiniAvatar";
import useAppStore from "../../../../context/useAppStore";
import ControlledCheckbox from "../../../ui/Checkbox";
import useChatStore from "../../../../context/useChatStore";

const UserListElem = ({ chat, type }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { userChats: chats, updateChats } = useAuthStore();

  const creatingGroup = useAppStore((state) => state.creatingGroup);
  const groupMembers = useAppStore((state) => state.creatingGroup);

  const updateUserInfo = useChatStore((state) => state.updateUserInfo);
  const receiver = useChatStore((state) => state.user);

  // Fix nado dlya obnovlenii ne chata, a esli user izmenit imya obnovit chat spisok!!!!!

  // !!! mogut bit trabls

  // Update user info in chatList

  useEffect(() => {
    let unSubs;
    if (type != "group" && chat.user?.id) {
      // console.log(chat.hasOwnProperty('user'))
      // console.log(chat.user)
      unSubs = onSnapshot(doc(db, "users", chat.user.id), async (res) => {
        const user = res.data();

        const updatedChats = chats.map((el) =>
          el.user?.id === user?.id ? { ...el, user: user } : el
        );

        updateChats(updatedChats.sort((a, b) => b.updatedAt - a.updatedAt));

        // user.id === receiver.id checks if user which maps are the same as picked (chat with user) and update data in Chat component
        if (receiver?.id) {
          user.id === receiver.id && updateUserInfo(user);
        }

        // user.id !== chat.user.id && updateUserInfo(user);
      });
    }
    return () => type != "group" && unSubs?.();
  }, []);

  // Nujno 4toto sdelat so statusom gruppi

  if (type === "group") {
    return (
      <>
        {/* dsadasdas */}
        {/* {chat.groupAvatar && <MiniAvatar status={'online'} img={chat.groupAvatar !== '' ? chat.groupAvatar : './avatar.png'} />} */}
        <MiniAvatar
          status={"dnd"}
          img={chat.groupAvatar !== "" ? chat.groupAvatar : "./avatar.png"}
        />
        <div className="texts">
          <div>
            <span style={{ fontSize: "15px", marginRight: "5px" }}>Group</span>
            <span style={{ fontSize: "12px" }}>{chat.groupName}</span>
          </div>
          <p>{chat.lastMessage}</p>
        </div>
      </>
    );
  }

  return (
    <>
      {chat.user.status && (
        <MiniAvatar
          status={chat.user.status}
          img={
            chat.user.blocked.includes(currentUser.id)
              ? "./avatar.png"
              : chat.user.avatar || "./avatar.png"
          }
        />
      )}
      <div className="texts">
        <span>
          {chat.user.blocked.includes(currentUser.id)
            ? "User"
            : chat.user.username}
        </span>
        <p>{chat.lastMessage}</p>
      </div>
      {creatingGroup && <ControlledCheckbox user={chat.user.id} />}
    </>
  );
};

export default UserListElem;
