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
	render() {
		return (<div className ="w-box">
			{this.props.weekFill.map((w) => {
				var day = fullDay;

				if(w == 1)
					day = this.props.dayFill;
				else if (w == 2)
					day = emptyDay;
				
				return (
					<div>
					<DayBox dayFill = {day}/>
					<div className = "pad"/>
					</div>);
			})}
			</div>);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.calcDayfill = this.calcDayfill.bind(this);
		this.timerHandler = this.timerHandler.bind(this);
		this.state = {
			dayFill: this.calcDayfill(),
			timer: setInterval(this.timerHandler, 1000 * 5),
			weekFill: this.calcWeekFill(),
			today: new Date(),
			prevDOY: this.prevDaysOfYear(),
			futureDOY: this.futureDaysOfYear(),
			mode: "year"
		};
	}
	calcDayfill() {
		var dayFill = new Array(cols * rows);
		dayFill.fill(1, 0, cols * rows);
		var d = new Date();
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
		var dayOf = new Date().getDay() - 1;
		if (dayOf === 0)
			dayOf = 6;
		weekFill[dayOf] = 1;
		for (var i = dayOf + 1; i < 7; i++)
			weekFill[i] = 2;
		return weekFill;
	}
	getMonday(d) {
		d = new Date(d);
		var day = d.getDay(),
			diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
		return new Date(d.setDate(diff));
	}
	prevDaysOfYear() {
		var c = [];

		var monday = this.getMonday(new Date());
		var start = new Date(monday.getFullYear(), 0, 0);
		var diff = monday - start;
		var oneDay = 1000 * 60 * 60 * 24;
		var days = Math.floor(diff / oneDay);
		for (var i = 0; i < days; i++) {
			c.push(<QuarterBox fill={10}/>);
		}
		return c;
	}
	futureDaysOfYear() {
		var c = [];

		var monday = this.getMonday(new Date());
		monday.setDate(monday.getDate() + 7);
		var start = new Date(monday.getFullYear() + 1, 0, 0);
		var diff = start - monday;
		var oneDay = 1000 * 60 * 60 * 24;
		var days = Math.floor(diff / oneDay);
		for (var i = 0; i < days; i++) {
			c.push(<QuarterBox fill={0}/>);
		}
		return c;
	}
	timerHandler() {
		this.setState({
			dayFill: this.calcDayfill(),
			weekFill: this.calcWeekFill()
		});
		if (!this.state.today.isSameDateAs(new Date())) {
			this.setState({
				prevDOY: this.prevDaysOfYear(),
				futureDOY: this.futureDaysOfYear()
			});
		}
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
	render() {
		return (<div className = {this.state.mode}>
			{this.state.prevDOY}
			<WeekBox dayFill = {this.state.dayFill} weekFill = {this.state.weekFill}/>
			{this.state.futureDOY}
			<button onClick={()=>this.toggleMode()}>Thing</button>
		</div>);
	}
}


ReactDOM.render(
	<App/>,
	document.getElementById("react-container")
);