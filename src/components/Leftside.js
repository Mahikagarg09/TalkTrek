import React, { useContext, useState } from 'react'
import emptyprofile from '../assets/emptyprofile.jpg'
import MessageView from './MessageView'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../Context/AuthContext';
import { collection, query, where, getDocs, getDoc, setDoc, updateDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../firebase"


export default function Leftside() {
    const { currentUser } = useContext(AuthContext);

    const [searchValue, setsearchValue] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

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

    const handleSelect = async () =>
    {
       //check wether the group(chats in firestore) exists, if not create 
         const combinedId  = 
         currentUser.uid > user.uid 
         ? currentUser.uid + user.uid 
          : user.uid + currentUser.uid;
      
          
          
         try{
          //if the chat between the user is exist 
           //we store in the response constant
      
             
           const res = await getDoc(doc(db,"chats",combinedId));
           console.log(res)
          /*If the Response that is chat between the user is not exsit we create the Chats  */
           if(!res.exists()){
             
              //creating chat in chats collection 
               console.log(res)
              
              await setDoc(doc(db,"chats",combinedId), {messages :[] });
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
              
              await updateDoc(doc(db,"userchats",currentUser.uid),{
                   [combinedId + ".userInfo"] :{
                      
                      uid : user.uid,
                      displayName : user.name,
                      photoURL : user.photoURL,
  
                   },
  
                   [combinedId + ".date"] : serverTimestamp() ,   //serverTimeStamp is  function of firebase it calculated time according  to different time zone 
  
                  /* RightNow we are not intialising the bottom msg of the user
                     Because right now we dont have any current user 
  
                     we are updating it when we Send msg to friend
                  */  
  
              });
  
              /* We are doing same thing for the other side of  user  */
               
              await updateDoc(doc(db,"userchats",user.uid),{
                [combinedId + ".userInfo"] :{
                   
                   uid : currentUser.uid,
                   displayName : currentUser.displayName,
                   photoURL : currentUser.photoURL
  
                },
  
                [combinedId + ".date"] : serverTimestamp() ,   //serverTimeStamp is  function of firebase it calculated time according  to different time zone 
  
               /* RightNow we are not intialising the bottom msg of the user
                  Because right now we dont have any current user 
  
                  we are updating it when we Send msg to friend
               */  
  
           });
  
  
           }
         }
         catch(err){}
        
      setUser(null);
      setsearchValue("");
         
       //create user chats
    };

    
    return (
        <>
            <div className="sticky bg-white top-0">
                <div className="flex items-center justify-between pt-4 ">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <img
                            src={currentUser.photoURL ? currentUser.photoURL : emptyprofile}
                            className="w-12 h-12 rounded-full pointer-events-none object-cover ml-2"
                            alt="profile"
                        />
                    </div>
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
                            <MessageView user={user} />
                        </div>
                        <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300"></div>
                    </div>
                }
                <div className="overflow-auto scrollbar-none mt-2 hover:bg-gray-200">
                    <MessageView />
                </div>
            </div>
        </>
    )
}
