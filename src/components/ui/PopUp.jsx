import React from 'react'
import '../settings/UserSettings.css'

const PopUp = ({ changeLanguage, changeStatePop }) => {
    return (
        <div className='popup'>
            <svg onClick={(e) => { e.stopPropagation(); changeStatePop(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="close">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <h1>Select language</h1>
            <button onClick={(e) => { e.stopPropagation(); changeLanguage('en'); changeStatePop(false) }}>English</button>
            <button onClick={(e) => { e.stopPropagation(); changeLanguage('ru'); changeStatePop(false) }}>Russian</button>
        </div>
    )
}

export default PopUp
