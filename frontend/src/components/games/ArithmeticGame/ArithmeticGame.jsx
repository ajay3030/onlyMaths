// src/components/games/ArithmeticGame/ArithmeticGame.jsx
import React from 'react';
import { useGame } from '../../../context/GameContext';
import ArithmeticQuestion from './ArithmeticQuestion';
import ArithmeticInput from './ArithmeticInput';

// const ArithmeticGame = () => {
//   const { 
//     currentQuestion, 
//     gameState, 
//     submitAnswer,
//     answers,
//     gameTemplate
//   } = useGame();

//   // Show loading if no question available
//   if (!currentQuestion) {
//     return (
//       <div className="text-center py-12">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
//         <p className="text-gray-600">Loading question...</p>
//       </div>
//     );
//   }

//   // Get the last answer result for feedback
//   const lastAnswer = answers[answers.length - 1];
//   const showingFeedback = lastAnswer && Date.now() - new Date(lastAnswer.timestamp || 0).getTime() < 1500;

//   return (
//     <div className="space-y-8">
//       {/* Question Display */}
//       <ArithmeticQuestion 
//         question={currentQuestion}
//         showFeedback={showingFeedback}
//         lastAnswer={lastAnswer}
//       />
      
//       {/* Input Section */}
//       <ArithmeticInput 
//         onSubmit={submitAnswer}
//         disabled={gameState !== 'playing' || showingFeedback}
//         questionType={gameTemplate?.config?.multipleChoice ? 'multiple-choice' : 'input'}
//         options={currentQuestion.options}
//       />
//     </div>
//   );
// };


// In ArithmeticGame.jsx - Add debug logging
// const ArithmeticGame = () => {
//   const { 
//     currentQuestion, 
//     gameState, 
//     submitAnswer,
//     answers,
//     gameTemplate
//   } = useGame();

//   // Get the last answer result for feedback
//   const lastAnswer = answers[answers.length - 1];
//   const showingFeedback = lastAnswer && Date.now() - new Date(lastAnswer.timestamp || 0).getTime() < 1500;

//   console.log('🎯 ArithmeticGame render:', {
//     currentQuestion: currentQuestion?.questionText,
//     gameState,
//     showingFeedback,
//     lastAnswerTime: lastAnswer?.timestamp
//   });

//   // Show loading if no question available
//   if (!currentQuestion) {
//     return (
//       <div className="text-center py-12">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
//         <p className="text-gray-600">Loading question...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Question Display */}
//       <ArithmeticQuestion 
//         question={currentQuestion}
//         showFeedback={showingFeedback}
//         lastAnswer={lastAnswer}
//       />
      
//       {/* Input Section */}
//       <ArithmeticInput 
//         onSubmit={submitAnswer}
//         disabled={gameState !== 'playing' || showingFeedback} // Check this condition
//         questionType={gameTemplate?.config?.multipleChoice ? 'multiple-choice' : 'input'}
//         options={currentQuestion.options}
//       />
      
//       {/* DEBUG INFO */}
//       <div className="text-center text-xs text-gray-400">
//         Input disabled: {String(gameState !== 'playing' || showingFeedback)} | 
//         Game state: {String(gameState)} | 
//         Showing feedback: {String(showingFeedback)}
//       </div>
//     </div>
//   );
// };

// In ArithmeticGame.jsx - FIX the disabled prop
// const ArithmeticGame = () => {
//   const { 
//     currentQuestion, 
//     gameState, 
//     submitAnswer,
//     answers,
//     gameTemplate
//   } = useGame();

//   const lastAnswer = answers[answers.length - 1];
//   const showingFeedback = lastAnswer && Date.now() - new Date(lastAnswer.timestamp || 0).getTime() < 1500;
  
//   // FIXED: Ensure disabled is always a boolean
//   const isInputDisabled = gameState !== 'playing' || showingFeedback || false;

//   console.log('🎯 ArithmeticGame render:', {
//     currentQuestion: currentQuestion?.questionText,
//     gameState,
//     isInputDisabled,
//     showingFeedback
//   });

//   if (!currentQuestion) {
//     return (
//       <div className="text-center py-12">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
//         <p className="text-gray-600">Loading question...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <ArithmeticQuestion 
//         question={currentQuestion}
//         showFeedback={showingFeedback}
//         lastAnswer={lastAnswer}
//       />
      
