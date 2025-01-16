import React from 'react'
import { a, useTrail } from '@react-spring/web'
import { useAuthStore } from '../../context/useAuthStore';

const Trail = ({ children }) => {
    const userInfo = useAuthStore((state) => state.currentUser);
    const [trails, api] = useTrail(children.length, () => ({
        from: { opacity: 0, y: -25 },
        to: { opacity: 1, y: 0  }
    }));

    const anims = userInfo.hasOwnProperty('settings') ? userInfo?.settings?.animations : true;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10            
        }}>
            {trails.map(({ ...style }, index) => (
                <a.div style={anims ? style : {}}>
                    {children[index]}
                </a.div>
            ))}
        </div >
    )
}

export default Trail
