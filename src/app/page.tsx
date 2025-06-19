import FallingPixelArtsGSAP from '../components/FallingPixelArtsGSAP';
import FallingItem from '../components/FallingItem';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Centered content behind falling items */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="rounded-xl shadow-lg p-10 max-w-xl text-center">
          {/* Your centered content here */}
          <h1 
            className="text-8xl font-bold mb-4 text-[#fff163]"
            style={{ fontFamily: "'Press Start 2P', cursive" }}>
              Vivian Li
          </h1>
        </div>
      </div>
      {/* Falling items (should have higher z-index via their own CSS) */}
      <FallingItem />
    </div>
  );
}
