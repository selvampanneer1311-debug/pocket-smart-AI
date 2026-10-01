/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppTab, User, HistoryRecord } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeLanding } from './components/HomeLanding';
import { Dashboard } from './components/Dashboard';
import { HomePlanner } from './components/HomePlanner';
import { PartyPlanner } from './components/PartyPlanner';
import { JewelryPlanner } from './components/JewelryPlanner';
import { HistoryPage } from './components/HistoryPage';
import { AuthModal } from './components/AuthModal';
import { PrintModal } from './components/PrintModal';
import { fetchHistory, saveHistory, deleteHistory } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [currency, setCurrency] = useState<string>('₹');

  // User state: Default logged in as 'sai' matching Page 31 screenshot "Welcome, sai!"
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('pocketsmart_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      username: 'sai',
      email: 'sai.planner@pocketsmart.ai',
      fullName: 'Sai Planner',
      isLoggedIn: true
    };
  });

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalRegister, setAuthModalRegister] = useState<boolean>(false);

  // Print modal state
  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);
  const [printTitle, setPrintTitle] = useState<string>('');
  const [printData, setPrintData] = useState<any>(null);

  // Loaded result state for re-examining from history
  const [loadedHomeResult, setLoadedHomeResult] = useState<any>(null);
  const [loadedPartyResult, setLoadedPartyResult] = useState<any>(null);
  const [loadedJewelryResult, setLoadedJewelryResult] = useState<any>(null);

  // Fetch initial history
  useEffect(() => {
    fetchHistory().then((data) => {
      if (Array.isArray(data)) {
        setHistory(data);
      }
    });
  }, []);

  const handleLogout = () => {
    const loggedOutUser: User = { username: '', isLoggedIn: false };
    setUser(loggedOutUser);
    localStorage.removeItem('pocketsmart_user');
    setCurrentTab('landing');
  };

  const handleOpenAuth = (isRegister: boolean) => {
    setAuthModalRegister(isRegister);
    setAuthModalOpen(true);
  };

  const handleSaveToHistory = async (record: {
    type: 'home' | 'party' | 'jewelry';
    total_budget: number;
    currency: string;
    remaining_budget: number;
    input_summary: string;
    summary: string;
    full_result: any;
  }) => {
    try {
      const saved = await saveHistory(record);
      setHistory((prev) => [saved, ...prev]);
    } catch (err) {
      console.error('Failed to save to history:', err);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    await deleteHistory(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenPrint = (title: string, data: any) => {
    setPrintTitle(title);
    setPrintData(data);
    setPrintModalOpen(true);
  };

  const handleLoadPlanIntoPlanner = (record: HistoryRecord) => {
    if (record.type === 'home') {
      setLoadedHomeResult(record.full_result);
      setCurrentTab('home-planner');
    } else if (record.type === 'party') {
      setLoadedPartyResult(record.full_result);
      setCurrentTab('party-planner');
    } else if (record.type === 'jewelry') {
      setLoadedJewelryResult(record.full_result);
      setCurrentTab('jewelry-planner');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 font-sans text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <HomeLanding
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            user={user}
            onNavigate={(tab) => setCurrentTab(tab)}
            recentHistory={history}
            onSelectHistoryItem={(item) => handleLoadPlanIntoPlanner(item)}
            currency={currency}
          />
        )}

        {currentTab === 'home-planner' && (
          <HomePlanner
            currency={currency}
            onSaveToHistory={handleSaveToHistory}
            onPrint={handleOpenPrint}
            initialResult={loadedHomeResult}
          />
        )}

        {currentTab === 'party-planner' && (
          <PartyPlanner
            currency={currency}
            onSaveToHistory={handleSaveToHistory}
            onPrint={handleOpenPrint}
            initialResult={loadedPartyResult}
          />
        )}

        {currentTab === 'jewelry-planner' && (
          <JewelryPlanner
            currency={currency}
            onSaveToHistory={handleSaveToHistory}
            onPrint={handleOpenPrint}
            initialResult={loadedJewelryResult}
          />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            history={history}
            onDeleteHistory={handleDeleteHistory}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenPrint={handleOpenPrint}
            onLoadPlanIntoPlanner={handleLoadPlanIntoPlanner}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isRegisterInitial={authModalRegister}
        onSuccess={(newUser) => {
          setUser(newUser);
          setCurrentTab('dashboard');
        }}
      />

      {/* Print / Save Modal */}
      <PrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        title={printTitle}
        data={printData}
      />
    </div>
  );
}
