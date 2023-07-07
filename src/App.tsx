import React, { useEffect, useState } from 'react';
import './App.scss';
import Layout from './components/navigation-layout/NavigationLayout';

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isUserLoggedIn = true;

  useEffect(() => {
    const handleWindowSizeChange = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener('resize', handleWindowSizeChange);
    return () => window.removeEventListener('resize', handleWindowSizeChange);
  }, []);

  return (
    <div className="App">
      {isUserLoggedIn ? (
        <Layout isMobile={isMobile}>
          <div className="content" />
        </Layout>
      ) : (
        <div className="content" />
      )}
    </div>
  );
};

export default App;
