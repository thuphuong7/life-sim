import type { Save } from '../types';
import { CASH_GOAL, CEC_H, CRS, QUESTS } from '../data/plan';
import { avgFr, avgTeer, cecDate, frDate, frHours, sumTeer } from '../lib/calc';
import { fmtMY } from '../lib/dates';
import { Meter } from '../components/ui';
import { Board } from '../components/Board';

const nf = (n: number) => Math.round(n).toLocaleString('vi-VN');

function Stat({ label, v, max, right, goal }: { label: string; v: number; max: number; right: string; goal?: boolean }) {
  return (
    <div className="stat">
      <div className="row"><span>{label}</span><b className="nw">{right}</b></div>
      <Meter v={v} max={max} goal={goal} />
    </div>
  );
}

export function MapView({ s }: { s: Save }) {
  const doneQ = QUESTS.filter((q) => s.done[q.id]).length;
  const at = (x: number) => `${((x - CRS.min) / (CRS.max - CRS.min)) * 100}%`;
  return (
    <>
      <section className="band board" aria-labelledby="map-h">
        <div className="wrap">
          <h2 id="map-h">Bản đồ nhiệm vụ chính: từ lò bánh North Van ra thế giới</h2>
          <p className="lead">Mỗi trạm là một mốc thật trên đường tới PR, quốc tịch và working holiday. Trạm tiếng Pháp và trạm 1.560 giờ tự tính lại ngày theo giờ bạn ghi.</p>
          <Board s={s} />
          <p className="small">Các mốc sau trạm ITA là ước tính, phụ thuộc vào các đợt rút Express Entry và thời gian xử lý của IRCC.</p>
        </div>
      </section>
      <section className="band" aria-labelledby="stats-h">
        <div className="wrap cols">
          <div>
            <h2 id="stats-h">Chỉ số nhân vật</h2>
            <div className="panel">
              <Stat label="Giờ CEC (TEER 0–3)" v={sumTeer(s)} max={CEC_H} right={`${nf(Math.min(sumTeer(s), CEC_H))}/1.560`} />
              <Stat label="Giờ tiếng Pháp tới NCLC 7" v={frHours(s)} max={s.set.frNeed} right={`${nf(frHours(s))}/${s.set.frNeed}`} />
              <Stat label="Nhiệm vụ đã xong" v={doneQ} max={QUESTS.length} right={`${doneQ}/${QUESTS.length}`} />
              <Stat label="Kho báu tiền mặt" v={s.set.saved} max={CASH_GOAL} right={`$${nf(s.set.saved)}/$800.000`} goal />
            </div>
            <div className="panel">
              <h3 className="first">Dự báo</h3>
              <p>Đủ 1.560 giờ CEC khoảng <b>{fmtMY(cecDate(s))}</b>, với {avgTeer(s).toFixed(1)} giờ làm bánh mỗi tuần.</p>
              <p>Đạt NCLC 7 khoảng <b>{fmtMY(frDate(s))}</b>, với {avgFr(s).toFixed(1)} giờ tiếng Pháp mỗi tuần.</p>
              <p className="small">Khi chưa có dữ liệu, dự báo dùng số giờ dự kiến ở mục Thêm. Có 4 tuần dữ liệu thì dùng trung bình thật. Nếu JJ Bean không duyệt nửa ca thứ 6, đổi giờ dự kiến về 24.</p>
            </div>
          </div>
          <aside>
            <div className="panel">
              <h3 className="first">Điểm CRS so với ngưỡng 2026</h3>
              <div className="crs" aria-hidden="true">
                {CRS.bands.map(([a, b, c]) => <span key={a} className="bandz" style={{ left: at(a), width: `calc(${at(b)} - ${at(a)})`, background: c }} />)}
                {CRS.dots.map(([x, c]) => <span key={x} className="dot" style={{ left: at(x), background: c }} />)}
              </div>
              <ul className="legend">
                {CRS.bands.map(([a, , c, t]) => <li key={a}><i style={{ background: c }} />{t}</li>)}
                {CRS.dots.map(([x, c, t]) => <li key={x}><i style={{ background: c }} />{t}</li>)}
              </ul>
              <p className="small">Điểm của bạn lấy từ ước tính trong Kế hoạch v1.3. Ngưỡng: các đợt rút năm 2026.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
