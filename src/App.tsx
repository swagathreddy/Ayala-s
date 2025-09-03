import React, { useState, useMemo } from 'react';
import GameScene from './components/GameScene';
import { sceneData } from './data/sceneData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const [animationKey, setAnimationKey] = useState(0);
  const [discoveredElementIds, setDiscoveredElementIds] = useState<Set<number>>(new Set());

  const totalElements = useMemo(() => {
    let count = 0;
    Object.values(sceneData).forEach(scene => {
        scene.elements.forEach(element => {
            if (!element.isTruck) {
                count++;
            }
        });
    });
    return count;
  }, []);
  
  const allElementsDiscovered = discoveredElementIds.size >= totalElements;

  const handleElementDiscovered = (elementId: number) => {
    setDiscoveredElementIds(prevIds => {
        if (prevIds.has(elementId)) return prevIds;
        const newIds = new Set(prevIds);
        newIds.add(elementId);
        return newIds;
    });
  };

  const getIsElementDiscovered = (elementId: number) => {
    return discoveredElementIds.has(elementId);
  };

  const navigateToScene = (sceneNumber: number) => {
    if (sceneNumber === currentScene) return;
    setCurrentScene(sceneNumber);
    setAnimationKey(prev => prev + 1);
  };

  const handleLeftArrow = () => {
    if (currentScene === 1) navigateToScene(3);
    else if (currentScene === 2) navigateToScene(1);
  };

  const handleRightArrow = () => {
    if (currentScene === 1) navigateToScene(2);
    else if (currentScene === 3) navigateToScene(1);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex flex-col font-sans">
      <style>{`
        @keyframes scene-transition {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scene-transition {
          animation: scene-transition 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
      <header className="bg-white shadow-md border-b-2 border-blue-300">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            🐟 Ayala's Dayout
          </h1>
          <p className="text-center text-gray-500 mt-1 text-sm md:text-base">
            Discover the journey of fish from ocean to table. Discovered: {discoveredElementIds.size}/{totalElements}
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative max-w-7xl w-full flex items-center justify-center">
          
          {/* Desktop-only Arrows */}
          {(currentScene === 1 || currentScene === 2) && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center w-48 text-center -translate-x-1/4">
                <button
                    onClick={handleLeftArrow}
                    className="bg-white hover:bg-blue-50 text-blue-600 rounded-full p-3 shadow-lg transition-transform duration-300 hover:scale-110 border-2 border-blue-200"
                    aria-label="Navigate left"
                >
                    <ChevronLeft size={32} />
                </button>
                <p className="mt-2 text-xs text-gray-600 font-semibold">
                    {currentScene === 1 
                        ? "Imagine you are standing in the middle of the landing dock..."
                        : "To middle of the landing dock"
                    }
                </p>
            </div>
          )}

          {(currentScene === 1 || currentScene === 3) && (
             <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center w-48 text-center translate-x-1/4">
                <button
                    onClick={handleRightArrow}
                    className="bg-white hover:bg-blue-50 text-blue-600 rounded-full p-3 shadow-lg transition-transform duration-300 hover:scale-110 border-2 border-blue-200"
                    aria-label="Navigate right"
                >
                    <ChevronRight size={32} />
                </button>
                 <p className="mt-2 text-xs text-gray-600 font-semibold">
                    {currentScene === 1 
                        ? "Click here to see what’s happening..."
                        : "To middle of the landing dock"
                    }
                </p>
            </div>
          )}

          <div className="w-full max-w-5xl mx-auto overflow-hidden">
            <div key={animationKey} className="animate-scene-transition">
                <GameScene 
                  sceneData={sceneData[currentScene]}
                  sceneNumber={currentScene}
                  onElementDiscovered={handleElementDiscovered}
                  allElementsDiscovered={allElementsDiscovered}
                  getIsElementDiscovered={getIsElementDiscovered}
                  onNavigate={navigateToScene}
                  handleLeftArrow={handleLeftArrow}
                  handleRightArrow={handleRightArrow}
                />
            </div>
          </div>

        </div>
      </main>

      <div className="bg-white border-t-2 border-blue-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-2 md:space-x-4">
            {[1, 2, 3].map((sceneNum) => (
              <button
                key={sceneNum}
                onClick={() => navigateToScene(sceneNum)}
                className={`px-4 py-2 text-sm md:px-6 md:py-3 rounded-full font-semibold transition-all duration-300 ${
                  currentScene === sceneNum
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                }`}
              >
                {sceneNum === 1 && '🏭 Sorting Dock'}
                {sceneNum === 2 && '🐠 Bycatch Area'}
                {sceneNum === 3 && '🚛 Fish Market'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

