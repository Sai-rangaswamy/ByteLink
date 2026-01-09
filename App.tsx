import React from 'react';
import { store } from './services/store';
import { initializeGemini } from './services/geminiService';
import { ViewState } from './types';
import { Shield } from 'lucide-react';

// Components & Pages
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import FindCollaborators from './pages/FindCollaborators';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

const App: React.FC = () => {
  const [view, setView] = React.useState<ViewState>(ViewState.LANDING);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);
  const [selectedUserProfileId, setSelectedUserProfileId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [previousView, setPreviousView] = React.useState<ViewState>(ViewState.LANDING);

  React.useEffect(() => {
    initializeGemini();
    const user = store.getCurrentUser();
    if (user) {
      setView(ViewState.DASHBOARD);
    } else {
      setView(ViewState.LANDING);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (userId?: string) => {
    const user = await store.login(userId);
    // If it's a pre-populated mock user, skip onboarding
    if (user.college && user.skillsHave.length > 0) {
        setView(ViewState.DASHBOARD);
    } else {
        setView(ViewState.ONBOARDING);
    }
  };

  const handleLogout = () => {
    store.logout();
    setView(ViewState.LANDING);
  };

  const navigate = (newView: ViewState) => {
    setView(newView);
    if (newView !== ViewState.PROJECT_DETAIL) {
        setSelectedProjectId(null);
    }
    if (newView !== ViewState.USER_PROFILE) {
        setSelectedUserProfileId(null);
    }
  };

  const enterAdminMode = () => {
      setPreviousView(view);
      setView(ViewState.ADMIN);
  };

  const exitAdminMode = () => {
      setView(previousView);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (view === ViewState.ADMIN) {
      return <AdminPanel onBack={exitAdminMode} />;
  }

  // Admin Button (Floating)
  const AdminButton = () => (
      <button 
        onClick={enterAdminMode}
        className="fixed bottom-4 right-4 z-50 bg-slate-900 text-slate-400 p-2 rounded-full shadow-lg hover:text-white hover:scale-110 transition-all border border-slate-700"
        title="Admin Mode"
      >
          <Shield size={20} />
      </button>
  );

  if (view === ViewState.LANDING) {
    return (
        <>
            <Landing onLogin={handleLogin} />
            <AdminButton />
        </>
    );
  }

  if (view === ViewState.ONBOARDING) {
    return (
        <>
            <Onboarding onComplete={() => navigate(ViewState.DASHBOARD)} />
            <AdminButton />
        </>
    );
  }

  return (
    <>
        <Layout currentView={view} onNavigate={navigate} onLogout={handleLogout}>
        {view === ViewState.DASHBOARD && (
            <Dashboard 
            onSelectProject={(id) => {
                setSelectedProjectId(id);
                navigate(ViewState.PROJECT_DETAIL);
            }} 
            onViewProfile={(id) => {
                setSelectedUserProfileId(id);
                setView(ViewState.USER_PROFILE);
            }}
            />
        )}
        
        {view === ViewState.PROJECT_DETAIL && selectedProjectId && (
            <ProjectDetail 
            projectId={selectedProjectId} 
            onBack={() => navigate(ViewState.DASHBOARD)} 
            onViewProfile={(id) => {
                setSelectedUserProfileId(id);
                setView(ViewState.USER_PROFILE);
            }}
            />
        )}

        {view === ViewState.FIND_COLLABORATORS && (
            <FindCollaborators 
            onViewProfile={(id) => {
                setSelectedUserProfileId(id);
                setView(ViewState.USER_PROFILE);
            }}
            />
        )}

        {/* My Profile */}
        {view === ViewState.PROFILE && (
            <Profile />
        )}

        {/* Other User Profile */}
        {view === ViewState.USER_PROFILE && selectedUserProfileId && (
            <Profile 
                userId={selectedUserProfileId} 
                onBack={() => navigate(ViewState.FIND_COLLABORATORS)}
            />
        )}
        </Layout>
        <AdminButton />
    </>
  );
};

export default App;