// src/hooks/useAudio.js
// Audio Engine supporting static audioMap asset lookup and Web Audio SFX

import { useRef, useCallback, useEffect } from 'react';
import { audioMap } from '../utils/audioMap.js';

export function useAudio(audioEnabled = true) {
  const currentAudioRef = useRef(null);
  const playingRef      = useRef(false);
  const narrateIdRef    = useRef(0);

  useEffect(() => {
    if (!audioEnabled) {
      narrateIdRef.current++;
      stopAll();
    }
  }, [audioEnabled]);

  const stopAll = useCallback(() => {
    narrateIdRef.current++;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    playingRef.current = false;
  }, []);

  const getAudioUrl = useCallback((text) => {
    if (!text) return null;
    if (audioMap[text]) return audioMap[text];
    if (audioMap[`key:${text}`]) return audioMap[`key:${text}`];
    // Check trimmed match
    const trimmed = text.trim();
    if (audioMap[trimmed]) return audioMap[trimmed];
    return null;
  }, []);

  const playSegment = useCallback(async (text, expectedId) => {
    if (!audioEnabled || narrateIdRef.current !== expectedId) return;
    const url = getAudioUrl(text);
    if (!url || narrateIdRef.current !== expectedId) return;

    return new Promise((resolve) => {
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => { currentAudioRef.current = null; resolve(); };
      audio.onerror = () => { currentAudioRef.current = null; resolve(); };
      audio.play().catch(() => resolve());
    });
  }, [audioEnabled, getAudioUrl]);

  const narrate = useCallback(async (segments) => {
    if (!segments || !segments.length || !audioEnabled) return;
    stopAll();
    const currentId = ++narrateIdRef.current;
    playingRef.current = true;

    for (const seg of segments) {
      if (narrateIdRef.current !== currentId || !audioEnabled) break;
      const text = typeof seg === 'string' ? seg : seg.text;
      await playSegment(text, currentId);
      if (narrateIdRef.current !== currentId || !audioEnabled) break;
      await new Promise(r => setTimeout(r, 180));
    }
    if (narrateIdRef.current === currentId) {
      playingRef.current = false;
    }
  }, [stopAll, playSegment, audioEnabled]);

  // Tone-based sound synthesizer for instant zero-latency feedback
  const playTone = useCallback((frequencies, durations) => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let offset = 0;
      frequencies.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.22, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + (durations[i] || 150) / 1000 + 0.2);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + (durations[i] || 150) / 1000 + 0.2);
        offset += (durations[i] || 150) / 1000;
      });
    } catch { /* ignore WebAudio errors */ }
  }, [audioEnabled]);

  const sounds = {
    correct: () => playTone([880, 1100, 1320], [100, 100, 180]),
    wrong:   () => playTone([220, 180], [180, 200]),
    badge:   () => playTone([523, 659, 784, 1047], [90, 90, 90, 240]),
    streak:  () => playTone([440, 880, 1100], [70, 70, 180]),
    levelUp: () => playTone([523, 659, 784, 1047, 1319], [60, 60, 60, 60, 250]),
    click:   () => playTone([440], [50]),
    defeat:  () => playTone([300, 240, 180], [120, 120, 250]),
  };

  return {
    narrate,
    stopAll,
    sounds,
    say:       (text) => ({ text, style: 'statement' }),
    ask:       (text) => ({ text, style: 'question' }),
    cheer:     (text) => ({ text, style: 'celebration' }),
    emphasize: (text) => ({ text, style: 'emphasis' }),
    think:     (text) => ({ text, style: 'thinking' }),
    celebrate: (text) => ({ text, style: 'celebration' }),
    instruct:  (text) => ({ text, style: 'instruction' }),
    encourage: (text) => ({ text, style: 'encouragement' }),
  };
}

export default useAudio;
