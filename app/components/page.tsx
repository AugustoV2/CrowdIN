"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import loginRequest from "./loginRequest";

const Login = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLoginClick = (event: React.FormEvent) => {
        event.preventDefault();

        const usernameInput = (document.getElementById("username") as HTMLInputElement).value;
        const emailInput = (document.getElementById("email") as HTMLInputElement).value;
        const passwordInput = (document.getElementById("password") as HTMLInputElement).value;
        const repeatPasswordInput = (document.getElementById("repeat-password") as HTMLInputElement).value;
        const termsCheckbox = (document.getElementById("terms") as HTMLInputElement).checked;

        if (usernameInput && emailInput && passwordInput && repeatPasswordInput === passwordInput && termsCheckbox) {
            setError(null); // Clear any previous error
        } else if (repeatPasswordInput !== passwordInput) {
            setError("Passwords do not match.");
        } else {
            setError("Please fill in all required fields.");
        }

        loginRequest(usernameInput, passwordInput)
      .then(response => {
        // Use the response inside the if condition
        if (response === true) {
          setError(null); // Clear any previous error
          router.push("/components/mainpage?page=1");
        } else {
          setError("Login failed. Please try again.");
        }
      })
      .catch(error => {
        setError("An error occurred. Please try again later.");
        console.error(error);
        router.push("/components/mainpage?page=1");

      });

   
    };

    return (
        <div className="p-24">
            <form className="max-w-sm mx-auto" onSubmit={handleLoginClick}>
            <div className="mb-5">
                    <label
                        htmlFor="username"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Username
                    </label>
                    <input
                        type="username"
                        id="username"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="username"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Your email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="name@gmail.com"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Your password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label
                        htmlFor="repeat-password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Repeat password
                    </label>
                    <input
                        type="password"
                        id="repeat-password"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        required
                    />
                </div>
                <div className="flex items-start mb-5">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                            required
                        />
                    </div>
                    <label
                        htmlFor="terms"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                        I agree with the{" "}
                        <a
                            href="#"
                            className="text-blue-600 hover:underline dark:text-blue-500"
                        >
                            terms and conditions
                        </a>
                    </label>
                </div>
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error:</span> {error}
                    </div>
                )}
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-gradient-to-r from-indigo-500 to-red-600"
                >
                    Register new account
                </button>
            </form>
        </div>
    );
};

export default Login;
