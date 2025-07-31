import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import { Volume2, VolumeX, Play, StopCircle, Music } from "lucide-react";

// --- Piano Key Data ---
// A slightly smaller, more focused range for better responsiveness without scrollbar
const PIANO_KEYS_DATA = [
  { note: "C3", label: "C3", type: "white", keyboardKey: "a" },
  { note: "C#3", label: "C#3", type: "black", keyboardKey: "w" },
  { note: "D3", label: "D3", type: "white", keyboardKey: "s" },
  { note: "D#3", label: "D#3", type: "black", keyboardKey: "e" },
  { note: "E3", label: "E3", type: "white", keyboardKey: "d" },
  { note: "F3", label: "F3", type: "white", keyboardKey: "f" },
  { note: "F#3", label: "F#3", type: "black", keyboardKey: "t" },
  { note: "G3", label: "G3", type: "white", keyboardKey: "g" },
  { note: "G#3", label: "G#3", type: "black", keyboardKey: "y" },
  { note: "A3", label: "A3", type: "white", keyboardKey: "h" },
  { note: "A#3", label: "A#3", type: "black", keyboardKey: "u" },
  { note: "B3", label: "B3", type: "white", keyboardKey: "j" },

  { note: "C4", label: "C4", type: "white", keyboardKey: "k" },
  { note: "C#4", label: "C#4", type: "black", keyboardKey: "o" },
  { note: "D4", label: "D4", type: "white", keyboardKey: "l" },
  { note: "D#4", label: "D#4", type: "black", keyboardKey: "p" },
  { note: "E4", label: "E4", type: "white", keyboardKey: ";" },
  { note: "F4", label: "F4", type: "white", keyboardKey: "'" },
  { note: "F#4", label: "F#4", type: "black", keyboardKey: "[" },
  { note: "G4", label: "G4", type: "white", keyboardKey: "]" },
  { note: "G#4", label: "G#4", type: "black", keyboardKey: "\\" },
  { note: "A4", label: "A4", type: "white", keyboardKey: "z" },
  { note: "A#4", label: "A#4", type: "black", keyboardKey: "x" },
  { note: "B4", label: "B4", type: "white", keyboardKey: "c" },

  { note: "C5", label: "C5", type: "white", keyboardKey: "v" },
  { note: "C#5", label: "C#5", type: "black", keyboardKey: "b" },
  { note: "D5", label: "D5", type: "white", keyboardKey: "n" },
  { note: "D#5", label: "D#5", type: "black", keyboardKey: "m" },
  { note: "E5", label: "E5", type: "white", keyboardKey: "," },
  { note: "F5", label: "F5", type: "white", keyboardKey: "." },
  { note: "F#5", label: "F#5", type: "black", keyboardKey: "/" },
  { note: "G5", label: "G5", type: "white", keyboardKey: "!" },
  { note: "G#5", label: "G#5", type: "black", keyboardKey: "@" },
  { note: "A5", label: "A5", type: "white", keyboardKey: "#" },
  { note: "A#5", label: "A#5", type: "black", keyboardKey: "$" },
  { note: "B5", label: "B5", type: "white", keyboardKey: "%" },
];

