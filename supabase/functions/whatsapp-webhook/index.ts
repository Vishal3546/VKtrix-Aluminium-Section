import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") || "my_secret_token";
const SPRING_BOOT_URL = Deno.env.get("SPRING_BOOT_URL") || "http://host.docker.internal:8080/api/whatsapp/webhook";

serve(async (req) => {
  const url = new URL(req.url);

  // 1. WhatsApp Webhook Verification (GET)
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // 2. WhatsApp Message Received (POST)
  if (req.method === "POST") {
    try {
      const payload = await req.json();
      console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

      // Quick validation
      if (payload.object !== "whatsapp_business_account") {
        return new Response("Not a WhatsApp event", { status: 404 });
      }

      // We extract the first entry and first change to forward
      const entry = payload.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages && value.messages.length > 0) {
        const message = value.messages[0];
        const contact = value.contacts?.[0];
        
        console.log(`Forwarding message from ${contact?.wa_id} to Spring Boot`);

        // Forward to Spring Boot
        // We don't await the response to ensure we return 200 OK quickly to WhatsApp
        // But in Deno Deploy, background tasks require passing the promise if we want it to run after response.
        // For simplicity, we await it but set a short timeout if possible, or just await it normally.
        // If the LLM takes too long, WhatsApp might retry. Spring Boot should ideally handle idempotency.
        
        fetch(SPRING_BOOT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wa_id: contact?.wa_id,
            name: contact?.profile?.name,
            message: message
          })
        }).catch(err => console.error("Error forwarding to Spring Boot:", err));
      }

      // WhatsApp requires a 200 OK response to acknowledge receipt
      return new Response("EVENT_RECEIVED", { status: 200 });
    } catch (e) {
      console.error("Error processing webhook:", e);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
});
