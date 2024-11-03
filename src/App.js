import { useState } from 'react';
import './App.css';

function App() {
  const [value, setvalue] = useState(0);
  const [history, sethistory] = useState([]);
  const [redoList, setredoList] = useState([]);
  //user sirf 5 bar he undo kar sakta hai uske liye ek state variable banaya
  const [undoCount, setundoCount] = useState(0);

  const maintainHistory = (key,prev,curr) => {
    console.log(key, prev, curr);
    const obj = {
      Action: key,
      prev,
      curr,
    }
    const copyHistory = [...history];
    copyHistory.unshift(obj);
    sethistory(copyHistory);
  }

  const handleclick = (key) => {
    
    const val = parseInt(key);
    console.log(key);
    maintainHistory(key,value, val + value);
    setvalue((existingValue) => existingValue + val);
  }

  //undo

  const handleUndo = () => {
    //stack - LIFO format
    if (history.length) {
      if (undoCount + 1 > 5) {
        alert("Limit Exiceded😁");
        return;  
      }
      setundoCount((c) => c + 1);
      const copyHist = [...history];
      //history se 1st Item nikalenge by using shift 
      const firstItem = copyHist.shift();
      //remaining items left in history update kar dena hai setHistory main
      sethistory(copyHist);
      //jab undo hoga to main result pe changes dekhne ke liye hum setvalue ko update karenge
      setvalue(firstItem.prev)
      
      //ab jo firstItem mila hai shift operation ke bad usko hamko redo list main push karna hai
      const copyredoList = [...redoList];
      copyredoList.push(firstItem);

      //redo list ko update karna hai copy redo list ke sath
      setredoList(copyredoList);

    }
  }


  const handleRedo = () => {
    // jaise he undo karega toh redo list create hogi tabhi simultaneously 
    if (redoList.length) {
      const copyRedoList = [...redoList];
      //pop karna hai redo list ke last value kko or ek variable main store karna hai
      const popedItem = copyRedoList.pop();
      // redo list ko udate karna hai
      setredoList(copyRedoList);
      // popedItem se 3 cheeze mil jayegi (action,prev,curr)
      const { Action, prev, curr } = popedItem;
      //history list ko update karna hai
      maintainHistory(Action, prev, curr);

      //history ko update karna hai
      setvalue(curr);
    }
  }
  return (
    <div className="App">
      <h1 className='header'>UNDOABLE COUNTER</h1>
      <div className='action-btn'>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
      </div>
      <div className='user-btn'>
        {
          [-100, -10, -1].map((btn) => {
            return <button onClick={()=>handleclick(btn)}>{btn}</button>
          })
        }
        <div>{value}</div>
        {
          ["+1", "+10", "+100"].map((btn) => {
            return <button onClick={()=>handleclick(btn)}>{btn}</button>
          })
        }
      </div>
      <h1 className='historyhead'>HISTORY</h1>
      <div className='history'>{history.map((item) => {
        return <div className='row'>
          <div>{item.Action}</div>
          <div>
            {
              `[${item.prev} -> ${item.curr}]`
            }
          </div>
        </div>
      })}</div>
    </div>
  );
}

export default App;
