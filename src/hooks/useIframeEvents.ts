import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockAuth } from "../auth/mockAuth";

// List of allowed origins for iframe events
const ACCEPTED_EVENT_ORIGINS: ReadonlySet<string> = new Set([
  // Add domains that can send events here
  "http://localhost:3000",
  "https://your-host-app.com",
  // You can add other domains as needed
]);

interface CustomEventData<TType extends string> {
  type: TType;
}

// Navigation event
interface NavigationEventData extends CustomEventData<"NAVIGATION"> {
  target: string; // URL or path for navigation
}

// Authentication event
interface AuthenticationEventData extends CustomEventData<"AUTHENTICATION"> {
  email: string;
  password: string;
}

type IframeEventMessage = MessageEvent<NavigationEventData | AuthenticationEventData>;

export default function useIframeEvents() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check that we are in the browser
    if (typeof window === 'undefined') return;

    const handleIframeMessage = async (event: IframeEventMessage) => {
      const { data, origin } = event;
      
      // Check that the source is allowed
      if (!ACCEPTED_EVENT_ORIGINS.has(origin)) {
        console.warn(`Ignored iframe message from unauthorized origin: ${origin}`);
        return;
      }

      try {
        switch (data.type) {
          case "NAVIGATION":
            console.log(`Navigating to: ${data.target}`);
            navigate(data.target);
            break;

          case "AUTHENTICATION":
            console.log(`Authentication attempt for: ${data.email}`);
            try {
              await mockAuth.signIn(data.email, data.password);
              console.log("Authentication successful");
              
              // Send confirmation back to parent window
              window.parent.postMessage({
                type: "AUTHENTICATION_SUCCESS",
                email: data.email
              }, origin);
              
            } catch (error) {
              console.error("Authentication failed:", error);
              
              // Send error back to parent window
              window.parent.postMessage({
                type: "AUTHENTICATION_ERROR",
                error: error instanceof Error ? error.message : "Authentication failed"
              }, origin);
              
              // Show popup with login details if authentication failed
              alert(`Login failed for ${data.email}. Please check your credentials.`);
            }
            break;

          default:
            console.warn(`Unknown iframe event type: ${(data as any).type}`);
        }
      } catch (error) {
        console.error("Error handling iframe message:", error);
      }
    };

    // Add event listener
    window.addEventListener("message", handleIframeMessage);

    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [navigate]);

  useEffect(() => {
    // Check that we are in the browser
    if (typeof window === 'undefined') return;

    // Check if we are in an iframe
    const isInIframe = window.self !== window.top;

    if (!isInIframe) return;

    let parentOrigin: string | null = null;

    try {
      // Safely extract the origin of the parent frame
      parentOrigin = new URL(document.referrer).origin;
    } catch {
      // If we can't get referrer, try other methods
      try {
        parentOrigin = window.location.ancestorOrigins?.[0] || null;
      } catch {
        parentOrigin = null;
      }
    }

    // Send ready message only to allowed parent window
    if (parentOrigin && ACCEPTED_EVENT_ORIGINS.has(parentOrigin)) {
      console.log(`Sending ready message to parent: ${parentOrigin}`);
      window.parent.postMessage({ 
        type: "IFRAME_READY",
        timestamp: Date.now()
      }, parentOrigin);
    } else {
      console.log("No valid parent origin found or not in accepted list");
    }
  }, []);
}
