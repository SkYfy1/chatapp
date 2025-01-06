import React from 'react'
import '../list/chatList/chatList.css'
import { animated, useSpring } from '@react-spring/web'
import useAppStore from '../../context/useAppStore'

const Button = ({ children }) => {
    const changeGroup = useAppStore((state) => state.changeGroup);
    const closeButton = useAppStore((state) => state.changeShowButton)
    const [spring, api] = useSpring(() => ({
        from: {
            y: 0,
            opacity: 0
        },
        to: {
            y: -30,
            opacity: 1
        }
    }));

    return (
        <animated.button style={spring} className='btn' onClick={() => { changeGroup(); closeButton()}}>
            {children}
        </animated.button>
    )
}

export default Button
