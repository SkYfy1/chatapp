import React from 'react'
import { a, useTrail } from '@react-spring/web'

const Trail = ({ children }) => {
    const [trails, api] = useTrail(children.length, () => ({
        from: { opacity: 0, y: -25 },
        to: { opacity: 1, y: 0  }
    }));
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10            
        }}>
            {trails.map(({ ...style }, index) => (
                <a.div style={style}>
                    {children[index]}
                </a.div>
            ))}
        </div >
    )
}

export default Trail
