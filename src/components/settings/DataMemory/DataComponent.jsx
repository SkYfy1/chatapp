import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../../context/useAuthStore';
import { fileService } from '../../../services/fileService';
import '../userSettings.css';

const DataComponent = ({ headBack }) => {
    const userChats = useAuthStore(state => state.userChats);
    const [imgs, setImgs] = useState(undefined);

    console.log(userChats)

    if (userChats.length == 0) {
        return (
            <div className='data'>
                <div className='top'>
                    <svg onClick={headBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                    <h1>No shared Files</h1>
                </div>
            </div>
        )
    }

    const chatIds = userChats?.map((chat) => chat.chatId);
    useEffect(() => {
        const getFiles = async () => {
            const messages = await fileService.getAllSharedFiles(chatIds);

            const img = messages.map(mes => mes.img);

            setImgs(img)
        }
        userChats.length != 0 && getFiles();
    }, [chatIds])
    return (
        <div className='data'>
            {/* {imgs?.map(el => (
                <div>{el.senderId}</div>
            ))} */}
            <div className='top'>
                <svg onClick={headBack} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
                <h1>Shared Files</h1>
            </div>
            <div className='imgs'>
                {imgs?.map(el => (
                    <img className='image' src={el} alt="" />
                ))}
            </div>
        </div>
    )
}

export default DataComponent
