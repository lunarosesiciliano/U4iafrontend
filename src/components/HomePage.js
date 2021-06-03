import React, { Component } from "react";
import HomeBackground from "../images/HomeBackground";
import SocialMediaFeed from "./SocialMediaFeed";
import UserPage from "./UserPage";

export default class HomePage extends Component {
  state = {
    SMPosts: [],
  };

  componentDidMount() {
    fetch("http://localhost:3000/social_media_posts", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then((response) =>
      response.json().then((smp) => this.setState({ SMPosts: smp }))
    );
  }

  addLike = (smp) => {
    let newLikes = smp.likes + 1;
    fetch("http://localhost:3000/social_media_posts/" + smp.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        social_media_post: { likes: newLikes },
      }),
    })
      .then((response) => response.json())
      .then((smp) => {
        let SMPosts = this.state.SMPosts.map((post) => {
          if (post.id === smp.id) {
            return smp;
          } else {
            return post;
          }
        });
        this.setState({
          SMPosts,
        });
      });
  };
  addSMP = (smp) => {
    fetch("http://localhost:3000/social_media_posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        social_media_post: smp,
      }),
    })
      .then((response) => response.json())
      .then((smp) =>
        this.setState({
          SMPosts: [...this.state.SMPosts, smp],
        })
      );
  };

  render() {
    return (
      <div className="HomePage">
        <HomeBackground />

        <UserPage user={this.props.user} logout={this.props.logout} />
        <SocialMediaFeed
          user={this.props.user}
          SMPosts={this.state.SMPosts}
          addPost={this.addSMP}
          addLike={this.addLike}
        />
      </div>
    );
  }
}
