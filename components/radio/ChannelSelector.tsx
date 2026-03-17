"use client";

import { RadioChannel, ChannelInfo } from "@/lib/radio/types";
import { RADIO_CHANNELS } from "@/lib/radio/constants";

type Props = {
  selected: RadioChannel;
  onSelect: (channel: RadioChannel) => void;
};

export default function ChannelSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {RADIO_CHANNELS.map((ch: ChannelInfo) => (
        <button
          key={ch.id}
          onClick={() => onSelect(ch.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left ${
            selected === ch.id
              ? "border-primary bg-primary/10 shadow-md"
              : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
          }`}
        >
          <span className="text-2xl">{ch.icon}</span>
          <div>
            <p className="font-semibold text-white text-sm">{ch.label}</p>
            <p className="text-xs text-gray-400">{ch.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
