import React from 'react';
import {Composition} from 'remotion';
import {DurianVideo} from './Video';
import {Thumb} from './Thumb';
import {buildTimeline} from './timeline';
import {FPS} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="DurianVideo" component={DurianVideo} durationInFrames={buildTimeline().total} fps={FPS} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={FPS} width={1920} height={1080} defaultProps={{v: 'A' as const}} />
  </>
);
