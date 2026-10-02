import timings from './timings.json';
import {CHAPTER_TITLES} from './scenes';
import {FPS} from './theme';

export const TITLE_SEC = 4.5; // title card after the cold open
export const CHAPTER_CARD_SEC = 2.5;
export const TAIL_SEC = 0.6; // breathing room after each VO chunk
export const END_CARD_SEC = 12; // YouTube end screen needs 5–20 s

export type Segment =
  | {kind: 'title'; from: number; dur: number}
  | {kind: 'chapterCard'; from: number; dur: number; num: number; title: string}
  | {kind: 'chapter'; from: number; dur: number; id: string; vo: number}
  | {kind: 'end'; from: number; dur: number};

const f = (s: number) => Math.round(s * FPS);

export const buildTimeline = () => {
  const segs: Segment[] = [];
  let t = 0;
  timings.forEach((ch, i) => {
    const title = CHAPTER_TITLES[ch.id];
    if (title) {
      segs.push({kind: 'chapterCard', from: t, dur: f(CHAPTER_CARD_SEC), num: i, title});
      t += f(CHAPTER_CARD_SEC);
    }
    const dur = f(ch.duration + TAIL_SEC);
    segs.push({kind: 'chapter', from: t, dur, id: ch.id, vo: i});
    t += dur;
    if (i === 0) {
      segs.push({kind: 'title', from: t, dur: f(TITLE_SEC)});
      t += f(TITLE_SEC);
    }
  });
  segs.push({kind: 'end', from: t, dur: f(END_CARD_SEC)});
  t += f(END_CARD_SEC);
  return {segs, total: t};
};
