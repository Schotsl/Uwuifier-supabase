import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchPlausible } from "../../helper.ts";

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  const updateStatistics = async () => {
    const promiseSpoke = fetchPlausible("Spoke sentence");
    const promiseCopied = fetchPlausible("Copied sentence");
    const promiseShared = fetchPlausible("Shared sentence");
    const promiseUwuified = fetchPlausible("Uwuified sentence");

    const [
      sentenceSpoke,
      sentenceCopied,
      sentenceShared,
      sentenceUwuified,
    ] = await Promise.all([
      promiseSpoke,
      promiseCopied,
      promiseShared,
      promiseUwuified,
    ]);

    await supabaseClient
      .from("statistics")
      .update({
        spoke_sentence: sentenceSpoke,
        copied_sentence: sentenceCopied,
        shared_sentence: sentenceShared,
        uwuified_sentence: sentenceUwuified,
      })
      .eq("id", "4e2e6f56-b4dc-4a38-9bf7-5d3c59321890");
  };

  await updateStatistics();

  // This function is called every minute but we want to update the index every second
  for (let i = 1; i < 59; i++) {
    setTimeout(updateStatistics, i * 1000);
  }

  return new Response(JSON.stringify({}), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
