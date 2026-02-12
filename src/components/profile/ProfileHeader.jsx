"use client";
import React from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import Button from "../Button";
import { TiEdit } from "react-icons/ti";
import { IoLogOut, IoClose } from "react-icons/io5";
import { authService } from "@/services/authService";
import colleges from "@/app/CollegeList";

const ProfileHeader = ({ user, onLogout, isLoggingOut, onProfileUpdate }) => {
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState("");
    const [editFormData, setEditFormData] = React.useState({
        name: user?.name || "",
        phone: user?.phone || "",
        college: user?.college || "",
        department: user?.department || "",
        year: user?.year || ""
    });

    // State management for display user details
    const [name, setName] = React.useState(user?.name || "KRIYA USER");
    const [kriyaId, setKriyaId] = React.useState(user?.kriyaId || "KRIYA-26-0000");
    const [email, setEmail] = React.useState(user?.email || "user@example.com");
    const [phone, setPhone] = React.useState(user?.phone || "+91 98765 43210");
    const [department, setDepartment] = React.useState(user?.department || "Department Not Set");
    const [year, setYear] = React.useState(user?.year || "Year ?");
    const [college, setCollege] = React.useState(user?.college || "PSG College of Technology");

    // Update display when user prop changes
    React.useEffect(() => {
        if (user) {
            setName(user.name || "KRIYA USER");
            setKriyaId(user.kriyaId || "KRIYA-26-0000");
            setEmail(user.email || "user@example.com");
            setPhone(user.phone || "+91 98765 43210");
            setDepartment(user.department || "Department Not Set");
            setYear(user.year || "Year ?");
            setCollege(user.college || "PSG College of Technology");
            setEditFormData({
                name: user.name || "",
                phone: user.phone || "",
                college: user.college || "",
                department: user.department || "",
                year: user.year || ""
            });
        }
    }, [user]);

    const handleEditClick = () => {
        setIsEditModalOpen(true);
        setError("");
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setError("");
        // Reset form data to current user data
        setEditFormData({
            name: user?.name || "",
            phone: user?.phone || "",
            college: user?.college || "",
            department: user?.department || "",
            year: user?.year || ""
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setError("");
        
        // Validation
        if (!editFormData.name.trim()) {
            setError("Name is required");
            return;
        }
        if (!editFormData.phone.trim()) {
            setError("Phone is required");
            return;
        }
        if (!editFormData.college) {
            setError("College is required");
            return;
        }
        if (!editFormData.department.trim()) {
            setError("Department is required");
            return;
        }
        if (!editFormData.year) {
            setError("Year is required");
            return;
        }

        try {
            setIsSaving(true);
            await authService.updateProfile(editFormData);
            
            // Update local state
            setName(editFormData.name);
            setPhone(editFormData.phone);
            setCollege(editFormData.college);
            setDepartment(editFormData.department);
            setYear(editFormData.year);
            
            // Notify parent component to refresh user data
            if (onProfileUpdate) {
                await onProfileUpdate();
            }
            
            setIsEditModalOpen(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">

                {/* Avatar Section */}
                <div className="relative group shrink-0">
                    <div className="absolute -inset-1 rounded-full bg-linear-to-r from-blue-500 to-violet-500 opacity-20 blur-md group-hover:opacity-40 transition duration-500"></div>
                    <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-2 border-white/20 p-1">
                        <div className="h-full w-full rounded-full overflow-hidden relative bg-black">
                            <Image
                                src={user?.avatar || "/img/gallery-1.webp"}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* User Info Section */}
                <div className="flex-1 w-full text-center md:text-left">
                    {/* Name - Keeping it prominent as the header title */}
                    <div className="mb-4">
                        <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-1">Name</p>
                        <h1 className="special-font text-5xl md:text-5xl uppercase text-white tracking-wide leading-none">
                            <b>{name}</b>
                        </h1>
                    </div>

                    {/* Details Grid - 3 rows x 2 columns */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        {/* Row 1 */}
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Kriya ID</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{kriyaId}</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Institution</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{college}</p>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Department</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{department}</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Year</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{year}</p>
                        </div>

                        {/* Row 3 */}
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Phone</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web">{phone}</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-0.5">Email</p>
                            <p className="text-sm md:text-base font-bold text-white font-circular-web break-all">{email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons - Positioned at top right */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2">
                {/* Logout Button */}
                <div className="md:hidden">
                    {/* Mobile: Icon only */}
                    <Button
                        onClick={onLogout}
                        containerClass="!bg-red-500/10 !text-red-200 hover:!bg-red-500/20 border border-red-500/30 !px-3 !py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                        leftIcon={<IoLogOut className="text-lg" />}
                        id="logout-btn"
                    />
                </div>
                <div className="hidden md:block">
                    {/* Desktop: Icon + Text */}
                    <Button
                        title={isLoggingOut ? "Logging out..." : "Logout"}
                        onClick={onLogout}
                        containerClass="!bg-red-500/10 !text-red-200 hover:!bg-red-500/20 border border-red-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        leftIcon={<IoLogOut />}
                        id="logout-btn"
                    />
                </div>

                {/* Edit Profile Button */}
                <div className="md:hidden">
                    {/* Mobile: Icon only */}
                    <Button
                        onClick={handleEditClick}
                        containerClass="!bg-white/10 !text-white hover:!bg-white/20 border border-white/10 !px-3 !py-3"
                        leftIcon={<TiEdit className="text-lg" />}
                    />
                </div>
                <div className="hidden md:block">
                    {/* Desktop: Icon + Text */}
                    <Button
                        title="Edit Profile"
                        onClick={handleEditClick}
                        containerClass="!bg-white/10 !text-white hover:!bg-white/20 border border-white/10"
                        leftIcon={<TiEdit />}
                    />
                </div>
            </div>

            {/* Edit Profile Modal - Rendered via Portal */}
            {isEditModalOpen && typeof window !== 'undefined' && ReactDOM.createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        >
                            <IoClose className="text-2xl" />
                        </button>

                        {/* Modal Header - Fixed */}
                        <div className="p-6 md:p-8 pb-4 border-b border-white/5">
                            <h2 className="special-font text-3xl md:text-4xl uppercase text-white">
                                <b>Edit Profile</b>
                            </h2>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-4">
                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 font-general text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg outline-none focus:border-blue-400 transition-colors font-general"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-2">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editFormData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg outline-none focus:border-blue-400 transition-colors font-general"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                {/* College */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-2">
                                        Institution *
                                    </label>
                                    <select
                                        name="college"
                                        value={editFormData.college}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg outline-none focus:border-blue-400 transition-colors font-general appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="" className="bg-gray-900 text-sm">Select College / Institute...</option>
                                        {colleges.map((col, index) => (
                                            <option key={index} value={col} className="bg-gray-900 text-sm py-2">
                                                {col}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-2">
                                        Department *
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={editFormData.department}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg outline-none focus:border-blue-400 transition-colors font-general"
                                        placeholder="Enter your department"
                                    />
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-wider text-blue-500 font-bold mb-2">
                                        Year *
                                    </label>
                                    <select
                                        name="year"
                                        value={editFormData.year}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white rounded-lg outline-none focus:border-blue-400 transition-colors font-general appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-gray-900">Select Year</option>
                                        <option value="1" className="bg-gray-900">1</option>
                                        <option value="2" className="bg-gray-900">2</option>
                                        <option value="3" className="bg-gray-900">3</option>
                                        <option value="4" className="bg-gray-900">4</option>
                                        <option value="5" className="bg-gray-900">5</option>
                                    </select>
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">
                                        Email (Cannot be changed)
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-gray-500 rounded-lg outline-none font-general cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons - Sticky Footer */}
                        <div className="border-t border-white/10 p-6 md:p-8 pt-4 bg-black/50 backdrop-blur-md">
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCloseModal}
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-general text-sm uppercase tracking-wider hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ProfileHeader;
