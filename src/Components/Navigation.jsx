const Navigation = () => {
  return (
    <nav className="fixed w-full border-red-500 z-30 border h-16 bg-lightbg flex justify-around items-center px-10">
      <div className="text-lg font-poppins font-semibold text-darkblue">
        Di'arva
      </div>
      <ul className="flex text-darkblack gap-12 font-poppins font-medium text-md">
        <li className="text-darkblue border-b-2 border-darkblue hover:cursor-pointer font-semibold">
          Home
        </li>
        <li className="hover:cursor-pointer">AboutUs</li>
        <li className="hover:cursor-pointer">CotactUs</li>
        <li className="hover:cursor-pointer">Features</li>
      </ul>
      <div className="flex  gap-8">
        <button class="bg-white text-sm  font-poppins text-darkblue border border-darkblue px-12 py-3 font-semibold rounded-full  hover:cursor-pointer">
          Login
        </button>
        <button class="bg-darkblue text-lightbg px-8 py-3 rounded-full font-semibold hover:cursor-pointer">
          Talk to us
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
