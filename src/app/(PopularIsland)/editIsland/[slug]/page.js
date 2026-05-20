import React from 'react'
import EditIsland from '../../../../../components/templates/PopularIsland/EditIsland'

const page = async ({ params }) => {
  const { slug } = await params;
  return (
    <div>
      <EditIsland slug={slug} />
    </div>
  )
}

export default page
