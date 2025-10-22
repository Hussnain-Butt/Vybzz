// src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { useQuery } from 'react-query'

// === CHANGE 1: IMPORT the getCurrentUser function ===
import { getCurrentUser } from './api/apiClient'

// === NAYA PUBLIC PAGE COMPONENT IMPORT KAREIN ===
// Yeh file aapko `src/pages/` folder mein banani hogi jaisa pichle jawab mein bataya gaya tha.
import PublicCreatorPage from './pages/PublicCreatorPage'

// Layouts
import MainLayout from './components/Layout/MainLayout'
import DashboardLayout from './components/Layout/DashboardLayout'
import MemberLayout from './components/Layout/MemberLayout'
import AdminLayout from './components/Layout/AdminLayout'

// Public Pages
import Landing from './pages/Landing'
import Resources from './pages/Resources'
import Updates from './pages/Updates'
import GetToKnowYourListeners from './pages/Podcasters/GetToKnowYourListeners'
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

// Auth & Onboarding Pages
import LoginPage from './pages/Auth/LoginPage'
import SsoCallbackPage from './pages/Auth/SsoCallbackPage'
import AuthRedirectPage from './pages/Auth/AuthRedirectPage'
import SetupNamePage from './pages/Creator/SetupNamePage'
import ConnectSocialsPage from './pages/Creator/ConnectSocialsPage'

// Creator Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome'
import Library from './pages/dashboard/Library'
import PostsPage from './pages/dashboard/library/PostsPage'
import CollectionsPage from './pages/dashboard/library/CollectionsPage'
import DraftsPage from './pages/dashboard/library/DraftsPage'
import Audience from './pages/dashboard/Audience'
import RelationshipManagerPage from './pages/dashboard/audience/RelationshipManagerPage'
import BenefitsPage from './pages/dashboard/audience/BenefitsPage'
import ExitSurveysPage from './pages/dashboard/audience/ExitSurveysPage'
import Insights from './pages/dashboard/Insights'
import MembershipPage from './pages/dashboard/insights/MembershipPage'
import EarningsPage from './pages/dashboard/insights/EarningsPage'
import SurveysPage from './pages/dashboard/insights/SurveysPage'
import TrafficPage from './pages/dashboard/insights/TrafficPage'
import Payouts from './pages/dashboard/Payouts'
import WithdrawPage from './pages/dashboard/payouts/WithdrawPage'
import DocumentsPage from './pages/dashboard/payouts/DocumentsPage'
import Promotions from './pages/dashboard/Promotions'
import AutopilotPage from './pages/dashboard/promotions/AutopilotPage'
import DiscountsPage from './pages/dashboard/promotions/DiscountsPage'
import GiftsPage from './pages/dashboard/promotions/GiftsPage'
import Community from './pages/dashboard/Community'
import ChatsPage from './pages/dashboard/community/ChatsPage'
import DirectMessagesPage from './pages/dashboard/community/DirectMessagesPage'
import Notifications from './pages/dashboard/Notifications'
import Settings from './pages/dashboard/Settings'
import AccountPage from './pages/dashboard/settings/AccountPage'
import TeamPage from './pages/dashboard/settings/TeamPage'
import AppsPage from './pages/dashboard/settings/AppsPage'
import PodcastPage from './pages/dashboard/settings/PodcastPage'
import NotificationsSettingsPage from './pages/dashboard/settings/NotificationsPage'
import BillingPage from './pages/dashboard/settings/BillingPage'

// Member Pages
import MemberHome from './pages/member/MemberHome'
import MemberExplore from './pages/member/MemberExplore'
import MemberCommunity from './pages/member/MemberCommunity'
import MemberNotifications from './pages/member/MemberNotifications'
import MemberChatsPage from './pages/member/memberComunity/MemberChatsPage'
import MDirectMessagesPage from './pages/member/memberComunity/MDirectMessagesPage'
import MemberSettings from './pages/member/MemberSettings'
import Basics from './pages/member/membersettings/Basics'
import Account from './pages/member/membersettings/Account'
import EmailNotifications from './pages/member/membersettings/EmailNotifications'
import Memberships from './pages/member/membersettings/Memberships'
import BillingHistory from './pages/member/membersettings/BillingHistory'
import PaymentMethods from './pages/member/membersettings/PaymentMethods'
import ConnectedApps from './pages/member/membersettings/ConnectedApps'
import BlockedUsers from './pages/member/membersettings/BlockedUsers'

// Admin Pages
import AdminLoginPage, { fakeAuth } from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminSettings from './pages/admin/AdminSettings'

// Components
import CursorFollower from './components/CursorFollower'

// --- Route Protection & Data Fetching Logic ---

// === CHANGE 2: REMOVE the old fetchUserFromApi function ===
/*
const fetchUserFromApi = async (getToken: () => Promise<string | null>) => {
  const token = await getToken()
  if (!token) throw new Error('Not authenticated')
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Failed to fetch user data')
  return response.json()
}
*/

