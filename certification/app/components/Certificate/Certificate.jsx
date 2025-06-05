import React, { forwardRef } from "react";

const Certificate = forwardRef((props, ref) => {
  const { 
    name = "0xprabal", 
    description, 
    signature = "Mrityunjaya Prajapati", 
    role = "CTO & CEO ",
    hash,
    logoSrc = "/KalpStudio.svg",
    date = new Date().toLocaleDateString()
  } = props;

  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto relative bg-white p-8 shadow-lg">
      {/* Top Corner Design */}
      <div className="absolute top-0 right-0 w-48 h-48">
        <div className="absolute top-0 right-0 w-full h-full">
          <div className="absolute top-0 right-0 w-full h-full bg-emerald-800 rounded-bl-full" />
          <div className="absolute top-2 right-2 w-full h-full bg-yellow-400 rounded-bl-full opacity-80" />
          <div className="absolute top-4 right-4 w-full h-full bg-emerald-800 rounded-bl-full" />
        </div>
      </div>

      {/* Certificate Content */}
      <div className="relative z-10 pt-8">
        {/* Header with Seal */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full" />
            <div className="absolute inset-2 bg-emerald-800 rounded-full">
              <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-8 bg-emerald-800" />
          </div>
          <div>
            <h1 className="text-5xl font-serif text-emerald-800">CERTIFICATE</h1>
            <p className="text-2xl text-emerald-800 mt-1">OF APPRECIATION</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-8">
          <p className="text-gray-700 text-xl">This certificate is proudly presented to:</p>
          
          <div className="py-4">
            <h2 className="text-4xl font-script text-emerald-800">{name}</h2>
            <div className="w-2/3 h-px bg-yellow-400 mx-auto mt-2" />
          </div>

          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description || "In recognition of your outstanding achievements and unwavering dedication. Your exceptional performance and commitment have significantly contributed to our success, and we honor your contributions with this award."}
          </p>

          {/* Date Section */}
          <div className="pt-4">
            <p className="text-gray-700">Awarded on</p>
            <p className="text-emerald-800 font-medium mt-1">{date}</p>
            <div className="w-48 h-px bg-yellow-400 mx-auto mt-2" />
          </div>

          {/* Signature Section */}
          <div className="pt-8 pb-8">
            <div className="inline-block">
              <p className="font-script text-3xl text-emerald-800">{signature}</p>
              <div className="w-full h-px bg-gray-400 mt-2" />
              <p className="text-gray-600 mt-1">{role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Corner Designs */}
      <div className="absolute bottom-0 left-0 w-32 h-32">
        <div className="absolute bottom-0 left-0 w-full h-full">
          <div className="absolute bottom-0 left-0 w-full h-full bg-yellow-400 rounded-tr-full opacity-80 transform -scale-x-100" />
        </div>
      </div>

      {/* Footer Section with ID and Logo */}
      <div className="absolute bottom-8 w-full left-0 px-8 flex justify-between items-end">
        {/* Unique Identifier */}
        <div className="text-sm text-gray-600">
          {hash && <p>ID: {hash}</p>}
        </div>

        {/* Logo */}
        <div className="h-16 w-24">
          <img
            src={logoSrc}
            alt="Certificate Logo"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
});

Certificate.displayName = "Certificate";

export default Certificate;