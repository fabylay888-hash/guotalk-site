"""Normalise narration text into words a speech aligner can match (numbers spelled out)."""
import re
ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'zero ten twenty thirty forty fifty sixty seventy eighty ninety'.split()

def words(n):
    if n < 20: return [ONES[n]]
    if n < 100: return [TENS[n // 10]] + (words(n % 10) if n % 10 else [])
    if n < 1000: return words(n // 100) + ['hundred'] + (words(n % 100) if n % 100 else [])
    for size, name in ((10**6, 'million'), (1000, 'thousand')):
        if n >= size: return words(n // size) + [name] + (words(n % size) if n % size else [])

def year(n):
    if 2000 <= n < 2010: return ['two', 'thousand'] + (words(n % 10) if n % 10 else [])
    return words(n // 100) + words(n % 100)

def norm(text):
    t = text.replace('–', ' to ').replace('%', ' percent').replace('$', '')
    t = re.sub(r'(\d),(\d{3})', r'\1\2', t)
    t = re.sub(r'(\d+)\.(\d+)', lambda m: ' '.join(words(int(m.group(1))) + ['point'] + [ONES[int(c)] for c in m.group(2)]), t)
    t = re.sub(r'\d+', lambda m: ' '.join(year(int(m.group(0))) if 1900 <= int(m.group(0)) <= 2099 else words(int(m.group(0)))), t)
    return re.findall(r"[a-z']+", t.lower().replace('-', ' '))
