import json
import argparse
from pathlib import Path


def chunk_messages(messages, chunk_size=2000):
    chunks = []
    current = []
    length = 0
    for msg in messages:
        text = msg.get('content') or msg.get('text') or ''
        if length + len(text) > chunk_size and current:
            chunks.append({"messages": current})
            current = []
            length = 0
        current.append(msg)
        length += len(text)
    if current:
        chunks.append({"messages": current})
    return chunks


def chunk_file(input_path: Path, output_path: Path, size: int):
    with input_path.open() as f:
        data = json.load(f)
    conversations = data.get('conversations', data)
    if not isinstance(conversations, list):
        raise ValueError("Unsupported data format")
    all_chunks = []
    for conv in conversations:
        messages = conv.get('messages', [])
        all_chunks.extend(chunk_messages(messages, size))
    with output_path.open('w') as f:
        json.dump(all_chunks, f, indent=2)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Chunk OpenAI conversation data.')
    parser.add_argument('input', help='Path to conversations.json from OpenAI export')
    parser.add_argument('--output', default='chunks.json', help='Where to save chunked data')
    parser.add_argument('--size', type=int, default=2000, help='Approx max characters per chunk')
    args = parser.parse_args()

    chunk_file(Path(args.input), Path(args.output), args.size)
