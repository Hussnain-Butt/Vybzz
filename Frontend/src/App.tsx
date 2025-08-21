// src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  AuthenticateWithRedirectCallback,
} from '@clerk/clerk-react'

import MainLayout from './components/Layout/MainLayout'
import LoginPage from './pages/Auth/LoginPage'
import Landing from './pages/Landing'
import GetToKnowYourListeners from './pages/Podcasters/GetToKnowYourListeners'

import DashboardLayout from './components/Layout/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import Library from './pages/dashboard/Library'
import Audience from './pages/dashboard/Audience'
import Insights from './pages/dashboard/Insights'
import Payouts from './pages/dashboard/Payouts'
import Promotions from './pages/dashboard/Promotions'
import Community from './pages/dashboard/Community'
import Notifications from './pages/dashboard/Notifications'
import Settings from './pages/dashboard/Settings'
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

import MemberHome from './pages/member/MemberHome'
import MemberExplore from './pages/member/MemberExplore'
import MemberCommunity from './pages/member/MemberCommunity'
import MemberNotifications from './pages/member/MemberNotifications'
import SsoCallbackPage from './pages/Auth/SsoCallbackPage'
import MemberLayout from './components/Layout/MemberLayout'
import MemberChatsPage from './pages/member/memberComunity/MemberChatsPage'
import MDirectMessagesPage from './pages/member/memberComunity/MDirectMessagesPage'
// Member Settings Nested Pages
import MemberSettings from './pages/member/MemberSettings'
import Basics from './pages/member/membersettings/Basics'
import Account from './pages/member/membersettings/Account'
import EmailNotifications from './pages/member/membersettings/EmailNotifications'
import Memberships from './pages/member/membersettings/Memberships'
import BillingHistory from './pages/member/membersettings/BillingHistory'
import PaymentMethods from './pages/member/membersettings/PaymentMethods'
import ConnectedApps from './pages/member/membersettings/ConnectedApps'
import BlockedUsers from './pages/member/membersettings/BlockedUsers'

