
import React, { useState, useEffect } from 'react';
import type { User } from './types';
import { AppView } from './types';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CourseCatalog from './components/CourseCatalog';
import { LEHIGH_COLORS } from './constants';

const Header: React.FC<{ onLogout: () => void; onNavigate: (view: AppView) => void; currentView: AppView; }> = ({ onLogout, onNavigate, currentView }) => {
  return (
    <header className="sticky top-0 z-40 w-full shadow-md backdrop-blur-md" style={{backgroundColor: `${LEHIGH_COLORS.white}E6`}}>
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <h1 className="text-xl font-bold cursor-pointer" style={{color: LEHIGH_COLORS.brown}} onClick={() => onNavigate(AppView.DASHBOARD)}>Lehigh Linc-Up</h1>
        <nav className="flex items-center gap-4">
            <button 
                onClick={() => onNavigate(AppView.DASHBOARD)} 
                className={`font-semibold ${currentView === AppView.DASHBOARD ? `border-b-2` : ''}`}
                style={{borderColor: LEHIGH_COLORS.brown, color: LEHIGH_COLORS.brown}}>
                Dashboard
            </button>
            <button 
                onClick={() => onNavigate(AppView.COURSE_CATALOG)} 
                className={`font-semibold ${currentView === AppView.COURSE_CATALOG ? `border-b-2` : ''}`}
                style={{borderColor: LEHIGH_COLORS.brown, color: LEHIGH_COLORS.brown}}>
                Courses
            </button>
            <button onClick={onLogout} className="px-4 py-2 text-sm text-white rounded-md" style={{backgroundColor: LEHIGH_COLORS.lightBrown}}>Logout</button>
        </nav>
      </div>
    </header>
  );
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load.
    // NOTE: This is for demonstration. A real app would use secure tokens.
    const loggedInUserEmail = localStorage.getItem('currentUser');
    if (loggedInUserEmail) {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = storedUsers.find((u: User) => u.email === loggedInUserEmail);
      if (user) {
        // We only store the email and profile, never the password in the session.
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
      }
    }
  }, []);

  const handleAuthSuccess = (user: User) => {
    // Remove password before setting in state or localStorage 'currentUser'
    const { password, ...userToStore } = user;
    setCurrentUser(userToStore);
    localStorage.setItem('currentUser', user.email);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const userIndex = storedUsers.findIndex(u => u.email === updatedUser.email);
    if (userIndex > -1) {
      // Keep existing password when updating user profile
      const existingPassword = storedUsers[userIndex].password;
      storedUsers[userIndex] = { ...updatedUser, password: existingPassword };
      localStorage.setItem('users', JSON.stringify(storedUsers));
    }
  };
  
  const renderContent = () => {
    if (!currentUser) {
      return <Auth onAuthSuccess={handleAuthSuccess} />;
    }
    
    let content;
    switch(currentView) {
      case AppView.COURSE_CATALOG:
        content = <CourseCatalog />;
        break;
      case AppView.DASHBOARD:
      default:
        content = <Dashboard user={currentUser} onUpdateUser={handleUpdateUser} onNavigate={setCurrentView} />;
    }

    return (
      <div className="min-h-screen" style={{backgroundColor: LEHIGH_COLORS.offWhite}}>
        <Header onLogout={handleLogout} onNavigate={setCurrentView} currentView={currentView}/>
        <main>
          {content}
        </main>
      </div>
    );
  };

  return renderContent();
};

export default App;
