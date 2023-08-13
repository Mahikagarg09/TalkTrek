import React, { useDeferredValue } from 'react';
import emptyprofile from '../assets/emptyprofile.jpg';

export default function MessageView({user}) {
    // const staticData = [
    //     {
    //         id: 1,
    //         name: 'John Doe',
    //         lastUpdate: '10:30 AM',
    //         lastMessage: 'Hello there!',
    //     },
    //     {
    //         id: 2,
    //         name: 'Jane Smith',
    //         lastUpdate: 'Yesterday',
    //         lastMessage: 'How are you?',
    //     },
    //     {
    //         id: 3,
    //         name: 'Alice Johnson',
    //         lastUpdate: '2 days ago',
    //         lastMessage: 'See you soon!',
    //     },
    // ];

    return (
        <div>
            {/* {staticData.map(user => ( */}
                <div
                    className="h-14 w-full mt-2 flex items-center justify-between hover:bg-gray-200 hover:bg-opacity-60 rounded-md px-2 py-1 cursor-pointer transition duration-200"
                >
                    <div className="h-5/6 flex items-center space-x-2">
                        <img
                            src={user && user.photoURL ? user.photoURL : emptyprofile}
                            alt="profilePicture"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-bold text-gray-800">
                                {user && user.name}
                            </p>
                            <p className="text-green text-sm">
                                Last Message: Hi
                            </p>
                        </div>
                    </div>
                    <p className="text-xs font-medium text-gray-800">
                        {/* {person.lastUpdate} */}
                        10:00 AM
                    </p>
                </div>
             {/* ))} */}
        </div>
    );
}
