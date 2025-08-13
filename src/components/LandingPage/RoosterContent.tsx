"use client"

import React from "react";
import { MessageSquare } from "lucide-react";

const samplePlayers = [
    { id: 1, name: "Alex Johnson" },
    { id: 2, name: "Mia Thompson" },
    { id: 3, name: "Jordan Lee" },
    { id: 4, name: "Sam Taylor" },
    { id: 5, name: "Riley Parker" },
    { id: 6, name: "Casey Morgan" },
    { id: 7, name: "Drew Carter" },
]

const RoosterContent: React.FC = () => {
    return (
        <div className="rounded-xl shadow-lg space-y-3 h-full overflow-x-hidden overflow-y-auto">
            {samplePlayers.map((player) => (
                <div
                    key={player.id}
                    className="flex items-center justify-between bg-gray-800 hover:bg-zinc-700 transition rounded-lg p-3"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-md">
                            {(player.name.charAt(0) || '').toUpperCase()}
                        </div>
                        <span className="text-white text-sm font-medium">
                            {player.name}
                        </span>
                    </div>
                    <MessageSquare size={18} className="text-zinc-400 hover:text-white cursor-pointer" />
                </div>
            ))}
        </div>
    );
};

export default RoosterContent;