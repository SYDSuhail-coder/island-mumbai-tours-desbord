import React from 'react'
import EditBooking from '../../../../../components/templates/BookingDetails/EditBooking'

const page = async ({ params }) => {
  const { id } = await params;  // await add kiya
  return (
    <>
      <EditBooking id={id} />
    </>
  )
}

export default page