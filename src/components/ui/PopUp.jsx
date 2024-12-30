import React, { useEffect } from 'react'
import '../settings/UserSettings.css'
import { a, useSpring } from '@react-spring/web'

const PopUp = ({ changeLanguage, changeStatePop }) => {
    const [spring, api] = useSpring(() => ({
        from: { x: 0, opacity: 0 },
        to: { x: 150, opacity: 1}
    }))

    return (
        <a.div className='popup' onClick={(e) => e.stopPropagation()} style={spring}>
            <svg onClick={() => changeStatePop(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="close">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <h1>Select language</h1>
            <button onClick={() => { changeLanguage('en'); changeStatePop(false) }}>English</button>
            <button onClick={() => { changeLanguage('ua'); changeStatePop(false) }}>Ukrainian</button>
        </a.div>
    )
}

export default PopUp
