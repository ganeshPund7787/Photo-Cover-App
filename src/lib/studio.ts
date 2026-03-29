export async function generateRandomImage(fullPrompt: string): Promise<string> {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 512,
          height: 512,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("HuggingFace error:", errorText);
    throw new Error(`Image generation failed: ${response.status}`);
  }

  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  const base64 = buffer.toString("base64");

  return `data:image/png;base64,${base64}`;
}
