import React from 'react'
import { useTrail, a } from '@react-spring/web';
import { useAuthStore } from '../../context/useAuthStore';

const List = ({ list }) => {
    const currentUser = useAuthStore((state) => state.currentUser);
    const anims = currentUser?.hasOwnProperty('settings') ? currentUser?.settings?.animations : true;

    const [trails, api] = useTrail(list.length, () => ({
        from: {
            y: -30,
            opacity: 0
        },
        to: {
            y: 0,
            opacity: 1,
        }
    }));

    return (
        <div className='members'>
            {
                trails.map(({ ...style }, index) => (
                    <a.div style={anims ? style : {}} key={index}>
                        {list.map((user) => (
                            <div className='userElem'>
                                <div className='userData'>
                                    <img src={user.avatar} alt="avatar" />
                                    <span>{user.username}</span>
                                </div>
                                <button>Kick user</button>
                            </div>
                        ))[index]}
                    </a.div>
                ))
            }
        </div>
    )
}

export default List
