"""Forced-align each narration paragraph to its voiceover with pocketsphinx (bundled
English model, runs offline). Writes src/timings.json with the start time of every
paragraph, so graphics land on the exact sentence. Run after replacing any VO file."""
import json, pathlib, subprocess, sys
from pocketsphinx import Decoder
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from norm import norm

EXTRA = {  # pronunciations missing from the CMU dictionary
    'afp': 'EY EH F P IY', 'auramine': 'AO R AH M IY N', 'douyin': 'D OW Y IH N',
    'durian': 'D UH R IY AH N', 'durians': 'D UH R IY AH N Z', "hainan's": 'HH AY N AE N Z',
    'influencer': 'IH N F L UW AH N S ER', 'kunming': 'K UH N M IH NG',
    'livestream': 'L AY V S T R IY M', 'tiktok': 'T IH K T AA K',
}
root = pathlib.Path(__file__).resolve().parent.parent
out = []
for txt in sorted((root / 'narration').glob('*.txt')):
    mp3 = root / 'public/vo' / (txt.stem + '.mp3')
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(mp3), '-ar', '16000', '-ac', '1', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    dur = len(pcm) / 32000
    paras = [p.strip() for p in txt.read_text().split('\n\n') if p.strip()]
    pw = [norm(p) for p in paras]
    dec = Decoder(lm=None)
    for w, ph in EXTRA.items():
        dec.add_word(w, ph, False)
    dec.set_align_text(' '.join(w for ws in pw for w in ws))
    dec.start_utt(); dec.process_raw(pcm, full_utt=True); dec.end_utt()
    segs = [s for s in dec.seg() if s.word not in ('<s>', '</s>', '<sil>', '[NOISE]')]
    words = [(s.word.split('(')[0], s.start_frame / 100) for s in segs]
    starts, i = [], 0
    for ws in pw:
        starts.append(round(max(0.0, words[i][1] - 0.15), 2) if i < len(words) else None)
        i += len(ws)
    assert len(words) == sum(len(w) for w in pw), (txt.stem, len(words), sum(len(w) for w in pw))
    starts[0] = 0.0
    out.append({'id': txt.stem, 'duration': round(dur, 2), 'paras': [{'start': s, 'text': p} for s, p in zip(starts, paras)]})
    print(txt.stem, starts)
(root / 'src/timings.json').write_text(json.dumps(out, indent=1, ensure_ascii=False))
