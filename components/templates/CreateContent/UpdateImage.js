"use client";
import { useParams } from "next/navigation";

const UpdateImage = () => {
  const { id } = useParams();

  // console.log("Edit ID:", id);

  return <div>Update Image ID: {id}</div>;
};

export default UpdateImage;
