'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { TiLocationArrow } from "react-icons/ti";
import Button from '@/components/Button';
import colleges from '@/app/CollegeList';

// PSG Colleges that require specific email domains
const PSG_COLLEGES = {
    'PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004': '@psgtech.ac.in',
    'PSG Institute of Technology and Applied Research, Avinashi Road, Neelambur, Coimbatore 641062': '@psgitech.ac.in'
};

export default function RegisterComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const source = searchParams.get('source');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        college: '',
        department: '',
        year: '',
        referral: '',
        accomodation: false,
        discoveryMethod: '',
        source: source || 'email',
        googleId: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEmailOverlay, setShowEmailOverlay] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showInstructionsOverlay, setShowInstructionsOverlay] = useState(false);
    const [instructionsAgreed, setInstructionsAgreed] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('registration_email');
        const storedGoogleId = localStorage.getItem('registration_googleId');
        const storedReferralCode = localStorage.getItem('club_referral_code');

        if (!storedEmail) {
            router.push('/auth?type=register');
            return;
        }

        setFormData(prev => ({
            ...prev,
            email: storedEmail || '',
            googleId: storedGoogleId || '',
            source: source || 'email',
            referral: storedReferralCode || prev.referral
        }));
    }, [source, router]);

    // Check if email is from a PSG college
    const isPSGEmail = () => {
        const emailLower = formData.email.toLowerCase();
        return Object.values(PSG_COLLEGES).some(domain => emailLower.endsWith(domain));
    };

    // Auto-select college based on email domain
    useEffect(() => {
        if (!formData.email) return;

        const emailLower = formData.email.toLowerCase();

        for (const [collegeName, emailDomain] of Object.entries(PSG_COLLEGES)) {
            if (emailLower.endsWith(emailDomain)) {
                setFormData(prev => ({
                    ...prev,
                    college: collegeName
                }));
                break;
            }
        }
    }, [formData.email]);

    // Check if the selected college is a PSG college and validate email domain
    const validatePSGEmail = () => {
        const selectedCollege = formData.college;
        const email = formData.email.toLowerCase();

        if (PSG_COLLEGES[selectedCollege]) {
            const requiredDomain = PSG_COLLEGES[selectedCollege];
            return email.endsWith(requiredDomain);
        }
        return true;
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (e.target.name === 'college') {
            setShowEmailOverlay(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validatePSGEmail()) {
            setShowEmailOverlay(true);
            return;
        }

        if (formData.source === 'email' && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setShowInstructionsOverlay(true);
    };

    const finalizeRegistration = async () => {
        setLoading(true);

        try {
            const storedReferralCode = localStorage.getItem('club_referral_code');

            const registrationData = {
                email: formData.email,
                name: formData.name,
                phone: formData.phone,
                college: formData.college,
                department: formData.department,
                year: parseInt(formData.year),
                referral: formData.referral || storedReferralCode || '',
                accomodation: formData.accomodation,
                discoveryMethod: formData.discoveryMethod,
                source: formData.source
            };

            if (formData.source === 'email') {
                registrationData.password = formData.password;
            } else if (formData.source === 'google') {
                registrationData.googleId = formData.googleId;
            }

            await authService.register(registrationData);

            localStorage.removeItem('registration_email');
            localStorage.removeItem('registration_googleId');
            localStorage.removeItem('club_referral_code');

            // Redirect to callback URL if present, otherwise to profile
            const callbackUrl = searchParams.get('callbackUrl');
            router.push(callbackUrl || '/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl relative z-10 bg-black/85 border border-white/10 shadow-2xl rounded-none p-8 my-8">
            <div className="mb-4 text-center">
                <h1 className="text-xl font-zentry font-thin text-white mb-1 uppercase tracking-wider">
                    Complete Reg<b>i</b>strat<b>i</b>on
                </h1>
                <p className="text-gray-400 text-[10px] font-general tracking-[0.2em] uppercase">
                    {formData.source === 'google' ? 'COLLECTING_AUTH_DATA' : 'CREATE_NEW_ACCOUNT'}
                </p>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Information Section */}
                <div>
                    <h3 className="text-sm font-zentry font-thin text-white mb-4 uppercase tracking-widest border-l-4 border-blue-400 pl-4">
                        Acco<b>u</b>nt
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                className="w-full h-12 px-4 py-3 bg-white/5 border border-white/10 text-white/30 cursor-not-allowed rounded-none outline-none font-general"
                            />
                        </div>

                        {formData.source === 'email' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="password" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                            className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors font-general"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-white/40 hover:text-white font-general"
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                            className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors font-general"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-white/40 hover:text-white font-general"
                                        >
                                            {showConfirmPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className="pt-2">
                    <h3 className="text-sm font-zentry font-thin text-white mb-4 uppercase tracking-widest border-l-4 border-blue-400 pl-4">
                        Pers<b>o</b>nal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Required"
                                required
                                className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors font-general placeholder:text-[10px]"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="10 Digits"
                                required
                                pattern="[0-9]{10}"
                                className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors font-general placeholder:text-[10px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Information Section */}
                <div className="pt-2">
                    <h3 className="text-sm font-zentry font-thin text-white mb-4 uppercase tracking-widest border-l-4 border-blue-400 pl-4">
                        Academ<b>i</b>c
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="college" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                College / Institute
                            </label>
                            <select
                                id="college"
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                required
                                disabled={isPSGEmail()}
                                className={`w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors appearance-none font-general text-[10px] ${isPSGEmail() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="" className="bg-black text-[10px]">Select institution...</option>
                                {colleges.map((college, index) => (
                                    <option key={index} value={college} className="bg-black">
                                        {college}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="department" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    list="department-options"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Enter Dept"
                                    required
                                    autoComplete="off"
                                    className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors font-general placeholder:text-[10px]"
                                />
                                <datalist id="department-options">
                                    <option value="Automobile Engineering" />
                                    <option value="Biomedical Engineering" />
                                    <option value="Civil Engineering" />
                                    <option value="Computer Science and Engineering" />
                                    <option value="Electrical and Electronics Engineering" />
                                    <option value="Electronics and Communication Engineering" />
                                    <option value="Instrumentation and Control Engineering" />
                                    <option value="Mechanical Engineering" />
                                    <option value="Production Engineering" />
                                </datalist>
                            </div>

                            <div>
                                <label htmlFor="year" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                    Year of Study
                                </label>
                                <select
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors appearance-none font-general text-[10px]"
                                >
                                    <option value="" className="bg-black text-gray-500 text-[10px]">Select Year</option>
                                    <option value="1" className="bg-black">Year 1</option>
                                    <option value="2" className="bg-black">Year 2</option>
                                    <option value="3" className="bg-black">Year 3</option>
                                    <option value="4" className="bg-black">Year 4</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referral & Discovery Section */}
                <div className="mb-8">
                    <h2 className="text-sm font-zentry font-thin text-white/60 mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
                        Optional Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="referral" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                Referral Code
                            </label>
                            <input
                                type="text"
                                id="referral"
                                name="referral"
                                value={formData.referral}
                                onChange={handleChange}
                                placeholder="Enter referral code (if any)"
                                className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors font-general placeholder:text-[10px]"
                            />
                        </div>
                        <div>
                            <label htmlFor="discoveryMethod" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                How did you hear about us?
                            </label>
                            <select
                                id="discoveryMethod"
                                name="discoveryMethod"
                                value={formData.discoveryMethod}
                                onChange={handleChange}
                                className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors appearance-none font-general text-[10px]"
                            >
                                <option value="" className="bg-black text-gray-500 text-[10px]">Select an option</option>
                                <option value="social_media" className="bg-black">Social Media</option>
                                <option value="friends" className="bg-black">Friends/Family</option>
                                <option value="college" className="bg-black">College Notice</option>
                                <option value="website" className="bg-black">Website Search</option>
                                <option value="previous_participant" className="bg-black">Previous Participant</option>
                                <option value="other" className="bg-black">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => router.push('/auth?type=login')}
                        className="w-full sm:w-auto px-10 py-3 border border-white/20 text-white uppercase tracking-widest hover:bg-white/10 transition-colors rounded-full font-zentry text-xs"
                    >
                        Cancel
                    </button>
                    <Button
                        title={loading ? 'Processing...' : 'Accept & Proceed'}
                        type="submit"
                        disabled={loading}
                        containerClass="bg-blue-400 flex-center gap-2 !px-6 !py-2 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:flex-1"
                        titleClass="font-semibold !text-xs"
                        leftIcon={<TiLocationArrow className="w-4 h-4 group-hover:animate-bounce" />}
                    />
                </div>
            </form>

            {showEmailOverlay && (
                <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 font-general">
                    <div className="max-w-md w-full bg-black border border-white/20 shadow-2xl rounded-none">
                        <div className="p-10 pb-6">
                            <div className="flex justify-center mb-8">
                                <div className="w-20 h-20 border-2 border-red-500 flex items-center justify-center text-red-500 font-bold text-4xl font-zentry">!</div>
                            </div>
                            <h2 className="text-lg font-zentry font-thin text-center text-white mb-4 uppercase tracking-widest">
                                Em<b>a</b>il Req<b>u</b>ired
                            </h2>
                            <p className="text-gray-400 text-center mb-4 text-sm font-general leading-relaxed">
                                To register as a student of <strong className="text-white">{formData.college}</strong>,
                                please use your official college email address ending with:
                            </p>
                            <p className="bg-white/5 border border-white/10 p-4 text-blue-400 font-mono text-center font-bold mb-10">
                                {PSG_COLLEGES[formData.college]}
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    className="w-full py-4 bg-blue-400 text-black font-bold uppercase tracking-widest hover:bg-white transition-all transform hover:scale-[1.02] rounded-none font-zentry text-sm"
                                    onClick={() => {
                                        localStorage.removeItem('registration_email');
                                        localStorage.removeItem('registration_googleId');
                                        router.push('/auth?type=register');
                                    }}
                                >
                                    RE-REGISTER WITH COLLEGE EMAIL
                                </button>
                                <button
                                    className="w-full py-4 border border-white/20 text-white uppercase tracking-widest hover:bg-white/10 transition-colors rounded-none font-zentry text-sm"
                                    onClick={() => setShowEmailOverlay(false)}
                                >
                                    GO BACK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showInstructionsOverlay && (
                <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 font-general">
                    <div className="max-w-2xl w-full bg-black border border-white/20 shadow-2xl rounded-none">
                        <div className="p-10">
                            <div className="mb-8 border-b border-white/10 pb-4">
                                <h2 className="text-xl font-zentry font-thin text-white uppercase tracking-widest">
                                    Instr<b>u</b>cti<b>o</b>ns
                                </h2>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-8 mb-10 h-72 overflow-y-auto custom-scrollbar">
                                <ul className="space-y-6 text-gray-300 text-sm font-general">
                                    <li className="flex gap-6 items-start">
                                        <span className="text-blue-400 font-zentry text-lg">01/</span>
                                        <span className="leading-relaxed">Bring a <strong className="text-white">Bonafide Certificate</strong> from your respective college for verification.</span>
                                    </li>
                                    <li className="flex gap-6 items-start">
                                        <span className="text-blue-400 font-zentry text-lg">02/</span>
                                        <span className="leading-relaxed">Upload your <strong className="text-white">College ID card</strong> on the portal and carry the same during the event.</span>
                                    </li>
                                    <li className="flex gap-6 items-start">
                                        <span className="text-blue-400 font-zentry text-lg">04/</span>
                                        <span className="leading-relaxed">Payment of  ₹250 <strong className="text-white">DOES NOT</strong> guarantee entry to any event or paper presentation. Users should register in the pages of the respective events and paper presentations.</span>
                                    </li>
                                    <li className="flex gap-6 items-start">
                                        <span className="text-blue-400 font-zentry text-lg">04/</span>
                                        <span className="leading-relaxed">By paying <strong className="text-white">₹250</strong>, a participant can attend any number of events and paper presentations.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mb-10">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={instructionsAgreed}
                                            onChange={(e) => setInstructionsAgreed(e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-6 h-6 border border-white/20 flex items-center justify-center transition-all ${instructionsAgreed ? 'bg-blue-400 border-blue-400' : 'group-hover:border-white'}`}>
                                            {instructionsAgreed && (
                                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors font-general">
                                        I confirm that I have read and understood all the instructions
                                    </span>
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    title={loading ? 'Processing...' : 'Accept & Proceed'}
                                    onClick={() => {
                                        if (instructionsAgreed) {
                                            finalizeRegistration();
                                        } else {
                                            alert('Please agree to the instructions to proceed.');
                                        }
                                    }}
                                    disabled={!instructionsAgreed || loading}
                                    containerClass="bg-blue-400 flex-center gap-2 !px-6 !py-2 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 flex-1"
                                    titleClass="font-semibold !text-xs"
                                    leftIcon={<TiLocationArrow className="w-4 h-4 group-hover:animate-bounce" />}
                                />
                                <button
                                    className="px-10 py-3 border border-white/20 text-white uppercase tracking-widest hover:bg-white/10 transition-colors rounded-full font-zentry text-xs"
                                    onClick={() => setShowInstructionsOverlay(false)}
                                    disabled={loading}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
