'use client'
// import {  SidebarDemo } from "@/src/components/AdminSidebar";

import Dashboard from "@/src/components/Volunteer/DashboardVolunteer";
import withAuth from "@/src/withAuth";

const page = () => {
    return (
        <div className="">
           <Dashboard></Dashboard>
          
        </div>
    );
};

export default withAuth(page) ;