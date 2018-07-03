import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

/*****************************************************************\
 *                                                                *
 * rQuery example of accessing components' state and functions    *
 * from siblings, decedents and ancestors, a timer, from enywhere *
 * by the component Type, ID, class or prop                       *
 *                                                                *
 \****************************************************************/

// Import the rQuery.js file

import R$ from "./rquery.js";

// Mark a component for inclusion in rQueries' internal
// repository bu inheriting it from React.$Component

class App extends React.$Component {
  constructor(props) {
    super(props);
    this.state = { title: "rQuery" }
  }
  componentWillUnmount() {

    // Since componentWillUnmount is overriden 
    // we call super.componentWillUnmount to unregister

    super.componentWillUnmount()
    clearInterval(this.timer)
  }
  componentDidMount() {

    // Adjust all components of the Clock type
    // by: R$("Clock")
    // with a single setInterval
    // issued in a parent component

    this.timer = setInterval(() => {
      R$("Clock").setState({ date: new Date() });
    }, 1000);
  }
  render() {
    return (
      <div>
        Last rendered at: {new Date().toLocaleTimeString()}
        <h1>{this.state.title}</h1>
        {[...Array(5)].map((x, i) =>
          <Clock
            id={'id' + (i + 1)}
            name={'Clock ' + (i + 1)}
            className={'cls' + (i % 2)} />
        )}
        <AllButton />
        <OddsButton />
        <EvensButton />
        <FirstButton />
        <BackgroundButton />
      </div>
    );
  }
}

// Select all components of the Clock type
// by their type: R$("Clock")
// from a sibling component

class AllButton extends React.Component {
  render() {
    return (
      <div>
        <button
          onClick={_ =>
            R$("Clock").setState({ color: "green" })}
        >Color All</button>
        Selects all Clocks by type 
        <code>R$("Clock").setState</code>
      </div>
    );
  }
}

// Select the odd clocks
// by their IDs: R$("#id1,#id3,#id5")
// from a sibling component

class OddsButton extends React.Component {
  render() {
    return (
      <div>
        <button
          onClick={_ => R$("#id1,#id3,#id5").setState({ color: "blue" })}
        >Color Odds</button>
        Selects multiple by IDs
        <code>R$("#id1,#id3,#id5").setState</code>
      </div >
    );
  }
}


// Select the even clocks
// by their class: R$(".cls1")
// from a sibling component

class EvensButton extends React.Component {
  render() {
    return (
      <div >
        <button
          onClick={_ =>
            R$(".cls1").setState({ color: "red" })}
        >Color Evens</button>
        Selects multiple by class (className)
        <code>R$(".cls1").setState</code>
      </div>
    );
  }
}

// Select the first clock
// by its name prop: R$('[name="Clock 1"]')
// from a sibling component

class FirstButton extends React.Component {
  render() {
    return (
      <div >
        <button
          onClick={_ =>
            R$('[name="Clock 1"]').setState({ color: "gold" })}
        >Color First</button>
        Selects by attribute (prop)
        <code>R$('[name="Clock 1"]').setState</code>
      </div>
    );
  }
}

// Select all components of the Clock type
// and call a function within each one
// R$('Clock').forEach(e=>e.changeBackground())

class BackgroundButton extends React.Component {
  render() {
    return (
      <div >
        <button
          onClick={_ =>
            R$('Clock').forEach(e => e.changeBackground())}
        >Change background</button>
        Calls a function within each component
        <code>R$('Clock').forEach(e => e.changeBackground())</code>
      </div>
    );
  }
}

// Example component monipulated 
// only from outside

class Clock extends React.$Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date(), background: '#eee' };
  }

  // User defined function that
  // is called from other components

  changeBackground() {
    this.setState({ background: "#" + ((1 << 14) * Math.random() | 0).toString(16) })
  }

  render() {
    return (
      <div style={{ color: this.state.color, background: this.state.background }}>
        {this.props.name}: {this.state.date.toLocaleTimeString()}.
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

// Select the App by it's type: R$("App")
// from outside the App context

R$("App").setState({ title: "rQuery ... everywhere" });

