import React from 'react'
import '../subscription.css'
import logo from '../../../../src/react-svgrepo-com.svg'

const ProductDisplay = () => {
    return (
        <>
            <img src={logo} alt="react logo" />
            <div>
                <h3>Starter plan</h3>
                <h4>$20.00 / month</h4>
            </div>
            <form action="http://localhost:3000/create-checkout-session" method="POST">
                {/* Add a hidden field with the lookup_key of your Price */}
                <input type="hidden" name="lookup_key" value="Subscription-f15a97a" />
                <button className='btn' id="checkout-and-portal-button" type="submit">
                    Checkout
                </button>
            </form>
        </>
    )
}

export default ProductDisplay
