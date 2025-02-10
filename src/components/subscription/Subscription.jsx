import React from 'react'
import './subscription.css'
import ProductDisplay from './productDisplay/ProductDisplay';
import SuccessDisplay from './successDisplay/SuccessDisplay';


const Subscription = ({ message, sessionId, success }) => {
    let content;

    if (!success && message === '') {
        content = <ProductDisplay />;
    } else if (success && sessionId !== '') {
        content = <SuccessDisplay sessionId={sessionId} />;
    } else {
        content = <Message message={message} />;
    }
    return (
        <section className='subscriptionWindow'>
            {content}
        </section>
    )
}

const Message = ({ message }) => (
    <section>
        <p>{message}</p>
    </section>
);

export default Subscription
