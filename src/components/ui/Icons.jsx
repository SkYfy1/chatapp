import React from 'react'
import useChatStore from '../../context/useChatStore';

const Icons = ({ children }) => {
    const { isReceiverBlocked, isUserBlocked } = useChatStore();

    if (!children.hasOwnProperty('length')) {

        return (
            <div className='icons'>
                <label htmlFor="img">
                    {children}
                    <input disabled={isUserBlocked || isReceiverBlocked} type="file" id='img' style={{ display: 'none' }} onChange={children.props['data-change']} />
                </label>
            </div>
        );
    }

    return (
        <div className='icons'>
            {children.map(el =>
                <label htmlFor="img">
                    {el}
                    <input disabled={isUserBlocked || isReceiverBlocked} type="file" id='img' style={{ display: 'none' }} onChange={el.props['data-change']} />
                </label>
            )}
        </div>
    )
}

export default Icons
