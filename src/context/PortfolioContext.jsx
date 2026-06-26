import React, { createContext, useState, useEffect, useContext } from 'react';

const PortfolioContext = createContext();

export function usePortfolio() {
  return useContext(PortfolioContext);
}

export function PortfolioProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [approvedMessages, setApprovedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [projectsRes, expRes, docsRes, messagesRes, approvedMessagesRes] = await Promise.all([
        fetch('http://localhost:5000/api/projects'),
        fetch('http://localhost:5000/api/experiences'),
        fetch('http://localhost:5000/api/docs'),
        fetch('http://localhost:5000/api/messages'),
        fetch('http://localhost:5000/api/messages/approved')
      ]);

      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
      if (docsRes.ok) setDocs(await docsRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (approvedMessagesRes.ok) setApprovedMessages(await approvedMessagesRes.json());
    } catch (error) {
      console.error("Failed to fetch data from API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // For Admin to force refresh after mutation
  const refreshData = () => {
    fetchData();
  };

  return (
    <PortfolioContext.Provider value={{
      projects, experiences, docs, messages, approvedMessages, isLoading, refreshData
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}
