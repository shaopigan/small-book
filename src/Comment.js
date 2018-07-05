import React from 'react';

class Comment extends React.Component{
    constructor(){
        super();
        this.state={
            showCreateTime:''
        }
    }

    componentWillMount(){
        this._updateCreateTime()
    }

    _updateCreateTime (){
        const comment = this.props.comment;
        const duration = (Date.now() - comment.createTime)/1000;
        console.log(comment.createTime);
        this.setState({
            showCreateTime:duration>60?Math.round(duration / 60)+' 分钟前':Math.round(Math.max(duration, 1))+' 秒前'
        })
    }

    handleDeleteComment(){
        if(this.props.onDeleteComment){
            this.props.onDeleteComment(this.props.index);
        }
    }
    render (){
         // console.log(this.props);
        return (
            <div className='comment'>
                <div className='comment-user'>
                    <span>{this.props.comment.username} </span>：
                </div>
                <p>{this.props.comment.content}</p>
                <span className='comment-createdtime'>
                  {this.state.showCreateTime}
                </span>
                <span className='comment-delete' onClick={this.handleDeleteComment.bind(this)}>
                  删除
                </span>
            </div>
        )
    }
}

export default Comment;