import { Link, useNavigate } from "react-router";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { FiUpload } from "react-icons/fi";

const Navbar = ({ searchValue, setSearchValue, onUploadClick }) => {
    const { user = {} } = useAppContext();
    const navigate = useNavigate();

    const { isAuthenticated } = user;

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/auth/logout");
            SuccessToast("Logout successful!");
            window.location.reload();
        } catch (err) {
            ErrorToast(err.message);
        }
    };

    const handleOpenProfilePage = () => {
        navigate("/profile");
    };

    return (
        <div className="p-6 flex items-center justify-between text-white" style={{ background: 'linear-gradient(90deg, #18181b 0%, #23272f 100%)', borderBottom: '4px solid #fff' }}>
            <div className="flex items-center gap-6">
                <Link to="/" className="font-bold text-2xl text-white hover:text-gray-300 transition-colors">Photos</Link>
            </div>
            <div className="flex items-center flex-1 justify-center gap-4">
                <input
                    type="text"
                    placeholder="Search images..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    className="px-2 py-1 border rounded-md w-64 text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                    onClick={onUploadClick}
                    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none flex items-center justify-center ml-4"
                    title="Upload Image"
                    style={{ background: '#fff', color: '#000' }}
                >
                    <FiUpload size={22} />
                </button>
            </div>
            <div className="flex gap-4 items-center">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="text-blue-400 underline hover:text-blue-200 transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="text-blue-400 underline hover:text-blue-200 transition-colors">
                            Signup
                        </Link>
                    </>
                ) : (
                    <>
                        <button
                            className="py-1 px-2 rounded-md transition-colors"
                            style={{ background: '#23272f', color: '#fff', border: 'none' }}
                            onMouseOver={e => e.currentTarget.style.background = '#18181b'}
                            onMouseOut={e => e.currentTarget.style.background = '#23272f'}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                        <div
                            onClick={handleOpenProfilePage}
                            className="h-10 w-10 rounded-full bg-indigo-900 text-amber-100 text-xl flex items-center justify-center cursor-pointer"
                        >
                            {user?.email?.substr(0, 1)?.toUpperCase()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export { Navbar };
