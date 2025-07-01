import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockAuth } from "../auth/mockAuth";

// Список разрешенных источников для iframe событий
const ACCEPTED_EVENT_ORIGINS: ReadonlySet<string> = new Set([
  // Добавьте сюда домены, которые могут отправлять события
  "http://localhost:3000",
  "https://your-host-app.com",
  // Можно добавить другие домены по необходимости
]);

interface CustomEventData<TType extends string> {
  type: TType;
}

// Событие навигации
interface NavigationEventData extends CustomEventData<"NAVIGATION"> {
  target: string; // URL или путь для навигации
}

// Событие аутентификации
interface AuthenticationEventData extends CustomEventData<"AUTHENTICATION"> {
  email: string;
  password: string;
}

type IframeEventMessage = MessageEvent<NavigationEventData | AuthenticationEventData>;

export default function useIframeEvents() {
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, что мы в браузере
    if (typeof window === 'undefined') return;

    const handleIframeMessage = async (event: IframeEventMessage) => {
      const { data, origin } = event;
      
      // Проверяем, что источник разрешен
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
              
              // Отправляем подтверждение обратно в родительское окно
              window.parent.postMessage({
                type: "AUTHENTICATION_SUCCESS",
                email: data.email
              }, origin);
              
            } catch (error) {
              console.error("Authentication failed:", error);
              
              // Отправляем ошибку обратно в родительское окно
              window.parent.postMessage({
                type: "AUTHENTICATION_ERROR",
                error: error instanceof Error ? error.message : "Authentication failed"
              }, origin);
              
              // Показываем popup с деталями логина, если аутентификация не удалась
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

    // Добавляем слушатель событий
    window.addEventListener("message", handleIframeMessage);

    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [navigate]);

  useEffect(() => {
    // Проверяем, что мы в браузере
    if (typeof window === 'undefined') return;

    // Проверяем, находимся ли мы в iframe
    const isInIframe = window.self !== window.top;

    if (!isInIframe) return;

    let parentOrigin: string | null = null;

    try {
      // Безопасно извлекаем origin родительского фрейма
      parentOrigin = new URL(document.referrer).origin;
    } catch {
      // Если не можем получить referrer, пробуем другие способы
      try {
        parentOrigin = window.location.ancestorOrigins?.[0] || null;
      } catch {
        parentOrigin = null;
      }
    }

    // Отправляем сообщение о готовности только разрешенному родительскому окну
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
