import React, { useContext } from 'react';
import emptyprofile from '../assets/emptyprofile.jpg';
import { AuthContext } from '../Context/AuthContext';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function SearchUser({ user ,setsearchValue,setUser}) {

    const { currentUser } = useContext(AuthContext);

    const handleSelect = async (user) => {
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
                        lowercase: user.name.toLowerCase(),

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
                        lowercase: currentUser.displayName.toLowerCase(),

                    },

                    [combinedId + ".date"]: serverTimestamp(),   //serverTimeStamp is  function of firebase it calculated time according  to different time zone 

                    /* RightNow we are not intialising the bottom msg of the user
                       Because right now we dont have any current user 
       
                       we are updating it when we Send msg to friend
                    */

                });
            }
        }
        catch (err) {
            console.log(err);
        }
        setsearchValue("");
        setUser(null);
    };

    return (
        <div>
            <div
                className="h-14 w-full mt-2 flex items-center justify-between hover:bg-gray-200 hover:bg-opacity-60 rounded-md px-2 py-1 cursor-pointer transition duration-200  "
                onClick={() => handleSelect(user)}

            >
                <div className="h-5/6 flex items-center space-x-2"  >
                    <img
                        src={user.photoURL || emptyprofile}
                        alt="profilePicture"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-bold text-gray-800">
                            {user.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
