import React from 'react';
import { useEffect } from 'react';

interface SparkContainerProps {
  children: React.ReactNode;
  sparkElementWidth?: number;
  distance?: number;
  sparkColor?: string;
  randomnessOn?: boolean;
}

const SparkContainer: React.FC<SparkContainerProps> = ({
  children,
  sparkElementWidth = 30,
  distance = 40,
  randomnessOn = true,
  sparkColor = 'white',
}) => {
  const createTransformSteps = (...args: string[]): string[] => {
    if (args.length === 0) {
      throw new Error(
        'Arguments to createTransformSteps should never be empty!'
      );
    }

    const outputSteps: string[] = [args.shift() as string];
    args.forEach((step, i) => {
      outputSteps.push(`${outputSteps[i]} ${step}`);
    });

    return outputSteps;
  };

  const dynamicAnimation = (name: string, rotation: number): void => {
    const randomDist: number = randomnessOn
      ? Math.floor((Math.random() - 0.5) * distance * 0.7)
      : 0;

    const [s1, s2, s3]: string[] = createTransformSteps(
      `translate(-50%, -50%) rotate(${rotation}deg) translate(10px, 0px)`,
      `translate(${distance + randomDist}px, 0px) scale(0.5, 0.5)`,
      `translate(${sparkElementWidth / 2}px, 0) scale(0, 0)`
    );

    const styleElement: HTMLStyleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    const styleSheet: CSSStyleSheet = styleElement.sheet as CSSStyleSheet;

    styleSheet.insertRule(
      `@keyframes ${name} {
         0% {
           transform: ${s1};
         }
         70% {
           transform: ${s2};
         }
         100% {
           transform: ${s3};
         }
      }`,
      styleSheet.cssRules.length
    );
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent): void => {
      const center: { x: number; y: number } = { x: e.pageX, y: e.pageY };
      makeBurst(center);
    };

    document
      .getElementById('container')
      ?.addEventListener('click', handleClick);

    return () => {
      document
        .getElementById('container')
        ?.removeEventListener('click', handleClick);
    };
  }, []);

  const makeBurst = (center: { x: number; y: number }): void => {
    for (let i = 0; i < 8; i++) {
      const randomSpace: number = randomnessOn
        ? Math.floor(-17 + Math.random() * 34)
        : 0;
      makeSpark(center, 45 * i + randomSpace);
    }
  };

  const makeSpark = (
    center: { x: number; y: number },
    rotation: number
  ): void => {
    const div: HTMLDivElement = document.createElement('div');
    const aniName: string = `disappear_${rotation}`;
    dynamicAnimation(aniName, rotation);

    div.classList.add('spark');
    div.style.left = `${center.x}px`;
    div.style.top = `${center.y}px`;
    div.style.animation = `${aniName} 500ms ease-out both`;
    document.getElementById('container')?.appendChild(div);
  };

  const sty: string = `
    .spark {
      position: absolute;
      width: ${sparkElementWidth}px;
      height: 8px;
      border-radius: 3px;
      background-color: ${sparkColor};
      transform: none;
    }
  `;

  return (
    <div id="container" style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{sty}</style>
      {children}
    </div>
  );
};
export default SparkContainer;
