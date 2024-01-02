import React from "react";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center text-black">
      <section class="bg-transparent dark:bg-gray-900">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              No page found.
            </p>
            <Link to="/" className="text-indigo-500">Go Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
