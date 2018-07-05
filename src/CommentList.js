import React from 'react';
import Comment from './Comment';

class CommentList extends React.Component{
    static defaultProps = {
        comments: []
    };

    deleteThisOneInList (index) {
        if (this.props.onDeleteComment){
            this.props.onDeleteComment(index);
        }
    }

    render (){

        return (
            <div>
                {this.props.comments.map((comment,i)=> <Comment comment={comment} key={i} index={i} onDeleteComment={this.deleteThisOneInList.bind(this)}/>)}
            </div>
        );
    }
}

export default CommentList;