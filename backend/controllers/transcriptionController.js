import { SpeechClient } from "@google-cloud/speech";

export const processAudioChunks = async (req, res) => {
  const speechClient = new SpeechClient();
  try {
    const audioBytes = req.body.toString("base64");

    const request = {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: "WEBM_OPUS", // may need adjustment depending on recorder settings
        sampleRateHertz: 48000,
        languageCode: "en-US",
      },
    };

    const [response] = speechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    res.json({ transcript: transcription });
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: "Transcription failed" });
  }
};
