import React from "react";

const MenuToggle = ({ isOpen, setIsOpen, className }) => {
	return (
		<button
			className={`${className} lg:hidden relative z-20 flex items-center p-1 text-gray-500 lg:hover:text-gray-300`}
			onClick={() => setIsOpen(!isOpen)}
		>
			{isOpen ? (
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			) : (
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			)}
		</button>
	);
};

export default MenuToggle;