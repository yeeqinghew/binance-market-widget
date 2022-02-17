import "./App.css";
import Widget from "./components/Widget";
import Main from "./components/Main";
import Draggable from "react-draggable";

function App() {
  return (
    <Draggable>
      <div className="App">
        <Main>
          <Widget />
        </Main>
      </div>
    </Draggable>
  );
}

export default App;
