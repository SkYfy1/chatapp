import React from 'react'
import '../subscription.css'
import logo from '../../../../src/react-svgrepo-com.svg'

const SuccessDisplay = ({ sessionId }) => {
    return (
        <>
            <div className="product Box-root">
                <img src={logo} alt="react logo" />
                <div className="description Box-root">
                    <h3>Subscription to starter plan successful!</h3>
                </div>
            </div>
            <form action="http://localhost:3000/create-portal-session" method="POST">
                <input
                    type="hidden"
                    id="session-id"
                    name="session_id"
                    value={sessionId}
                />
                <button className='btn' id="checkout-and-portal-button" type="submit">
                    Manage your billing information
                </button>
            </form>
        </>
    )
}

export default SuccessDisplay
