import React,{Component} from 'react';
import MountOrder from "./MountOrder";
import CLock from "./CLock";

class DelMountOrder extends Component{
    constructor (){
        super();
        this.state = {
            isShow : true,
            aaa:'321',
            isClockShow:true
        }
    }

    handleDelMountOrder (){
        this.setState({
            isShow:!this.state.isShow
        })
    }

    handleDelClock (){
        this.setState({
            isClockShow:!this.state.isClockShow
        })
    }

    render(){
        return (
            <div>
                {this.state.isShow?<MountOrder aaa={this.state.aaa}/>:null}
                <button onClick={this.handleDelMountOrder.bind(this)}>删除MountOrder组件</button>
                <button onClick={this.handleDelClock.bind(this)}>删除Clock组件</button>
                {this.state.isClockShow?<CLock/>:null}
            </div>
        )
    }
}

export default DelMountOrder;