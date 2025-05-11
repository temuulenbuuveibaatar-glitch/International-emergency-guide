import logoImage from '../assets/logo.png';

export default function RedCrossLogo() {
  return (
    <div className="h-12 w-12 flex items-center justify-center">
      <img 
        src={logoImage} 
        alt="Emergency Guide Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
