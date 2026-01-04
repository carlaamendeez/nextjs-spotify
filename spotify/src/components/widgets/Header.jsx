'use client';

import { useRouter } from 'next/navigation';
import { clearTokens } from '@/lib/auth';
import styles from './Header.module.css';

export default function Header({ user }) {
  const router = useRouter();
  
  const handleLogout = () => {
    clearTokens();
    router.push('/');
  };
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo y título */}
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            S
          </div>
          <div>
            <h1 className={styles.title}>Spotify Taste Mixer</h1>
            <p className={styles.subtitle}>Dashboard</p>
          </div>
        </div>
        
        {/* Información del usuario y logout */}
        <div className={styles.userContainer}>
          {user && (
            <div className={styles.userInfo}>
              {user.images && user.images[0] && (
                <img
                  src={user.images[0].url}
                  alt={user.display_name}
                  className={styles.userImage}
                />
              )}
              <div className={styles.userText}>
                <p className={styles.userName}>
                  {user.display_name || user.email}
                </p>
                <p className={styles.userPlan}>
                  {user.product === 'premium' ? 'Premium' : 'Gratuito'}
                </p>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}