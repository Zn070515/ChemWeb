import json
import re
from pathlib import Path

import pdfplumber

DATA_DIR = Path(r"C:\Users\16275\Desktop\ChemWeb\public\data")
SOURCES_DIR = DATA_DIR / "sources"

FILES = [
    {
        "path": SOURCES_DIR / "pka-compilation-williams.pdf",
        "source": "Williams compilation",
        "solvent": "water"
    },
    {
        "path": SOURCES_DIR / "pka-compilation-reich-bordwell.pdf",
        "source": "Reich-Bordwell compilation",
        "solvent": "dmso"
    }
]

FLOAT_RE = re.compile(r"(?<!\d)(-?\d+(?:\.\d+)?)(\*?)")


def normalize_line(line: str) -> str:
    return re.sub(r"\s+", " ", line).strip()


def should_skip(line: str) -> bool:
    lowered = line.lower()
    return (
        not line
        or "provided by" in lowered
        or "updated" in lowered
        or "page" in lowered
        or "index" in lowered
        or "copyright" in lowered
        or "author" in lowered
        or "references" in lowered
        or "table" in lowered
        or "compound pk" in lowered
    )


def parse_pdf(file_path: Path, source: str, solvent: str) -> list[dict]:
    entries = []
    with pdfplumber.open(file_path) as pdf:
        for page_index, page in enumerate(pdf.pages):
            if page_index == 0:
                continue
            text = page.extract_text() or ""
            for raw_line in text.splitlines():
                line = normalize_line(raw_line)
                if should_skip(line):
                    continue
                matches = FLOAT_RE.findall(line)
                if not matches:
                    continue
                numbers = [float(v[0]) for v in matches]
                if len(numbers) > 1 and matches[-1][0].isdigit():
                    numbers = numbers[:-1]
                pka_values = [v for v in numbers if -5 <= v <= 50]
                if not pka_values:
                    continue
                name = normalize_line(FLOAT_RE.sub("", line))
                if not name or len(name) < 2:
                    continue
                temp_match = re.search(r"(\d+)(?:\s*°|\s*\(\d+)", line)
                temperature_c = int(temp_match.group(1)) if temp_match else None
                entries.append(
                    {
                        "name": name,
                        "pKaValues": pka_values,
                        "temperatureC": temperature_c,
                        "solvent": solvent,
                        "source": source,
                        "raw": line,
                    }
                )
    return entries


def main() -> None:
    all_entries = []
    for item in FILES:
        if not item["path"].exists():
            continue
        all_entries.extend(parse_pdf(item["path"], item["source"], item["solvent"]))

    output = {
        "generatedAt": "2026-02-09",
        "count": len(all_entries),
        "entries": all_entries,
    }
    output_path = DATA_DIR / "pka_compiled.json"
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
