import React, { useEffect } from 'react'
import useChatStore from '../../context/useChatStore';

const Icons = React.memo(({ children }) => {
    const isReceiverBlocked = useChatStore(state => state.isReceiverBlocked);
    const isUserBlocked = useChatStore(state => state.isReceiverBlocked);

    useEffect(() => {
        console.log('Rerender icons')
    })

    console.log(children)

    const isSingleChild = React.Children.count(children) === 1;

    if (isSingleChild) {
        return (
            <div className='icons'>
                <label htmlFor="img">
                    {children}
                    <input disabled={isUserBlocked || isReceiverBlocked} type="file" id='img' style={{ display: 'none' }} onChange={children.props[children.props['data-handler']]} />
                </label>
            </div>
        );
    }

    return (
        <div className='icons'>
            {children.map(el =>
                <label htmlFor="img">
                    {el}
                    <input disabled={isUserBlocked || isReceiverBlocked} type="file" id='img' style={{ display: 'none' }} onChange={el.props[el.props['data-handler']]} />
                </label>
            )}
        </div>
    )
}, (prevProps, nextProps) => {
    return prevProps.children === nextProps.children;
})

export default Icons
