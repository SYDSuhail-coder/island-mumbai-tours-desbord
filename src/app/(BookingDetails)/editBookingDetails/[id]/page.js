import React from 'react'
import EditBooking from '../../../../../components/templates/BookingDetails/EditBooking'

const page = ({params}) => {
  return (
    <>
     <EditBooking id={params.id}/> 
    </>
  )
}

export default page
