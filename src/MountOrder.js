import React from 'react';

class MountOrder extends React.Component{
    constructor (){
        super();
        console.log('constructor');
        // alert('constructor');
    }

    componentWillMount (){
        console.log('component will mount');
        // alert('component will mount');
    }

    componentDidMount (){
        console.log('component did mount');
        // alert('component did mount');
    }

    componentWillUnmount (){
        console.log('component will unmount');
        // alert('component will unmount');
    }

    render (){
        console.log('render');
        // alert('render');
        return (
            <div>
                <h1>这是父组件传来的值： {this.props.aaa}</h1>
            </div>
        )
    }
}

export default MountOrder;