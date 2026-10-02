import React from 'react';
import {Composition} from 'remotion';
import {DurianVideo} from './Video';
import {buildTimeline} from './timeline';
import {FPS} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="DurianVideo" component={DurianVideo} durationInFrames={buildTimeline().total} fps={FPS} width={1920} height={1080} />
);
