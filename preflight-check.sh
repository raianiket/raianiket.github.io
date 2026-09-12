#!/bin/bash
# Run this a few minutes before the interview to confirm the LLM fallback
# is ready and pre-warm the model so the first real question isn't slow.
echo "Checking Ollama..."
if ! curl -sf http://localhost:11434/api/tags > /dev/null; then
  echo "Ollama is NOT running. Starting it..."
  brew services start ollama
  sleep 3
fi
echo "Warming up llama3.2:1b..."
curl -s http://localhost:11434/api/chat -d '{"model":"llama3.2:1b","stream":false,"messages":[{"role":"user","content":"hi"}],"options":{"num_predict":1}}' > /dev/null
echo "Ready. Ollama is up and the model is warm."
