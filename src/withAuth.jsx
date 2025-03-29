'use client'

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation"; // Note: using next/navigation instead of next/router
import { AuthContext } from "@/providers/AuthProvider";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;