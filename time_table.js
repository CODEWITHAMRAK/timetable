let step = 0;
let rooms = [{ name: "Room 101" }, { name: "Room 102" }];
let teachers = [
    { name: "Dr. Smith" },
    { name: "Prof. Jones" },
    { name: "Ms. Patel" },
];
let sections = [
    {
        name: "CS-A",
        roomIdx: 0,
        subjects: [
            { name: "Maths", cpw: 4, tIdx: 0 },
            { name: "Physics", cpw: 3, tIdx: 1 },
        ],
    },
    {
        name: "CS-B",
        roomIdx: 1,
        subjects: [
            { name: "Maths", cpw: 4, tIdx: 0 },
            { name: "Chemistry", cpw: 3, tIdx: 2 },
        ],
    },
];

function msg(html, cls = "") {
    const el = document.getElementById("msg");
    if (el) {
        el.innerHTML = html
            ? `<div class="alert ${cls}">${html}</div>`
            : "";
    }
}
function goStep(n) {
    document.getElementById("panel" + step).style.display = "none";
    document
        .getElementById("stab" + step)
        .classList.remove("active");
    step = n;
    document.getElementById("panel" + step).style.display = "";
    document.getElementById("stab" + step).classList.add("active");
    msg("");
    renderStep();
}
function nextStep() {
    if (validateStep()) goStep(step + 1);
}
function prevStep() {
    goStep(step - 1);
}

function validateStep() {
    if (step === 0) {
        if (+id("numDays").value < 1 || +id("numDays").value > 7) {
            msg("Days must be 1–7", "alert-err");
            return false;
        }
        if (+id("classesPD").value < 1) {
            msg("Need at least 1 class per day", "alert-err");
            return false;
        }
        return true;
    }
    if (step === 1) {
        if (rooms.length === 0) {
            msg("Add at least one room", "alert-err");
            return false;
        }
        if (rooms.some((r) => !r.name.trim())) {
            msg("All rooms need a name", "alert-err");
            return false;
        }
        return true;
    }
    if (step === 2) {
        if (teachers.length === 0) {
            msg("Add at least one teacher", "alert-err");
            return false;
        }
        if (teachers.some((t) => !t.name.trim())) {
            msg("All teachers need a name", "alert-err");
            return false;
        }
        return true;
    }
    if (step === 3) {
        if (sections.length === 0) {
            msg("Add at least one section", "alert-err");
            return false;
        }
        for (let s of sections) {
            if (!s.name.trim()) {
                msg("All sections need a name", "alert-err");
                return false;
            }
            if (s.subjects.length === 0) {
                msg(
                    `Section ${s.name || "?"} needs subjects`,
                    "alert-err",
                );
                return false;
            }
            for (let sub of s.subjects) {
                if (!sub.name.trim()) {
                    msg("All subjects need a name", "alert-err");
                    return false;
                }
                if (sub.cpw < 1) {
                    msg(
                        "Classes per week must be ≥ 1",
                        "alert-err",
                    );
                    return false;
                }
            }
        }
        return true;
    }
    return true;
}

function id(x) {
    return document.getElementById(x);
}

const defaultDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];
let dayNames = [...defaultDays.slice(0, 5)];

function renderStep() {
    if (step === 0) renderSchedule();
    if (step === 1) renderRooms();
    if (step === 2) renderTeachers();
    if (step === 3) renderSections();
    if (step === 4) renderSummary();
}

function renderSchedule() {
    const nd = +id("numDays").value || 5;
    while (dayNames.length < nd)
        dayNames.push(
            defaultDays[dayNames.length] ||
                `Day ${dayNames.length + 1}`,
        );
    const el = id("dayNames");
    if (el) {
        el.innerHTML = "";
        for (let i = 0; i < nd; i++) {
            const inp = document.createElement("input");
            inp.type = "text";
            inp.value = dayNames[i] || "";
            inp.placeholder = `Day ${i + 1}`;
            inp.oninput = (e) => (dayNames[i] = e.target.value);
            el.appendChild(inp);
        }
    }
}

function resetDays() {
    const nd = +id("numDays").value || 5;
    dayNames = defaultDays.slice(0, nd);
    renderSchedule();
}