//       <ArithmeticInput 
//         onSubmit={submitAnswer}
//         disabled={isInputDisabled} // Always boolean now
//         questionType={gameTemplate?.config?.multipleChoice ? 'multiple-choice' : 'input'}
//         options={currentQuestion.options || []} // Always provide array
//       />
//     </div>
//   );
// };

// In ArithmeticGame.jsx - Pass currentQuestion prop
// const ArithmeticGame = () => {
//   const { 
//     currentQuestion, 
//     gameState, 
//     submitAnswer,
//     answers,
//     gameTemplate
//   } = useGame();

//   const lastAnswer = answers[answers.length - 1];
//   const showingFeedback = lastAnswer && Date.now() - new Date(lastAnswer.timestamp || 0).getTime() < 1500;
//   const isInputDisabled = gameState !== 'playing' || showingFeedback || false;

//   if (!currentQuestion) {
//     return (
//       <div className="text-center py-12">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
//         <p className="text-gray-600">Loading question...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <ArithmeticQuestion 
//         question={currentQuestion}
//         showFeedback={showingFeedback}
//         lastAnswer={lastAnswer}
//       />
      
//       <ArithmeticInput 
//         currentQuestion={currentQuestion} // ADD this prop
//         onSubmit={submitAnswer}
//         disabled={isInputDisabled}
//         questionType={gameTemplate?.config?.multipleChoice ? 'multiple-choice' : 'input'}
//         options={currentQuestion.options || []}
//       />
//     </div>
//   );
// };

// In ArithmeticGame.jsx - Pass currentQuestion prop
// const ArithmeticGame = () => {
//   const { 
//     currentQuestion, 
//     gameState, 
//     submitAnswer,
//     answers,
//     gameTemplate
//   } = useGame();

//   const lastAnswer = answers[answers.length - 1];
//   const showingFeedback = lastAnswer && Date.now() - new Date(lastAnswer.timestamp || 0).getTime() < 1500;
//   const isInputDisabled = gameState !== 'playing' || showingFeedback || false;

//   if (!currentQuestion) {
//     return (
//       <div className="text-center py-12">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
//         <p className="text-gray-600">Loading question...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <ArithmeticQuestion 
//         question={currentQuestion}
//         showFeedback={showingFeedback}
//         lastAnswer={lastAnswer}
//       />
      
//       <ArithmeticInput 
//         currentQuestion={currentQuestion} // ADD this prop
//         onSubmit={submitAnswer}
//         disabled={isInputDisabled}
//         questionType={gameTemplate?.config?.multipleChoice ? 'multiple-choice' : 'input'}
//         options={currentQuestion.options || []}
//       />
//     </div>
//   );
// };

// In ArithmeticGame.jsx - Add question validation
const ArithmeticGame = () => {
  const { 
    currentQuestion, 
    gameState, 
    submitAnswer,
    answers,
    gameTemplate
  } = useGame();

  const lastAnswer = answers[answers.length - 1];
  const showingFeedback = lastAnswer && Date.now() - new Date(lastAnswer.timestamp || 0).getTime() < 1500;
  const isInputDisabled = gameState !== 'playing' || showingFeedback || false;

  console.log('🎮 ArithmeticGame render:', {
    currentQuestion: currentQuestion?.questionText,
    gameState,
    isInputDisabled,
    showingFeedback
  });

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading question...</p>
      </div>
    );
  }

  // ADDED: Validate question data
  if (!currentQuestion.num1 || !currentQuestion.num2 || !currentQuestion.operation) {
    console.error('❌ Invalid question detected:', currentQuestion);
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 rounded-2xl p-8">
          <div className="text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-4">Question Error</h2>
          <p className="text-gray-600">There was an issue loading this question.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Restart Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ArithmeticQuestion 
        question={currentQuestion}
        showFeedback={showingFeedback}
        lastAnswer={lastAnswer}
      />
      
      <ArithmeticInput 
        currentQuestion={currentQuestion}
        onSubmit={submitAnswer}
        disabled={isInputDisabled}
        questionType={gameTemplate?.config?.multipleChoice ? 'multiple-choice' : 'input'}
        options={currentQuestion.options || []}
      />
    </div>
  );
};






export default ArithmeticGame;
