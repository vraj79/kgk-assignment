"use client";

import dynamic from "next/dynamic";

const Posts = dynamic(() => import("@/components/Posts"), { ssr: false });
const Pages = dynamic(() => import("@/components/Pages"), { ssr: false });
const Plugin = dynamic(() => import("@/components/Plugin"), { ssr: false });

import { useEffect, useState } from "react";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("Posts");

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(window.location.href);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-center space-x-4 mb-6">
        {["Posts", "Pages", "Plugin"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-2 text-lg font-semibold rounded-lg transition-all duration-300 focus:outline-none ${
              selectedTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-indigo-500 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-gray-100 shadow-lg rounded-lg p-6">
        {selectedTab === "Posts" && <Posts />}
        {selectedTab === "Pages" && <Pages />}
        {selectedTab === "Plugin" && <Plugin />}
      </div>
    </div>
  );
}
