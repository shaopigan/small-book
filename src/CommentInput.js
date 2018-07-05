import React from 'react';
import { Form,Input,Button } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

class CommentInput extends React.Component{
    constructor () {
        super();
        this.state = {
            username: '',
            content: '',
            textarea:function(){

            }
        }
    }

    componentWillMount(){
        const username=localStorage.getItem('username');
        if(username){
            this.setState({
                username:username
            })
        }else{
            alert('local里username无数据');
        }
    }

    componentDidMount(){
        this.textarea.focus()
    }

    handleChangeName = (e)=>{
        this.setState({
            username:e.target.value
        })
    };

    handleChangeTextarea = (e)=>{
        this.setState({
            content:e.target.value
        })
    };

    handleSubmit = () => {
        if(this.props.onSubmit){
            this.props.onSubmit({
                username:this.state.username,
                content:this.state.content,
                createTime:Date()
            })
        }
        this.setState({
            content:''
        })
    };

    handleUsernameBlue = (e)=>{
        localStorage.setItem('username',e.target.value)
    };


    render (){
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        return (
            <div>
                <Form onClick={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="用户名：">
                        <Input type="text" value={this.state.username} onBlur={this.handleUsernameBlue.bind(this)} onChange={this.handleChangeName.bind(this)}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="评论：">
                        <TextArea value={this.state.content} ref={(textarea)=>{this.textarea=textarea}} onChange={this.handleChangeTextarea.bind(this)} autosize={{ minRows: 2, maxRows: 6 }}/>
                    </FormItem>
                    <FormItem style={{'textAlign':'center'}}>
                        <Button type="primary" htmlType="submit">发布</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default CommentInput;