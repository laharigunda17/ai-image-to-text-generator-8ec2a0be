export const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating orbs */}
      <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" 
           style={{ animation: 'float 8s ease-in-out infinite, pulse-glow 4s ease-in-out infinite' }} />
      <div className="absolute top-40 right-[15%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" 
           style={{ animation: 'float 10s ease-in-out infinite 2s, pulse-glow 5s ease-in-out infinite 1s' }} />
      <div className="absolute bottom-20 left-[20%] w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" 
           style={{ animation: 'float 12s ease-in-out infinite 4s, pulse-glow 6s ease-in-out infinite 2s' }} />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
    </div>
  );
};
