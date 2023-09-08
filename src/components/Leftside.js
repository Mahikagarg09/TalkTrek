import React, { useContext, useState } from 'react'
import emptyprofile from '../assets/emptyprofile.jpg'
import MessageView from './MessageView'
import SearchUser from './SearchUser'
import { signOut, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../Context/AuthContext';
import { collection, query, where, getDocs, getDoc, setDoc, updateDoc, serverTimestamp, doc } from "firebase/firestore";
import { db, storage } from "../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export default function Leftside({toggleSidebar}) {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [newDisplayName, setNewDisplayName] = useState(currentUser.displayName || "");
    const [editDisplayName, setEditDisplayName] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [searchValue, setsearchValue] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [showPopover, setShowPopover] = useState(false);

    const handleSearch = async () => {
        if (searchValue.trim() === "") {
            setErr(false);
            setUser(null);
            return;
        }
        const q = query(collection(db, "users"), where("name", "==", searchValue));
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size === 0) {
                setErr(true);
                setUser(null);
            } else {
                setErr(false);
                setUser(querySnapshot.docs[0].data());
            }
        } catch (err) {
            setErr(true);
            setUser(null);
            console.log(err);
        }
    }

    const handleKey = (e) => {
        e.code == 'Enter' && handleSearch();
    }

    //--------------------------------IF ANY USER IS SELECTED TO CHAT----------------

    const handleSelect = async () => {
        //check wether the group(chats in firestore) exists, if not create 
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            //if the chat between the user is exist 
            //we store in the response constant
            const res = await getDoc(doc(db, "chats", combinedId));
            /*If the Response that is chat between the user is not exsit we create the Chats  */
            if (!res.exists()) {

                await setDoc(doc(db, "chats", combinedId), { messages: [] });
                //create user Chats

                /* while Creating user Chats in search bar what we need is 
                   *both userID(id)
                   *last message {we want to show at bottom of every user}
                   *displayName (dn)
                   *img 
                   *date {we are going to sort the date in this file }
                */

                /*   usersChat:{
                      joyeId :{              
                        combinedId :{
                              userInfo{
                                 dn,img,id 
                              },
                              lastMessage:""       //rightnow we dont have any chat 
                              date:               //it is current date
                        }
                      }
                   } */

                await updateDoc(doc(db, "userchats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {

                        uid: user.uid,
                        displayName: user.name,
                        photoURL: user.photoURL,
                        lowercase:user.name.toLowerCase(),

                    },

                    [combinedId + ".date"]: serverTimestamp(),   //serverTimeStamp is  function of firebase it calculated time according  to different time zone 

                    /* RightNow we are not intialising the bottom msg of the user
                       Because right now we dont have any current user 
    
                       we are updating it when we Send msg to friend
                    */
                });

                /* We are doing same thing for the other side of  user  */

                await updateDoc(doc(db, "userchats", user.uid), {
                    [combinedId + ".userInfo"]: {

                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                        lowercase:currentUser.displayName.toLowerCase(),

                    },

                    [combinedId + ".date"]: serverTimestamp(),   //serverTimeStamp is  function of firebase it calculated time according  to different time zone 

                    /* RightNow we are not intialising the bottom msg of the user
                       Because right now we dont have any current user 
       
                       we are updating it when we Send msg to friend
                    */

                });
            }
        }
        catch (err) { }

        setUser(null);
        setsearchValue("");
    };

    // -----------------------------PROFILE CLICK-----------------------------------
    const handleProfileClick = () => {
        setShowPopover(!showPopover);
    };

    const handleSaveDisplayName = async () => {
        try {

            const q = query(collection(db, "userchats"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                const userData = doc.data();
                // Iterate through the nested objects
                for (const key in userData) {
                    if (userData.hasOwnProperty(key)) {
                        const nestedData = userData[key];
                        // Check if the nested object contains userInfo and displayName
                        if (nestedData.userInfo && nestedData.userInfo.displayName == currentUser.displayName) {
                            // Update the displayName
                            nestedData.userInfo.displayName = newDisplayName;
                            // Update the document in Firebase with the modified data
                            await setDoc(doc.ref, userData);
                            console.log("Display name updated successfully!");
                        }
                    }
                }
            });

            await updateProfile(currentUser, { displayName: newDisplayName });
            setCurrentUser({ ...currentUser, displayName: newDisplayName });

            await updateDoc(doc(db, "users", currentUser.uid), {
                name: newDisplayName,
                lastUpdated: serverTimestamp(),
                name_in_lowercase:newDisplayName.toLowerCase()
            });

            setNewDisplayName("");
            console.log(currentUser);
        } catch (error) {
            console.error("Error updating display name:", error);
        }
    };

    const uploadImage = async () => {
        try {
            if (selectedImage) {
                console.log("selected img",selectedImage)
                setUploading(true);
                // Upload the selected image to a storage location (e.g., Firebase Storage).
                const storageRef = ref(storage, `user-profiles/${currentUser.uid}`);
                await  uploadBytesResumable(storageRef, selectedImage);

                // Get the download URL of the uploaded image.
                const downloadURL = await getDownloadURL(storageRef);

                const q = query(collection(db, "userchats"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc) => {
                    const userData = doc.data();
                    // Iterate through the nested objects
                    for (const key in userData) {
                        if (userData.hasOwnProperty(key)) {
                            const nestedData = userData[key];
                            // Check if the nested object contains userInfo and displayName
                            if (nestedData.userInfo.displayName == currentUser.displayName && (nestedData.userInfo.photoURL==null || nestedData.userInfo.photoURL == currentUser.photoURL)) {
                                // Update
                                nestedData.userInfo.photoURL = downloadURL;
                                // Update the document in Firebase with the modified data
                                await setDoc(doc.ref, userData);
                                console.log("Profile pic  updated successfully!");
                            }
                        }
                    }
                });
                // Update the user's profile picture in Firebase Authentication.
                await updateProfile(currentUser, { photoURL: downloadURL });
                setCurrentUser({ ...currentUser, photoURL: downloadURL });

                // Update the user's profile picture in Firestore (if needed).
                await updateDoc(doc(db, "users", currentUser.uid), {
                    photoURL: downloadURL,
                    lastUpdated: serverTimestamp(),
                });
                setUploading(false);

                // Clear the selected image state and update UI.
                setSelectedImage(null);
                console.log("Profile picture updated successfully!");
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            setUploading(false);
        }
    };
    return (
        <>
            <div className="sticky bg-white top-0">
                <div className="flex items-center justify-between pt-4 ">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <button onClick={handleProfileClick} data-modal-target="defaultModal" data-modal-toggle="defaultModal" type="button">
                            <img
                                src={currentUser.photoURL || emptyprofile}
                                className="w-12 h-12 rounded-full pointer-events-none object-cover ml-2"
                                alt="profile"

                            />
                        </button>
                    </div>
                    {showPopover ? (
                        <>
                            <div
                                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed z-50 outline-none focus:outline-none top-4 left-4"
                            >
                                <div className="relative w-auto my-6 mx-auto max-w-sm">
                                    {/*content*/}
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none bg-white focus:outline-none">
                                        {/*header*/}
                                        <div className="flex items-start justify-between p-5 border-b border-solid  text-white  bg-cyan-900 border-slate-200 rounded-t">
                                            <h3 className="text-3xl font-semibold">
                                                Settings
                                            </h3>
                                            <button
                                                className="p-1 ml-auto bg-transparent border-0 text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                onClick={() => setShowPopover(false)}
                                            >
                                                <span className="bg-transparent text-white opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                                    ×
                                                </span>
                                            </button>
                                        </div>
                                        {/*body*/}
                                        <div className="relative p-6 flex-auto">
                                            <span className='font-bold  px-2 py-2 text-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'>Change Profile Photo</span>
                                            <div className="sm:flex text-center sm:justify-between mb-2 p-5 pt-2">
                                                <div className="flex justify-center">
                                                    {selectedImage || currentUser.photoURL || emptyprofile ? (
                                                        <img src={selectedImage || currentUser.photoURL || emptyprofile} alt="Avatar" className="bg-cover w-28 h-28 rounded-full" />
                                                    ) : (
                                                        <img src={currentUser.photoURL || emptyprofile} alt="Avatar" className="w-28 bg-cover" />
                                                    )}
                                                </div>
                                                <div className="sm:mt-[40px] mt-5">
                                                    {uploading ? (
                                                        <button className="items-center text-base font-medium rounded-xl bg-violet-50 px-4 mx-2" disabled>
                                                            Uploading...
                                                        </button>
                                                    ) : selectedImage ? (
                                                        <button className="items-center text-base font-medium rounded-xl bg-violet-50 px-4 "
                                                            onClick={uploadImage}
                                                        >
                                                            Upload
                                                        </button>
                                                    ) : (
                                                        <label className="items-center text-base font-medium rounded-xl bg-violet-50 px-4 cursor-pointer">
                                                            Upload Photo
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => setSelectedImage(e.target.files[0])}
                                                                // ref={fileInputRef}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                            <span className='font-bold  px-2 py-2 text-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'>Change Display Name</span>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold ml-2 mt-4 ">
                                                    {editDisplayName ? (
                                                        <input
                                                            type="text"
                                                            value={newDisplayName}
                                                            onChange={(e) => setNewDisplayName(e.target.value)}
                                                        />
                                                    ) : (
                                                        currentUser.displayName
                                                    )}
                                                </span>
                                                {editDisplayName ? (
                                                    <>
                                                        <button className="inline-flex items-center text-base font-medium rounded-xl bg-violet-50 px-4 cursor-pointer mt-2" onClick={handleSaveDisplayName}>Save</button>
                                                        <button className='inline-flex items-center text-base font-medium rounded-xl bg-violet-50 px-4 cursor-pointer mt-2' onClick={() => setEditDisplayName(false)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <div
                                                        className="inline-flex items-center text-base font-medium rounded-xl bg-violet-50 px-4 cursor-pointer mt-2"
                                                        onClick={() => setEditDisplayName(true)}
                                                    >
                                                        Edit
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/*footer*/}
                                        <div className="flex items-center justify-end p-6  rounded-b">
                                            <button
                                                className="bg-cyan-900 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowPopover(false)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                    ) : null}

                    <p className="font-semibold text-lg">Messages</p>
                    <p className=" dark:bg-cyan-900 hover:bg-opacity-50 text-white font-medium px-3 py-2 mr-2 rounded-lg cursor-pointer active:scale-95 transition"
                        onClick={() => signOut(auth)}
                    >
                        Sign out
                    </p>

                </div>
                <div>
                    <p className="mt-1 indent-2 font-semibold">
                        {currentUser.displayName}
                    </p>
                </div>
                <div className="mt-6 flex space-x-2 border-2 items-center bg-white px-3 py-2 rounded-lg mx-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        className="bg-transparent outline-none  w-full"
                        placeholder="Search"
                        onChange={e => setsearchValue(e.target.value)}
                        onKeyDown={handleKey}
                    />
                </div>
                {err && <span>User not found</span>}
                {user &&
                    <div className='hover:bg-gray-200' onClick={handleSelect}>
                        <div className="overflow-auto scrollbar-none mt-2">
                            <SearchUser user={user} />
                        </div>
                        <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300"></div>
                    </div>
                }
                <div className="overflow-auto scrollbar-none mt-2">
                    <MessageView  toggleSidebar={toggleSidebar}/>
                </div>
            </div >
        </>
    )
}
