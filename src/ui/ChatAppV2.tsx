import React from "react";

import ExecutiveChatV2 from "./ExecutiveChatV2";

interface ChatAppV2Props {
  openModelPicker?: boolean;
}

/** ====== Revolutionary Executive Interface V2 ====== */
export default function ChatAppV2({ openModelPicker = false }: ChatAppV2Props) {
  return <ExecutiveChatV2 openModelPicker={openModelPicker} />;
}