import React from 'react';
import {Form,Input} from 'antd';

const FormItem = Form.Item;

class InputItem extends React.Component{

    render(){
        return (
            <div>
                <Form layout={'horizontal'}>
                    <FormItem>
                        <Input type="number" onChange={this.props.handlChange}/>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default InputItem;