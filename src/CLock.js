import React from 'react';

class CLock extends React.Component{
    constructor (){
        super();
        this.state={
            now:new Date()
        }
    }

    componentWillMount (){
        this.timer = setInterval(()=>{
            this.setState({
                now:new Date()
            });
        },1000)
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    render (){
        return (
            <div>
                <h5>现在是：{this.state.now.toLocaleTimeString()}</h5>
            </div>
        )
    }
}

export default CLock;