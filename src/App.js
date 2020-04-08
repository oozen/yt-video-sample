import React, { Component } from "react";
import "./style.css";

class App extends Component {
  state = {
    videoId: "Pbg8T9r1DiQ",
    title: "",
    message: "C'mon Hit The Play Button!",
    percent: 0,
    playing: false
  };

  componentDidMount() {
    this.loadApi().then((YT) => {
      this.loadYoutubePlayer();
    });
  }

  loadApi = () => {
    return new Promise((resolve) => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      window.onYouTubeIframeAPIReady = () => resolve();
    });
  };

  loadYoutubePlayer = () => {
    try {
      this.player = new window.YT.Player("youtubePlayer", {
        events: {
          onReady: this.onPlayerReady,
          onStateChange: this.onPlayerStateChange
        }
      });
      this.calculatePercentage(this.player);
    } catch (error) {
      // this is a hack for Chrome only error
      // because sometimes the Youtube Api dependency library "widget-api" gives an error while loading
      document.location.reload();
    }
  };

  onPlayerReady = (event) => {
    this.setState({
      title: event.target.playerInfo.videoData.title
    });
  };

  onPlayerStateChange = (e) => {
    let message,
      playing = false;
    switch (e.data) {
      case -1:
        message = "Video hasn't started yet!";
        break;
      case 0:
        message = "THE END!";
        break;
      case 1:
        message = "Now Playing!";
        playing = true;
        break;
      case 2:
        message = "Video Paused!";
        break;
      case 3:
        message = "Buffering...";
        break;
      default:
        break;
    }
    this.setState({ message, playing });
  };

  calculatePercentage = (player) => {;
    let duration = 0, current = 0, percent = 0;
    setInterval(() => {
      const { playing } = this.state;
      if (playing) {
        duration = parseInt(player.getDuration());
        current = parseInt(player.getCurrentTime());
        percent = (current / duration) * 100;
        this.setState({
          percent : Math.floor(percent)
        });
      }
    }, 1000);
  };

  render() {
    const { message, percent, videoId, title } = this.state;
    return (
      <section className="wrapper">
        <iframe title="youtube player" id="youtubePlayer" width="640" height="360" src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}></iframe>
        <div className="title">{title}</div>
        <div className="message">{message}</div>
        <div className="percent">{percent} %</div>
      </section>
    );
  }
}

export default App;
