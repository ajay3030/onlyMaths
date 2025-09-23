// In GameContainer.jsx - REMOVE or FIX progress bar
import React from 'react';
import { useGame } from '../../../context/GameContext';

// In GameContainer.jsx - Simpler progress display
// const GameContainer = ({ children }) => {
//   const { progress, streak, gameTemplate } = useGame();

//   console.log('🎮 GameContainer progress:', progress);

//   return (
//     <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//       {/* Progress Header */}
//       <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
//         <div className="flex items-center justify-between text-white">
//           <div className="flex items-center space-x-4">
//             <span className="text-lg font-semibold">
//               Question {progress.current || 1} of {progress.total || 10}
//             </span>
//             {streak > 1 && (
//               <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
//                 🔥 {streak} streak!
//               </div>
//             )}
//           </div>
//           <div className="text-sm opacity-90">
//             {progress.percentage || 0}% Complete
//           </div>
//         </div>
        
//         {/* Progress bar - only show if we have valid data */}
//         {progress.total > 0 && (
//           <div className="mt-3 w-full bg-white bg-opacity-20 rounded-full h-2">
//             <div 
//               className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
//               style={{ width: `${Math.min(progress.percentage || 0, 100)}%` }}
//             />
//           </div>
//         )}
//       </div>

//       {/* Game Content */}
//       <div className="p-8">
//         {children}
//       </div>
//     </div>
//   );
// };

// In GameContainer.jsx - More compact design
const GameContainer = ({ children }) => {
  const { progress, streak, gameTemplate } = useGame();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* More compact progress header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3"> {/* Reduced padding */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3"> {/* Reduced spacing */}
            <span className="text-base font-semibold"> {/* Reduced size */}
              Question {progress.current || 1} of {progress.total || 10}
            </span>
            {streak > 1 && (
              <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold"> {/* Reduced size */}
                🔥 {streak} streak!
              </div>
            )}
          </div>
          <div className="text-xs opacity-90"> {/* Reduced size */}
            {progress.percentage || 0}% Complete
          </div>
        </div>
        
        {progress.total > 0 && (
          <div className="mt-2 w-full bg-white bg-opacity-20 rounded-full h-1.5"> {/* Reduced height */}
            <div 
              className="bg-white h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress.percentage || 0, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Game Content - Reduced padding */}
      <div className="p-6"> {/* Reduced from p-8 to p-6 */}
        {children}
      </div>
    </div>
  );
};



export default GameContainer;
