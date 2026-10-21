import React, { useState } from 'react';
import LoginScreen from '@/screens/LoginScreen';
import HomeScreen from '@/screens/HomeScreen';

// aqui decidimos que pantalla mostrar segun si el usuario inicio sesion o no
export default function AppEntry() {
  // guardamos el correo del usuario cuando entra (si es null muestra login)
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // si ya tenemos el correo, mostramos la pantalla home
  if (userEmail) {
    return (
      <HomeScreen
        email={userEmail}
        onLogout={() => setUserEmail(null)} // al cerrar sesion vuelve a dejarlo en null para ir a login
      />
    );
  }

  // si no ha iniciado sesion, mostramos la pantalla login
  return <LoginScreen onLogin={(email) => setUserEmail(email)} />;
}
