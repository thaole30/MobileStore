import React from 'react'

export default function EmptyCart() {
  return (
    <div className='empty-cart'>
        <img src={require("../img/empty-cart.png")} alt="" className='empty-cart-img'/>
    </div>
  )
}
