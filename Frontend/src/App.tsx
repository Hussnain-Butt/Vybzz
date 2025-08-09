// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// --- Import Layouts and Pages ---

// Import the new layout component
import MainLayout from './components/Layout/MainLayout'

// Import your pages
import Landing from './pages/Landing'
import GetToKnowYourListeners from './pages/Podcasters/GetToKnowYourListeners'
import LoginPage from './pages/Auth/LoginPage'

// Import Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome'
import Library from './pages/dashboard/Library'
import Audience from './pages/dashboard/Audience'
import Insights from './pages/dashboard/Insights'
import Payouts from './pages/dashboard/Payouts'
import Promotions from './pages/dashboard/Promotions'
import Community from './pages/dashboard/Community'
import Notifications from './pages/dashboard/Notifications'
import Settings from './pages/dashboard/Settings'
import DashboardLayout from './components/Layout/DashboardLayout'
import PostsPage from './pages/dashboard/library/PostsPage'
import CollectionsPage from './pages/dashboard/library/CollectionsPage'
import DraftsPage from './pages/dashboard/library/DraftsPage'
import RelationshipManagerPage from './pages/dashboard/audience/RelationshipManagerPage'
import BenefitsPage from './pages/dashboard/audience/BenefitsPage'
import ExitSurveysPage from './pages/dashboard/audience/ExitSurveysPage'
import MembershipPage from './pages/dashboard/insights/MembershipPage'
import EarningsPage from './pages/dashboard/insights/EarningsPage'
import SurveysPage from './pages/dashboard/insights/SurveysPage'
import TrafficPage from './pages/dashboard/insights/TrafficPage'
import WithdrawPage from './pages/dashboard/payouts/WithdrawPage'
import DocumentsPage from './pages/dashboard/payouts/DocumentsPage'
import AutopilotPage from './pages/dashboard/promotions/AutopilotPage'
import DiscountsPage from './pages/dashboard/promotions/DiscountsPage'
import GiftsPage from './pages/dashboard/promotions/GiftsPage'
import ChatsPage from './pages/dashboard/community/ChatsPage'
import DirectMessagesPage from './pages/dashboard/community/DirectMessagesPage'
import AccountPage from './pages/dashboard/settings/AccountPage'
import TeamPage from './pages/dashboard/settings/TeamPage'
import AppsPage from './pages/dashboard/settings/AppsPage'
import PodcastPage from './pages/dashboard/settings/PodcastPage'
import NotificationsSettingsPage from './pages/dashboard/settings/NotificationsPage'
import BillingPage from './pages/dashboard/settings/BillingPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the standalone Login page (NO Header/Footer) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Routes that will use the MainLayout (WITH Header/Footer) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="/creators/podcasters/listeners" element={<GetToKnowYourListeners />} />
        </Route>
        {/* Routes for the Creator's Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          {/* Library route ab ek parent route hai jo nested routes ko handle karta hai */}
          <Route path="library" element={<Library />}>
            <Route index element={<Navigate to="posts" replace />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="drafts" element={<DraftsPage />} />
          </Route>

          {/* --- (UPDATED) Audience Nested Routes --- */}
          <Route path="audience" element={<Audience />}>
            <Route index element={<Navigate to="relationship-manager" replace />} />
            <Route path="relationship-manager" element={<RelationshipManagerPage />} />
            <Route path="benefits" element={<BenefitsPage />} />
            <Route path="exit-surveys" element={<ExitSurveysPage />} />
          </Route>
          {/* --- (UPDATED) Insights Nested Routes --- */}
          <Route path="insights" element={<Insights />}>
            <Route index element={<Navigate to="membership" replace />} />
            <Route path="membership" element={<MembershipPage />} />
            <Route path="earnings" element={<EarningsPage />} />
            <Route path="posts" element={<PostsPage />} />

            <Route path="surveys" element={<SurveysPage />} />
            <Route path="traffic" element={<TrafficPage />} />
          </Route>
          {/* --- (UPDATED) Payouts Nested Routes --- */}
          <Route path="payouts" element={<Payouts />}>
            <Route index element={<Navigate to="withdraw" replace />} />
            <Route path="withdraw" element={<WithdrawPage />} />
            <Route path="documents" element={<DocumentsPage />} />
          </Route>
          {/* --- (UPDATED) Promotions Nested Routes --- */}
          <Route path="promotions" element={<Promotions />}>
            <Route index element={<Navigate to="autopilot" replace />} />
            <Route path="autopilot" element={<AutopilotPage />} />
            <Route path="discounts" element={<DiscountsPage />} />
            <Route path="gifts" element={<GiftsPage />} />
          </Route>
          {/* --- (UPDATED) Community Nested Routes --- */}
          <Route path="community" element={<Community />}>
            <Route index element={<Navigate to="chats" replace />} />
            <Route path="chats" element={<ChatsPage />} />
            <Route path="direct-messages" element={<DirectMessagesPage />} />
          </Route>
          <Route path="notifications" element={<Notifications />} />
          {/* --- (UPDATED) Settings Nested Routes --- */}
          <Route path="settings" element={<Settings />}>
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="apps" element={<AppsPage />} />
            <Route path="podcast" element={<PodcastPage />} />
            <Route path="notifications" element={<NotificationsSettingsPage />} />
            <Route path="billing" element={<BillingPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
