import CommentBox from '3box-comments-react';
import React, { Component } from "react";
import { SPACE_NAME, THREAD_NAME } from "../Constants";

export default class Comments extends Component {
  state = {
  }
  render() {
    return (
      <div className="container">
        <div style={{margin : 'auto'}}>
          <h1 style={{textAlign : "center"}}>Comments!</h1>
          <CommentBox
                spaceName={SPACE_NAME}
                threadName={THREAD_NAME}
                box={this.props.box} // box created in step 2
                currentUserAddr={this.props.usersAddress} //users address from step 1
                adminEthAddr={"0x343712AbA29A21c9eB50Cc98D556028485146913"} 
          />
        </div>
      </div>
    );
  }
}