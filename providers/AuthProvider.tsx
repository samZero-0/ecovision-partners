"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { app } from "../firebase/firebase.config";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext<any>(null);

const provider = new GoogleAuthProvider();

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const auth = getAuth(app);
    const [user, setUser] = useState<any>(null);
    const [totalDontations, setTotalDonations] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setDarkMode] = useState(false);
    const [cart, setCart] = useState<any[]>([]);
    const [amount, setAmount] = useState(0);
    const [invoice, setInvoice] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVolunteer, setIsVolunter] = useState(false);
    const [isDonor, setIsDonor] = useState(false);
    const [allUsers, setAllUsers] = useState<any[]>([]);


    const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser?.email) {
                axios
                    .post("https://assignment-12-blue.vercel.app/jwt", { email: currentUser.email }, { withCredentials: true })
                    .finally(() => setLoading(false));
            } else {
                axios
                    .post("https://assignment-12-blue.vercel.app/logout", {}, { withCredentials: true })
                    .finally(() => setLoading(false));
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        axios.get("https://ecovision-backend-five.vercel.app/users")
            .then((res) => {
                setAllUsers(res.data);
                const loggedInUser = res.data.find((u: any) => u.email === user?.email);
                if (loggedInUser) {
                    setIsAdmin(loggedInUser.role === "admin");
                    setIsVolunter(loggedInUser.role === "volunteer");
                    setIsDonor(loggedInUser.role === "donor");
                }
            })
            .catch(() => setLoading(false));
    }, [user]);

    const userInfo = {
        createAccount: (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password),
        signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
        googleSignin: () => signInWithPopup(auth, provider),
        logOut: () => signOut(auth),
        user, loading, setUser, toggleDarkMode, isDarkMode, setDarkMode,
        cart, setCart, amount, setAmount, invoice, setInvoice,
        isAdmin, isVolunteer, isDonor,setTotalDonations
    };

    return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
