import React from 'react'
import EditMumbaiWalkingTour from '../../../../../components/templates/MumbaiWalkingTour/EditMumbaiWalkingTour'

const page = async({params}) => {
  const { slug } = await params;
  return (
    <div>
      <EditMumbaiWalkingTour slug={slug} />
    </div>
  )
}

export default page
