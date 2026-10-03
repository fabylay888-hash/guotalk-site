"""Where does a phrase start inside its paragraph? Prints the fraction of the paragraph
(for `seq` `at` values) and the frame offset (for device timings).
Usage: python3 tools/anchor.py <chapter-id> <paragraph-number> "<phrase>" """
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from norm import norm
root = pathlib.Path(__file__).resolve().parent.parent
ch, para, phrase = sys.argv[1], int(sys.argv[2]), sys.argv[3]
T = {c['id']: c for c in json.loads((root / 'src/timings.json').read_text())}[ch]
W = json.loads((root / 'tools/words.json').read_text())[ch]
paras = T['paras']
start = paras[para - 1]['start']
end = paras[para]['start'] if para < len(paras) else T['duration']
target = norm(phrase)
seq = [w for w, t in W]
for i in range(len(seq)):
    if seq[i:i + len(target)] == target and start - 0.3 <= W[i][1] < end:
        t = W[i][1] - 0.1
        print(f'{ch} ¶{para} "{phrase}": t={t:.2f}s  frac={(t - start) / (end - start):.3f}  frame+{round((t - start) * 30)}  (para {end - start:.2f}s)')
        break
else:
    print('not found', target)
