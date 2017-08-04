"use strict";

import React from "react";
import ReactDOM from "react-dom";
import "./main.less";

var rows = 12,
	cols = 2;

var fullDay = new Array(cols * rows).fill(1, 0, cols * rows),
	emptyDay = new Array(cols * rows).fill(0, 0, cols * rows);

Date.prototype.isSameDateAs = function(pDate) {
	return (
		this.getFullYear() === pDate.getFullYear() &&
		this.getMonth() === pDate.getMonth() &&
		this.getDate() === pDate.getDate()
	);
}

var colors = ["orange", "blue", "black", "red", "green", "white"];

//props should expect full event object
//this.props.blockCount
//this.props.name
class Event extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var _arr = new Array(this.props.blockCount);
		_arr.fill(1, 0, this.props.blockCount);
		return (<div className = "e-box"><div className = "e-box-name">{this.props.name}</div>
			{_arr.map((_, ind) => <QuarterBox key = {ind} fill = "10"/>)}
			</div>);
	}
}


class QuarterBox extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		var classn = "q-box fill-" + this.props.fill;
		return (
			<div className={classn}>
			<div className="inner"></div>
			</div>
		);
	}
}


class DayBox extends React.Component {
	render() {
		return (<div className="d-box">
			<div className="inner"/>
			{this.props.dayFill.map((i, ind)=><QuarterBox key = {ind} fill={Math.floor(i * 10)}/>)}
			</div>);
	}
}

class WeekBox extends React.Component {
	calcDayfill() {
		var dayFill = new Array(cols * rows);
		dayFill.fill(1, 0, cols * rows);
		var d = this.props.today;
		var ind = d.getHours() + Math.floor(d.getMinutes() / 60);
		var portion = Math.floor(d.getMinutes() % 60) / 60;
		dayFill[ind] = portion;
		for (ind++; ind < cols * rows; ind++) {
			dayFill[ind] = 0;
		}
		return dayFill;
	}
	calcWeekFill() {
		var weekFill = [0, 0, 0, 0, 0, 0, 0];
		var dayOf = this.props.today.getDay() - 1;
		if (dayOf < 0)
			dayOf = 6;
		weekFill[dayOf] = 1;
		for (var i = dayOf + 1; i < 7; i++)
			weekFill[i] = 2;
		return weekFill;
	}
	render() {
		return (<div className ="w-box" id="weekbox">
			{this.calcWeekFill().map((w, i) => {
				var day = fullDay;

				if(w == 1)
					day = this.calcDayfill();
				else if (w == 2)
					day = emptyDay;
				
				var pad = i == 6 ? null : <div className = "pad"/>;

				return (
					<div key={i}>
					<DayBox dayFill = {day}/>

					{pad}
					</div>);
			})}
			</div>);
	}
}

class YearBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			prevDOY: this.prevDaysOfYear(),
			futureDOY: this.futureDaysOfYear()
		};

	}
	prevDaysOfYear() {
		var c = [];

		var today = this.props.today;
		var start = new Date(today.getFullYear(), 0, 0);
		var diff = today - start;
		var oneDay = 1000 * 60 * 60 * 24;
		var days = Math.floor(diff / oneDay);
		for (var i = 0; i < days; i++) {
			c.push(<QuarterBox key={i} fill={10}/>);
		}
		return c;
	}
	futureDaysOfYear() {
		var c = [];

		var today = this.props.today;
		var start = new Date(today.getFullYear() + 1, 0, 0);
		var diff = start - today;
		var oneDay = 1000 * 60 * 60 * 24;
		var days = Math.floor(diff / oneDay);
		var t = Math.floor(today / oneDay);
		for (var i = 0; i < days; i++) {
			c.push(<QuarterBox key={i+t} fill={0}/>);
		}
		return c;
	}
	render() {
		var a = this.props.today;
		var todayProg = (a.getHours() * 60 + a.getMinutes()) / (12 * 60);
		todayProg = Math.floor(todayProg * 100);
		return (<div id="yearbox">
		{this.prevDaysOfYear()}
		<QuarterBox fill={todayProg}/>
		{this.futureDaysOfYear()}	
		</div>);
	}

}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.timerHandler = this.timerHandler.bind(this);
		this.state = {
			timer: setInterval(this.timerHandler, 1000 * 10),
			today: new Date(),
			mode: "week",
			colorIndex: parseInt(localStorage.getItem("color"))
		};
		console.log(localStorage.getItem("color"))
	}
	timerHandler() {
		this.setState({ today: new Date() });
	}
	toggleMode() {
		var n = "year";
		if (this.state.mode == "year") {
			n = "week";
		}
		this.setState({
			mode: n
		});
	}
	toggleColor(){
		var newInd = (this.state.colorIndex + 1)%(colors.length);
		this.setState({
			colorIndex: newInd
		});
		localStorage.setItem("color", newInd);
	}
	render() {
		return (
			<div className = {this.state.mode + " " + colors[this.state.colorIndex]}>
				<WeekBox today={this.state.today}/>

				<button id="switch" onClick={()=>this.toggleMode()}>Toggle view</button>
				<button id="color" onClick={()=>this.toggleColor()}>Color</button>

				<YearBox today={this.state.today}/>

			</div>
		);
	}
}


ReactDOM.render(
	<App/>,
	document.getElementById("react-container")
);