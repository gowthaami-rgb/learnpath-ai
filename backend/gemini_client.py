
"""
Thin wrapper around the Google Gen AI SDK.

All AI-generation routes (roadmap, study plan, skill gap, chat, courses)
call into this module.
"""

import os
import json
import time
from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY")

MODEL_NAME = "gemini-3.1-flash-lite"

_client = None


def is_configured():
    return bool(API_KEY)


def _get_client():
    global _client
    if _client is None:
        if not API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not set. Add it to backend/.env")
        _client = genai.Client(api_key=API_KEY)
    return _client


def _is_retryable_error(error):
    """
    Return True only for temporary Gemini availability/server errors.
    """
    error_text = str(error).upper()

    retryable_errors = [
        "503",
        "UNAVAILABLE",
        "500",
        "INTERNAL",
        "502",
        "BAD GATEWAY",
        "504",
        "DEADLINE EXCEEDED",
    ]

    return any(message in error_text for message in retryable_errors)


def _generate_content_with_retry(client, prompt, config=None):
    """
    Call Gemini and automatically retry temporary server/model errors.

    Attempts:
        1st attempt → immediately
        2nd attempt → wait 2 seconds
        3rd attempt → wait 4 seconds
        4th attempt → wait 8 seconds
    """

    max_attempts = 4
    delays = [0, 2, 4, 8]

    for attempt in range(max_attempts):
        try:
            return client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=config,
            )

        except Exception as error:
            if not _is_retryable_error(error):
                raise

            if attempt == max_attempts - 1:
                raise

            delay = delays[attempt + 1]

            print(
                f"[Gemini] Temporary error ({error}). "
                f"Retrying in {delay}s... "
                f"Attempt {attempt + 2}/{max_attempts}"
            )

            time.sleep(delay)


def generate_json(prompt, system_instruction=None):
    """
    Calls Gemini with a prompt that asks for a strict JSON response,
    and parses the result.
    """

    client = _get_client()

    response = _generate_content_with_retry(
        client,
        prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
        ),
    )

    return json.loads(response.text.strip())


def generate_text(prompt, system_instruction=None):
    """
    Calls Gemini and returns a plain text response (used for chat).
    """

    client = _get_client()

    response = _generate_content_with_retry(
        client,
        prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction
        ),
    )

    return response.text.strip()

