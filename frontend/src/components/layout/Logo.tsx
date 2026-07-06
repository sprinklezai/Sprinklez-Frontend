interface LogoProps {
  showSubtitle?: boolean;
}

function Logo({ showSubtitle = true }: LogoProps) {
  return (
    <div className="flex flex-col items-center mb-8">
      <img
        src="/logo.png"
        alt="Sprinklez Logo"
        className="h-20 w-auto mb-4"
      />

      <h1 className="text-3xl font-bold text-slate-800">
        Sprinklez
      </h1>

      {showSubtitle && (
        <p className="mt-2 text-center text-slate-500">
          General Trading LLC
          <br />
          F&amp;B Division
        </p>
      )}
    </div>
  );
}

export default Logo;