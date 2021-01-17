
import './App.css';
import { FormEvent, useState } from 'react';

function App() {
interface Sequence {
    step: number;
    start: number;
}
  const [sequence, setSequence] = useState({ step: 1, start: 1 } as Sequence);
  const [answer, setAnswer] = useState("n");
  const [winStreak, setWinStreak] = useState(0);
  const [showCorrectMessage, setShowCorrectMessage] = useState(false);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [lockStreak, setLockStreak] = useState(false);

  const correctMessage = "Correct, great job!";
  const wrongMessage = "Sorry, try again.";

  const winMessages = {
      5: "Wow!",
      10: "Amazing!",
      20: "Spectacular!",
      50: "Unbelievable!",
      100: "Superhero status"
  } as {
      [n: number]: string
  }

  function getSequence(sequence: Sequence, numTerms = 4) {
    return [...Array(numTerms)].map((_, i) => (
      i * sequence.step + sequence.start
    ));
  }

  function makeSequence() {
    const stepRange = 20;
    const startRange = 20;
    const step = Math.floor(Math.random() * stepRange) - Math.floor(stepRange / 2);
    return {
      step: step || 1, // prevent step from being 0
      start: Math.floor(Math.random() * startRange) - Math.floor(startRange / 2)
    }
  }

  function getCorrectAnswers() {
    /** Return simplified form and formula form
    (dn + b or a0 + d(n - 1))
    Also return reversed versions of each. Doing this instead of embedding
    algebra.js for actual simplification of symbolic expressions. */

    let answer1 = sequence.step === 1 ? "n" : sequence.step === -1 ? "-n" : sequence.step.toString() + "n";
    let diff = sequence.start - sequence.step;
    let reversedAnswer1 = answer1;
    if (diff !== 0) {
      answer1 += (diff < 0 ? "-" : "+") + Math.abs(diff);
      reversedAnswer1 = diff + (sequence.step < 0 ? "" : "+") + reversedAnswer1;
    }

    let formulaAnswer = reversedAnswer1;
    if (sequence.step !== 1) {
      formulaAnswer = (sequence.start !== 0 ? sequence.start : "") + 
        (sequence.step < 0 ? "-" : (sequence.start !== 0 ? "+" : "")) + 
        (Math.abs(sequence.step) > 1 ? Math.abs(sequence.step) : "") + "(n-1)";
    }
      
    let reversedFormulaAnswer = formulaAnswer;
    if (sequence.start !== 0 && sequence.step !== 1) {
      reversedFormulaAnswer = (Math.abs(sequence.step) > 1 ? sequence.step : 
        (sequence.step < 0 ? "-" : "")) + "(n-1)" + (sequence.start > 0 ? "+" : "") + 
        sequence.start;
    }
    return [answer1, reversedAnswer1, formulaAnswer, reversedFormulaAnswer];
  }

  function checkAnswer(event: FormEvent<HTMLFormElement>) {
    event.stopPropagation();
    event.preventDefault();

    if (lockStreak) {
        makeNewSequence();
        return;
    }

    if (answer === "") {
        return;
    }

    // Remove parentheses, spaces, + 0, and +-
    let strippedAns = answer.replace(/\s+/g, "").replace(/\+0/g, "").replace("+-","-").toLowerCase();
    // Change 1n or -1n to n
    strippedAns = strippedAns.replace(/\b1n/g, "n")
    let formulaAns = strippedAns;
    strippedAns = strippedAns.replace(/[()]+/g, "");
    // formulaAns is of form a0 + d(n-1), so can't remove parentheses
    formulaAns = formulaAns.replace(/^0\+/g, "")
    const corrects = getCorrectAnswers();
    console.log("strippedAns: ", strippedAns);
    console.log("formulaAns: ", formulaAns);
    console.log("corrects: ", corrects);
    const isCorrect = [corrects[0], corrects[1]].includes(strippedAns) || 
      [corrects[2], corrects[3]].includes(formulaAns);
    if (isCorrect) {
      setShowCorrectMessage(true);
      setShowWrongMessage(false);
      if (!lockStreak) {
        setWinStreak(ws => ++ws);
        setLockStreak(true);
      }
    }
    else {
      setShowWrongMessage(true);
      setShowCorrectMessage(false);
      setWinStreak(0);
    }
  }

  function makeNewSequence() {
    setSequence(makeSequence());
    setShowWrongMessage(false);
    setShowCorrectMessage(false);
    setLockStreak(false);
    setAnswer("");
  }

  return (
    <div className="App">
      <main className="App-header">
        <h1 className="sequence">{ getSequence(sequence).join(", ") + ", ..." }</h1>
        <div>I think the <em>n</em>th term of this sequence is:
        <form onSubmit={(e) => checkAnswer(e)}>
          <input type="text" autoFocus value={answer} onInput={(e) => setAnswer(e.currentTarget.value)} size={30} className="answer" />
          <input type="submit" value="Check" className="check" />
          </form>
          </div>
          <div>
            { showCorrectMessage && <><div className="correct">{correctMessage}</div>
            <div style={{color:'#eee', fontStyle:'italic'}}>Press enter or click the button below to try another.</div></>}
            { showWrongMessage && <><div className="wrong">{wrongMessage}</div><div style={{color:'#eee', fontStyle:'italic'}}>Remember, your answer needs to include the common difference, "n", and another number based on the first term.</div></> }
          </div>
          
        <div style={{marginTop: '15px'}}><button className={`newButton ${showCorrectMessage ? "highlight" : ""}`} onClick={
        makeNewSequence
        }>Make a new sequence!</button></div>
        <div className="winBlock">
            Your win streak: <div className={winStreak > 0 ? "wins" : "wins zero"} >{ winStreak }</div>
            { winStreak in winMessages ? <div className="winMessage">{winMessages[winStreak]}</div> : ""}
            <div><em style={{color: 'lightgrey', fontSize: '0.9em', marginTop: '5px'}} >(How high can you go?!)</em></div>
          </div>
      </main>
    </div>
  );
}

export default App;
