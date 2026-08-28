import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// PWA: mantém o app instalado sempre na mesma versão publicada no Vercel.
// registerType 'autoUpdate' já ativa e recarrega sozinho quando encontra uma
// versão nova, mas o navegador só checa por padrão ao abrir o app; aqui
// forçamos checagens extras (a cada hora e sempre que o app volta ao
// primeiro plano) para detectar deploys novos mesmo com o app aberto.
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      const checarAtualizacao = () => registration.update().catch(() => {});
      setInterval(checarAtualizacao, 60 * 60 * 1000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checarAtualizacao();
      });
    },
    onNeedRefresh() {
      // Sem prompt ao usuário: ativa a versão nova e recarrega automaticamente
      updateSW(true);
    },
  });
}
