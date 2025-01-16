import React from 'react'
import Spring from '../../animation/Spring';
import { useAuthStore } from '../../../context/useAuthStore';
import Audio from '../Audio/Audio';
import { chatService } from '../../../services/chatsService';
import FileDownload from '../../download/FileDownload';
import Trail from '../../animation/Trail';
import useChatStore from '../../../context/useChatStore';

const Message = ({ message, setShowBig }) => {
    const currentUser = useAuthStore((state) => state.currentUser);
    const chatId = useChatStore(state => state.chatId);
    const groupInfo = useChatStore(state => state.groupInfo);

    const milliseconds = message?.createdAt.seconds * 1000 + Math.floor(message?.createdAt.nanoseconds / 1e6);
    const date = new Date(milliseconds);

    // Delete message
    const changeMessageState = async (text) => {
        await chatService.changeMessageState(chatId, text)
    };

    // Like
    const messageAction = async (text) => {
        await chatService.messageAction(chatId, text);
        console.log('Message liked/disliked!')
    }

    const handleClickImage = (e) => {
        e.stopPropagation();
        setShowBig({
            img: message.img,
            state: true
        });
    }

    const senderImg = groupInfo && groupInfo.members.find((mem) => mem.id === message.senderId).avatar;

    return (
        <div className={message.senderId === currentUser.id ? "outer own" : 'outer'}>
            {(message?.like && message.senderId === currentUser.id) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="heart">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>}
            {(groupInfo && message.senderId === currentUser.id) && <img src={senderImg} className='senderAvatar' alt='sender-avatar'/>  }
            <div className={message.senderId === currentUser.id ? "message own" : 'message'} key={message.createdAt} onClick={async (e) => {
                e.stopPropagation();
                await messageAction(message.createdAt.seconds + message.createdAt.nanoseconds);
            }}>
                <div className="texts">
                    {/* Image */}
                    {message.img &&
                        <Spring onClick={handleClickImage}>
                            <img src={message.img} alt="Message Image" />
                        </Spring>}
                    {/* Text */}
                    {message.text &&
                        <p className='p'>
                            {message.deleted ? <div>Message-deleted</div> : message.text}
                            {!message.deleted && <svg onClick={async (e) => {
                                e.stopPropagation(); await changeMessageState(message.text)
                            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>}
                            {message.deleted && <svg onClick={async (e) => {
                                e.stopPropagation(); await changeMessageState(message.text)
                            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                            </svg>
                            }
                        </p>}
                    {/* File */}
                    {message.file &&
                        <div id={message.file.name} className={message.senderId === currentUser.id ? 'message-file own' : 'message-file'}>
                            <FileDownload file={message.file} />
                            <span>{message.file.name}</span>
                        </div>}
                    {message.audioMessage && <div className={message.senderId === currentUser.id ? 'audio own' : 'audio'}>
                        <Audio audioMessage={message.audioMessage} />
                    </div>}
                    <span>{date.toLocaleString()}</span>
                </div>
            </div>
            {(groupInfo && message.senderId !== currentUser.id) && <img src={senderImg} className='senderAvatar' alt='sender-avatar' />}
            {(message?.like && message.senderId !== currentUser.id) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="heart">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>}
        </div>
    )
}

export default Message
