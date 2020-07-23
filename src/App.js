import React, { Component } from "react";
//import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Box from '3box';
import "bootstrap/dist/css/bootstrap.min.css";

import Nav from "./components/Nav";
import { BounceLoader } from "react-spinners";

import Home from "./pages/Home";
import AddApp from "./pages/AddApp";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Comments from "./pages/Comments";

import { SPACE_NAME, THREAD_NAME } from "./Constants";

export default class App extends Component {

  state = {
    needToAWeb3Browser : false,
     box: {},
     space: {},
     thread: {},
     posts: []
  }
  async getAddressFromMetaMask() {
    if (typeof window.ethereum == "undefined") {
      this.setState({ needToAWeb3Browser: true });
    } else {
      window.ethereum.autoRefreshOnNetworkChange = false; //silences warning about no autofresh on network change
      const accounts = await window.ethereum.enable();
      this.setState({ accounts });
    }
  }
  //Dapp handles web3 and 3Box logins, and they run before component is mounted. (recommended)
  async componentDidMount() {
    await this.getAddressFromMetaMask();
    if (this.state.accounts) {
      // Now we have enabled the provider and have the users ethereum address we can start working with 3Box
      //BPS following lines added from ---https://docs.3box.io/learn/building-a-distributed-appstore-with-3box 
      const box = await Box.openBox(this.state.accounts[0], window.ethereum); 
      const space = await box.openSpace(SPACE_NAME);  //bps-defi-store
      this.setState({ space, box }); 

      //https://ipfs.3box.io/list-spaces?address=0x343712AbA29A21c9eB50Cc98D556028485146913

      //create thread STEP 4
      const thread = await space.joinThread(THREAD_NAME,
      // , {
      //   // firstModerator: moderatorsEthAddress,
      //   // members: false
      //   ghost: true,
      //   ghostBacklogLimit: 20 // optional and defaults to 50
      //}
      );

      //STEP 5: retrive posts from Thread 
      this.setState({ thread }, ()=>(this.getAppsThread()));
    }
  }

  async getAppsThread() {
    if (!this.state.thread) {
      console.error("apps thread not in react state");
      return;
    }
   const posts = await this.state.thread.getPosts();
   this.setState({posts});
   
   await this.state.thread.onUpdate(async()=> {
     const posts = await this.state.thread.getPosts();
     this.setState({posts});
    });
  
  }



  render() {
    if(this.state.needToAWeb3Browser){
      return <h1>Please install metamask</h1>
    }
    return (
      <Router>
        <div>
          <Nav />

          <Switch>
            <Route exact path="/profile">
            {this.state.space && (
                <Profile
                  box={this.state.box}
                  space={this.state.space}
                  accounts={this.state.accounts}
                  threeBoxProfile={this.state.threeBoxProfile}
                />
              )}
              {!this.state.space && (
                <div style={{ width: "60px", margin: "auto" }}>
                  <BounceLoader color={"blue"} />
                </div>
              )}
            </Route>
            <Route exact path="/chat">
               <Chat 
                  box={this.state.box}
                  space={this.state.space}
                  accounts = {this.state.accounts}
                  threeBoxProfile={this.state.threeBoxProfile}
                  thread={this.state.thread}
               />
            </Route>
            <Route exact path="/add-application">
                {this.state.accounts && (
                  <AddApp
                  accounts={this.state.accounts}
                  thread={this.state.thread}
                  box={this.state.box}
                  space={this.state.space}
                  threadMembers={this.state.threadMembers}
                  posts={this.state.posts}
                  threeBoxProfile={this.state.threeBoxProfile}
                  getAppsThread={this.getAppsThread.bind(this)}
                />
              )}
              {!this.state.accounts && <h1>Login with metamask</h1>}
            </Route>
            <Route exact path="/comments">
              <Comments 
                   space={this.state.space}
                   thread={this.state.thread}
                   box={this.state.box}
                   usersAddress={
                     this.state.accounts ? this.state.accounts[0] : null
                   }
              />
            </Route>
            <Route exact path="/">
              <Home 
                   posts={this.state.posts}
                   space={this.state.space}
                   box={this.state.box}
                   getAppsThread={this.getAppsThread}
                   usersAddress={
                     this.state.accounts ? this.state.accounts[0] : null
                   }
              />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}


// function Home() {
//   return <h2>Home</h2>;
// }

// class Profile extends Component {
//   render() {
//     return <h2>Profile </h2>;
//   }
// }

//const Chat =  () => { return(<div>Chat constant</div>)  } 




