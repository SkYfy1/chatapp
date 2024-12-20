import React from 'react'
import { a, useTrail } from '@react-spring/web'

const Trail = ({ children }) => {
    const [trails, api] = useTrail(children.length, () => ({
        from: { opacity: 0 },
        to: { opacity: 1 }
    }))
    const textArray = children.split('');
    return (
        <div style={{
            display: 'flex',
        }}>
            {trails.map(({ ...style }, index) => (
                <a.div style={style}>
                    {textArray[index]}
                </a.div>
            ))}
        </div >
    )
}

export default Trail
