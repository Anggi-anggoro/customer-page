'use client'
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import React, { useState } from 'react';
import { EnvVarWarning } from './env-var-warning';
import HeaderAuth from './header-auth';

const Navbar = () => {
    const [hideMenu, setHideMenu] = useState(true)
    return (
        <nav className="w-full flex justify-center max-md:border-b max-md:border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex md:flex-col justify-between items-center p-3 px-5 text-sm md:absolute md:items-start left-0">    
            <button onClick={()=> setHideMenu(!hideMenu)} className="w-8 max-md:hidden mb-20 absolute top-0 z-10"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg></button>      
          <div className={`md:flex flex-col items-center md:bg-slate-200 border-black border rounded-md md:p-9 md:h-[90vh] md:z-10  ${hideMenu ? 'hidden' : 'flex'}`}>                  
            <div className={`flex gap-5 items-center justify-between font-semibold md:flex-col md:h-96 md:justify-between`}>
              <Link href={"/"}>HOME</Link>
              <Link href='/customer'>Add Customer</Link>
              <Link href='/customer/list'>List Customer</Link>                       
            </div>
          </div>
        </div>
      </nav>
    );
};

export default Navbar;