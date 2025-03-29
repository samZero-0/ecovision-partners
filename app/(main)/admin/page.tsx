'use client'
import Donations from "@/src/components/Admin/Donations";
import Overview from "@/src/components/Admin/Overview";
import withAuth from "@/src/withAuth";
// import {  SidebarDemo } from "@/src/components/AdminSidebar";

const page = () => {
    return (
        <div className="">
           <Overview></Overview>
           <Donations></Donations>
          
        </div>
    );
};

export default  withAuth(page);