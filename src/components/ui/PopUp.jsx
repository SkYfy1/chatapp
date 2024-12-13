import React from 'react'
import '../settings/UserSettings.css'

const PopUp = ({ changeLanguage, changeStatePop }) => {
    if (typeof console === 'undefined') {
        alert('Console is not defined in this environment');
    } else {
        console.log('Console is working fine in this component');
    }
    return (
        <div className='popup'>
            <svg onClick={() => changeStatePop(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="close">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <h1>Select language</h1>
            <button onClick={() => { changeLanguage('en'); changeStatePop(false) }}>English</button>
            <button onClick={() => { changeLanguage('ru'); changeStatePop(false) }}>Russian</button>
        </div>
    )
}

export default PopUp
