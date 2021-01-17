
import './App.css';
import { useState } from 'react';

function App() {
  const [sequence, setSequence] = useState({ step: 1, start: 1 });
  const [answer, setAnswer] = useState("");
  const [winStreak, setWinStreak] = useState(0);
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  
  const correctMessage = "Correct, great job!";
  const wrongMessage = "Sorry, try again";

  function getSequence(sequence, numTerms = 4) {
    return [...Array(numTerms)].map((_, i) => (
      i * sequence.step + sequence.start
    ));
  }

  function makeSequence() {
    const stepRange = 20;
    const startRange = 20;
    return {
      step: Math.floor(Math.random() * stepRange) - Math.floor(stepRange / 2),
      start: Math.floor(Math.random() * startRange) - Math.floor(startRange / 2)
    }
  }

  function getCorrectAnswer() {
    let answer = sequence.step === 1 ? "n" : sequence.step === -1 ? "-n" : sequence.step.toString() + "n";
    let diff = sequence.start - sequence.step;
    if (diff === 0) return answer;
    answer += (diff < 0 ? "-" : "+") + Math.abs(diff.toString());
    return answer;
  }

  function checkAnswer(event) {
    event.stopPropagation();
    event.preventDefault();
    // Remove parentheses, spaces, + 0, and +-
    let strippedAns = answer.replace(/\+\s*0\s*$/g).replace(/[\s()]+/g, "").replace("+-","-").toLowerCase();
    // Change 1n or -1n to n
    strippedAns = strippedAns.replace(/\b1n/g, "n")
    const correct = getCorrectAnswer();
    const isCorrect = strippedAns === correct;
    if (isCorrect) {
      setShowCorrectMessage(true);
      setShowWrongMessage(false);
      setWinStreak(ws => ++ws);
    }
    else {
      setShowWrongMessage(true);
      setShowCorrectMessage(false);
    }
  }

  return (
    <div className="App">
      <main className="App-header">
        <h1 className="sequence">{ getSequence(sequence).join(", ") }</h1>
        <div>I think the <em>n</em>th term of this sequence is:
        <form onSubmit={(e) => checkAnswer(e)}>
          <input type="text" value={answer} onInput={(e) => setAnswer(e.currentTarget.value)} size={30} className="answer" />
          <input type="submit" value="Check" className="check" />
          </form>
          </div>
          <div>
            { showCorrectMessage && <span className="correct">{correctMessage}</span>}
            { showWrongMessage && <span className="wrong">{wrongMessage}</span> }
          </div>
          <div>
            Your win streak: <span className="wins">{ winStreak }</span>
          </div>
        <div><button className="newButton" onClick={() => {
          setSequence(makeSequence());
          setShowWrongMessage(false);
          setShowCorrectMessage(false);
        }
        }>Make a new sequence!</button></div>
      </main>
    </div>
  );
}

export default App;
