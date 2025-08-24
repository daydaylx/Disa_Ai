import * as React from "react";
import ChatView from "./views/ChatView";
import Settings from "./views/Settings";
import TopNav, { type Tab } from "./components/TopNav";

/** App-Shell im Look von Bild 2 */
export default function App(): JSX.Element {
const [tab, setTab] = React.useState<Tab>("chat");

return (
<div className="h-screen w-screen flex flex-col bg-black">
<TopNav tab={tab} onChange={setTab} />
<div className="flex-1 min-h-0">{tab === "chat" ? <ChatView /> : <Settings />}</div>
</div>
);
}
