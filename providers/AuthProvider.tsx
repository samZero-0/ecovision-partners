'use client'

import { createContext, useEffect, useState } from "react";
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

export const AuthContext = createContext(null);

const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setDarkMode] = useState(false);
    const [cart, setCart] = useState([]);
    const [amount, setAmount] = useState(0);
    const [invoice, setInvoice] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    const createAccount = async (email, password) => {
        setLoading(true);
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            toast.error("Error creating account");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            toast.error("Error signing in");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const googleSignin = async () => {
        setLoading(true);
        try {
            return await signInWithPopup(auth, provider);
        } catch (error) {
            toast.error("Error signing in with Google");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            return await signOut(auth);
        } catch (error) {
            toast.error("Error logging out");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser?.email) {
                const user = { email: currentUser.email };

                axios
                    .post("https://assignment-12-blue.vercel.app/jwt", user, { withCredentials: true })
                    .then((res) => {
                        setLoading(false);
                    });
            } else {
                axios
                    .post("https://assignment-12-blue.vercel.app/logout", {}, { withCredentials: true })
                    .then((res) => {
                        setLoading(false);
                    });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        axios
            .get("https://assignment-12-blue.vercel.app/users")
            .then((res) => {
                setAllUsers(res.data);

                // Find the logged-in user in the fetched users
                const loggedInUser = res.data.find((u) => u.email === user?.email);

                if (loggedInUser) {
                    if (loggedInUser.role === "admin") {
                        setIsAdmin(true);
                        setIsSeller(false);
                        setIsUser(false);
                    } else if (loggedInUser.role === "seller") {
                        setIsSeller(true);
                        setIsAdmin(false);
                        setIsUser(false);
                    } else if (loggedInUser.role === "user") {
                        setIsUser(true);
                        setIsAdmin(false);
                        setIsSeller(false);
                    }
                }
            })
            .catch((error) => {
                error
            });
    }, [user]); // Add `user` as a dependency to re-run this effect when `user` changes

    const userInfo = {
        createAccount,
        signIn,
        googleSignin,
        logOut,
        user,
        loading,
        setUser,
        toggleDarkMode,
        isDarkMode,
        setDarkMode,
        cart,
        setCart,
        setAmount,
        amount,
        invoice,
        setInvoice,
        isAdmin,
        isSeller,
        isUser,
    };

    return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;