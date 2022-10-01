import { useReducer, useState } from 'react';
import './App.css';
import Modal from './Modal';

const reducer = (state, action) => {
  switch (action.type) {
    case 'addBank':
      console.log("hi")
      saveqLib([...state.qLibrary, action.newBank])
      return { qLibrary: [...state.qLibrary, action.newBank] }
    default:
      return state
  }
}

const getLib = () => {
  if (localStorage.getItem("qLibrary") == undefined) {
    localStorage.setItem("qLibrary", JSON.stringify([]))
    return []
  } else {
    return JSON.parse(localStorage.getItem("qLibrary"))
  }
}

const saveqLib = (qLib) => {
  localStorage.setItem("qLibrary", JSON.stringify(qLib))


}

function App() {
  let x = getLib()
  const [open, setOpen] = useState(false);
  
  const [currNumber, setCurrNumber] = useState(0);
  const [quoteShown, setQuoteShown] = useState(true);

  const [learnOn, setLearnOn] = useState(false);
  const [viewOn, setViewOn] = useState(false);
  const [state, dispatch] = useReducer(reducer, { qLibrary: getLib() })
  const [tempQuotes, setTempQuotes] = useState(["Quote 1"]);
  const [tempName, setTempName] = useState("");
  const [selected, setSelected] = useState(-1);
  // const [show, setShow] = useState(true);



  const addQuoteBank = () => {
    let b = [];
    tempQuotes.forEach((q) => {
      b.push({ text: q, correct: 0, incorrect: 0 })
    })
    // console.log({ name: tempName, quotes: b })
    dispatch({ type: "addBank", newBank: { name: tempName, quotes: b } });
    setTempQuotes(["Quote 1"]);
    setTempName("");
    setOpen(false);

  }

  const handleChange = (e, i) => {
    let q = tempQuotes;
    q[i] = e.target.value;
    setTempQuotes(tempQuotes);
  }

  let r = 300;
  // let qLibrary = [{ name: "1984.1", quotes: [] }, { name: "Tempest", quotes: [] }, { name: "JAP", quotes: [] },];
  return (
    <>
      <div className="App">
        <div className='books'>
          {state.qLibrary.map((book, index) => {

            return <div onClick={() => { if (selected !== index) setSelected(index); else setSelected(-1) }} style={{ position: 'fixed', transform: `translate(${r * Math.cos(2 * Math.PI * index / (state.qLibrary.length + 1))}px,${r * Math.sin(2 * Math.PI * index / (state.qLibrary.length + 1))}px)` }} className={`${index === selected ? 'selBook' : 'book'}`} key={book.name}>
              {book.name}
            </div>

          })}
          <div onClick={() => setOpen(true)} style={{ position: 'fixed', transform: `translate(${r * Math.cos(2 * Math.PI * state.qLibrary.length / (state.qLibrary.length + 1))}px,${r * Math.sin(2 * Math.PI * state.qLibrary.length / (state.qLibrary.length + 1))}px)` }} className='adder'>
            +
          </div>

          <div className='actions'>
            {selected !== -1 ? <div className='bTitle'>{state.qLibrary[selected].name}</div> : <div className='bTitle'>Quotes</div>}
            <div className='action' onClick={() => { if (selected !== -1) setViewOn(true); }}>View</div>
            <div className='action' onClick={() => { if (selected !== -1) setLearnOn(true); }}>Learn</div>
            <div className='action'>Revise</div>
          </div>
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className='quoteBank'>
            <div className='back' onClick={() => setOpen(false) || setTempQuotes(["Quote 1"])}>Cancel</div>
            <div className='main'>
              <input onChange={((e) => setTempName(e.target.value))} type="text" className="in" placeholder="Name of Quotebank" spellCheck="false"></input>
              <div className='quoteBankQuotes'>
                {tempQuotes.map((quote, index) => {

                  return <input key={index} onChange={((e) => handleChange(e, index))} type="text" className="in quoteBankQuote" placeholder={`Quote ${index + 1}`} spellCheck="false"></input>
                })}

              </div>
              <div className='plusQBQ' onClick={() => setTempQuotes([...tempQuotes, `Quote ${tempQuotes.length + 1}`])}>+ Add Another Quote</div>
              <div className='addQB' onClick={addQuoteBank}>Done</div>

            </div>
          </div>
        </Modal>

        <Modal open={viewOn} >
          {selected != -1 ? <div className='view'>
            <div className='titleM'>{state.qLibrary[selected].name}</div>
            <div className='mainSpace'>

              <div className='quotesV'>

                {state.qLibrary[selected].quotes.map((quote, index) => {
                  return <div className='quoteV'>{quote.text} <div className='numberV'>{index + 1}</div><div className='stats'><div className='correct'>Correct: {quote.correct}</div> <div className='incorrect'>Incorrect: {quote.incorrect}</div> </div></div>
                })}
              </div>

            </div>

            <div className='back2' onClick={() => setViewOn(false)}>Back</div>
          </div> : ''
          }

        </Modal>

        <Modal open={learnOn}>
          {selected != -1 ? <>
            <div className='learn'>
              <div className='titleM'>{state.qLibrary[selected].name}</div>
              <div className='mainSpace'>
                <div className='quoteG' onClick={() => {setQuoteShown(!quoteShown)}}>
                  <div className={`quoteV clickable`}><div className={`${quoteShown ? 'shown' : 'hidden'}`}>{quoteShown ? state.qLibrary[selected].quotes[currNumber].text : 'Click to show'}</div> <div className='numberV'>{currNumber + 1}</div></div>
                </div>
                <div><input className='lAnswer' placeholder='Quote' onPaste={(e) => {e.preventDefault()}} onChange={(e) => {setQuoteShown(false)}}></input></div>

              </div>


              <div className='back2' onClick={() => setLearnOn(false)}>Back</div>
            </div>
          </> : ''}

        </Modal>
      </div>
    </>
  );
}

export default App;
