import React from 'react'

export default function ShowCustomerInfo({ Data }) {
  if (Data === undefined) {
    return (
      <div>

      </div>
    )
  }
  return (
    <div>
      <div className='border p-3 text-center'>Customer Info</div>
      <div className='border p-3 d-flex flex-column gap-3 text-center'>
        <div>Name : {Data.fullName}</div>
        <div>Address : {Data.address}</div>
        <div>Phonenumber : {Data.phone}</div>
        <div>Delivery To : {Data.cityProvince.name_en}</div>
        <div>Delivery Fee : {Data.cityProvince.deliveryFee}$</div>
        <div>Total Item : {Data.clothAndQuantities.length}</div>
        <div>Total Price : {Data.totalPrice}$</div>
        <div>Note : {Data.note}</div>
      </div>
    </div>
  )
}
