import React, { useState, useEffect } from 'react';

interface AnimatedHeroProps {
  texts: string[];
  speed?: number;
  pauseTime?: number;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ 
  texts, 
  speed = 100, 
  pauseTime = 2000 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = texts[currentTextIndex];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, pauseTime]);

  return (
    <div className="text-center py-8">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        What do you want to{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          {currentText}
        </span>
        <span className="animate-pulse">|</span>
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Paste your text, article, or URL and get instant AI-powered insights with advanced NLP analysis
      </p>
    </div>
  );
};

export default AnimatedHero;