// --- Predefined Romantic Melodies ---
const MELODIES = [
  {
    name: "Kal Ho Naa Ho (Main Theme)",
    notes: [
      "E4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "D4",
      "E4",
      "F4",
      "E4",
      "D4",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "D4",
      "E4",
      "F4",
      "E4",
      "D4",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4", // Repeated for longer duration
    ],
    durations: Array(64).fill("8n"),
    bpm: 120,
  },
  {
    name: "Pehla Nasha (Main Phrase Extended)",
    notes: [
      "E4",
      "F#4",
      "G#4",
      "B4",
      "A4",
      "G#4",
      "F#4",
      "E4",
      "F#4",
      "G#4",
      "B4",
      "A4",
      "G#4",
      "F#4",
      "E4",
      "F#4",
      "G#4",
      "B4",
      "A4",
      "G#4",
      "F#4",
      "E4",
      "E4",
      "F#4",
      "G#4",
      "B4",
      "A4",
      "G#4",
      "F#4",
      "E4", // Repeat for longer
      "C#4",
      "D#4",
      "E4",
      "F#4",
      "E4",
      "D#4",
      "C#4",
      "B3", // Bridge
    ],
    durations: Array(30).fill("8n"),
    bpm: 110,
  },
  {
    name: "Tum Hi Ho (Extended)",
    notes: [
      "C4",
      "E4",
      "G4",
      "A4",
      "G4",
      "E4",
      "C4",
      "E4",
      "G4",
      "A4",
      "G4",
      "E4",
      "C4",
      "E4",
      "G4",
      "A4",
      "G4",
      "E4",
      "C4",
      "C4",
      "E4",
      "G4",
      "A4",
      "G4",
      "E4",
      "C4",
      "E4",
      "G4",
      "A4",
      "G4",
      "E4",
      "C4",
      "E4",
      "G4",
      "A4",
      "G4",
      "E4",
      "C4", // Repeated for longer duration
    ],
    durations: Array(38).fill("8n"),
    bpm: 100,
  },
  {
    name: "Gerua (Dilwale Extended)",
    notes: [
      "D4",
      "E4",
      "F#4",
      "G4",
      "F#4",
      "E4",
      "D4",
      "E4",
      "D4",
      "C#4",
      "D4",
      "E4",
      "F#4",
      "G4",
      "F#4",
      "E4",
      "D4",
      "E4",
      "D4",
      "C#4",
      "A3",
      "C4",
      "D4",
      "E4",
      "F#4",
      "G4",
      "F#4",
      "E4",
      "D4",
      "E4",
      "D4",
      "C#4",
      "D4",
      "E4",
      "F#4",
      "G4",
      "F#4",
      "E4",
      "D4",
      "E4",
      "D4",
      "C#4",
      "A3",
      "C4", // Repeated
    ],
    durations: Array(44).fill("8n"),
    bpm: 100,
  },
  {
    name: "Chura Liya Hai (Long)",
    notes: [
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "G3",
      "A3",
      "B3",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4", // Extended
    ],
    durations: Array(33).fill("4n"),
    bpm: 80,
  },
  {
    name: "Tere Mere Sapne (Guide Extended)",
    notes: [
      "C4",
      "G3",
      "A3",
      "B3",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "C4",
      "G3",
      "A3",
      "B3",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4", // Repeated
    ],
    durations: Array(26).fill("4n"),
    bpm: 70,
  },
  {
    name: "Tu Hi Re (Bombay Extended)",
    notes: [
      "G3",
      "A3",
      "C4",
      "A3",
      "G3",
      "F#3",
      "E3",
      "D3",
      "E3",
      "F#3",
      "G3",
      "A3",
      "C4",
      "A3",
      "G3",
      "F#3",
      "E3",
      "G3",
      "A3",
      "C4",
      "A3",
      "G3",
      "F#3",
      "E3",
      "D3",
      "E3",
      "F#3",
      "G3",
      "A3",
      "C4",
      "A3",
      "G3",
      "F#3",
      "E3", // Repeated
    ],
    durations: Array(34).fill("8n"),
    bpm: 95,
  },
  {
    name: "Kabira (Yeh Jawaani Hai Deewani Extended)",
    notes: [
      "G3",
      "C4",
      "D4",
      "C4",
      "G3",
      "A3",
      "G3",
      "C4",
      "D4",
      "C4",
      "A3",
      "G3",
      "G3",
      "C4",
      "D4",
      "C4",
      "G3",
      "A3",
      "G3",
      "C4",
      "D4",
      "C4",
      "A3",
      "G3", // Repeated
    ],
    durations: Array(24).fill("4n"),
    bpm: 110,
  },
  {
    name: "Love Theme (Simple Extended)",
    notes: [
      "C4",
      "E4",
      "G4",
      "C5",
      "G4",
      "E4",
      "C4",
      "D4",
      "F4",
      "A4",
      "D5",
      "A4",
      "F4",
      "D4",
    ],
    durations: Array(14).fill("4n"),
    bpm: 120,
  },
  {
    name: "Dil Diyan Gallan",
    notes: [
      "G3",
      "C4",
      "D4",
      "E4",
      "D4",
      "C4",
      "A3",
      "G3",
      "C4",
      "D4",
      "E4",
      "D4",
      "C4",
      "A3",
      "G3",
      "A3",
      "C4",
      "D4",
      "C4",
      "G3",
      "F3",
      "E3",
      "D3",
      "E3",
      "F3",
      "G3",
      "A3",
      "G3",
      "F3",
      "E3",
      "D3", // Extended
    ],
    durations: Array(31).fill("8n"),
    bpm: 105,
  },
  {
    name: "Bulleya (Ae Dil Hai Mushkil)",
    notes: [
      "D4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "D4",
      "E4",
      "F4",
      "E4",
      "D4",
      "C4",
      "A3",
      "D4",
      "F4",
      "G4",
      "A4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "D4",
      "E4",
      "F4",
      "E4",
      "D4",
      "C4",
      "A3", // Repeated
    ],
    durations: Array(32).fill("8n"),
    bpm: 115,
  },
  {
    name: "Ae Dil Hai Mushkil (Main Theme)",
    notes: [
      "A3",
      "C4",
      "D4",
      "C4",
      "A3",
      "G3",
      "A3",
      "B3",
      "C4",
      "B3",
      "A3",
      "G3",
      "A3",
      "C4",
      "D4",
      "C4",
      "A3",
      "G3",
      "A3",
      "B3",
      "C4",
      "B3",
      "A3",
      "G3", // Repeated
    ],
    durations: Array(24).fill("4n"),
    bpm: 90,
  },
  {
    name: "Khairiyat (Chhichhore)",
    notes: [
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "G3",
      "A3",
      "B3",
      "C4",
      "B3",
      "A3",
      "G3",
      "C4",
      "D4",
      "E4",
      "F4",
      "G4",
      "F4",
      "E4",
      "D4",
      "C4",
      "G3",
      "A3",
      "B3",
      "C4",
      "B3",
      "A3",
      "G3", // Repeated
    ],
    durations: Array(32).fill("8n"),
    bpm: 100,
  },
];

