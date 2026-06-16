import { useEffect } from "react";

const TEAMS_CHAT_SCRIPT_ID = "chatbot";
const TEAMS_CHAT_SRC =
  "https://res.public.onecdn.static.microsoft/customerconnect/v1/7dttl/init.js";
const TEAMS_CHAT_ENVIRONMENT_ID = "b2e5815c-388f-e355-b74d-34ea7937fe1d";
const TEAMS_CHAT_REGION = "unitedstates";

export default function TeamsLiveChat() {
  useEffect(() => {
    if (document.getElementById(TEAMS_CHAT_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = TEAMS_CHAT_SRC;
    script.id = TEAMS_CHAT_SCRIPT_ID;
    script.setAttribute("environmentId", TEAMS_CHAT_ENVIRONMENT_ID);
    script.setAttribute("region", TEAMS_CHAT_REGION);
    script.crossOrigin = "anonymous";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
