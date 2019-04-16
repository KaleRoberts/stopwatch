import React, { ReactDOM } from "react";

let model = {
  running: false,
  time: 0
};

let intents = {
  TICK: "TICK",
  START: "START",
  STOP: "STOP",
  RESET: "RESET"
};

let view = m => {
  let minutes = Math.floor(m.time / 60);
  let seconds = m.time - minutes * 60;
  // We create a left padding here, by asking if seconds is less than 10 and returning a leading 0 if it is
  let secondsFormatted = `${seconds < 10 ? "0" : ""}${seconds}`;
  let handler = event => {
    model = update(model, m.running ? "STOP" : "START");
  };
  let reset = event => {
    model = update(model, "RESET");
  };
  return (
    <div>
      <p>
        {minutes}:{secondsFormatted}
      </p>
      <button onClick={handler}>{m.running ? "Stop" : "Start"}</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

/*
    This is our state container
  */
let container = {};

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

const render = () => {
  ReactDOM.render(view(model), document.getElementById("root"));
};

render();

setInterval(() => {
  // Pass in the current application state and an intent
  model = update(model, "TICK");
  render();
}, 1000);
