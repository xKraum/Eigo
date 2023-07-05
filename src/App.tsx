import React, { useEffect, useState } from 'react';
import './App.scss';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
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
