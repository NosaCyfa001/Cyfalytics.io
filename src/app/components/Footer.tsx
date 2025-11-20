"use client";

import Link from "next/link";
import { Github, Linkedin, X } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Icons Section */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 py-6 sm:py-8">
          <Link
            href="https://github.com/NosaCyfa001"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:scale-110 transform duration-200"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <Link
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:scale-110 transform duration-200"
            aria-label="Twitter"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/nosa-ugobor/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:scale-110 transform duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 text-center py-4 sm:py-5">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Cyfalytics.io
            </span>
            {" "}— All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}