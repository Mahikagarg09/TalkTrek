import React from 'react'
import emptyprofile from '../assets/emptyprofile.jpg'
import MessageView from './MessageView'

export default function Leftside() {
    return (
        <>
            <div className="sticky bg-white top-0">
                <div className="flex items-center justify-between pt-4 ">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <img
                            src={emptyprofile}
                            className="w-12 h-12 rounded-full pointer-events-none object-cover"
                            alt="profile"
                        />
                    </div>
                    <p className="font-semibold text-lg">Messages</p>
                    <p className="bg-teal-700 hover:bg-opacity-50 text-white font-medium px-3 py-2 mr-2 rounded-lg cursor-pointer active:scale-95 transition" >
                        Sign out
                    </p>

                </div>
                <div>
                    <p className="mt-4 indent-2 font-semibold">
                        You logged in as
                        <span className="text-green hover:underline"> username</span>
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
                    />
                </div>
                <div className="overflow-auto scrollbar-none mt-2">
                    <MessageView/>
                </div>
            </div>
        </>
    )
}
