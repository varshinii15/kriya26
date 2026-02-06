"use client"
import clsx from "clsx";

const Button = ({ id, title, rightIcon, leftIcon, containerClass, titleClass }) => {
  return (
    <button
      id={id}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-blue-75 px-7 py-3 text-black flex items-center justify-center gap-2",
        containerClass
      )}
    >
      {leftIcon}

      {title && (
        <span className={clsx("relative inline-flex overflow-hidden font-general text-xs uppercase", titleClass)}>
          <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
            {title}
          </div>
          <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
            {title}
          </div>
        </span>
      )}

      {rightIcon}
    </button>
  );
};

export default Button;