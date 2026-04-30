export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-2xl font-bold text-white mt-3">Mundial 2026</h1>
          <p className="text-gray-500 text-sm mt-1">Tu álbum de figuritas</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-yellow-800 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <h2 className="font-bold text-yellow-400">Configuración necesaria</h2>
              <p className="text-gray-400 text-sm">La app necesita una base de datos Firebase para funcionar.</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {[
              { n: '1', text: 'Creá un proyecto gratuito en', link: 'https://console.firebase.google.com', linkText: 'Firebase Console' },
              { n: '2', text: 'Agregá una app web (ícono </>) y copiá las credenciales' },
              { n: '3', text: 'Activá Authentication → Sign-in method → Email/Password' },
              { n: '4', text: 'Activá Firestore Database (modo test para empezar)' },
              { n: '5', text: 'Creá un archivo .env.local en la raíz del proyecto con las credenciales' },
              { n: '6', text: 'Ejecutá npm run build y volvé a abrir este archivo' },
            ].map(step => (
              <div key={step.n} className="flex gap-3 items-start">
                <span className="bg-green-800 text-green-200 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  {step.n}
                </span>
                <p className="text-gray-300">
                  {step.text}{' '}
                  {step.link && (
                    <a href={step.link} className="text-green-400 underline" target="_blank" rel="noreferrer">
                      {step.linkText}
                    </a>
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl p-4 font-mono text-xs text-gray-300 space-y-1">
            <p className="text-gray-500 mb-2"># Contenido del archivo .env.local:</p>
            <p>VITE_FIREBASE_API_KEY=tu_api_key</p>
            <p>VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com</p>
            <p>VITE_FIREBASE_PROJECT_ID=tu_proyecto</p>
            <p>VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com</p>
            <p>VITE_FIREBASE_MESSAGING_SENDER_ID=123456789</p>
            <p>VITE_FIREBASE_APP_ID=1:123456789:web:abc</p>
          </div>
        </div>
      </div>
    </div>
  )
}
