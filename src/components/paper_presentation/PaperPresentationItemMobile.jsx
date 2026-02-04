import Link from "next/link";
import Image from "next/image";

const PaperPresentationItemMobile = ({ data }) => {
  return (
    <Link
      href={`/portal/paper/${data.ppid}`}
      className="w-64 h-[90%] relative flex items-end rounded-lg p-4"
    >
      <div className="w-full  h-full absolute top-0 left-0 z-20 bg-[linear-gradient(to_top,_#202020_1%,_rgba(255,255,255,0)_50%)] bg-center bg-no-repeat bg-cover" />
      <div className="absolute top-0 left-0 z-10 w-full h-full rounded-lg overflow-hiddenc">
        <Image
          src={data.image}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          alt={data.eventName || "Paper Presentation"}
        />
      </div>
      <p className="relative  z-30 text-2xl font-semibold text-gray-100 font-poppins">
        {data.eventName}
      </p>
    </Link>
  );
};

export default PaperPresentationItemMobile;
