import React from 'react'
import { useSpring, a } from '@react-spring/web'

const Spring = ({ onClick, children }) => {
    const [props, api] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
    }))
    return (
        // onMouseOver={() => api.start({ scale: 1.2, x: 30, rotate: 10 })} onMouseOut={() => api.start({ scale: 1, x: 0, rotate: 0 })}
        <a.div style={props} onClick={onClick} onMouseOver={() => api.start({ scale: 1.2, x: -15, y: -5 })} onMouseOut={() => api.start({ scale: 1, x: 0, y: 0 })}>
            {children}
        </a.div>
    )
}

export default Spring
