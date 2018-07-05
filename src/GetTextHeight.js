import React from 'react';

class GetTextHeight extends React.Component{
    componentDidMount() {
        this.pHeight = this.p.clientHeight
    }

    render () {
        return (
            <p ref={(p) => this.p = p} onClick={() => {console.log(this.pHeight)}}>获取文本高度{this.pHeight}</p>
        )
    }
}

export default GetTextHeight;