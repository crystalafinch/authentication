import { useAuth } from '@/context/AuthContext';
import { Blocks, LogOut, BookOpenText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function Navbar() {
  const auth = useAuth();
  const location = useLocation();
  return (
    <TooltipProvider>
      <nav className="w-20 bg-slate-50 border-r border-slate-100 h-screen p-3 flex flex-col items-center gap-1 fixed pt-5">
        <div className="w-10 h-10 mb-4 rounded-full bg-white flex items-center justify-center text-sm font-semibold text-slate-700 border border-slate-200">
          CF
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/research"
              className={`p-2 rounded-sm border border-transparent hover:border-violet-200 ${
                location.pathname === '/research'
                  ? 'bg-violet-200 text-violet-800'
                  : ''
              }`}
            >
              <BookOpenText size={16} />
              <span className="sr-only">Research</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Research</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/build"
              className={`p-2 rounded-sm border border-transparent hover:border-violet-200 ${
                location.pathname === '/build'
                  ? 'bg-violet-200 text-violet-800'
                  : ''
              }`}
            >
              <Blocks size={16} />
              <span className="sr-only">Build</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Build</p>
          </TooltipContent>
        </Tooltip>

        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2 rounded-sm border border-transparent hover:border-violet-200"
                aria-label="Sign Out"
                onClick={auth?.signOut}
              >
                <LogOut size={16} />
                <span className="sr-only">Sign Out</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
}

export default Navbar;
