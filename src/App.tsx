import { useState, useEffect } from 'react';
import LeftBirdImage from "./assets/left-bird.jpg";
import RightBirdImage from "./assets/right-bird.jpg";
import './App.css';

// Define the expected shape of the joke response
interface JokeResponse {
  id: string;
  joke: string;
  status: number;
}

function App() {
  const [joke, setJoke] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Fetch a random dad joke
  const fetchJoke = async (): Promise<void> => {
    try {
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      });

      const data = (await response.json()) as JokeResponse;
      setJoke(data.joke);
    } catch (error) {
      console.error("Failed to fetch joke: ", error);
      setJoke("Why did the bird fail to fetch the joke? Because of a network error!");
    }
  };

  // Load a joke on initial render
  useEffect(() => {
    fetchJoke();
  }, []);

  // Handle Text-to-Speech and Animation State
  const tellJoke = (): void => {
    if (!joke || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(joke);

    // Make it sound higher pitched like a bird
    utterance.pitch = 1.5;
    utterance.rate = 1.1;

    // Toggle animation state based on speech events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container">
      <h1>Joking Birds</h1>

      {/* The bird container. The "talking" class is added when TTS is active. */}
      <div className="birds-row">
        <div className={`bird-container ${isSpeaking ? 'talking' : ''}`}>
          <img 
            src={LeftBirdImage}
            alt="A funny bird"
            className="bird-img"
          />
        </div>
        <div className={`bird-container ${isSpeaking ? 'talking' : ''}`}>
          <img
            src={RightBirdImage}
            alt="A funnier bird"
            className="bird-img"
          />
        </div>
      </div>

      <div className="joke-box">
        <p>{joke || "Loading a fresh joke..."}</p>
      </div>

      <div className="controls">
        <button onClick={tellJoke} disabled={isSpeaking}>
          Tell Joke
        </button>
      </div>
    </div>
  );
}

export default App;