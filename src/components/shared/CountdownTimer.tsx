
"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // ISO date string
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Set initial time left
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="text-sm text-muted-foreground">Calculating...</div>;
  }

  const timerComponents = [];
  if (timeLeft.days > 0) timerComponents.push(<span key="days" className="mx-1">{String(timeLeft.days).padStart(2, '0')}d</span>);
  if (timeLeft.days > 0 || timeLeft.hours > 0) timerComponents.push(<span key="hours" className="mx-1">{String(timeLeft.hours).padStart(2, '0')}h</span>);
  if (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0) timerComponents.push(<span key="minutes" className="mx-1">{String(timeLeft.minutes).padStart(2, '0')}m</span>);
  timerComponents.push(<span key="seconds" className="mx-1">{String(timeLeft.seconds).padStart(2, '0')}s</span>);
  
  const differenceForCheck = +new Date(targetDate) - +new Date();
  if (differenceForCheck <= 0 && (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) ) {
    return <div className="text-sm text-primary font-semibold">Event Started!</div>;
  }
  
  if (!timerComponents.length) {
      return <div className="text-sm text-muted-foreground">Starts soon...</div>
  }

  return (
    <div className="text-sm font-mono text-primary">
      {timerComponents.length ? timerComponents : <span>Event Started!</span>}
    </div>
  );
}