const CreatorProtectedRoute = () => {
  // === CHANGE 3: USE the imported `getCurrentUser` function in useQuery ===
  const { data: user, isLoading, isError } = useQuery('currentUser', getCurrentUser)

  if (isLoading) return <div>Loading your creator profile...</div>
  if (isError || user?.creatorProfile?.status !== 'ACTIVE')
    return <Navigate to="/member/home" replace />
  return <DashboardLayout />
}

const RedirectIfCreator = () => {
  // === CHANGE 4: USE the imported `getCurrentUser` function here as well ===
  const { data: user, isLoading } = useQuery('currentUser', getCurrentUser)

  if (isLoading) return <MemberLayout />
  if (user?.creatorProfile?.status === 'ACTIVE') return <Navigate to="/dashboard" replace />
  return <MemberLayout />
}

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!fakeAuth.isAuthenticated) return <Navigate to="/admin" replace />
  return children
}

function App() {
  return (
    <>
      <CursorFollower />
      <Routes>
        {/* --- AUTH & ONBOARDING ROUTES (No Change) --- */}
        <Route path="/sso-callback" element={<SsoCallbackPage />} />
        <Route
          path="/auth-redirect"
          element={
            <SignedIn>
              <AuthRedirectPage />
            </SignedIn>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <SignedIn>
                <Navigate to="/auth-redirect" replace />
              </SignedIn>
              <SignedOut>
                <LoginPage />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/creator/setup"
          element={
            <SignedIn>
              <SetupNamePage />
            </SignedIn>
          }
        />
        <Route
          path="/creator/connect-socials"
          element={
            <SignedIn>
              <ConnectSocialsPage />
            </SignedIn>
          }
        />

        {/* --- PROTECTED DASHBOARD ROUTES (No Change) --- */}
        <Route
          path="/dashboard/*"
          element={
            <>
              <SignedIn>
                <CreatorProtectedRoute />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn signInUrl="/login?role=creator" />
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
        <Route
          path="/member/*"
          element={
            <>
              <SignedIn>
                <RedirectIfCreator />
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
        <Route path="/admin" element={<AdminLoginPage />} />
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
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* === PUBLIC ROUTES WITH DYNAMIC CREATOR PAGE (No Change) === */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />

          {/* Static public routes pehle aayenge */}
          <Route path="creators/podcasters/listeners" element={<GetToKnowYourListeners />} />
          <Route path="creators/podcasters/cutthrough" element={<CutThroughTheNoise />} />
          <Route path="creators/podcasters/moveway" element={<MoveWayToGetPaid />} />
          <Route path="creators/podcasters/otherpodcaster" element={<OtherPodcasterOnVybzz />} />
          <Route path="creators/videocreator/turnyourviewer" element={<TurnYourViewers />} />
          <Route path="creators/videocreator/moreway" element={<MoreWayToGetPaid />} />
          <Route path="creators/videocreator/reachfan" element={<ReachEveryFan />} />
          <Route path="creators/videocreator/other" element={<OtherVideoCreators />} />
          <Route path="creators/musicians/fromyourmind" element={<FromYourMind />} />
          <Route path="creators/musicians/moreway" element={<MoreWayToGetPaidMusicians />} />
          <Route path="creators/musicians/sharemorethan" element={<ShareMoreThan />} />
          <Route path="creators/musicians/other" element={<OtherMusicians />} />
          <Route path="features/creatonyourteam/gettingstart" element={<GettingStartOnVybzz />} />
          <Route path="features/creatonyourteam/makeityourown" element={<MakeItYourOwn />} />
          <Route path="features/creatonyourteam/reacheveryfan" element={<ReachEveryFan />} />
          <Route path="features/creatonyourteam/showcase" element={<ShowCaseYourWork />} />
          <Route path="prices/powerfullfeature" element={<PowerFullCoreFeature />} />
          <Route path="prices/paymentpoweredby" element={<PaymentPoweredBy />} />
          <Route path="prices/paidmembership" element={<PaidMembership />} />
          <Route path="prices/earningmode" element={<EarningModeEasy />} />
          <Route path="prices/commerce" element={<Commerce />} />
          <Route path="resources" element={<Resources />} />
          <Route path="updates" element={<Updates />} />
          <Route
            path="features/buildcommunity/everyposteverytime"
            element={<EveryPostEveryTime />}
          />
          <Route path="features/buildcommunity/gettoknows" element={<GetToKnowYourFans />} />
          <Route
            path="features/creatonyourteam/morewaytostayclose"
            element={<MoreWayToStayClose />}
          />
          <Route path="features/expandyourreach/appintegration" element={<AppIntegration />} />
          <Route path="features/expandyourreach/bringnewfans" element={<BringInNewFans />} />
          <Route path="features/expandyourreach/unlockgrowth" element={<UnlockGrowth />} />

          {/* DYNAMIC CREATOR PAGE ROUTE */}
          <Route path=":pageUrl" element={<PublicCreatorPage />} />
        </Route>

        {/* --- FALLBACK ROUTE --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
