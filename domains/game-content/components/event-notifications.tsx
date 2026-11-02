"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AGENDA_EVENTS } from "../data/event-agenda";
import { getDueEventNotifications } from "../services/event-notifications";

const PREFERENCE = "aion2-event-notifications:v1";
const DELIVERED = "aion2-event-notifications-delivered:v1";
const CHANGE = "aion2-notifications-change";

type NotificationModel = {
  enabled: boolean;
  available: boolean;
  busy: boolean;
  message: string;
  toggle: () => Promise<void>;
  test: () => Promise<void>;
};

const Context = createContext<NotificationModel | null>(null);

async function registration() {
  const worker = await navigator.serviceWorker.register("/agenda-notifications/sw.js");
  if (worker.active) return worker;
  await new Promise<void>((resolve, reject) => {
    const pending = worker.installing ?? worker.waiting;
    if (!pending) { reject(new Error("Service worker indisponível")); return; }
    const timeout = window.setTimeout(() => reject(new Error("Tempo esgotado")), 15_000);
    const check = () => {
      if (pending.state === "activated" || pending.state === "redundant") {
        window.clearTimeout(timeout);
        pending.removeEventListener("statechange", check);
        if (pending.state === "activated") resolve();
        else reject(new Error("Service worker indisponível"));
      }
    };
    pending.addEventListener("statechange", check);
    check();
  });
  return worker;
}

export function EventNotificationsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sync = () => {
      const supported = window.isSecureContext && "Notification" in window && "serviceWorker" in navigator;
      setAvailable(supported);
      try {
        setEnabled(supported && Notification.permission === "granted" && localStorage.getItem(PREFERENCE) === "true");
      } catch { setEnabled(false); }
      if (supported && Notification.permission === "denied") {
        setMessage("Notificações bloqueadas. Permita as notificações nas configurações do site no navegador.");
      }
    };
    const initial = window.setTimeout(sync, 0);
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    window.addEventListener(CHANGE, sync);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener(CHANGE, sync);
    };
  }, []);

  const toggle = useCallback(async () => {
    setBusy(true);
    setMessage("");
    try {
      if (enabled) {
        localStorage.setItem(PREFERENCE, "false");
        setEnabled(false);
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setMessage("Permita as notificações nas configurações do site para ativar os avisos.");
          return;
        }
        await registration();
        localStorage.setItem(PREFERENCE, "true");
        setEnabled(true);
      }
      window.dispatchEvent(new Event(CHANGE));
    } catch {
      setMessage("Não foi possível salvar ou ativar os avisos. Tente novamente e verifique as permissões do navegador.");
    } finally { setBusy(false); }
  }, [enabled]);

  const test = useCallback(async () => {
    setBusy(true);
    try {
      const worker = await registration();
      await worker.showNotification("AION 2 — Avisos ativados", {
        body: "Você receberá um aviso 10 minutos antes dos eventos com horário definido.",
        tag: "aion2-notification-test",
      });
      setMessage("Notificação de teste enviada. Se ela não aparecer, confira as notificações e o modo Não perturbe do sistema.");
    } catch { setMessage("Não foi possível enviar a notificação de teste. Verifique as permissões do navegador."); }
    finally { setBusy(false); }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let stopped = false;
    const deliver = async () => {
      if (stopped || Notification.permission !== "granted" || localStorage.getItem(PREFERENCE) !== "true") return;
      const now = Date.now();
      const events = getDueEventNotifications(AGENDA_EVENTS, now);
      if (!events.length) return;
      const worker = await registration();
      if (stopped || localStorage.getItem(PREFERENCE) !== "true") return;
      let ledger: Record<string, number> = {};
      try { ledger = JSON.parse(localStorage.getItem(DELIVERED) ?? "{}"); } catch { /* Reset invalid history. */ }
      if (!ledger || typeof ledger !== "object" || Array.isArray(ledger)) ledger = {};
      ledger = Object.fromEntries(Object.entries(ledger).filter(([, at]) => typeof at === "number" && at > now));
      for (const event of events) {
        const key = `${event.id}:${event.at}`;
        if (ledger[key]) continue;
        const minutes = Math.max(1, Math.ceil((event.at - Date.now()) / 60_000));
        if (event.at <= Date.now()) continue;
        await worker.showNotification(`AION 2 — ${event.title}`, {
          body: `Começa em ${minutes} min, às ${new Date(event.at).toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" })} (BRT).`,
          tag: key,
        });
        ledger[key] = event.at;
        localStorage.setItem(DELIVERED, JSON.stringify(ledger));
      }
    };
    const check = () => {
      const task = navigator.locks ? navigator.locks.request("aion2-event-notifications", deliver) : deliver();
      void task.catch(() => setMessage("Falha ao enviar um aviso. Verifique as permissões e o armazenamento do navegador."));
    };
    const initial = window.setTimeout(check, 0);
    const timer = window.setInterval(check, 15_000);
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      stopped = true;
      window.clearTimeout(initial);
      window.clearInterval(timer);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [enabled]);

  return <Context.Provider value={{ enabled, available, busy, message, toggle, test }}>{children}</Context.Provider>;
}

export function useEventNotifications() {
  const model = useContext(Context);
  if (!model) throw new Error("EventNotificationsProvider ausente");
  return model;
}
