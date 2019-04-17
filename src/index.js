import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from './App';
// import * as serviceWorker from "./serviceWorker";

// let model = {
//   running: false,
//   time: 0
// };

// let intents = {
//   TICK: "TICK",
//   START: "START",
//   STOP: "STOP",
//   RESET: "RESET"
// };

/*
    The job of the update function is to apply the intent to the model
    and produce a new model. This is a good general concept of how Redux handles state mutations.
  */
const update = (model = { running: false, time: 0 }, intent) => {
  const updates = {
    START: model => Object.assign(model, { running: true }),
    STOP: model => Object.assign(model, { running: false }),
    RESET: model => Object.assign(model, { time: 0, running: false }),
    TICK: model =>
      Object.assign(model, { time: model.time + (model.running ? 1 : 0) })
  };
  return (updates[intent] || (() => model))(model);
};

let view = m => {
  let minutes = Math.floor(m.time / 60); // 0.001 / 60
  let seconds = m.time - minutes * 60;
  // let milliseconds = m.time - seconds * 1000;
  // We create a left padding here, by asking if seconds is less than 10 and returning a leading 0 if it is
  let secondsFormatted = `${seconds < 10 ? "0" : ""}${seconds}`;
  // let millisecondsFormatted = `${milliseconds < 100 ? "00" : ""}${milliseconds}`;
  let handler = () => {
    container.dispatch(m.running ? "STOP" : "START");
  };
  let reset = () => {
    // model = update(model, "RESET");
    container.dispatch("RESET");
  };
  return (
    <div className="container">
      <p>
        {minutes}:{secondsFormatted}
      </p>
      <button className="button" onClick={handler}>{m.running ? "Stop" : "Start"}</button>
      <button className="button" onClick={reset}>Reset</button>
    </div>
  );
};

const createStore = (reducer) => {
  let internalState;
  let handlers = [];
  return {
    dispatch: (intent) => {
      internalState = reducer(internalState, intent);
      handlers.forEach(h => {
        h();
      });
    },
    subscribe: (handler) => {
      handlers.push(handler);
    },
    getState: () => internalState
  };
};

let container = createStore(update);

const render = () => {
  ReactDOM.render(view(container.getState()),
    document.getElementById('root')
  );
};
container.subscribe(render);

setInterval(() => {
  // console.log(container);
  // Pass in the current application state and an intent
  container.dispatch('TICK');
  // render();
}, 1000);

// render();

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
