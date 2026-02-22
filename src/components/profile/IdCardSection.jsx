"use client";
import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import ReactDOM from "react-dom";
import { IoClose, IoCloudUpload, IoEye, IoCheckmarkCircle, IoRefresh } from "react-icons/io5";
import { authService } from "@/services/authService";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const IdCardSection = forwardRef(({ user, onRefresh }, ref) => {
    const fileInputRef = useRef(null);

    // Expose triggerUpload to parent via ref
    useImperativeHandle(ref, () => ({
        triggerUpload: () => fileInputRef.current?.click()
    }));

    // Upload flow state
    const [isUploading, setIsUploading] = useState(false);
    const [stagedFile, setStagedFile] = useState(null);
    const [stagedPreviewUrl, setStagedPreviewUrl] = useState(null);
    const [stagedFileType, setStagedFileType] = useState(null); // 'image' | 'pdf'

    // View flow state
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewPreviewUrl, setViewPreviewUrl] = useState(null);
    const [viewFileType, setViewFileType] = useState(null);
    const [isViewLoading, setIsViewLoading] = useState(false);

    const hasUploaded = !!user?.idCardUrl;

    // --- File Selection & Validation ---
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset file input so re-selecting the same file works
        e.target.value = "";

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert("Invalid file type. Please upload a PDF, JPG, PNG, or WebP file.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert("File is too large. Maximum allowed size is 5MB.");
            return;
        }

        // Stage the file for preview
        const blobUrl = URL.createObjectURL(file);
        const fileType = file.type === "application/pdf" ? "pdf" : "image";

        setStagedFile(file);
        setStagedPreviewUrl(blobUrl);
        setStagedFileType(fileType);
    };

    const cancelStaged = () => {
        if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
        setStagedFile(null);
        setStagedPreviewUrl(null);
        setStagedFileType(null);
    };

    const confirmUpload = async () => {
        if (!stagedFile) return;
        setIsUploading(true);
        try {
            await authService.uploadIdCard(stagedFile);
            cancelStaged();
            alert("ID card uploaded successfully!");
            if (onRefresh) await onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to upload ID card. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    // --- Viewing Uploaded ID ---
    const handleViewId = async () => {
        if (!user?.idCardUrl) return;
        setIsViewLoading(true);
        try {
            const response = await authService.getIdCardFile(user.idCardUrl);
            const blob = response.data;
            const blobUrl = URL.createObjectURL(blob);
            const type = blob.type === "application/pdf" ? "pdf" : "image";
            setViewPreviewUrl(blobUrl);
            setViewFileType(type);
            setIsViewerOpen(true);
        } catch (err) {
            alert("Failed to load ID card. Please try again.");
        } finally {
            setIsViewLoading(false);
        }
    };

    const closeViewer = () => {
        if (viewPreviewUrl) URL.revokeObjectURL(viewPreviewUrl);
        setViewPreviewUrl(null);
        setViewFileType(null);
        setIsViewerOpen(false);
    };

    return (
        <>
            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleFileSelect}
            />

            {/* ID Card Card */}
            <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-5">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                    <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                        <b>ID Card</b>
                    </h2>
                    {hasUploaded && (
                        <div className="flex items-center gap-1.5 text-green-400 text-sm font-general">
                            <IoCheckmarkCircle className="text-lg" />
                            <span className="hidden sm:inline">ID Card Uploaded</span>
                            <span className="sm:hidden">Uploaded</span>
                        </div>
                    )}
                </div>

                <p className="font-general text-xs text-gray-400 mb-4 uppercase tracking-wide">
                    Upload your college ID card (PDF, JPG, PNG or WebP • Max 5MB)
                </p>

                <div className="flex flex-wrap gap-3">
                    {/* Upload / Re-upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    >
                        {hasUploaded ? (
                            <>
                                <IoRefresh className="text-lg" />
                                Re-upload
                            </>
                        ) : (
                            <>
                                <IoCloudUpload className="text-lg" />
                                Upload
                            </>
                        )}
                    </button>

                    {/* View Button (only if uploaded) */}
                    {hasUploaded && (
                        <button
                            onClick={handleViewId}
                            disabled={isViewLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <IoEye className="text-lg" />
                            {isViewLoading ? "Loading..." : "View ID"}
                        </button>
                    )}
                </div>
            </div>

            {/* --- Preview / Confirm Overlay (Staged File) --- */}
            {stagedFile && typeof window !== "undefined" && ReactDOM.createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        {/* Close */}
                        <button
                            onClick={cancelStaged}
                            disabled={isUploading}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        >
                            <IoClose className="text-2xl" />
                        </button>

                        {/* Header */}
                        <div className="p-6 pb-3 border-b border-white/5">
                            <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                                <b>Preview ID Card</b>
                            </h2>
                            <p className="font-general text-xs text-gray-400 mt-1 uppercase tracking-wide">
                                Review before uploading
                            </p>
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[200px]">
                            {stagedFileType === "image" ? (
                                <img
                                    src={stagedPreviewUrl}
                                    alt="ID Card Preview"
                                    className="max-w-full max-h-[50vh] object-contain rounded-lg border border-white/10"
                                />
                            ) : (
                                <embed
                                    src={stagedPreviewUrl}
                                    type="application/pdf"
                                    className="w-full h-[50vh] rounded-lg border border-white/10"
                                />
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-white/10 p-6 pt-4 bg-black/50 backdrop-blur-md">
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelStaged}
                                    disabled={isUploading}
                                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-general text-sm uppercase tracking-wider hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmUpload}
                                    disabled={isUploading}
                                    className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white rounded-lg font-general text-sm uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                                >
                                    {isUploading ? "Uploading..." : "Confirm Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* --- View ID Modal --- */}
            {isViewerOpen && typeof window !== "undefined" && ReactDOM.createPortal(
                <div
                    className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    onClick={closeViewer}
                >
                    <div
                        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={closeViewer}
                            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        >
                            <IoClose className="text-2xl" />
                        </button>

                        {/* Header */}
                        <div className="p-6 pb-3 border-b border-white/5">
                            <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                                <b>Your ID Card</b>
                            </h2>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center min-h-[300px]">
                            {viewFileType === "image" ? (
                                <img
                                    src={viewPreviewUrl}
                                    alt="ID Card"
                                    className="max-w-full max-h-[60vh] object-contain rounded-lg"
                                />
                            ) : (
                                <embed
                                    src={viewPreviewUrl}
                                    type="application/pdf"
                                    className="w-full h-[60vh] rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
});

export default IdCardSection;
