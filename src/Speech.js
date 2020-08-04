import React, {Component, useState, useEffect} from 'react';
//import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

//------------------------SPEECH RECOGNITION SETUP-----------------------
const SpeechRecognition = window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
let name1 = 0
let location1 = 0
let organization1 = 0
let finalTranscript = ''

recognition.continous = true
//Default is false
recognition.interimResults = true
recognition.lang = 'en-US'

function SpeechFunc() {
  const [name, setName] = useState([])
  const [location, setLocation] = useState([])
  const [organization, setOrganization] = useState([])

  useEffect(() => {
    var url = '/desc?finalTranscript=' + JSON.stringify(finalTranscript);
    fetch(url).then(res => res.json()).then(data => {
      setName(data.name);
      setLocation(data.location);
      setOrganization(data.organization);
    });
  }, [finalTranscript]);

  name1 = name
  location1 = location
  organization1 = organization

  return(
    <div>
      <p>Hi {name1}! Welcome to {location1}!!</p>
      <p>Name:{name1}</p>
      <p>Location:{location1}</p>
      <p>Organization:{organization1}</p>
    </div>
  );
}

//------------------------Component--------------------------------------
class Speech extends Component {

  constructor(){
    super()
    this.state = {
      listening:false //initial state
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
  }

  //toggling listen state between true and false
  toggleListen() {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  handleListen(){
    console.log('listening?', this.state.listening)
    if (this.state.listening) {
      finalTranscript = ''
      recognition.start()
      recognition.onend = () => {
        console.log("...continue listening...")
        recognition.start()
      }
    }
    else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
      }
    }
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      document.getElementById('interim').innerHTML = interimTranscript
      document.getElementById('final').innerHTML = finalTranscript
    }
  }

  //Not added handleListen here because React internally decides when its the right time to change the state which may create synchronous issues
  render() {
    return (
      <div style={container}>
        <button id='microphone-btn' style={button} onClick={this.toggleListen} />
        <div id='interim' style={interim}></div>
        <div id='final' style={final}></div>
        <SpeechFunc />
      </div>
    );
  }
}

export default Speech;


//---------------------------CSS----------------------------------
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  button: {
    width: '60px',
    height: '60px',
    background: 'lightblue',
    borderRadius: '50%',
    margin: '6em 0 2em 0'
  },
  interim: {
    color: 'gray',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  },
  final: {
    color: 'black',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  }
}

const { container, button, interim, final } = styles
