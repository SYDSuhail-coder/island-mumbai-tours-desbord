"use client"
import { useSelector } from 'react-redux'
import React from 'react'
import SideBar from '../../templates/SideBaar/SideBaar'
import FrontPage from '../../templates/FrontPage/FrontPage'
import dynamic from "next/dynamic";


const AuthSidebar = ({ children }) => {
    const loginDetails = useSelector((state) => state.login.isLogin)
    //  console.log(loginDetails);
     
    return (
        <>
            {/* {loginDetails ? ( */}
                <SideBar>
                    {children}
                </SideBar>

            {/* ) : (
                <FrontPage />
            )} */}
        </>
    );
}

// export default AuthSidebar
export default dynamic(() => Promise.resolve(AuthSidebar), { ssr: false })
