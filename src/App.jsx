import logo from './logo.svg';
import './App.css';
import Amplify,{ API, graphqlOperation} from "aws-amplify";
import awsconfig from './aws-exports';
import { listStories } from "./graphql/queries";
import React,{useState,useEffect} from 'react'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
Amplify.configure(awsconfig)
function App() {
  const [stories,setStories]= useState([])
  useEffect(()=>{
    fetchStories()
  },[])
  
  const fetchStories= async ()=>{
    try{
      const st= await API.graphql(graphqlOperation(listStories))
     const storylist= st.data.listStories.items;
     console.log(storylist)
      setStories(storylist)
    }catch(error){console.log(error);}
  }
  return (
    <div className="App">
      <h1>Story tails app</h1>
    {stories &&  <StoryList stories={stories}></StoryList>}
      
    </div>
  );
}

const StoryList=({stories})=>{
  const [index,setIndex]=useState(0);
    const [current ,setCurrent]=useState({...stories[0]})
  const nav=(i)=>{
    setIndex(i)
    setCurrent(stories[i])
  }


  return(
    // stories.map(x=><Story story={x} key={x.id}/>)
    <div>
      {/* <AutoCompleteSearch suggestions={stories}/> */}
      <NextPrev nav={nav} index={index}maxlenth={stories.length}></NextPrev>
      {current && <Player filename={current?.filename}/>}
   <Story story={current}></Story>
    </div>
  )
}
const NextPrev=({nav,index,maxlenth})=>{
  return <div>
    
    <button onClick={()=>nav(--index)} disabled={index===0}>previous</button> | 
    <button onClick={()=>nav(++index)}disabled={index===maxlenth-1}>next</button>

  </div>
}
const Player=({filename})=>{
return <AudioPlayer
autoPlay={false}
    // src={"https://storiesmp3.s3.ap-south-1.amazonaws.com/"+filename}
    src={"https://storiesmp3.s3.ap-south-1.amazonaws.com/"+filename}
    onPlay={e => console.log("onPlay")}
    // other props here
  />

}
const Story=({story})=>{
  return (<div>
      <h3>{story?.title}</h3>
      <p>{story?.story_text}</p>

  </div>)
}
export default App;