function renderRooms() {
    const el = id("roomList");
    if (!el) return;
    if (rooms.length === 0) {
        el.innerHTML =
            '<div class="empty">No rooms yet. Add one above.</div>';
        return;
    }
    el.innerHTML = rooms
        .map(
            (r, i) => `
    <div class="card" style="display:flex;align-items:center;gap:12px;padding:.75rem 1rem">
      <i class="ti ti-door" aria-hidden="true" style="font-size:18px;color:var(--color-text-secondary)"></i>
      <input type="text" value="${esc(r.name)}" placeholder="Room name" oninput="rooms[${i}].name=this.value" style="flex:1">
      <button class="btn btn-sm btn-danger" onclick="rooms.splice(${i},1);renderRooms()"><i class="ti ti-trash" aria-hidden="true"></i></button>
    </div>`,
        )
        .join("");
}
function addRoom() {
    rooms.push({ name: `Room ${rooms.length + 1}` });
    renderRooms();
}

function renderTeachers() {
    const el = id("teacherList");
    if (!el) return;
    if (teachers.length === 0) {
        el.innerHTML = '<div class="empty">No teachers yet.</div>';
        return;
    }
    el.innerHTML = teachers
        .map(
            (t, i) => `
    <div class="card" style="display:flex;align-items:center;gap:12px;padding:.75rem 1rem">
      <i class="ti ti-user" aria-hidden="true" style="font-size:18px;color:var(--color-text-secondary)"></i>
      <input type="text" value="${esc(t.name)}" placeholder="Teacher name" oninput="teachers[${i}].name=this.value" style="flex:1">
      <button class="btn btn-sm btn-danger" onclick="teachers.splice(${i},1);renderTeachers()"><i class="ti ti-trash" aria-hidden="true"></i></button>
    </div>`,
        )
        .join("");
}
function addTeacher() {
    teachers.push({ name: `Teacher ${teachers.length + 1}` });
    renderTeachers();
}

function roomOpts() {
    return rooms
        .map(
            (r, i) =>
                `<option value="${i}">${esc(r.name)}</option>`,
        )
        .join("");
}
function teacherOpts() {
    return teachers
        .map(
            (t, i) =>
                `<option value="${i}">${esc(t.name)}</option>`,
        )
        .join("");
}

function renderSections() {
    const el = id("sectionList");
    if (!el) return;
    if (sections.length === 0) {
        el.innerHTML = '<div class="empty">No sections yet.</div>';
        return;
    }
    el.innerHTML = sections
        .map(
            (s, si) => `
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:.75rem">
        <input type="text" value="${esc(s.name)}" placeholder="Section name" oninput="sections[${si}].name=this.value" style="flex:1;font-weight:500">
        <label style="margin:0;white-space:nowrap;font-size:12px;color:var(--color-text-secondary)">Room:</label>
        <select onchange="sections[${si}].roomIdx=+this.value" style="width:auto;min-width:110px">${rooms.map((r, i) => `<option value="${i}" ${s.roomIdx === i ? "selected" : ""}>${esc(r.name)}</option>`).join("")}</select>
        <button class="btn btn-sm btn-danger" onclick="sections.splice(${si},1);renderSections()"><i class="ti ti-trash" aria-hidden="true"></i></button>
      </div>
      <div style="margin-left:.5rem">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem">
          <span style="font-size:12px;color:var(--color-text-secondary);font-weight:500">Subjects</span>
          <button class="btn btn-sm" onclick="sections[${si}].subjects.push({name:'',cpw:2,tIdx:0});renderSections()"><i class="ti ti-plus" aria-hidden="true"></i> Subject</button>
        </div>
        ${s.subjects.length === 0 ? '<div class="empty" style="margin-bottom:.5rem">No subjects</div>' : ""}
        ${s.subjects
            .map(
                (sub, ji) => `
          <div style="display:grid;grid-template-columns:1fr 80px 1fr auto;gap:8px;align-items:center;margin-bottom:6px">
            <input type="text" value="${esc(sub.name)}" placeholder="Subject name" oninput="sections[${si}].subjects[${ji}].name=this.value">
            <input type="number" value="${sub.cpw}" min="1" max="30" placeholder="CPW" title="Classes/week" oninput="sections[${si}].subjects[${ji}].cpw=+this.value">
            <select onchange="sections[${si}].subjects[${ji}].tIdx=+this.value">${teachers.map((t, i) => `<option value="${i}" ${sub.tIdx === i ? "selected" : ""}>${esc(t.name)}</option>`).join("")}</select>
            <button class="btn btn-sm btn-danger" onclick="sections[${si}].subjects.splice(${ji},1);renderSections()"><i class="ti ti-trash" aria-hidden="true"></i></button>
          </div>`,
            )
            .join("")}
      </div>
    </div>`,
        )
        .join("");
}
function addSection() {
    sections.push({
        name: `Sec-${String.fromCharCode(65 + sections.length)}`,
        roomIdx: 0,
        subjects: [],
    });
    renderSections();
}

