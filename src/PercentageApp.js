import React,{Component} from 'react';
import {Divider} from 'antd';
import PercentageShower from './PercentageShower';
import InputItem from './Input';
import GetTextHeight from "./GetTextHeight";

class PercentageApp extends Component{

    constructor (){
        super();
        this.state = {
            number:''
        }
    }

    valueChange(e){
        this.setState({
            number:e.target.value
        })
    }

    render (){
        return (
            <div>
                <InputItem handlChange={this.valueChange.bind(this)}/>
                <PercentageShower sendRes={this.state.number*100+'%'}/>
                <Divider />
                <GetTextHeight/>
                <Divider />
            </div>
        );
    }
}

export default PercentageApp;