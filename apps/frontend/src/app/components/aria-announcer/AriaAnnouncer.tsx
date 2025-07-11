import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Assertiveness = 'assertive' | 'polite';
type AriaAnnouncerContext = (msg: string, assertiveness: Assertiveness) => void;
type AriaAnnouncerProps = {
  children: ReactNode;
};

const AnnouncerContext = createContext<AriaAnnouncerContext>(() => {});

export function useAnnouncer() {
  return useContext(AnnouncerContext);
}

export default function AriaAnnouncerProvider({
  children,
}: AriaAnnouncerProps) {
  const [politeMessage, setPoliteMessage] = useState('');
  const politeQueue = useRef<string[]>([]);
  const politeBusy = useRef(false);

  const [assertiveMessage, setAssertiveMessage] = useState('');
  const assertiveQueue = useRef<string[]>([]);
  const assertiveBusy = useRef(false);

  const announce = (msg: string, assertiveness: Assertiveness = 'polite') => {
    let queue = politeQueue;
    let busy = politeBusy;
    let setMessageFn = setPoliteMessage;

    if (assertiveness === 'assertive') {
      queue = assertiveQueue;
      busy = assertiveBusy;
      setMessageFn = setAssertiveMessage;
    }

    queue.current.push(msg);
    setTimeout(() => runQueue(queue, busy, setMessageFn), 1000); // delay required to trigger announcement
  };

  const runQueue = (
    queue: React.RefObject<string[]>,
    busy: React.RefObject<boolean>,
    setMessageFn: (msg: string) => void
  ) => {
    if (busy.current || queue.current.length === 0) return;

    const next = queue.current.shift()!;
    busy.current = true;
    setMessageFn(''); // clear any previous messages to retrigger

    setTimeout(() => {
      setMessageFn(next);
      setTimeout(() => {
        busy.current = false;
        runQueue(queue, busy, setMessageFn);
      }, 1000);
    }, 10);
  };

  const assertiveContainer =
    typeof document !== 'undefined' &&
    document.getElementById('aria-live-assertive');

  const politeContainer =
    typeof document !== 'undefined' &&
    document.getElementById('aria-live-polite');

  return (
    <AnnouncerContext value={announce}>
      {children}
      {assertiveContainer &&
        createPortal(<>{assertiveMessage}</>, assertiveContainer)}
      {politeContainer && createPortal(<>{politeMessage}</>, politeContainer)}
    </AnnouncerContext>
  );
}
