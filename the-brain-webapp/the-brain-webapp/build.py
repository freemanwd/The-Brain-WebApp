"""Build a self-contained HTML edition. No third-party Python packages required."""
from pathlib import Path
from urllib.parse import quote
import re

ROOT = Path(__file__).resolve().parent

def build(output: Path | None = None) -> Path:
    output = output or ROOT.parent / 'the-brain.html'
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    css = (ROOT / 'app.css').read_text(encoding='utf-8')
    data = (ROOT / 'cases.js').read_text(encoding='utf-8')
    js = (ROOT / 'app.js').read_text(encoding='utf-8')
    # The direct-open edition does not request a manifest or service worker.
    js = re.sub(r'// Static-host build only\.[\s\S]*?(?=\n\}\)\(\);)', '', js)
    html = html.replace('<link rel="stylesheet" href="app.css">', '<style>\n' + css + '\n</style>')
    html = re.sub(r'<script defer src="(?:cases|app)\.js"></script>\n?', '', html)
    html = html.replace('<link rel="manifest" href="manifest.webmanifest">', '')
    svg = (ROOT / 'assets' / 'icon.svg').read_text(encoding='utf-8')
    html = html.replace('href="assets/icon.svg"', 'href="data:image/svg+xml,' + quote(svg, safe='') + '"')
    html = html.replace('</body>', '<script>\n' + data + '\n</script>\n<script>\n' + js + '\n</script>\n</body>')
    output.write_text(html, encoding='utf-8')
    return output

if __name__ == '__main__':
    print(build())
