import React from 'react';
import {Link} from 'react-router-dom';
import {Receipt} from 'lucide-react';

function Header() {
  return (
    <div>
       <nav className="bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-yellow-400" />
            <span className="font-bold text-xl">MatTaxPro</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Header
