import { useState } from "react";
import { Link } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            if (!email || !password) {
                ErrorToast("Email & password are required!");
                return;
            }

            const dataObj = {
                email,
                password,
            };

            const result = await axiosInstance.post("/auth/login", dataObj);

            if (result.status === 200) {
                SuccessToast(result.data.message);
                window.open("/", "_self");
            } else {
                ErrorToast(result.data.message);
            }
        } catch (err) {
            ErrorToast(`Cannot signup: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="min-h-[100vh] p-4 flex items-center justify-center">
            <div className="p-6 flex flex-col items-start gap-4 bg-emerald-200 rounded-lg">
                <div className="flex gap-4 items-center">
                    <label className="text-gray-700" htmlFor="user-email">
                        Email:
                    </label>
                    <input
                        id="user-email"
                        type="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-1 rounded-md py-1 px-2 text-indigo-700"
                    ></input>
                </div>

                <div className="flex gap-4 items-center">
                    <label className="text-gray-700" htmlFor="user-password">
                        Password:
                    </label>
                    <input
                        id="user-password"
                        type="password"
                        name="password"
                        required
                        className="border-1 rounded-md py-1 px-2 text-indigo-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>

                <div className="flex flex-col gap-3 items-center self-stretch">
                    <button
                        className="border-1 py-1 px-2 rounded-lg text-xl bg-green-700 text-white cursor-pointer"
                        onClick={handleRegister}
                    >
                        Login
                    </button>
                    <p className="flex flex-col gap-2 items-center justify-center">
                        <span>Don't have an account?</span>
                        <Link to="/signup" className="text-blue-600 underline">
                            Signup here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export { LoginPage };
