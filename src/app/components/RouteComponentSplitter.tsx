import { lazy, Suspense } from "react";

import { RouteWrapper } from "./RouteWrapper";

// Granular component splitting for better performance
const ChatPage = lazy(() => import("../../pages/Chat"));
const ChatComposer = lazy(() =>
  import("../../components/chat/ChatInputBar").then((module) => ({ default: module.ChatInputBar })),
);
const ChatMessageList = lazy(() =>
  import("../../components/chat/VirtualizedMessageList").then((module) => ({
    default: module.VirtualizedMessageList,
  })),
);
const ChatHeader = lazy(() =>
  import("../../components/chat/ChatStatusBanner").then((module) => ({
    default: module.ChatStatusBanner,
  })),
);

const ChatHistoryPage = lazy(() => import("../../pages/ChatHistoryPage"));
const ChatHistoryList = lazy(() => import("../../components/chat/ChatHistoryList"));

const ModelsPage = lazy(() => import("../../pages/ModelsPage"));
const ModelList = lazy(() => import("../../components/models/ModelList"));
const ModelCard = lazy(() => import("../../components/models/ModelCard"));

const RolesPage = lazy(() => import("../../pages/RolesPage"));
const RoleList = lazy(() => import("../../components/roles/RoleList"));
const RoleCard = lazy(() => import("../../components/roles/RoleCard"));

// Route components with granular splitting
export const OptimizedChatRoute = () => (
  <RouteWrapper>
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">Lade Chat...</div>
      }
    >
      <ChatPage />
    </Suspense>
  </RouteWrapper>
);

export const OptimizedChatHistoryRoute = () => (
  <RouteWrapper>
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">Lade Verlauf...</div>
      }
    >
      <ChatHistoryPage />
    </Suspense>
  </RouteWrapper>
);

export const OptimizedModelsRoute = () => (
  <RouteWrapper>
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">Lade Modelle...</div>
      }
    >
      <ModelsPage />
    </Suspense>
  </RouteWrapper>
);

export const OptimizedRolesRoute = () => (
  <RouteWrapper>
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">Lade Rollen...</div>
      }
    >
      <RolesPage />
    </Suspense>
  </RouteWrapper>
);

// Utility components for granular loading
export const LazyChatComposer = () => (
  <Suspense
    fallback={<div className="h-16 flex items-center justify-center">Lade Eingabefeld...</div>}
  >
    <ChatComposer />
  </Suspense>
);

export const LazyChatMessageList = () => (
  <Suspense
    fallback={<div className="flex-1 flex items-center justify-center">Lade Nachrichten...</div>}
  >
    <ChatMessageList />
  </Suspense>
);
