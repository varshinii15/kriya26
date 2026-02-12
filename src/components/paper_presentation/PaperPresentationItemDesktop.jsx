import Link from "next/link";
import Image from "next/image";

const PaperPresentationItemDesktop = ({
  index,
  onMouseHoverIndex,
  setOnMouseHoverIndex,
  data,
}) => {
  const isHovered = onMouseHoverIndex === index;

  return (
    <Link
      href={`/portal/paper/${data.ppid}`}
      onMouseEnter={() => setOnMouseHoverIndex(index)}
      onMouseLeave={() => setOnMouseHoverIndex(0)}
      className={`text-left rounded-xl shadow-lg ${isHovered ? "h-[90%] w-2/6" : "h-[85%] w-1/6"
        } transition-all duration-300 relative overflow-hidden group
        border-2 border-white
        hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
    >
      {/* Gradient overlay - black and white theme */}
      <div className={`w-full h-full absolute top-0 left-0 z-20 
        bg-gradient-to-t from-black via-black/40 to-transparent
        transition-all duration-300 ${isHovered ? 'from-black/90' : 'from-black/80'}`}
      />

      {/* Image */}
      <div className="absolute top-0 left-0 z-10 w-full h-full rounded-xl overflow-hidden bg-gray-900">
        {data.image && data.image.trim() !== "" ? (
          <Image
            src={data.image}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            alt={data.eventName || "Paper Presentation"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-white/30 text-4xl">📄</div>
          </div>
        )}
      </div>

      {/* Title */}
      <p
        className={`font-semibold font-poppins absolute w-full origin-top-left transition-all duration-300 z-30 ${isHovered
          ? `rotate-0 ${data.eventName.length > 60
            ? "text-sm"
            : data.eventName.length > 30
              ? "text-lg"
              : "text-xl"
          } text-white bottom-0 left-0 translate-x-6 -translate-y-6 lg:-translate-y-10`
          : `-rotate-90 whitespace-nowrap ${data.eventName.length > 50
            ? "text-xs md:text-2xs"
            : data.eventName.length > 30
              ? "text-sm"
              : "text-2xl"
          } text-white/60 bottom-0 right-2 lg:right-4 translate-x-[calc(35vw/6)]`
          } uppercase drop-shadow-lg`}
      >
        {data.eventName}
      </p>

      {/* Explore indicator on hover */}
      <div className={`absolute bottom-4 right-4 z-30 px-3 py-1.5 
        bg-transparent border border-white/50 rounded-lg text-white text-sm font-medium
        transition-all duration-300 hover:bg-white hover:text-black
        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        Explore →
      </div>
    </Link>
  );
};

export default PaperPresentationItemDesktop;