// --- Constants for Key Sizing/Positioning ---
const WHITE_KEY_MIN_WIDTH_PX = 38; // Minimum design width for a white key
const BLACK_KEY_WIDTH_PX = 32; // Corresponds to Tailwind 'w-8'
const BLACK_KEY_OFFSET_PERCENTAGE = 0.6; // How far into the preceding white key the black key's left edge starts

const RomanticPiano = () => {
  const [synth, setSynth] = useState(null);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [currentSongName, setCurrentSongName] = useState("");
  const [masterVolume, setMasterVolume] = useState(0);
  const [selectedMelody, setSelectedMelody] = useState(MELODIES[0].name);

  const pianoRef = useRef(null); // Ref for the whole piano container
  const melodySequenceRef = useRef(null);

  // --- Tone.js Initialization ---
  useEffect(() => {
    const newSampler = new Tone.Sampler({
      urls: {
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
      },
      release: 0.8,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => {
        console.log("Piano samples loaded!");
      },
      onerror: (e) => {
        console.error("Error loading piano samples:", e);
      },
    });

    const globalReverb = new Tone.Reverb({
      decay: 1.5,
      preDelay: 0.01,
      wet: 0.2,
    }).toDestination();

    newSampler.chain(globalReverb, Tone.Destination); // Sampler -> Reverb -> Master

    setSynth(newSampler);
    Tone.Destination.volume.value = masterVolume;

    return () => {
      newSampler.dispose();
      globalReverb.dispose();
      if (melodySequenceRef.current) {
        melodySequenceRef.current.dispose();
      }
      Tone.Transport.cancel(0);
      Tone.Transport.stop();
    };
  }, []);

  useEffect(() => {
    if (Tone.Destination) {
      Tone.Destination.volume.value = masterVolume;
    }
  }, [masterVolume]);

  // --- Piano Key Display Logic (Responsive Fit) ---
  const [visibleKeys, setVisibleKeys] = useState([]);

  useEffect(() => {
    const updateVisibleKeys = () => {
      const width = pianoRef.current
        ? pianoRef.current.offsetWidth - 32 // Account for padding if any, just a small buffer
        : window.innerWidth;

      // Determine how many white keys can fit based on a minimum key width
      // We want to ensure at least 7-8 white keys for a decent playable range
      const minWhiteKeysToShow = 8; // At least one full octave (C-C) + a couple more
      const maxWhiteKeysThatCanFit = Math.floor(width / WHITE_KEY_MIN_WIDTH_PX);

      // Default to a central range around C4 for mobile or small screens
      let startIndex = PIANO_KEYS_DATA.findIndex((k) => k.note === "C4");
      if (startIndex === -1) startIndex = 0; // Fallback if C4 not found

      // Calculate the number of white keys we'll actually try to render
      let numWhiteKeysToRender = Math.max(
        minWhiteKeysToShow,
        maxWhiteKeysThatCanFit
      );

      // Adjust start index to try and center the view, or start from C3 if enough space
      if (numWhiteKeysToRender > 10) {
        // If enough space, start from C3
        startIndex = PIANO_KEYS_DATA.findIndex((k) => k.note === "C3");
        if (startIndex === -1) startIndex = 0;
      } else {
        // Keep it centered around C4
        let currentWhiteKeysCount = 0;
        let tempStartIndex = startIndex;
        while (
          tempStartIndex >= 0 &&
          currentWhiteKeysCount < Math.floor(numWhiteKeysToRender / 2)
        ) {
          if (PIANO_KEYS_DATA[tempStartIndex].type === "white") {
            currentWhiteKeysCount++;
          }
          tempStartIndex--;
        }
        startIndex = Math.max(0, tempStartIndex + 1); // Adjust back to correct start
      }

      let endIndex = startIndex;
      let whiteKeysCount = 0;

      // Iterate through the PIANO_KEYS_DATA to find the actual end index
      for (let i = startIndex; i < PIANO_KEYS_DATA.length; i++) {
        if (PIANO_KEYS_DATA[i].type === "white") {
          whiteKeysCount++;
        }
        endIndex = i;
        if (whiteKeysCount >= numWhiteKeysToRender) {
          break;
        }
      }

      // If we couldn't find enough white keys, adjust startIndex backwards
      while (whiteKeysCount < numWhiteKeysToRender && startIndex > 0) {
        startIndex--;
        if (PIANO_KEYS_DATA[startIndex].type === "white") {
          whiteKeysCount++;
        }
      }

      const newVisibleKeys = PIANO_KEYS_DATA.slice(startIndex, endIndex + 1);
      setVisibleKeys(newVisibleKeys);
    };

    updateVisibleKeys();
    window.addEventListener("resize", updateVisibleKeys);
    return () => window.removeEventListener("resize", updateVisibleKeys);
  }, []);

  // --- Play Note Handler ---
  const handlePlayNote = useCallback(
    async (note) => {
      if (!synth) return;
      await Tone.start();

      synth.triggerAttack(note);
      setActiveKeys((prev) => new Set(prev).add(note));
    },
    [synth]
  );

  // --- Release Note Handler ---
  const handleReleaseNote = useCallback(
    (note) => {
      if (!synth) return;
      synth.triggerRelease(note);
      setActiveKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
    },
    [synth]
  );

  // --- Keyboard Event Listeners for Piano Keys ---
  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = async (e) => {
      if (e.repeat) return;

      const keyData = PIANO_KEYS_DATA.find((k) => k.keyboardKey === e.key);
      if (keyData && visibleKeys.some((vk) => vk.note === keyData.note)) {
        if (
          !pressedKeys.has(keyData.note) &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.altKey
        ) {
          await handlePlayNote(keyData.note);
          pressedKeys.add(keyData.note);
        }
      }
    };

    const handleKeyUp = (e) => {
      const keyData = PIANO_KEYS_DATA.find((k) => k.keyboardKey === e.key);
      if (keyData) {
        if (pressedKeys.has(keyData.note)) {
          handleReleaseNote(keyData.note);
          pressedKeys.delete(keyData.note);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handlePlayNote, handleReleaseNote, visibleKeys]);

  // --- Melody Playback Controls ---
  const playSelectedMelody = useCallback(async () => {
    if (isPlayingMelody || !synth) return;

    await Tone.start();

    setIsPlayingMelody(true);
    const song = MELODIES.find((m) => m.name === selectedMelody);
    if (!song) {
      console.error("Selected melody not found!");
      setIsPlayingMelody(false);
      return;
    }
    setCurrentSongName(song.name);

    Tone.Transport.bpm.value = song.bpm || 100;

    if (melodySequenceRef.current) {
      melodySequenceRef.current.dispose();
    }
    Tone.Transport.cancel(0);

    melodySequenceRef.current = new Tone.Sequence(
      (time, noteIndex) => {
        const note = song.notes[noteIndex];
        const duration = song.durations[noteIndex];
        if (synth && note) {
          synth.triggerAttackRelease(note, duration, time);
          setActiveKeys((prev) => new Set(prev).add(note));
          Tone.Transport.scheduleOnce(() => {
            setActiveKeys((prev) => {
              const newSet = new Set(prev);
              newSet.delete(note);
              return newSet;
            });
          }, time + Tone.Time(duration).toSeconds() * 0.8);
        }
      },
      Array.from({ length: song.notes.length }, (_, i) => i)
    ).start(0);

    const totalMelodyDuration = song.notes.reduce(
      (acc, _, i) => acc + Tone.Time(song.durations[i]).toSeconds(),
      0
    );

    Tone.Transport.scheduleOnce(() => {
      if (melodySequenceRef.current) {
        melodySequenceRef.current.dispose();
      }
      setIsPlayingMelody(false);
      setCurrentSongName("");
      setActiveKeys(new Set());
      Tone.Transport.stop();
    }, totalMelodyDuration + Tone.Time("8n").toSeconds());

    Tone.Transport.start();
  }, [synth, isPlayingMelody, selectedMelody]);

  const stopMelody = useCallback(() => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
      Tone.Transport.cancel(0);
      if (melodySequenceRef.current) {
        melodySequenceRef.current.dispose();
      }
    }
    setIsPlayingMelody(false);
    setCurrentSongName("");
    setActiveKeys(new Set());
  }, []);

  // --- Render Logic for Keys ---
  const renderKeys = () => {
    const whiteKeysToRender = visibleKeys.filter((key) => key.type === "white");
    const blackKeysToRender = visibleKeys.filter((key) => key.type === "black");

    // Calculate dynamic width for white keys to fill the container
    const whiteKeyWidthPx =
      pianoRef.current && whiteKeysToRender.length > 0
        ? pianoRef.current.offsetWidth / whiteKeysToRender.length
        : WHITE_KEY_MIN_WIDTH_PX;

    return (
      <div className="flex relative h-56 pb-4 w-full select-none z-30">
        {/* White Keys Container */}
        <div className="flex relative z-0 w-full">
          {" "}
          {/* Use w-full for flex-1 to work */}
          {whiteKeysToRender.map((key, idx) => (
            <button
              key={key.note}
              onMouseDown={() => handlePlayNote(key.note)}
              onMouseUp={() => handleReleaseNote(key.note)}
              onMouseLeave={() => handleReleaseNote(key.note)}
              className={`
                flex-1 border border-gray-400 rounded-b-lg shadow-md relative
                transition-all duration-75 ease-out
                ${
                  activeKeys.has(key.note)
                    ? "bg-pink-200 shadow-inner scale-y-[0.98]"
                    : "bg-white hover:bg-pink-50 active:bg-pink-100"
                }
              `}
              style={{
                height: "100%",
                marginLeft: idx === 0 ? 0 : "-1px",
                minWidth: `${WHITE_KEY_MIN_WIDTH_PX}px`,
              }}
              disabled={!synth}
            >
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-600 select-none">
                {key.label}
              </span>
            </button>
          ))}
        </div>
        {/* Black Keys Container */}
        <div className="absolute left-0 top-0 z-10 flex w-full h-36 pointer-events-none">
          {blackKeysToRender.map((key) => {
            const globalKeyIndex = PIANO_KEYS_DATA.findIndex(
              (k) => k.note === key.note
            );
            const prevWhiteKey = PIANO_KEYS_DATA.slice(0, globalKeyIndex)
              .reverse()
              .find((k) => k.type === "white");

            if (!prevWhiteKey) return null;
            const prevWhiteKeyRenderedIndex = whiteKeysToRender.findIndex(
              (k) => k.note === prevWhiteKey.note
            );
            if (prevWhiteKeyRenderedIndex === -1) return null;

            const baseLeft = prevWhiteKeyRenderedIndex * whiteKeyWidthPx;
            const finalLeft =
              baseLeft +
              whiteKeyWidthPx * BLACK_KEY_OFFSET_PERCENTAGE -
              BLACK_KEY_WIDTH_PX / 2;

            return (
              <button
                key={key.note}
                onMouseDown={() => handlePlayNote(key.note)}
                onMouseUp={() => handleReleaseNote(key.note)}
                onMouseLeave={() => handleReleaseNote(key.note)}
                className={`
                  absolute h-36 w-8 rounded-b-lg border border-gray-700 shadow-lg
                  transition-all duration-75 ease-out
                  ${
                    activeKeys.has(key.note)
                      ? "bg-pink-500 shadow-inner scale-y-[0.98]"
                      : "bg-gray-900 hover:bg-gray-700 active:bg-gray-800"
                  }
                `}
                style={{
                  left: `${finalLeft}px`,
                  pointerEvents: "auto",
                  zIndex: 20,
                }}
                disabled={!synth}
              >
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white select-none">
                  {key.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={pianoRef}
      className="relative bg-gradient-to-b from-gray-200 to-gray-400 p-4 rounded-2xl border border-gray-300 shadow-2xl w-full max-w-4xl mx-auto overflow-hidden"
    >
      <h3 className="text-3xl font-extrabold text-pink-600 mb-4 text-center">
        <Music className="inline-block w-8 h-8 mr-2 text-pink-500" />
        Love's Melody Composer
        <Music className="inline-block w-8 h-8 ml-2 text-pink-500" />
      </h3>

      {/* Piano Keys Section */}
      <div className="relative flex items-end min-h-[16rem] rounded-b-lg shadow-inner bg-gray-100 p-1">
        {renderKeys()}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col gap-4 mt-6 p-4 bg-white/50 rounded-xl shadow-inner">
        {/* Volume Control */}
        <div className="flex items-center gap-4 bg-white/70 p-3 rounded-lg shadow-sm">
          {masterVolume <= -25 ? (
            <VolumeX className="text-gray-500 w-6 h-6" />
          ) : (
            <Volume2 className="text-gray-700 w-6 h-6" />
          )}
          <label
            htmlFor="volume"
            className="text-gray-700 font-semibold text-sm sr-only"
          >
            Volume:
          </label>
          <input
            id="volume"
            type="range"
            min="-40"
            max="0"
            step="1"
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-pink-500 [&::-moz-range-thumb]:rounded-full"
          />
        </div>

        {/* Melody Selection & Controls */}
        <div className="bg-pink-50/50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between shadow-sm">
          <label
            htmlFor="melody-select"
            className="text-pink-700 font-semibold text-base mb-3 sm:mb-0 sm:mr-4 flex-shrink-0"
          >
            Choose Melody:
          </label>
          <select
            id="melody-select"
            value={selectedMelody}
            onChange={(e) => setSelectedMelody(e.target.value)}
            className="flex-grow py-2 px-3 rounded-md border border-gray-300 bg-white text-gray-800 focus:ring-pink-500 focus:border-pink-500 shadow-sm mb-3 sm:mb-0 sm:mr-4 w-full sm:w-auto"
            disabled={isPlayingMelody}
          >
            {MELODIES.map((melody) => (
              <option key={melody.name} value={melody.name}>
                {melody.name}
              </option>
            ))}
          </select>

          <button
            className={`py-2 px-5 rounded-full font-bold text-lg mr-0 sm:mr-3 mb-3 sm:mb-0 w-full sm:w-auto flex items-center justify-center
                ${
                  isPlayingMelody
                    ? "bg-pink-300 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700 text-white"
                } transition-colors duration-200`}
            onClick={playSelectedMelody}
            disabled={isPlayingMelody || !synth}
          >
            <Play className="inline-block w-6 h-6 mr-2" />
            {isPlayingMelody ? "Playing..." : "Play Melody"}
          </button>
          <button
            className={`py-2 px-5 rounded-full font-bold text-lg w-full sm:w-auto flex items-center justify-center
                ${
                  !isPlayingMelody || !synth
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                } transition-colors duration-200`}
            onClick={stopMelody}
            disabled={!isPlayingMelody || !synth}
          >
            <StopCircle className="inline-block w-6 h-6 mr-2" /> Stop
          </button>
          {currentSongName && (
            <span className="text-pink-700 font-medium text-base mt-4 sm:mt-0 sm:ml-4 px-2 text-center w-full">
              Currently Playing:{" "}
              <span className="font-bold">{currentSongName}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RomanticPiano;
