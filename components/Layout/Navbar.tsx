import { FC } from "react";

export const Navbar: FC = () => {
  return (
    <div className="h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center" style={{ backgroundColor: '#e9b5f2', backgroundSize: 'cover', display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}>
      <div className="flex items-center justify-start">
        <a href="mailto:alegarciamundi@gmail.com" style={{ marginRight: '20px' }} target="_blank" rel="noopener noreferrer">
          <img src="/gmail.png" alt="Logo" className="h-10 w-10 sm:h-10 sm:w-10" style={{ backgroundColor: 'transparent', objectFit: 'contain' }} />
        </a>
        <a href="LINK" style={{ marginRight: '20px' }} target="_blank" rel="noopener noreferrer">
          <img src="/linkedin.png" alt="Logo" className="h-10 w-10 sm:h-10 sm:w-10" style={{ backgroundColor: 'transparent', objectFit: 'contain' }} />
        </a>
      </div>
      <div className="font-bold text-3xl flex items-center justify-center">
        <a
          className="ml-2 hover:opacity-50"
          href="LINK"
          style={{ color: 'inherit', textDecoration: 'none' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          NAME
        </a>
      </div>
      <div></div>
    </div>
  );
};

