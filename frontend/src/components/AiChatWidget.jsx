import React, { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

const AiChatWidget = () => {
  useEffect(() => {
    // Mencegah inisialisasi ganda
    if (document.querySelector('.n8n-chat-widget')) return;

    createChat({
      // 👇 INI URL KAMU YANG BARU
      webhookUrl: 'https://wjjhsdas4yr8bwvto5iyrj4f.hooks.n8n.cloud/webhook/7f1fa7e4-d053-4e81-b407-bc638c310f5b/chat',
      
      mode: 'window', 
      target: '#n8n-chat', 
      chatInputKey: 'chatInput', 
      chatSessionKey: 'sessionId',
      
      metadata: {
        appName: 'LifeMon',
        page: 'ReportPage'
      },

      showWelcomeScreen: true, 
      defaultLanguage: 'en',
      initialMessages: [
        'Halo! Saya LifeMon AI Assistant. 🤖',
        'Tanya saya tentang nutrisi, kalori, atau analisa grafik kesehatanmu!'
      ],
      
      i18n: {
        en: {
          title: 'LifeMon AI Assistant',
          subtitle: 'Asisten Gizi & Kesehatan',
          footer: 'Powered by LifeMon AI',
          getStarted: 'Mulai Chat',
          inputPlaceholder: 'Ketik pertanyaanmu...',
        },
      },

      style: {
        width: 400,
        height: 600,
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 9999,
        
        colors: {
          primary: '#2563eb',
          secondary: '#eff6ff',
          typography: '#1e293b',
          background: '#ffffff',
          inputBackground: '#f8fafc',
        },
        
        button: {
          backgroundColor: '#2563eb',
          iconColor: '#ffffff',
        }
      },
    });
  }, []);

  return <div id="n8n-chat"></div>;
};

export default AiChatWidget;