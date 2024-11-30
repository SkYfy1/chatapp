import React from 'react'

const ModalWindow = ({ children, onclick }) => {
    return (
        <>
            <div className='modal-back' onClick={onclick} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(17, 25, 40, 0.856)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div className='modal-block' style={{
                    textAlign: 'center'
                }}>{children}</div>
            </div>
        </>
    )
}

export default ModalWindow;


{/* <div className='modal-back' style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(17, 25, 40, 0.856)',
}}>
</div>
<div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    width: 'max-content',
    height: 'max-content'
}} className='modal-block'>{children}</div> */}
