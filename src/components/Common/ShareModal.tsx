"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Copy, Facebook, Twitter, Linkedin, Mail } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, url }) => {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "Check this out")}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title || "Check this out")}&body=${encodeURIComponent(url)}`,
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-black bg-opacity-70 transition-all duration-500 ease-in-out fixed inset-0 z-50",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70 transition-opacity duration-500" />
      <div
        className={cn(
          "relative bg-gray-900 rounded-2xl overflow-hidden max-w-lg w-full shadow-lg transition-all duration-500 ease-in-out transform",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}
      >
        <div className="flex justify-between px-4 pt-2">
          <div className="flex justify-start px-2 py-2 text-white font-semibold text-lg">Share</div>
          <div className="flex justify-end mb-1">
            <button
              onClick={onClose}
              className="hover:text-white text-gray-500 w-10 h-10 flex items-center justify-center text-4xl font-bold shadow"
            >
              &times;
            </button>
          </div>
        </div>
        <p className=" px-6 pb-2 text-sm text-gray-300">{title}</p>
        <div className="border-t border-gray-700 my-1"></div>

        <div className="px-4 py-4 relative w-full rounded-lg">
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Link</label>
            <div className="flex items-center bg-[#374151] rounded-md px-3 py-2">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-transparent text-white text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="ml-2 text-gray-300 hover:text-white"
                aria-label="Copy link"
                title="Copy link"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <p
              className={cn(
                "text-green-500 text-sm mt-1 transition-opacity duration-500",
                copied ? "opacity-100" : "opacity-0"
              )}
            >
              Link copied to clipboard!
            </p>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-white justify-center border border-[#374151] rounded-md py-2 hover:bg-[#374151]"
              >
                <Facebook className="h-4 w-4" />
                <span className="ml-2 text-sm">Facebook</span>
              </a>

              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-white justify-center border border-[#374151] rounded-md py-2 hover:bg-[#374151]"
              >
                <Twitter className="h-4 w-4" />
                <span className="ml-2 text-sm">Twitter</span>
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-white justify-center border border-[#374151] rounded-md py-2 hover:bg-[#374151]"
              >
                <Linkedin className="h-4 w-4" />
                <span className="ml-2 text-sm">LinkedIn</span>
              </a>

              <a
                href={shareLinks.email}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-white justify-center border border-[#374151] rounded-md py-2 hover:bg-[#374151]"
              >
                <Mail className="h-4 w-4" />
                <span className="ml-2 text-sm">Email</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 my-1"></div>
        <div className="flex items-center bg-gray-800/50  justify-center py-3 px-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-2 rounded-md text-white font-semibold hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
