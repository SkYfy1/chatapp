import React from 'react'
import './tooltip.css'

const Tooltip = ({ style, children, text }) => {
    return (
        <div className='tooltip'>
            <span style={{ top: style.pointerY, left: style.pointerX }} className='tooltip-text'>{text}</span>
            {children}
        </div>
    )
}

export default Tooltip
