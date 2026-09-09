import React, { createContext, useState, useEffect, useContext } from 'react';

const PortfolioContext = createContext();

export function usePortfolio() {
  return useContext(PortfolioContext);
}

export function PortfolioProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [docs, setDocs] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [approvedMessages, setApprovedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [projectsRes, expRes, docsRes, certsRes, messagesRes, approvedMessagesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/experiences'),
        fetch('/api/docs'),
        fetch('/api/certificates'),
        fetch('/api/messages'),
        fetch('/api/messages/approved')
      ]);

      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
      if (docsRes.ok) setDocs(await docsRes.json());
      if (certsRes.ok) setCertificates(await certsRes.json());
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
      projects, experiences, docs, certificates, messages, approvedMessages, isLoading, refreshData
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}
