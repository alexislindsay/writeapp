# Writeapp OpenAI Data API

This project includes a small Python utility and web API for turning an OpenAI data export into an HTTP service. The intent is to host the API on platforms such as Railway.

## Chunking OpenAI Data

The `chunk_openai_data.py` script processes the `conversations.json` file from an OpenAI user data download. The conversations are split into smaller chunks for easier consumption by a chatbot or other clients.

```
python3 chunk_openai_data.py /path/to/conversations.json --output chunks.json --size 2000
```

`--size` controls the approximate maximum number of characters per chunk.

## Running the API

The provided `app.py` uses Flask. It loads the generated `chunks.json` file and exposes two endpoints:

- `/chunks` returns the entire list of chunks.
- `/chunk/<index>` returns a specific chunk by index.

Use environment variable `DATA_FILE` to point to a custom chunk file and `PORT` to select the port (useful for Railway).

```
export DATA_FILE=chunks.json
export PORT=8000
python3 app.py
```

The API will be available at `http://localhost:8000/`.
