'use client'
import { AuthContext } from "@/providers/AuthProvider";
import MyDonations from "@/src/components/Donor/MyDonations";
import withAuth from "@/src/withAuth";
// import { useContext } from "react";
// import Dashboard from "@/src/components/Volunteer/DashboardVolunteer";

const page = () => {

    
    
    return (
        <div className="">
           <MyDonations></MyDonations>

          
        </div>
    );
};

export default withAuth(page);