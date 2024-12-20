import React from 'react'
import { useSpring, a } from '@react-spring/web'

const Spring = ({ children }) => {
    const [props, api] = useSpring(() => ({
        x: 0,
        scale: 1,
    }))
    return (
        <a.div style={props} onMouseOver={() => api.start({ scale: 1.2, x: 30, rotate: 10 })} onMouseOut={() => api.start({ scale: 1, x: 0, rotate: 0 })}>
            {children}
        </a.div>
    )
}

export default Spring
