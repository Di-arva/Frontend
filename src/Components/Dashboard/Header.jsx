import {
  Bell,
  ChevronDown,
  Filter,
  Menu,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import Button from "../Button";

const Header = () => {
  return (
    <div className="bg-lightbg backdrop-blur-xl border-b border-lightbg px-6 py-4 ">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg text-darkblack hover:cursor-pointer bg-lightblue hover:bg-lightblue/60 transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className="font-poppins text-2xl font-medium text-darkblack">
              Dashboard
            </h1>
            <p className="text-sm font-poppins font-normal">
              Welcome back,
              <span className="text-darkblue mx-1">Navjot Bassi.</span>
              Here's what's happening today
            </p>
          </div>
        </div>

        {/* Center part */}

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-darkblue" />
            <input
              type="text"
              placeholder="Search Anything"
              className="w-full pl-10 pr-4 py-2.5 bg-lightblue border-lightblue/50 rounded-xl text-darkblack font-poppins text-sm placeholder:text-darkblue focus:outline-none focus:ring-2 focus:ring-darkblue focus:border-transparent transition-all"
            />

            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-darkblue hover:text-darkblue/80 hover:cursor-pointer">
              <Filter />
            </button>
          </div>
        </div>

        {/* Right */}

        <div className="flex items-center space-x-3">
          {/* Quick Action */}
          <Button
            variant="dark"
            size="md"
            className="hidden text-lightbg font-poppins lg:flex items-center"
          >
            <Plus className="w-4 h-4 mr-1 text-lightbg" />
            <span className="text-sm font-medium">New</span>
          </Button>

          {/* Notification */}

          <button className="relative p-2.5 rounded-xl text-darkblue bg-lightblue hover:bg-lightblue/70 transition-colors hover:cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 w-5 h-5 bg-darkblue text-lightbg text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className=" p-2.5 rounded-xl text-darkblue bg-lightblue hover:bg-lightblue/70 transition-colors hover:cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}

          <div className="flex items-center space-x-3 pl-3 border-l border-lightblue">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
              alt="user profile"
              className="w-9 h-9 rounded-full ring-2 ring-darkblue object-cover shrink-0"
            />
            <div className="hidden md:block">
              <p className="text-sm font-poppins text-darkblue font-medium">
                Navjot Bassi
              </p>
              <p className="text-xs font-medium text-darkblack font-poppins">
                Administrator
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-darkblue" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
