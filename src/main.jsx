"use strict";

import React from "react";
import ReactDOM from "react-dom";
import "./main.less";

//props should expect full event object
//this.props.blockCount
//this.props.name
class Event extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		var _arr = new Array(this.props.blockCount);
		_arr.fill(1, 0, this.props.blockCount);
		return(<div className = "e-box"><div className = "e-box-name">{this.props.name}</div>
			{_arr.map((_, ind) => <QuarterBox key = {ind} fill = "10"/>)}
			</div>
		);
	}
}


class QuarterBox extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		var classn = "q-box fill-" + this.props.fill;
		return (
			<div className={classn}>
				<div className="inner"></div>
			</div>
		);
	}
}


class DayBox extends React.Component{
	render(){
		return (<div id="d-box">
			{this.props.dayFill.map((i, ind)=><QuarterBox key = {ind} fill={Math.floor(i * 10)}/>)}
		</div>);
	}
}

class App extends React.Component{
	constructor(props){
		super(props);
		this.calcDayfill = this.calcDayfill.bind(this);
		this.timerHandler = this.timerHandler.bind(this);
		this.state = {
			dayFill: this.calcDayfill(),
			timer: setInterval(this.timerHandler,1000 * 5 )
		};
	}
	calcDayfill(){
		var dayFill = new Array(4*24);
		dayFill.fill(1, 0, 4 * 24);
		var d = new Date();
		var ind = d.getHours()*4 + Math.floor(d.getMinutes() / 15);
		var portion = Math.floor(d.getMinutes() % 15) / 15;
		dayFill[ind] = portion;
		for(ind++; ind < 4*24; ind++){
			dayFill[ind] = 0;
		}
		return dayFill;
	}
	timerHandler(){
		this.setState({
			dayFill: this.calcDayfill()
		});
	}
	render(){
		return (<div>
			<DayBox dayFill = {this.state.dayFill}/>
			<div id = "e-box-container">
			<Event name = "temp" blockCount = {4}/>
			<Event name = "temp" blockCount = {8}/>
			</div>
		</div>);
	}
}


ReactDOM.render(
	<App/>,
	document.getElementById("react-container")
);

