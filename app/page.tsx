import { Shrikhand } from "next/font/google";
import Menu from '@/app/components/Menu';
import Grid from "@/app/components/Grid";

const shrikhand = Shrikhand({
  subsets: ["latin"],
  weight: "400",
});

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4">
        <h1 className={`${shrikhand.className} text-3xl md:text-4xl text-[#66ff33] text-center`}>
          {"Conway's Game of Life"}
        </h1>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-between p-4 gap-4 overflow-hidden">
        {/* Grid container with constrained maximum size */}
        <div className="w-full flex-1 flex items-center justify-center overflow-auto">
          <Grid />
        </div>
        
        {/* Menu container with constrained width */}
        <div className="w-full max-w-md">
          <Menu />
        </div>
      </main>
    </div>
  );
}

export default Home;