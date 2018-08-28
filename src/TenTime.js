import React from 'react';
import {Button} from 'antd';

class TenTime extends React.Component{
    constructor(){
        super();
        this.state = {
            time : 0
        }
    }

    handleClick () {
        if(this.state.time === 0){
            this.timer = setInterval(()=>{
                this.setState({
                    time:this.state.time+0.01
                });
            },1);
        }else{
            clearInterval(this.timer);
        }

    }

    handleReturn(){
        this.setState({
            time : 0
        });
        clearInterval(this.timer);
    }


    render(){
        return (
            <div>
                <h5>{this.state.time}</h5>
                <Button type="primary" onClick={this.handleClick.bind(this)}>开始</Button>
                <Button type="primary" onClick={this.handleReturn.bind(this)}>归零</Button>
            </div>
        )
    }
}

export default TenTime;


