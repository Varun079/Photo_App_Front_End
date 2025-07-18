import { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";
import { Navbar } from "../components/navbar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState({});
    const [loadingProfile, setLoadingProfile] = useState(false);

    const getUserDetails = async () => {
        try {
            setLoadingProfile(true);
            const resp = await axiosInstance.get("/users/details");
            setUserDetails(resp.data.data.user);
        } catch (err) {
            ErrorToast(`${err.response?.data?.message || err.message}`);
        } finally {
            setTimeout(() => setLoadingProfile(false), 5000);
        }
    };

    const handleUpdateUserDetails = (e) => {
        e.preventDefault();
        //...
    };

    const handleDPUpload = async (e) => {
        console.log(e.target.files);
        const formData = new FormData();
        formData.append("displayPicture", e.target.files[0]);

        const resp = await axiosInstance.put("/users/display-picture", formData);
        console.log(resp);
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div>
            <Navbar />
            <div>
                {loadingProfile ? (
                    <div className="py-10 flex items-center justify-center">
                        <SkeletonTheme baseColor="#808080" highlightColor="#444">
                            <div className="bg-gray-200 rounded-2xl p-4 shadow-md w-full max-w-sm">
                                {/* Image Placeholder */}
                                <Skeleton height={180} className="rounded-xl mb-4" />

                                {/* Title Placeholder */}
                                <Skeleton height={20} width={`80%`} className="mb-2" />

                                {/* Subtitle/Description Placeholder */}
                                <Skeleton height={15} width={`60%`} className="mb-4" />

                                {/* Button or Footer Placeholder */}
                                <div className="flex justify-between items-center mt-4">
                                    <Skeleton height={30} width={80} />
                                    <Skeleton circle={true} height={30} width={30} />
                                </div>
                            </div>
                        </SkeletonTheme>
                    </div>
                ) : (
                    <form className="flex flex-col p-6 gap-6" onSubmit={handleUpdateUserDetails}>
                        <div>
                            <label>Email</label>
                            <input
                                defaultValue={userDetails.email}
                                type="text"
                                name="email"
                                className="py-1 px-2 border-1 border-gray-400 rounded-md bg-gray-300 cursor-not-allowed"
                                disabled
                            />
                        </div>
                        <p className="px-2 py-1 border-1 rounded-md bg-lime-200 text-sm w-fit">{userDetails.role}</p>
                        <div>
                            <label>Name</label>
                            <input type="text" name="email" className="py-1 px-2 border-1 border-gray-400 rounded-md" />
                        </div>
                        <div>
                            <label>Gender</label>
                            <select>
                                <option value="not-allowed">---select---</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </form>
                )}
                <div>
                    <input
                        type="file"
                        onChange={handleDPUpload}
                        className="py-1 px-2 border-1 border-gray-400 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export { ProfilePage };
