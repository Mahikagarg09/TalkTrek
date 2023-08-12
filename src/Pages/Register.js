import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {  ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { auth ,db,storage} from "../firebase"
import { useNavigate, Link } from "react-router-dom";
import uploadimage from "../assets/upload-image.jpg"

export default function Register() {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const res=await createUserWithEmailAndPassword(auth, email, password);
            console.log(res);

            const date=new Date().getTime();
            const storageRef = ref(storage, `{${name} + ${date}}`);

            await uploadBytesResumable(storageRef,file).then(() =>{
                getDownloadURL(storageRef).then(async(downloadURL) =>{
                    try{
                        //----------UPDATEING PROFILE-----
                        await updateProfile(res.user,{
                            name,
                            photoURL:downloadURL
                        });
                        console.log("UID:", res.user.uid);
                        console.log("Name:", name);
                        console.log("Email:", email);
                        console.log("PhotoURL:", downloadURL);

                        // Creating Firestore document
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            name,
                            email,
                            photoURL: downloadURL,
                        });
                        

                        //-------CREATE EMPTY USER CHATS ON FIRESTORE--
                        await setDoc(doc(db,"userchats",res.user.uid),{});
                        navigate("/");
                    }catch (err) {
                        console.log(err);
                        setErr(true);
                    } 
                })
            })
        }catch(err){
            setErr(true);
        } 

    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link
                    to="/register"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                >
                    <img
                        className="w-8 h-8 mr-2"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                        alt="logo"
                    />
                    TalkTrek
                </Link>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Display Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Your email
                                </label>
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="name@xyz.com"
                                    
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <input
                                    required
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                            <label
                                    htmlFor="file"
                                    className="mb-2 text-sm font-medium text-gray-900 dark:text-white flex "
                                >
                                    <img className="w-7 h-7 mr-2" src={uploadimage} alt="Upload Avatar" />
                                    <span>Add an avatar</span>
                                </label>
                            <input required className="flex items-center justify-center w-full text-white focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 text-cente bg-teal-500" type="file" id="file" />
                            {/* <button className="flex items-center justify-center w-full text-white focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 text-cente bg-teal-500"> */}
                                {/* <label htmlFor="file" className="flex items-center cursor-pointer">
                                    <img className="w-7 h-7 mr-2" src={uploadimage} alt="Upload Avatar" />
                                    <span>Add an avatar</span>
                                </label> */}
                            {/* </button> */}

                            <button
                                type="submit"
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Create an account
                            </button>
                            {err && <span>Something went wrong</span>}
                            {/* <!-- Divider --> */}
                            <div
                                className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                                <p
                                    className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">
                                    OR
                                </p>
                            </div>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    Login here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