// App.tsx ke top par yeh imports add karein
import AdminLoginPage, { fakeAuth } from './pages/admin/AdminLoginPage'
import AdminLayout from './components/Layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminSettings from './pages/admin/AdminSettings'
import CutThroughTheNoise from './pages/Podcasters/CutThroughTheNoise'
import MoveWayToGetPaid from './pages/Podcasters/MoveWayToGetPaid'
import OtherPodcasterOnVybzz from './pages/Podcasters/OtherPodcasterOnVybzz'
import TurnYourViewers from './pages/VideoCreators/TurnYourViewer'
import MoreWayToGetPaid from './pages/VideoCreators/MoreWayToGetPaid'
import ReachEveryFan from './pages/VideoCreators/ReachEveryFan'
import OtherVideoCreators from './pages/VideoCreators/OtherVideoCreators'
import FromYourMind from './pages/Musicians/FromYourMind'
import MoreWayToGetPaidMusicians from './pages/Musicians/MoreWayToGetPaid'
import ShareMoreThan from './pages/Musicians/ShareMoreThan'
import OtherMusicians from './pages/Musicians/OtherMusicians'
import CursorFollower from './components/CursorFollower'
import GettingStartOnVybzz from './pages/CreateOnYourTeam/GettingStartOnVybzz'
import MakeItYourOwn from './pages/CreateOnYourTeam/MakeItYourOwn'
import ShowCaseYourWork from './pages/CreateOnYourTeam/ShowCaseYourWork'
import EveryPostEveryTime from './pages/BuildRealCommunity/EveryPostEveryTime'
import GetToKnowYourFans from './pages/BuildRealCommunity/GetToKnowYourFans'
import MoreWayToStayClose from './pages/BuildRealCommunity/MoreWayToStayClose'
import AppIntegration from './pages/ExpandYourReach/AppIntegration'
import BringInNewFans from './pages/ExpandYourReach/BringInNewFans'
import UnlockGrowth from './pages/ExpandYourReach/UnlockGrowth'
import PowerFullCoreFeature from './pages/Prices/PowerFullCoreFeature'
import PaymentPoweredBy from './pages/Prices/PaymentPoweredBy'
import PaidMembership from './pages/Prices/PaidMembership'
import EarningModeEasy from './pages/Prices/EarningModeEasy'
import Commerce from './pages/Prices/Commerce'
import Resources from './pages/Resources'
import Updates from './pages/Updates'

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!fakeAuth.isAuthenticated) {
    // Agar user authenticated nahi hai, to login page par redirect karein
    return <Navigate to="/admin" replace />
  }
  return children
}
function App() {
  return (
    <>
      <CursorFollower />
      <Routes>
        {/* OAuth callback: MUST HAVE */}
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        {/* Public */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="/creators/podcasters/listeners" element={<GetToKnowYourListeners />} />
          <Route path="/creators/podcasters/cutthrough" element={<CutThroughTheNoise />} />
          <Route path="/creators/podcasters/moveway" element={<MoveWayToGetPaid />} />
          <Route path="/creators/podcasters/otherpodcaster" element={<OtherPodcasterOnVybzz />} />
          <Route path="/creators/videocreator/turnyourviewer" element={<TurnYourViewers />} />
          <Route path="/creators/videocreator/moreway" element={<MoreWayToGetPaid />} />
          <Route path="/creators/videocreator/reachfan" element={<ReachEveryFan />} />
          <Route path="/creators/videocreator/other" element={<OtherVideoCreators />} />
          <Route path="/creators/musicians/fromyourmind" element={<FromYourMind />} />
          <Route path="/creators/musicians/moreway" element={<MoreWayToGetPaidMusicians />} />
          <Route path="/creators/musicians/sharemorethan" element={<ShareMoreThan />} />
          <Route path="/creators/musicians/other" element={<OtherMusicians />} />
          <Route path="/features/creatonyourteam/gettingstart" element={<GettingStartOnVybzz />} />
          <Route path="/features/creatonyourteam/makeityourown" element={<MakeItYourOwn />} />
          <Route path="/features/creatonyourteam/reacheveryfan" element={<ReachEveryFan />} />
          <Route path="/features/creatonyourteam/showcase" element={<ShowCaseYourWork />} />
          <Route path="/prices/powerfullfeature" element={<PowerFullCoreFeature />} />
          <Route path="/prices/paymentpoweredby" element={<PaymentPoweredBy />} />
          <Route path="/prices/paidmembership" element={<PaidMembership />} />
          <Route path="/prices/earningmode" element={<EarningModeEasy />} />
          <Route path="/prices/commerce" element={<Commerce />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/updates" element={<Updates />} />

          <Route
            path="/features/buildcommunity/everyposteverytime"
            element={<EveryPostEveryTime />}
          />
          <Route path="/features/buildcommunity/gettoknows" element={<GetToKnowYourFans />} />
          <Route
            path="/features/creatonyourteam/morewaytostayclose"
            element={<MoreWayToStayClose />}
          />
          <Route path="/features/expandyourreach/appintegration" element={<AppIntegration />} />
          <Route path="/features/expandyourreach/bringnewfans" element={<BringInNewFans />} />
          <Route path="/features/expandyourreach/unlockgrowth" element={<UnlockGrowth />} />
        </Route>
        {/* Login */}
        <Route
          path="/login"
          element={
            <>
              <SignedIn>
                <Navigate to="/member/home" replace />
              </SignedIn>
              <SignedOut>
                <LoginPage />
              </SignedOut>
            </>
          }
        />
        {/* Creator Dashboard (protected) */}
        <Route
          path="/dashboard/*"
          element={
            <>
              <SignedIn>
                <DashboardLayout />
              </SignedIn>
              <SignedOut>
                {/* ✅ Explicit signInUrl — /undefined ko kill karta hai */}
                <RedirectToSignIn signInUrl="/login" />
              </SignedOut>
            </>
          }
        >
          <Route path="" element={<DashboardHome />} />
          <Route path="library" element={<Library />}>
            <Route index element={<Navigate to="posts" replace />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="drafts" element={<DraftsPage />} />
          </Route>
          <Route path="audience" element={<Audience />}>
            <Route index element={<Navigate to="relationship-manager" replace />} />
            <Route path="relationship-manager" element={<RelationshipManagerPage />} />
            <Route path="benefits" element={<BenefitsPage />} />
            <Route path="exit-surveys" element={<ExitSurveysPage />} />
          </Route>
          <Route path="insights" element={<Insights />}>
            <Route index element={<Navigate to="membership" replace />} />
            <Route path="membership" element={<MembershipPage />} />
            <Route path="earnings" element={<EarningsPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="surveys" element={<SurveysPage />} />
            <Route path="traffic" element={<TrafficPage />} />
          </Route>
          <Route path="payouts" element={<Payouts />}>
            <Route index element={<Navigate to="withdraw" replace />} />
            <Route path="withdraw" element={<WithdrawPage />} />
            <Route path="documents" element={<DocumentsPage />} />
          </Route>
          <Route path="promotions" element={<Promotions />}>
            <Route index element={<Navigate to="autopilot" replace />} />
            <Route path="autopilot" element={<AutopilotPage />} />
            <Route path="discounts" element={<DiscountsPage />} />
            <Route path="gifts" element={<GiftsPage />} />
          </Route>
          <Route path="community" element={<Community />}>
            <Route index element={<Navigate to="chats" replace />} />
            <Route path="chats" element={<ChatsPage />} />
            <Route path="direct-messages" element={<DirectMessagesPage />} />
          </Route>
          <Route path="notifications" element={<Notifications />} />
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
        {/* ================================================= */}
        {/* =============== ADMIN SECTION START =============== */}
        {/* ================================================= */}

        {/* 1. Admin Login Route (Public) */}
        {/* Yahan humne test h1 tag ko asal AdminLoginPage se badal diya hai */}
        <Route path="/admin" element={<AdminLoginPage />} />

        {/* 2. Protected Admin Dashboard Routes */}
        {/* Yahan humne path ko "/admin/*" se "/admin-dashboard/*" kar diya hai taake conflict na ho */}
        <Route
          path="/admin-dashboard/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* =============================================== */}
        {/* =============== ADMIN SECTION END =============== */}
        {/* =============================================== */}
        {/* Member Dashboard (protected) */}
        <Route
          path="/member/*"
          element={
            <>
              <SignedIn>
                <MemberLayout />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn signInUrl="/login" />
              </SignedOut>
            </>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<MemberHome />} />
          <Route path="explore" element={<MemberExplore />} />
          <Route path="community" element={<Community />}>
            <Route index element={<Navigate to="chats" replace />} />
            <Route path="chats" element={<MemberChatsPage />} />
            <Route path="direct-messages" element={<MDirectMessagesPage />} />
          </Route>
          <Route path="notifications" element={<MemberNotifications />} />
          {/* === NESTED SETTINGS ROUTES START HERE === */}
          <Route path="settings" element={<MemberSettings />}>
            <Route index element={<Navigate to="basics" replace />} />
            <Route path="basics" element={<Basics />} />
            <Route path="account" element={<Account />} />
            <Route path="notifications" element={<EmailNotifications />} />
            <Route path="memberships" element={<Memberships />} />
            <Route path="billing" element={<BillingHistory />} />
            <Route path="payment-methods" element={<PaymentMethods />} />
            <Route path="connected-apps" element={<ConnectedApps />} />
            <Route path="blocked-users" element={<BlockedUsers />} />
          </Route>
        </Route>
        {/* Fallback: kabhi /undefined aa bhi jaye to safe redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/sso-callback" element={<SsoCallbackPage />} />
      </Routes>
    </>
  )
}

export default App
