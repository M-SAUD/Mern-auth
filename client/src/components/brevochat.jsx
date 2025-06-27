import { useEffect } from 'react';

const BrevoChat = () => {
  useEffect(() => {
    // Prevent duplicate script injection
    if (document.getElementById('brevo-chat-widget')) return;

    window.BrevoConversationsID = '6854691b01b20be933008c81';
    const script = document.createElement('script');
    script.id = 'brevo-chat-widget';
    script.async = true;
    script.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
    document.head.appendChild(script);
  }, []);

  return null; // No visible UI, only script injection
};

export default BrevoChat;
