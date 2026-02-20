"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

const PAYMENT_URL = process.env.NEXT_PUBLIC_PAYMENT_URL;

const instructions = [
    "Login / Register on the Kriya website and complete your profile with accurate details.",
    "Ensure that the phone number and email address entered on the Kriya website are the same as the ones used in the payment portal.",
    "Upload your college ID card on the profile page.",
    "Select the appropriate category carefully before proceeding to payment. No refunds will be issued for incorrect category selection.",
    "Click the 'Pay Now' button below to proceed to the payment gateway and complete the payment.",
    "After making the payment, return to this page and click the 'Check Payment Status' button to verify your payment.",
    "Once your payment is verified, proceed to register for your desired events, workshops, or paper presentations.",
    "Payment success alone does not constitute a complete registration — you must register for the respective event, workshop, or paper presentation separately after payment verification.",
];

export default function FeePaymentPage() {
    const vantaRef = useRef(null);
    const [hasReadInstructions, setHasReadInstructions] = useState(false);
    const [paymentRecords, setPaymentRecords] = useState([]);
    const [recordsSummary, setRecordsSummary] = useState({ totalRecords: 0, totalAmount: 0 });
    const [recordsLoading, setRecordsLoading] = useState(true);
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();

    // Redirect to auth if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth?type=login");
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch payment records on page load
    useEffect(() => {
        if (isAuthenticated) {
            fetchPaymentRecords();
        }
    }, [isAuthenticated]);

    // Vanta Waves Background Effect
    useEffect(() => {
        let vantaEffect = null;

        const loadVanta = async () => {
            if (typeof window !== "undefined") {
                if (!window.THREE) {
                    const threeScript = document.createElement("script");
                    threeScript.src =
                        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
                    document.head.appendChild(threeScript);
                    await new Promise((resolve) => {
                        threeScript.onload = resolve;
                    });
                }

                if (!window.VANTA || !window.VANTA.WAVES) {
                    const vantaScript = document.createElement("script");
                    vantaScript.src =
                        "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js";
                    document.head.appendChild(vantaScript);
                    await new Promise((resolve) => {
                        vantaScript.onload = resolve;
                    });
                }

                if (window.VANTA && vantaRef.current) {
                    vantaEffect = window.VANTA.WAVES({
                        el: vantaRef.current,
                        mouseControls: true,
                        touchControls: true,
                        gyroControls: false,
                        minHeight: 200.0,
                        minWidth: 200.0,
                        scale: 1.0,
                        scaleMobile: 1.0,
                        color: 0x30c15,
                        shininess: 55.0,
                        waveHeight: 0.0,
                        waveSpeed: 0.7,
                        zoom: 1.49,
                    });
                }
            }
        };

        loadVanta();
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    const fetchPaymentRecords = async () => {
        try {
            setRecordsLoading(true);
            const response = await api.get("/api/payment/records");
            const data = response.data;
            if (data.success) {
                setPaymentRecords(data.data?.records || []);
                setRecordsSummary(data.data?.summary || { totalRecords: 0, totalAmount: 0 });
            }
        } catch (error) {
            console.error("Error fetching payment records:", error);
        } finally {
            setRecordsLoading(false);
        }
    };

    const handleCheckPaymentStatus = async () => {
        try {
            setCheckingPayment(true);
            setStatusMessage(null);
            const response = await api.get("/api/payment/check");
            const data = response.data;

            if (data.success) {
                const { recordsCreated, recordsSkipped, totalRegistrations } = data.summary || {};
                if (totalRegistrations === 0) {
                    setStatusMessage({ type: "info", text: "No payment records found. If you have made a payment, please wait a few minutes and try again." });
                } else if (recordsCreated > 0) {
                    setStatusMessage({ type: "success", text: `Payment verified successfully! ${recordsCreated} new payment record(s) synced.` });
                } else {
                    setStatusMessage({ type: "info", text: "All payment records are already up to date." });
                }
                // Refresh records after check
                await fetchPaymentRecords();
            } else {
                setStatusMessage({ type: "error", text: data.message || "Payment check failed." });
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to check payment status. Please try again.";
            setStatusMessage({ type: "error", text: msg });
        } finally {
            setCheckingPayment(false);
        }
    };

    const handlePayNow = () => {
        if (PAYMENT_URL) {
            window.open(PAYMENT_URL, "_blank", "noopener,noreferrer");
        }
    };

    // Don't render if not authenticated (redirect will happen)
    if (!authLoading && !isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen w-full bg-black text-white pt-28 pb-20 px-4 md:px-8 lg:px-12 relative">
            <Navbar />
            {/* Vanta Waves Background */}
            <div
                ref={vantaRef}
                className="fixed inset-0 w-screen h-screen z-0"
            ></div>

            {/* Content */}
            <div className="max-w-3xl mx-auto relative z-10 space-y-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:-translate-x-1">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                    </svg>
                    <span className="font-general text-sm uppercase tracking-wider">Back</span>
                </button>

                {/* Page Title */}
                <div className="text-center">
                    <h1 className="special-font text-4xl md:text-5xl uppercase text-white">
                        <b>Fee Payment</b>
                    </h1>
                </div>

                {/* Instructions Card */}
                <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8">
                    <h2 className="special-font text-2xl md:text-3xl uppercase text-white mb-6">
                        <b>Instructions</b>
                    </h2>

                    <ol className="space-y-4">
                        {instructions.map((instruction, index) => (
                            <li key={index} className="flex gap-4 items-start">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-general text-xs text-blue-400 font-bold">
                                    {index + 1}
                                </span>
                                <p className="font-circular-web text-sm md:text-base text-gray-300 leading-relaxed pt-0.5">
                                    {instruction}
                                </p>
                            </li>
                        ))}
                    </ol>

                    {/* Important Note */}
                    <div className="mt-6 bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
                        <p className="font-general text-xs uppercase tracking-wider text-yellow-400 mb-1">
                            Important
                        </p>
                        <p className="font-circular-web text-sm text-yellow-200/80">
                            Successful payment does not mean successful registration.
                            You must complete the event / workshop / paper presentation
                            registration separately after your payment has been verified.
                            No refunds will be provided once the payment has been made.
                        </p>
                    </div>
                </div>

                {/* Read Instructions Checkbox */}
                <div className="flex justify-center">
                    <label className="flex items-center gap-3 cursor-pointer select-none group">
                        <input
                            type="checkbox"
                            checked={hasReadInstructions}
                            onChange={(e) => setHasReadInstructions(e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-white/30 bg-white/5 accent-blue-500 cursor-pointer"
                        />
                        <span className="font-general text-sm text-gray-300 uppercase tracking-wider group-hover:text-white transition-colors">
                            I have read all the instructions
                        </span>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    {/* Pay Now Button */}
                    <button
                        onClick={handlePayNow}
                        disabled={!hasReadInstructions}
                        className={`group relative px-10 py-4 text-white font-general text-sm uppercase tracking-widest rounded-lg transition-all duration-300 ${hasReadInstructions
                            ? "bg-blue-500 hover:bg-blue-600 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] active:scale-95 cursor-pointer"
                            : "bg-gray-600/50 cursor-not-allowed opacity-50"
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Pay Now
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className={`w-5 h-5 transition-transform ${hasReadInstructions ? "group-hover:translate-x-1" : ""}`}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                    </button>

                    {/* Check Payment Status Button */}
                    <button
                        onClick={handleCheckPaymentStatus}
                        disabled={checkingPayment}
                        className={`group relative px-10 py-4 text-white font-general text-sm uppercase tracking-widest rounded-lg transition-all duration-300 border ${checkingPayment
                            ? "border-gray-500/30 bg-gray-600/30 cursor-not-allowed opacity-60"
                            : "border-emerald-400/30 bg-emerald-500/20 hover:bg-emerald-500/40 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 cursor-pointer"
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {checkingPayment ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Checking...
                                </>
                            ) : (
                                <>
                                    Check Payment Status
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.598a.75.75 0 0 0-.75.75v3.634a.75.75 0 0 0 1.5 0v-2.033l.312.342a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.06-7.534a.75.75 0 0 0-1.5 0v2.033l-.312-.342A7 7 0 0 0 2.848 8.72a.75.75 0 0 0 1.449.39A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h3.634a.75.75 0 0 0 .75-.75V3.89Z" clipRule="evenodd" />
                                    </svg>
                                </>
                            )}
                        </span>
                    </button>
                </div>

                {/* Status Message */}
                {statusMessage && (
                    <div className={`rounded-lg p-4 border ${statusMessage.type === "success"
                        ? "bg-emerald-500/10 border-emerald-400/30"
                        : statusMessage.type === "error"
                            ? "bg-red-500/10 border-red-400/30"
                            : "bg-blue-500/10 border-blue-400/30"
                        }`}>
                        <p className={`font-circular-web text-sm ${statusMessage.type === "success"
                            ? "text-emerald-300"
                            : statusMessage.type === "error"
                                ? "text-red-300"
                                : "text-blue-300"
                            }`}>
                            {statusMessage.text}
                        </p>
                    </div>
                )}

                {/* Payment Records Section */}
                <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8">
                    <div className="flex items-end gap-4 mb-6 border-b border-white/10 pb-3">
                        <h2 className="special-font text-2xl md:text-3xl uppercase text-white">
                            <b>Payment Records</b>
                        </h2>
                        {recordsSummary.totalRecords > 0 && (
                            <span className="font-general text-xs text-gray-500 mb-1 uppercase tracking-wide">
                                {recordsSummary.totalRecords} Record{recordsSummary.totalRecords !== 1 ? "s" : ""} · ₹{recordsSummary.totalAmount}
                            </span>
                        )}
                    </div>

                    {recordsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="ml-3 font-general text-sm text-gray-400 uppercase tracking-wider">Loading records...</p>
                        </div>
                    ) : paymentRecords.length === 0 ? (
                        <div className="text-center py-10">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-600 mx-auto mb-3">
                                <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                                <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                            </svg>
                            <p className="font-circular-web text-gray-400 text-sm">No payment records found.</p>
                            <p className="font-circular-web text-gray-500 text-xs mt-1">
                                If you have made a payment, click "Check Payment Status" above to sync your records.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {paymentRecords.map((record, index) => (
                                <div
                                    key={record._id || index}
                                    className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-general text-sm text-white uppercase tracking-wide truncate">
                                            {record.category}
                                        </p>
                                        <p className="font-circular-web text-xs text-gray-400 mt-1">
                                            {record.time
                                                ? new Date(record.time).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    timeZone: "Asia/Kolkata",
                                                })
                                                : "—"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <span className="font-general text-lg text-white font-bold">
                                            ₹{record.amount}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-general uppercase tracking-wider ${record.status === "1"
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
                                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
                                            }`}>
                                            {record.status === "1" ? "Paid" : "Pending"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