function getConfig() {
    return {
        numDays: +id("numDays").value,
        classesPD: +id("classesPD").value,
        startTime: id("startTime").value,
        classDur: +id("classDur").value,
        lunchDur: +id("lunchDur").value,
        lunchAfter: +id("lunchAfter").value,
        dayNames: dayNames.slice(0, +id("numDays").value),
    };
}

function buildSlots(cfg) {
    const slots = [];
    let cur = parseTime(cfg.startTime);
    let tc = 0,
        lunchSlot = -1;
    const total =
        cfg.classesPD +
        (cfg.lunchDur > 0 && cfg.lunchAfter > 0 ? 1 : 0);
    let lunchDone = false;
    for (let s = 0; s < total; s++) {
        if (
            !lunchDone &&
            cfg.lunchDur > 0 &&
            cfg.lunchAfter > 0 &&
            tc === cfg.lunchAfter
        ) {
            lunchSlot = s;
            slots.push({
                label:
                    minsToStr(cur) +
                    " – " +
                    minsToStr(cur + cfg.lunchDur) +
                    " Lunch",
                isLunch: true,
            });
            cur += cfg.lunchDur;
            lunchDone = true;
        } else {
            slots.push({
                label:
                    minsToStr(cur) +
                    " – " +
                    minsToStr(cur + cfg.classDur),
                isLunch: false,
            });
            cur += cfg.classDur;
            tc++;
        }
    }
    return { slots, lunchSlot };
}
function parseTime(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}
function minsToStr(m) {
    return (
        String(Math.floor(m / 60)).padStart(2, "0") +
        ":" +
        String(m % 60).padStart(2, "0")
    );
}
function esc(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function checkFeasibility(cfg) {
    const total = cfg.numDays * cfg.classesPD;
    const errs = [];
    for (let s of sections) {
        const sum = s.subjects.reduce((a, b) => a + b.cpw, 0);
        if (sum > total)
            errs.push(
                `Section ${s.name}: needs ${sum} slots but only ${total} available`,
            );
    }
    const load = {};
    for (let s of sections)
        for (let sub of s.subjects) {
            load[sub.tIdx] = (load[sub.tIdx] || 0) + sub.cpw;
        }
    for (let [ti, ld] of Object.entries(load)) {
        if (ld > total)
            errs.push(
                `${teachers[ti].name}: ${ld} classes but only ${total} slots`,
            );
    }
    return errs;
}

function renderSummary() {
    const cfg = getConfig();
    const errs = checkFeasibility(cfg);
    const total = cfg.numDays * cfg.classesPD;
    id("summary").innerHTML = `
    <h3 style="margin-bottom:.75rem">Summary</h3>
    <div class="metric-grid">
      <div class="metric"><div class="metric-lbl">Days/week</div><div class="metric-val">${cfg.numDays}</div></div>
      <div class="metric"><div class="metric-lbl">Slots/day</div><div class="metric-val">${cfg.classesPD}</div></div>
      <div class="metric"><div class="metric-lbl">Rooms</div><div class="metric-val">${rooms.length}</div></div>
      <div class="metric"><div class="metric-lbl">Teachers</div><div class="metric-val">${teachers.length}</div></div>
      <div class="metric"><div class="metric-lbl">Sections</div><div class="metric-val">${sections.length}</div></div>
      <div class="metric"><div class="metric-lbl">Total slots</div><div class="metric-val">${total}</div></div>
    </div>`;
    const feasEl = id("feasMsg");
    if (errs.length) {
        feasEl.innerHTML = `<div class="alert alert-err"><b>Feasibility issues:</b><ul style="margin:.25rem 0 0 1rem">${errs.map((e) => `<li>${e}</li>`).join("")}</ul></div>`;
        id("genBtn").disabled = true;
    } else {
        feasEl.innerHTML = `<div class="alert alert-ok"><i class="ti ti-check" aria-hidden="true"></i> Configuration looks feasible.</div>`;
        id("genBtn").disabled = false;
    }
    id("results").innerHTML = "";
}

// ── Backtracking Solver ──────────────────────────────────────
function runSolver() {
    const cfg = getConfig();
    const { slots, lunchSlot } = buildSlots(cfg);
    const SLOTS = slots.length;
    const DAYS = cfg.numDays;

    // busy[teacherIdx][day][slot]
    const tBusy = teachers.map(() =>
        Array.from({ length: DAYS }, () =>
            new Array(SLOTS).fill(false),
        ),
    );
    const rBusy = rooms.map(() =>
        Array.from({ length: DAYS }, () =>
            new Array(SLOTS).fill(false),
        ),
    );

    // timetable[secIdx][day][slot] = {subIdx,tIdx,rIdx,isLunch}
    const tt = sections.map(() =>
        Array.from({ length: DAYS }, () =>
            Array.from({ length: SLOTS }, () => ({
                subIdx: -1,
                tIdx: -1,
                rIdx: -1,
                isLunch: false,
            })),
        ),
    );

    // Prefill lunch
    if (lunchSlot >= 0)
        for (let si = 0; si < sections.length; si++)
            for (let d = 0; d < DAYS; d++)
                tt[si][d][lunchSlot] = {
                    subIdx: -1,
                    tIdx: -1,
                    rIdx: -1,
                    isLunch: true,
                };

    // rem[si][ji]
    const rem = sections.map((s) =>
        s.subjects.map((sub) => sub.cpw),
    );

    // Build ordered list: teaching slots only, interleaved
    const order = [];
    for (let d = 0; d < DAYS; d++)
        for (let s = 0; s < SLOTS; s++) {
            if (s === lunchSlot) continue;
            for (let si = 0; si < sections.length; si++)
                order.push([si, d, s]);
        }

    const genBtn = id("genBtn");
    genBtn.innerHTML =
        '<span class="spin"><i class="ti ti-loader-2" aria-hidden="true"></i></span> Solving…';
    genBtn.disabled = true;

    setTimeout(() => {
        const ok = solve(
            0,
            order,
            tt,
            tBusy,
            rBusy,
            rem,
            lunchSlot,
        );
        genBtn.innerHTML =
            '<i class="ti ti-player-play" aria-hidden="true"></i> Generate timetable';
        genBtn.disabled = false;
        if (!ok) {
            msg(
                "No valid timetable found. Try reducing classes per week or adding more teachers.",
                "alert-err",
            );
            return;
        }
        msg("Timetable generated!", "alert-ok");
        renderTimetable(tt, slots, cfg, lunchSlot);
    }, 30);
}

function solve(pos, order, tt, tBusy, rBusy, rem, lunchSlot) {
    if (pos === order.length) {
        for (let si = 0; si < sections.length; si++)
            for (
                let ji = 0;
                ji < sections[si].subjects.length;
                ji++
            )
                if (rem[si][ji] > 0) return false;
        return true;
    }
    const [sec, day, slot] = order[pos];
    const rIdx = sections[sec].roomIdx;
    const numSubj = sections[sec].subjects.length;

    // MRV heuristic
    const order_subj = Array.from(
        { length: numSubj },
        (_, i) => i,
    ).sort((a, b) => rem[sec][b] - rem[sec][a]);

    for (let ji of order_subj) {
        if (rem[sec][ji] === 0) continue;
        const tIdx = sections[sec].subjects[ji].tIdx;
        if (tBusy[tIdx][day][slot]) continue;

        tt[sec][day][slot] = {
            subIdx: ji,
            tIdx,
            rIdx,
            isLunch: false,
        };
        tBusy[tIdx][day][slot] = true;
        rBusy[rIdx][day][slot] = true;
        rem[sec][ji]--;
        if (solve(pos + 1, order, tt, tBusy, rBusy, rem, lunchSlot))
            return true;
        rem[sec][ji]++;
        tBusy[tIdx][day][slot] = false;
        rBusy[rIdx][day][slot] = false;
        tt[sec][day][slot] = {
            subIdx: -1,
            tIdx: -1,
            rIdx: -1,
            isLunch: false,
        };
    }
    // Allow free period
    tt[sec][day][slot] = {
        subIdx: -1,
        tIdx: -1,
        rIdx: -1,
        isLunch: false,
    };
    if (solve(pos + 1, order, tt, tBusy, rBusy, rem, lunchSlot))
        return true;
    return false;
}

function renderTimetable(tt, slots, cfg, lunchSlot) {
    const el = id("results");
    let html = "";
    for (let si = 0; si < sections.length; si++) {
        const sec = sections[si];
        html += `<div style="margin-top:1.5rem">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
        <h3>${esc(sec.name)}</h3>
        <span class="tag tag-info">${esc(rooms[sec.roomIdx].name)}</span>
      </div>
      <div class="tt-wrap"><table class="tt-table">
        <thead><tr><th>Time</th>${cfg.dayNames.map((d) => `<th>${esc(d)}</th>`).join("")}</tr></thead>
        <tbody>`;
        for (let s = 0; s < slots.length; s++) {
            html += `<tr><td style="font-size:11px;color:var(--color-text-secondary)">${esc(slots[s].label)}</td>`;
            for (let d = 0; d < cfg.numDays; d++) {
                const e = tt[si][d][s];
                if (e.isLunch) {
                    html += `<td class="lunch" colspan="1">Lunch</td>`;
                    continue;
                }
                if (e.subIdx < 0) {
                    html += `<td class="free">—</td>`;
                    continue;
                }
                const sub = sec.subjects[e.subIdx];
                const tName = teachers[e.tIdx].name;
                html += `<td class="cls">${esc(sub.name)}<span>${esc(tName)}</span></td>`;
            }
            html += "</tr>";
        }
        html += "</tbody></table></div></div>";
    }
    // Teacher summary
    html += `<div style="margin-top:2rem"><h3 style="margin-bottom:.75rem">Teacher schedule summary</h3>`;
    for (let ti = 0; ti < teachers.length; ti++) {
        html += `<div style="margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.25rem">
        <span style="font-size:13px;font-weight:500">${esc(teachers[ti].name)}</span>
      </div>
      <div class="tt-wrap"><table class="tt-table">
        <thead><tr><th>Time</th>${cfg.dayNames.map((d) => `<th>${esc(d)}</th>`).join("")}</tr></thead><tbody>`;
        for (let s = 0; s < slots.length; s++) {
            html += `<tr><td style="font-size:11px;color:var(--color-text-secondary)">${esc(slots[s].label)}</td>`;
            for (let d = 0; d < cfg.numDays; d++) {
                if (slots[s].isLunch) {
                    html += `<td class="lunch">Lunch</td>`;
                    continue;
                }
                let cell = '<td class="free">—</td>';
                for (let si = 0; si < sections.length; si++) {
                    const e = tt[si][d][s];
                    if (e.tIdx === ti && e.subIdx >= 0) {
                        cell = `<td class="cls">${esc(sections[si].subjects[e.subIdx].name)}<span>${esc(sections[si].name)}</span></td>`;
                        break;
                    }
                }
                html += cell;
            }
            html += "</tr>";
        }
        html += "</tbody></table></div></div>";
    }
    html += "</div>";

    // Download buttons
    html += `<div style="margin-top:1rem;text-align:right">
    <button class="btn btn-pdf" onclick="downloadPDF()"><i class="ti ti-file-text" aria-hidden="true"></i> Download PDF</button>
  </div>`;

    el.innerHTML = html;

    // Store for download
    window._lastTT = { tt, slots, cfg, lunchSlot };
}

function downloadTimetable() {
    const { tt, slots, cfg, lunchSlot } = window._lastTT;
    let csv = "";
    for (let si = 0; si < sections.length; si++) {
        const sec = sections[si];
        csv += `Section: ${sec.name},Room: ${rooms[sec.roomIdx].name}\n`;
        csv += `Time Slot,${cfg.dayNames.join(",")}\n`;
        for (let s = 0; s < slots.length; s++) {
            const row = [slots[s].label];
            for (let d = 0; d < cfg.numDays; d++) {
                const e = tt[si][d][s];
                if (e.isLunch) row.push("LUNCH");
                else if (e.subIdx < 0) row.push("(free)");
                else
                    row.push(
                        `${sec.subjects[e.subIdx].name} / ${teachers[e.tIdx].name}`,
                    );
            }
            csv += row.map((c) => `"${c}"`).join(",") + "\n";
        }
        csv += "\n";
    }
    csv += "\nTEACHER SCHEDULE SUMMARY\n";
    for (let ti = 0; ti < teachers.length; ti++) {
        csv += `Teacher: ${teachers[ti].name}\n`;
        csv += `Time Slot,${cfg.dayNames.join(",")}\n`;
        for (let s = 0; s < slots.length; s++) {
            const row = [slots[s].label];
            for (let d = 0; d < cfg.numDays; d++) {
                if (slots[s].isLunch) {
                    row.push("LUNCH");
                    continue;
                }
                let cell = "(free)";
                for (let si = 0; si < sections.length; si++) {
                    const e = tt[si][d][s];
                    if (e.tIdx === ti && e.subIdx >= 0) {
                        cell = `${sections[si].subjects[e.subIdx].name} [${sections[si].name}]`;
                        break;
                    }
                }
                row.push(cell);
            }
            csv += row.map((c) => `"${c}"`).join(",") + "\n";
        }
        csv += "\n";
    }
    dlFile("timetable.csv", csv, "text/csv");
}

function downloadHTML() {
    const { tt, slots, cfg } = window._lastTT;
    let body = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Timetable</title>
<style>body{font-family:sans-serif;padding:2rem;max-width:1200px;margin:auto}
h2{margin-bottom:.5rem}h3{margin:.5rem 0}
table{border-collapse:collapse;margin-bottom:2rem;width:100%}
th,td{border:1px solid #ccc;padding:6px 10px;font-size:13px;text-align:left}
th{background:#f5f5f5;font-weight:600}.lunch{background:#fff9db;text-align:center}.free{color:#999}
.cls{font-weight:500}.cls small{display:block;font-weight:400;color:#666}
</style></head><body>
<h1 style="font-size:22px;margin-bottom:1.5rem">College Timetable</h1>`;
    for (let si = 0; si < sections.length; si++) {
        const sec = sections[si];
        body += `<h2>${sec.name} — Room: ${rooms[sec.roomIdx].name}</h2><table>`;
        body += `<tr><th>Time</th>${cfg.dayNames.map((d) => `<th>${d}</th>`).join("")}</tr>`;
        for (let s = 0; s < slots.length; s++) {
            body += `<tr><td>${slots[s].label}</td>`;
            for (let d = 0; d < cfg.numDays; d++) {
                const e = tt[si][d][s];
                if (e.isLunch)
                    body += `<td class="lunch">Lunch</td>`;
                else if (e.subIdx < 0)
                    body += `<td class="free">—</td>`;
                else
                    body += `<td class="cls">${sec.subjects[e.subIdx].name}<small>${teachers[e.tIdx].name}</small></td>`;
            }
            body += "</tr>";
        }
        body += "</table>";
    }
    body += `<h2 style="margin-top:2rem">Teacher schedule summary</h2>`;
    for (let ti = 0; ti < teachers.length; ti++) {
        body += `<h3>${teachers[ti].name}</h3><table>`;
        body += `<tr><th>Time</th>${cfg.dayNames.map((d) => `<th>${d}</th>`).join("")}</tr>`;
        for (let s = 0; s < slots.length; s++) {
            body += `<tr><td>${slots[s].label}</td>`;
            for (let d = 0; d < cfg.numDays; d++) {
                if (slots[s].isLunch) {
                    body += `<td class="lunch">Lunch</td>`;
                    continue;
                }
                let cell = `<td class="free">—</td>`;
                for (let si = 0; si < sections.length; si++) {
                    const e = tt[si][d][s];
                    if (e.tIdx === ti && e.subIdx >= 0) {
                        cell = `<td class="cls">${sections[si].subjects[e.subIdx].name}<small>${sections[si].name}</small></td>`;
                        break;
                    }
                }
                body += cell;
            }
            body += "</tr>";
        }
        body += "</table>";
    }
    body += "</body></html>";
    dlFile("timetable.html", body, "text/html");
}

function downloadPDF() {
    window.print();
}

function dlFile(name, content, mime) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
        new Blob([content], { type: mime }),
    );
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
}

// Initial setup after JS is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Set up event listeners that depend on DOM elements
    const numDaysEl = id("numDays");
    if (numDaysEl) {
        numDaysEl.oninput = renderSchedule;
    }
    renderSchedule();
    renderRooms();
    renderTeachers();
    renderSections();
    renderStep();
});
