import React from 'react'
import EditMumbaiPrivateTour from '../../../../../components/templates/MumbaiPrivateTour/EditMumbaiPrivateTour'

const page = async({params}) => {
   const { slug } = await params;
  return (
    <div>
      <EditMumbaiPrivateTour slug={slug}/>
    </div>
  )
}

export default page
