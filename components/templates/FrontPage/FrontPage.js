"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const FrontPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.push('/login')
    }, [])

    return (
        <>
        </>
    )
}

export default FrontPage

