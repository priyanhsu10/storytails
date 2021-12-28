import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { listStories } from "./graphql/queries";
import React, { useState, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Search from "./components/Search";
Amplify.configure(awsconfig);
function App() {
  const [stories, setStories] = useState([]);
  const [filterstories, setFilterStories] = useState([]);
  const [currentFile, setcurrentFile] = useState(undefined);
  const [currentTitle, setcurrentTitle] = useState(undefined);
  useEffect(() => {
    fetchStories();
  }, []);
  const apply = (value) => {
    setFilterStories(stories.filter((x) => x.title.indexOf(value) > -1));
  };
  const play = (filename, title) => {
    setcurrentFile(filename);
    setcurrentTitle(title);
  };
  const clear = () => {
    console.log("clear");
    setFilterStories(stories);
  };
  const fetchStories = async () => {
    try {
      const st = await API.graphql(graphqlOperation(listStories));
      const storylist = st.data.listStories.items;
      setStories([...storylist]);
      setFilterStories(storylist);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="App">
      <div className="row">
        <div className="col-12 topnav">
          <h1>Story tails app</h1>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Search apply={apply} clear={clear} />
          </div>
        </div>

        <div className="FixedHeightContainer row">
          <div className="Content col-12 container ">
            {stories && <StoryListNew stories={filterstories} play={play} />}
          </div>
        </div>
        <div className="row ">
          <div className="col-12">
            {currentFile && (
              <Player filename={currentFile} title={currentTitle} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const StoryList = ({ stories }) => {
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState({ ...stories[0] });
  const nav = (i) => {
    setIndex(i);
    setCurrent(stories[i]);
  };

  return (
    // stories.map(x=><Story story={x} key={x.id}/>)
    <div>
      {/* <AutoCompleteSearch suggestions={stories}/> */}
      <NextPrev nav={nav} index={index} maxlenth={stories.length}></NextPrev>
      {current && <Player filename={current?.filename} />}
      <Story story={current}></Story>
    </div>
  );
};
const NextPrev = ({ nav, index, maxlenth }) => {
  return (
    <div>
      <button onClick={() => nav(--index)} disabled={index === 0}>
        previous
      </button>{" "}
      |
      <button onClick={() => nav(++index)} disabled={index === maxlenth - 1}>
        next
      </button>
    </div>
  );
};
const Player = ({ filename, title }) => {
  return (
    <div className="fixplayer">
      <div className="fw-bold"> Current titile :{title}</div>
      <AudioPlayer
        autoPlay={false}
        // src={"https://storiesmp3.s3.ap-south-1.amazonaws.com/"+filename}
        src={"https://storiesmp3.s3.ap-south-1.amazonaws.com/" + filename}
        onPlay={(e) => console.log("onPlay")}
        // other props here
      />
    </div>
  );
};
const Story = ({ story }) => {
  return (
    <div>
      <h3>{story?.title}</h3>
    </div>
  );
};
const Storycomp = ({ story, play }) => {
  return (
    <div className="row">
      <div className="col-sm-8">{story.title}</div>
      <div className="col-sm-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => play(story.filename, story.title)}
        >
          {" "}
          play
        </button>
      </div>
    </div>
  );
};

const StoryListNew = ({ stories, play }) => {
  return (
    <div>
      {stories.map((x) => {
        return <Storycomp story={x} play={play} key={x.id} />;
      })}
    </div>
  );
};

export default App;
