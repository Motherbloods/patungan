import Avatar from "../Avatar";
import InfoBox from "../InfoBox";
import { fmt } from "../../utils/format";
import { getNameUtil } from "../../utils/member";

function TabTransfer({ members, settlements }) {
  if (!settlements || settlements.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          0 transfer
        </p>

        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">
            Tidak ada transfer yang diperlukan.
          </p>
        </div>

        <InfoBox />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {settlements.length} transfer untuk selesaikan semua
      </p>

      {settlements.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm"
          style={{ border: "1.5px solid #E5E7EB" }}
        >
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
            {i + 1}
          </div>

          <Avatar members={members} uid={s.from} size={38} />

          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-800">
              <span className="font-bold">{getNameUtil(members, s.from)}</span>
              <span className="text-gray-400 mx-1.5">transfer ke</span>
              <span className="font-bold">{getNameUtil(members, s.to)}</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              1 kali transfer · langsung lunas
            </div>
          </div>

          <Avatar members={members} uid={s.to} size={38} />

          <div className="font-extrabold text-base text-gray-900 ml-2 shrink-0">
            {fmt(s.amount)}
          </div>
        </div>
      ))}

      <InfoBox />
    </div>
  );
}

export default TabTransfer;
