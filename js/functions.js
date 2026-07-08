// Formateo de fecha/hora SIEMPRE en zona Colombia (America/Bogota, UTC-5),
// sin importar como este configurada la zona horaria del computador.
// El web service Sonar entrega gps_GMT en UTC (5 horas adelante de Colombia).
const HORA_CO_OPTS = { timeZone: "America/Bogota", hour12: false };
function fechaHoraCO(value){
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString("es-CO", HORA_CO_OPTS);
}
function horaCO(value){
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleTimeString("es-CO", HORA_CO_OPTS);
}

const SUPABASE_URL = "https://jtnlcckphveeqhyrxlku.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_khOBBj9EIe2Ahmkz_KxVUw_R-SDOpk0";
const PLANILLA_SUPABASE_URL = "https://cbplebkmxrkaafqdhiyi.supabase.co";
const PLANILLA_SUPABASE_ANON_KEY = "sb_publishable_DZCceNTENY4ViP17-eZrGg_bdMElZ9X";
const SONAR_DISPATCH_URL = "https://cbplebkmxrkaafqdhiyi.supabase.co/functions/v1/sonar-dispatch";
const SONAR_DISPATCH_KEY = PLANILLA_SUPABASE_ANON_KEY;
const SONAR_CANCEL_URL = "https://cbplebkmxrkaafqdhiyi.supabase.co/functions/v1/sonar-cancel";
const GEOCERCA_ADMIN_CHECK_URL = "https://cbplebkmxrkaafqdhiyi.supabase.co/functions/v1/geocerca-admin-check";
const SONAR_DRIVERS_URL = "https://cbplebkmxrkaafqdhiyi.supabase.co/functions/v1/sonar-drivers";
const SONAR_CANCEL_KEY = PLANILLA_SUPABASE_ANON_KEY;
const OUT_OF_LIST_WEBHOOK_URL = "https://connect.pabbly.com/webhook-listener/webhook/IjU3NjEwNTY4MDYzMDA0MzQ1MjZjNTUzMiI_3D_pc/IjU3NjcwNTZlMDYzNjA0MzI1MjY0NTUzMDUxMzQi_pc";
const PLANILLA_OPTIONAL_REG_ID_COLUMNS = ["reg_id", "regid", "regId"];
const SONAR_ITINERARIES = [
  { id: "3385", grupo: "AEROPUERTO", nombre: "Aeropuerto-San Diego-Tunel" },
  { id: "3387", grupo: "NUTIBARA", nombre: "Nutibara-Aeropuerto-Autopista" },
  { id: "3394", grupo: "NUTIBARA", nombre: "Nutibara-Aeropuerto-Variante Palmas" },
  { id: "3395", grupo: "SANDIEGO", nombre: "San Diego-Aeropuerto-Variante Palmas" },
  { id: "4413", grupo: "AEROPUERTO", nombre: "Aeropuerto-Exposiciones" },
  { id: "4501", grupo: "AEROPUERTO", nombre: "Aeropuerto-autopista-terminalnorte" },
  { id: "4502", grupo: "EXPOSICIONES", nombre: "Nutibara-exposiciones-tunel-aeropuerto" },
  { id: "4503", grupo: "AEROPUERTO", nombre: "Aeropuerto-Tunel-Exposiciones-Nutibara" },
  { id: "4504", grupo: "SANDIEGO", nombre: "ccsandiego-tunel-aeropuerto" },
  { id: "4505", grupo: "SANDIEGO", nombre: "Almacentro-Tunel-Aeropuerto" },
  { id: "4507", grupo: "SANDIEGO", nombre: "Aeropuerto-Tunel-ccsandiego" }
];
const PLANILLA_TABLE_NAME = "planilla_afiliados_2";
const VEHICULOS_SONAR_TABLE_NAME = "vehiculossonar";
const PLANILLA_TABLE_SOURCE_STORAGE_KEY = "planilla_table_source";
const PLANILLA_AFILIADOS_2_COLUMNS = [
  "id",
  "cruce_key",
  "hora_llegada",
  "tipo_llegada",
  "base",
  "interno",
  "mid",
  "driver_id",
  "itinerario_llegada",
  "hora_despacho",
  "itinerario_despacho",
  "conductor",
  "usuario",
  "pasajeros",
  "observaciones",
  "estado",
  "espera",
  "generado_en",
  "created_at",
  "updated_at"
];
const SUPER_ADMIN_EMAIL = "administrador@combuses.com.co";
const BASE_USER_EMAIL_RE = /^base\s*([0-9]+)@combuses\.com\.co$/i;
const ALLOW_PUBLIC_SIGNUP = false;
if (!window.XLSX) {
  throw new Error("No cargo XLSX. Verifica conexion a internet o ruta del script.");
}
if (!window.supabase || typeof window.supabase.createClient !== "function") {
  throw new Error("No cargo Supabase JS. Verifica conexion a internet o ruta del script.");
}
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const planillaSupabaseClient = window.supabase.createClient(PLANILLA_SUPABASE_URL, PLANILLA_SUPABASE_ANON_KEY);
const authSupabaseClient = planillaSupabaseClient;
const authPanel = document.getElementById("authPanel");
const appWrap = document.getElementById("appWrap");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authStatus = document.getElementById("authStatus");
const authUserLabel = document.getElementById("authUserLabel");
const btnSignIn = document.getElementById("btnSignIn");
const btnSignUp = document.getElementById("btnSignUp");
const btnLogout = document.getElementById("btnLogout");
const btnManualDispatch = document.getElementById("btnManualDispatch");
const appToast = document.getElementById("appToast");
const swapModal = document.getElementById("swapModal");
const swapSourceLabelEl = document.getElementById("swapSourceLabel");
const swapTargetLabelEl = document.getElementById("swapTargetLabel");
const swapSourceVehEl = document.getElementById("swapSourceVeh");
const swapTargetVehEl = document.getElementById("swapTargetVeh");
const btnSwapCancel = document.getElementById("btnSwapCancel");
const btnSwapConfirm = document.getElementById("btnSwapConfirm");
const noteModal = document.getElementById("noteModal");
const noteModalTitleEl = document.getElementById("noteModalTitle");
const noteModalSub = document.getElementById("noteModalSub");
const noteModalInput = document.getElementById("noteModalInput");
const btnNoteClear = document.getElementById("btnNoteClear");
const btnNoteCancel = document.getElementById("btnNoteCancel");
const btnNoteSave = document.getElementById("btnNoteSave");
const dispatchModal = document.getElementById("dispatchModal");
const dispatchModalInterno = document.getElementById("dispatchModalInterno");
const dispatchModalBase = document.getElementById("dispatchModalBase");
const dispatchModalMid = document.getElementById("dispatchModalMid");
const dispatchModalDriverSelect = document.getElementById("dispatchModalDriverSelect");
const dispatchModalItinerarySelect = document.getElementById("dispatchModalItinerarySelect");
const dispatchModalFichoSelect = document.getElementById("dispatchModalFichoSelect");
const dispatchModalObs = document.getElementById("dispatchModalObs");
const dispatchModalPreop = document.getElementById("dispatchModalPreop");
const btnDispatchCancel = document.getElementById("btnDispatchCancel");
const btnDispatchConfirm = document.getElementById("btnDispatchConfirm");
const cancelDispatchModal = document.getElementById("cancelDispatchModal");
const cancelDispatchModalInterno = document.getElementById("cancelDispatchModalInterno");
const cancelDispatchModalBase = document.getElementById("cancelDispatchModalBase");
const cancelDispatchModalMid = document.getElementById("cancelDispatchModalMid");
const cancelDispatchModalRegId = document.getElementById("cancelDispatchModalRegId");
const cancelDispatchModalHora = document.getElementById("cancelDispatchModalHora");
const cancelDispatchModalComments = document.getElementById("cancelDispatchModalComments");
const btnCancelDispatchCancel = document.getElementById("btnCancelDispatchCancel");
const btnCancelDispatchConfirm = document.getElementById("btnCancelDispatchConfirm");
const removeFromListModal = document.getElementById("removeFromListModal");
const removeFromListInterno = document.getElementById("removeFromListInterno");
const removeFromListBase = document.getElementById("removeFromListBase");
const removeFromListMid = document.getElementById("removeFromListMid");
const removeFromListPunto = document.getElementById("removeFromListPunto");
const removeFromListObs = document.getElementById("removeFromListObs");
const btnRemoveFromListCancel = document.getElementById("btnRemoveFromListCancel");
const btnRemoveFromListConfirm = document.getElementById("btnRemoveFromListConfirm");
const editPlanillaModal = document.getElementById("editPlanillaModal");
const editPlanillaModalInterno = document.getElementById("editPlanillaModalInterno");
const editPlanillaModalBase = document.getElementById("editPlanillaModalBase");
const editPlanillaModalMid = document.getElementById("editPlanillaModalMid");
const editPlanillaModalPasajeros = document.getElementById("editPlanillaModalPasajeros");
const editPlanillaModalObservaciones = document.getElementById("editPlanillaModalObservaciones");
const btnEditPlanillaCancel = document.getElementById("btnEditPlanillaCancel");
const btnEditPlanillaSave = document.getElementById("btnEditPlanillaSave");
const manualDispatchModal = document.getElementById("manualDispatchModal");
const manualDispatchInterno = document.getElementById("manualDispatchInterno");
const manualDispatchInternoList = document.getElementById("manualDispatchInternoList");
const manualDispatchBase = document.getElementById("manualDispatchBase");
const manualDispatchMid = document.getElementById("manualDispatchMid");
const manualDispatchConductorName = document.getElementById("manualDispatchConductorName");
const manualDispatchConductorList = document.getElementById("manualDispatchConductorList");
const manualDispatchDriverId = document.getElementById("manualDispatchDriverId");
const manualDispatchItinerarySelect = document.getElementById("manualDispatchItinerarySelect");
const manualDispatchObs = document.getElementById("manualDispatchObs");
const btnManualDispatchCancel = document.getElementById("btnManualDispatchCancel");
const btnManualDispatchConfirm = document.getElementById("btnManualDispatchConfirm");

let appInitialized = false;
let currentUserId = null;
let currentUserEmail = "";
let currentUserRole = "";
let currentUserBase = "";
let currentProgramacionId = null;
let currentProgramacionFileName = "programacion_online";
let programacionesTotalCount = 0;
let dragFeedbackTimer = null;
let swapModalResolver = null;
let noteModalResolver = null;
let dispatchModalResolver = null;
let cancelDispatchModalResolver = null;
let removeFromListModalResolver = null;
let editPlanillaModalResolver = null;
let manualDispatchModalResolver = null;
let vehiculosSonarRows = [];
let vehiculosSonarLoading = false;
let vehiculosSonarLoadedOnce = false;
let vehiculosSonarLastLoadedAt = 0;
let manualDispatchVehicleLookupSeq = 0;
const VEHICULOS_SONAR_REFRESH_MAX_AGE_MS = 5 * 60 * 1000;
const ROW_UI_ID_KEY = "__ROW_UI_ID";
let rowUiIdSeq = 1;
const UNASSIGNED_LABEL = "SIN CONDUCTOR PROGRAMADO";
let syncRowsInProgress = false;
let syncRowsPending = false;
let syncRetryTimer = null;
let autoRefreshTimer = null;
const SYNC_RETRY_DELAY_MS = 8000;
const AUTO_REFRESH_DELAY_MS = 45000;
const DISPATCH_SERVER_SYNC_WAIT_MS = 65000;
const PROGRAMACION_HISTORY_FETCH_LIMIT = 80;
const ENABLE_PROGRAMACION_AUTO_REFRESH = false;
const ENABLE_PROGRAMACION_SUPABASE = false;
const ENABLE_NOVEDADES_SUPABASE = false;
const programacionReferenceRowsCache = new Map();
const cancelingRowUiIds = new Set();
const removingFromListRowUiIds = new Set();
let dispatchServerSyncTimer = null;

/* ===================== UTILS (compartidos) ===================== */
function ensureRowUiId(rowObj){
  const row = rowObj || {};
  if (!row[ROW_UI_ID_KEY]) {
    row[ROW_UI_ID_KEY] = `R${Date.now().toString(36)}${(rowUiIdSeq++).toString(36)}`;
  }
  return String(row[ROW_UI_ID_KEY]);
}

function isSameLocalDate(a, b){
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function excelDateToISO(serial){
  if(serial === null || serial === undefined) return serial;
  if(typeof serial === "string" && serial.includes("-")) return serial;
  if(isNaN(serial)) return serial;
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const d = date_info.getUTCDate().toString().padStart(2,'0');
  const m = (date_info.getUTCMonth()+1).toString().padStart(2,'0');
  const y = date_info.getUTCFullYear();
  return `${y}-${m}-${d}`;
}

function normalizeDateToISO(value){
  if (value === null || value === undefined) return value;
  if (typeof value === "number" && !isNaN(value)) return excelDateToISO(value);
  const raw = String(value).trim();
  if (!raw) return raw;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  let m = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    let p1 = parseInt(m[1], 10);
    let p2 = parseInt(m[2], 10);
    if (Number.isNaN(p1) || Number.isNaN(p2)) return raw;
    let d = p1;
    let mo = p2;
    if (p1 <= 12 && p2 > 12) {
      d = p2;
      mo = p1;
    }
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return raw;
    const y = m[3];
    return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  m = raw.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (m) {
    const y = m[1];
    const mo = m[2].padStart(2, "0");
    const d = m[3].padStart(2, "0");
    return `${y}-${mo}-${d}`;
  }
  return raw;
}

function getOutOfListStorageKey(){
  return `out_of_list_vehicles_${currentUserId || "anon"}`;
}

function buildOutOfListRowKey(row){
  const interno = String(row?.interno || "").trim();
  const mid = String(row?.mid || "").trim();
  const base = String(row?.base || "").trim();
  if (interno || mid) {
    return `veh:${base}|${interno}|${mid}`;
  }
  const rowId = String(row?.id || "").trim();
  if (rowId) return `id:${rowId}`;
  const tipo = String(row?.tipo_llegada || "").trim();
  const hora = String(row?.hora_llegada || row?.generado_en || row?.created_at || "").trim();
  return `raw:${tipo}|${base}|${interno}|${mid}|${hora}`;
}

function rebuildOutOfListVehicleIndex(){
  outOfListVehicleKeySet = new Set(
    (Array.isArray(outOfListVehicles) ? outOfListVehicles : [])
      .map(item => String(item?.row_key || "").trim())
      .filter(Boolean)
  );
}

function readOutOfListVehiclesLocal(){
  try {
    const raw = localStorage.getItem(getOutOfListStorageKey());
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveOutOfListVehiclesLocal(list){
  try {
    const payload = Array.isArray(list) ? list : [];
    localStorage.setItem(getOutOfListStorageKey(), JSON.stringify(payload));
  } catch (e) {}
}

function loadOutOfListVehiclesLocal(){
  outOfListVehicles = readOutOfListVehiclesLocal();
  rebuildOutOfListVehicleIndex();
}

function isRowOutOfList(row){
  const key = buildOutOfListRowKey(row);
  return !!key && outOfListVehicleKeySet.has(key);
}

function filterOutOfListRows(rowsInput){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  return rows.filter(row => !isRowOutOfList(row));
}

function addOutOfListVehicleEntry(entry){
  const list = Array.isArray(outOfListVehicles) ? outOfListVehicles.slice() : [];
  const rowKey = String(entry?.row_key || "").trim();
  if (rowKey && list.some(item => String(item?.row_key || "").trim() === rowKey)) return false;
  list.unshift(entry);
  outOfListVehicles = list;
  rebuildOutOfListVehicleIndex();
  saveOutOfListVehiclesLocal(outOfListVehicles);
  return true;
}

function updateOutOfListEntry(entryId, patch){
  const id = String(entryId || "").trim();
  if (!id) return;
  outOfListVehicles = (Array.isArray(outOfListVehicles) ? outOfListVehicles : []).map(item => {
    if (String(item?.id || "").trim() !== id) return item;
    return { ...item, ...(patch || {}) };
  });
  rebuildOutOfListVehicleIndex();
  saveOutOfListVehiclesLocal(outOfListVehicles);
}

function setAuthStatus(msg, type){
  authStatus.textContent = msg;
  authStatus.className = `auth-status ${type}`;
}

function showToast(msg, type = "ok"){
  if (!appToast) return;
  appToast.textContent = msg;
  appToast.className = `toast ${type} show`;
  clearTimeout(dragFeedbackTimer);
  dragFeedbackTimer = setTimeout(() => {
    appToast.className = `toast ${type}`;
  }, 2600);
}

function notifyDispatchServerSyncDelay(){
  showToast("Despacho enviado. La informacion completa puede tardar hasta 1 minuto por sincronizacion del servidor Python.", "ok");
  if (dispatchServerSyncTimer) {
    clearTimeout(dispatchServerSyncTimer);
    dispatchServerSyncTimer = null;
  }
  dispatchServerSyncTimer = setTimeout(async () => {
    dispatchServerSyncTimer = null;
    if (!currentUserId) return;
    await loadPlanillaAfiliadosFromSupabase();
    showToast("Actualizacion aplicada tras la espera de sincronizacion.", "ok");
  }, DISPATCH_SERVER_SYNC_WAIT_MS);
}

function extractConductorName(val){
  if (!val) return '';
  if (norm(val) === UNASSIGNED_LABEL) return '';
  const match = String(val).match(/^(.*?)\s*\[(DISPONIBLE|INCAPACITADO|PERMISO|DESCANSO|VACACIONES|RECONOCIMIENTO DE RUTA|DIA NO REMUNERADO|CALAMIDAD|RENUNCIA)\]\s*$/);
  return match ? match[1].trim() : String(val).trim();
}

function closeDispatchModal(confirmed){
  if (dispatchModal) dispatchModal.classList.add("hidden");
  if (dispatchModalResolver) {
    const resolve = dispatchModalResolver;
    dispatchModalResolver = null;
    const itineraryId = String(dispatchModalItinerarySelect?.value || "").trim();
    const driverId = String(dispatchModalDriverSelect?.value || "").trim();
    const ficho = String(dispatchModalFichoSelect?.value || "").trim();
    resolve({ confirmed: !!confirmed, itineraryId, driverId, ficho });
  }
}

function closeCancelDispatchModal(confirmed){
  if (cancelDispatchModal) cancelDispatchModal.classList.add("hidden");
  if (cancelDispatchModalResolver) {
    const resolve = cancelDispatchModalResolver;
    cancelDispatchModalResolver = null;
    resolve({
      confirmed: !!confirmed,
      comments: String(cancelDispatchModalComments?.value || "").trim()
    });
  }
}

function openCancelDispatchModal(payload = {}){
  if (!cancelDispatchModal || !btnCancelDispatchCancel || !btnCancelDispatchConfirm) {
    const text = [
      `Interno: ${payload.interno || "-"}`,
      `Base: ${payload.base || "-"}`,
      `MID: ${payload.mid || "-"}`,
      `regId: ${payload.regId || "-"}`,
      `Hora despacho: ${payload.horaDespacho || "-"}`
    ].join("\n");
    const comments = prompt(`Confirmar cancelacion?\n\n${text}\n\nMotivo de cancelacion:`, "");
    if (comments === null) {
      return Promise.resolve({ confirmed: false, comments: "" });
    }
    return Promise.resolve({
      confirmed: true,
      comments: String(comments || "").trim()
    });
  }
  if (cancelDispatchModalInterno) cancelDispatchModalInterno.textContent = payload.interno || "-";
  if (cancelDispatchModalBase) cancelDispatchModalBase.textContent = payload.base || "-";
  if (cancelDispatchModalMid) cancelDispatchModalMid.textContent = payload.mid || "-";
  if (cancelDispatchModalRegId) cancelDispatchModalRegId.textContent = payload.regId || "-";
  if (cancelDispatchModalHora) cancelDispatchModalHora.textContent = payload.horaDespacho || "-";
  if (cancelDispatchModalComments) cancelDispatchModalComments.value = "";
  cancelDispatchModal.classList.remove("hidden");
  setTimeout(() => cancelDispatchModalComments?.focus(), 10);
  return new Promise(resolve => {
    cancelDispatchModalResolver = resolve;
  });
}

function closeRemoveFromListModal(confirmed){
  if (removeFromListModal) removeFromListModal.classList.add("hidden");
  if (removeFromListModalResolver) {
    const resolve = removeFromListModalResolver;
    removeFromListModalResolver = null;
    resolve({
      confirmed: !!confirmed,
      observacion: String(removeFromListObs?.value || "").trim()
    });
  }
}

function openRemoveFromListModal(payload = {}){
  if (!removeFromListModal || !btnRemoveFromListCancel || !btnRemoveFromListConfirm) {
    const info = [
      `Interno: ${payload.interno || "-"}`,
      `Base: ${payload.base || "-"}`,
      `MID: ${payload.mid || "-"}`,
      `Punto: ${payload.punto || "-"}`
    ].join("\n");
    const observacion = prompt(`Sacar vehiculo de la lista?\n\n${info}\n\nObservacion obligatoria:`, "");
    if (observacion === null) return Promise.resolve({ confirmed: false, observacion: "" });
    return Promise.resolve({ confirmed: true, observacion: String(observacion || "").trim() });
  }
  if (removeFromListInterno) removeFromListInterno.textContent = payload.interno || "-";
  if (removeFromListBase) removeFromListBase.textContent = payload.base || "-";
  if (removeFromListMid) removeFromListMid.textContent = payload.mid || "-";
  if (removeFromListPunto) removeFromListPunto.textContent = payload.punto || "-";
  if (removeFromListObs) removeFromListObs.value = "";
  removeFromListModal.classList.remove("hidden");
  setTimeout(() => removeFromListObs?.focus(), 10);
  return new Promise(resolve => {
    removeFromListModalResolver = resolve;
  });
}

function closeEditPlanillaModal(confirmed){
  if (editPlanillaModal) editPlanillaModal.classList.add("hidden");
  if (editPlanillaModalResolver) {
    const resolve = editPlanillaModalResolver;
    editPlanillaModalResolver = null;
    resolve({
      confirmed: !!confirmed,
      pasajeros: String(editPlanillaModalPasajeros?.value || "").trim(),
      observaciones: String(editPlanillaModalObservaciones?.value || "").trim()
    });
  }
}

function openEditPlanillaModal(payload = {}){
  if (!editPlanillaModal || !btnEditPlanillaCancel || !btnEditPlanillaSave) {
    const pasajeros = prompt("Pasajeros:", String(payload.pasajeros || ""));
    if (pasajeros === null) return Promise.resolve({ confirmed: false, pasajeros: "", observaciones: "" });
    const observaciones = prompt("Observaciones:", String(payload.observaciones || ""));
    if (observaciones === null) return Promise.resolve({ confirmed: false, pasajeros: "", observaciones: "" });
    return Promise.resolve({
      confirmed: true,
      pasajeros: String(pasajeros || "").trim(),
      observaciones: String(observaciones || "").trim()
    });
  }
  if (editPlanillaModalInterno) editPlanillaModalInterno.textContent = payload.interno || "-";
  if (editPlanillaModalBase) editPlanillaModalBase.textContent = payload.base || "-";
  if (editPlanillaModalMid) editPlanillaModalMid.textContent = payload.mid || "-";
  if (editPlanillaModalPasajeros) editPlanillaModalPasajeros.value = payload.pasajeros || "";
  if (editPlanillaModalObservaciones) editPlanillaModalObservaciones.value = payload.observaciones || "";
  editPlanillaModal.classList.remove("hidden");
  setTimeout(() => editPlanillaModalPasajeros?.focus(), 10);
  return new Promise(resolve => {
    editPlanillaModalResolver = resolve;
  });
}

function buildItineraryOptionsHtml(itinerariesInput){
  const itineraries = Array.isArray(itinerariesInput) && itinerariesInput.length
    ? itinerariesInput
    : SONAR_ITINERARIES;
  return `<option value="">Selecciona itinerario...</option>${
    itineraries.map(item => {
      const value = escapeHtml(String(item.id || ""));
      const label = escapeHtml(`${item.grupo} | ${item.nombre} (${item.id})`);
      return `<option value="${value}">${label}</option>`;
    }).join("")
  }`;
}

function fillDriverSelectOptions(selectEl, baseValue, preferredDriverId){
  if (!selectEl) return;
  const baseCanonical = getBaseCanonical(baseValue || "");
  const allCatalog = Array.isArray(driversCatalogRows) ? driversCatalogRows : [];
  const preferredId = String(preferredDriverId || "").trim();
  const enabledRows = allCatalog.filter(row => String(row?.status || "").trim().toUpperCase() === "ENABLED");
  const baseRows = enabledRows.filter(row => !baseCanonical || getCsvDriverBase(row) === baseCanonical);
  const finalRows = baseRows.length ? baseRows : enabledRows;
  selectEl.innerHTML = `<option value="">Selecciona conductor...</option>${
    finalRows.map(row => {
      const drId = String(row?.dr_id || "").trim();
      const name = String(row?.nombre || "").trim();
      const baseLabel = formatBaseLabel(getCsvDriverBase(row) || "");
      return `<option value="${escapeHtml(drId)}">${escapeHtml(`${name} | ${drId} | ${baseLabel}`)}</option>`;
    }).join("")
  }`;
  if (preferredId) {
    selectEl.value = preferredId;
    if (selectEl.value !== preferredId) {
      const known = allCatalog.find(r => String(r?.dr_id || "").trim() === preferredId);
      const op = document.createElement("option");
      op.value = preferredId;
      op.textContent = known
        ? `${known.nombre || "Conductor"} | ${preferredId}`
        : `Driver ID manual | ${preferredId}`;
      selectEl.appendChild(op);
      selectEl.value = preferredId;
    }
  }
}

async function checkPreoperacionalForInterno(interno){
  const k = String(interno || "").trim();
  if (!k) return { found: false };
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const fromIso = `${yyyy}-${mm}-${dd}T00:00:00`;
  try {
    const { data, error } = await planillaSupabaseClient
      .from(PREOP_SICOV_TABLE)
      .select("FechaHora, NombreConductor, EstadoEnvio, Documento")
      .eq("NumeroInterno", k)
      .gte("FechaHora", fromIso)
      .order("FechaHora", { ascending: false })
      .limit(1);
    if (error) throw error;
    const row = Array.isArray(data) && data.length ? data[0] : null;
    if (!row) return { found: false };
    return {
      found: true,
      fecha: row.FechaHora,
      conductor: row.NombreConductor || "",
      documento: row.Documento || "",
      estado: String(row.EstadoEnvio || "").toUpperCase()
    };
  } catch (err) {
    console.error("[preop check] fallo:", err);
    return { found: false, error: err?.message || "consulta fallida" };
  }
}

function renderDispatchModalPreop(state){
  if (!dispatchModalPreop) return;
  dispatchModalPreop.classList.remove("preop-loading", "preop-ok", "preop-missing", "preop-error");
  if (!state) {
    dispatchModalPreop.classList.add("preop-loading");
    dispatchModalPreop.textContent = "Consultando...";
    return;
  }
  if (state.error) {
    dispatchModalPreop.classList.add("preop-error");
    dispatchModalPreop.textContent = `Error: ${state.error}`;
    return;
  }
  if (!state.found) {
    dispatchModalPreop.classList.add("preop-missing");
    dispatchModalPreop.textContent = "NO realizo preoperacional hoy";
    return;
  }
  const hora = state.fecha ? fechaHoraCO(state.fecha) : "-";
  const partes = [`${state.estado || "OK"} · ${hora}`];
  if (state.conductor) partes.push(state.conductor);
  dispatchModalPreop.classList.add("preop-ok");
  dispatchModalPreop.textContent = `Realizado: ${partes.join(" · ")}`;
}

function openDispatchConfirmModal(payload = {}){
  if (!dispatchModal || !btnDispatchCancel || !btnDispatchConfirm) {
    const text = [
      `Interno: ${payload.interno || "-"}`,
      `Base: ${payload.base || "-"}`,
      `MID: ${payload.mid || "-"}`,
      `Driver ID: ${payload.driverId || "-"}`,
      `Itinerario ID: ${payload.itineraryId || "-"}`,
      `Observaciones: ${payload.observaciones || "-"}`
    ].join("\n");
    const confirmed = confirm(`Confirmar despacho?\n\n${text}`);
    return Promise.resolve({
      confirmed,
      itineraryId: String(payload.itineraryId || "").trim(),
      driverId: String(payload.driverId || "").trim()
    });
  }
  if (dispatchModalInterno) dispatchModalInterno.textContent = payload.interno || "-";
  if (dispatchModalBase) dispatchModalBase.textContent = payload.base || "-";
  if (dispatchModalMid) dispatchModalMid.textContent = payload.mid || "-";
  fillDriverSelectOptions(dispatchModalDriverSelect, payload.base || "", payload.driverId || "");
  if (dispatchModalItinerarySelect) {
    const modalItineraries = Array.isArray(payload.itineraryOptions) && payload.itineraryOptions.length
      ? payload.itineraryOptions
      : SONAR_ITINERARIES;
    dispatchModalItinerarySelect.innerHTML = buildItineraryOptionsHtml(modalItineraries);
    // Siempre arranca SIN itinerario elegido ("Selecciona itinerario..."): obliga al
    // operador a escoger a conciencia. No se preselecciona nada a propósito; el despacho
    // se bloquea más abajo si queda vacío (ver "Selecciona un itinerario en el modal").
    dispatchModalItinerarySelect.value = "";
  }
  if (dispatchModalFichoSelect) dispatchModalFichoSelect.value = String(payload.ficho || "");
  if (dispatchModalObs) dispatchModalObs.textContent = payload.observaciones || "-";
  renderDispatchModalPreop(null);
  checkPreoperacionalForInterno(payload.interno).then(renderDispatchModalPreop);
  dispatchModal.classList.remove("hidden");
  return new Promise(resolve => {
    dispatchModalResolver = resolve;
  });
}

function closeManualDispatchModal(confirmed){
  if (manualDispatchModal) manualDispatchModal.classList.add("hidden");
  if (manualDispatchModalResolver) {
    const resolve = manualDispatchModalResolver;
    manualDispatchModalResolver = null;
    resolve({
      confirmed: !!confirmed,
      interno: String(manualDispatchInterno?.value || "").trim(),
      base: String(manualDispatchBase?.value || "").trim(),
      mId: String(manualDispatchMid?.value || "").trim(),
      conductorName: String(manualDispatchConductorName?.value || "").trim(),
      drvId: String(manualDispatchDriverId?.value || "").trim(),
      itinerary: String(manualDispatchItinerarySelect?.value || "").trim(),
      observaciones: String(manualDispatchObs?.value || "").trim()
    });
  }
}

function normalizeVehiculoSonarRow(row){
  const source = row || {};
  const interno = String(source.INTERNO ?? source.interno ?? source.Interno ?? "").trim();
  const placa = String(source.Placa ?? source.PLACA ?? source.placa ?? "").trim();
  const mid = String(source.ID ?? source.id ?? source.Id ?? source.mid ?? source.MID ?? "").trim();
  return {
    ...source,
    interno,
    placa,
    mid,
    source: "vehiculossonar"
  };
}

function getManualDispatchDefaultBase(){
  return getBaseCanonical(currentBase || currentUserBase || "");
}

async function loadVehiculosSonarFromSupabase(options = {}){
  if (vehiculosSonarLoading) return;
  if (!currentUserId) return;
  const force = !!options.force;
  const stale = !vehiculosSonarLoadedOnce
    || !vehiculosSonarLastLoadedAt
    || ((Date.now() - vehiculosSonarLastLoadedAt) > VEHICULOS_SONAR_REFRESH_MAX_AGE_MS);
  if (!force && !stale) return;
  vehiculosSonarLoading = true;
  if (vehiculosSonarStatus) vehiculosSonarStatus.textContent = "Consultando Supabase...";
  try {
    const { data, error } = await planillaSupabaseClient
      .from(VEHICULOS_SONAR_TABLE_NAME)
      .select("*")
      .limit(5000);
    if (error) throw error;
    vehiculosSonarRows = (Array.isArray(data) ? data : [])
      .map(normalizeVehiculoSonarRow)
      .filter(row => row.interno && row.mid);
    vehiculosSonarLoadedOnce = true;
    vehiculosSonarLastLoadedAt = Date.now();
    renderVehiculosSonarTab();
    if (vehiculosSonarStatus) {
      const stamp = fechaHoraCO(new Date());
      vehiculosSonarStatus.textContent = `Actualizado: ${stamp}`;
    }
  } catch (error) {
    console.error(`Error cargando ${VEHICULOS_SONAR_TABLE_NAME}:`, error);
    if (vehiculosSonarStatus) vehiculosSonarStatus.textContent = `Error: ${error?.message || "consulta fallida"}`;
    showToast(`No se pudo cargar ${VEHICULOS_SONAR_TABLE_NAME}. Se usara la planilla cargada si esta disponible.`, "warn");
  } finally {
    vehiculosSonarLoading = false;
  }
}

function mergeVehiculoSonarRows(rowsInput){
  const incoming = (Array.isArray(rowsInput) ? rowsInput : [])
    .map(normalizeVehiculoSonarRow)
    .filter(row => row.interno && row.mid);
  if (!incoming.length) return null;
  const byInterno = new Map((Array.isArray(vehiculosSonarRows) ? vehiculosSonarRows : [])
    .map(row => [String(row?.interno || "").trim(), row]));
  incoming.forEach(row => byInterno.set(String(row.interno), row));
  vehiculosSonarRows = Array.from(byInterno.values());
  vehiculosSonarLoadedOnce = true;
  vehiculosSonarLastLoadedAt = Date.now();
  return incoming[0];
}

function getFilteredVehiculosSonarRows(){
  const term = String(vehiculosSonarSearch?.value || "").trim().toLowerCase();
  const rows = Array.isArray(vehiculosSonarRows) ? vehiculosSonarRows : [];
  const filtered = term
    ? rows.filter(row => {
        const haystack = [
          row?.interno,
          row?.placa,
          row?.mid
        ].map(v => String(v || "").toLowerCase()).join(" ");
        return haystack.includes(term);
      })
    : rows.slice();
  return filtered.sort((a, b) => String(a.interno).localeCompare(String(b.interno), "es", { numeric: true }));
}

function renderVehiculosSonarTab(){
  if (!vehiculosSonarBody) return;
  const filtered = getFilteredVehiculosSonarRows();
  if (vehiculosSonarCount) vehiculosSonarCount.textContent = String(filtered.length);
  if (!filtered.length) {
    vehiculosSonarBody.innerHTML = `<tr><td colspan="4" class="muted" style="text-align:center;padding:12px">Sin vehiculos para mostrar.</td></tr>`;
    return;
  }
  vehiculosSonarBody.innerHTML = filtered.map(row => {
    const interno = String(row?.interno || "").trim();
    const placa = String(row?.placa || "").trim();
    const mid = String(row?.mid || "").trim();
    const baseNum = getBaseNumForInterno(interno);
    const baseBadge = baseNum ? `<span class="chip-base" title="Base afiliacion">B${escapeHtml(baseNum)}</span> ` : "";
    return `<tr>
      <td>${baseBadge}${escapeHtml(interno)}</td>
      <td>${escapeHtml(placa || "-")}</td>
      <td>
        <input class="vehiculo-sonar-id-input" data-interno="${escapeHtml(interno)}" value="${escapeHtml(mid)}" placeholder="ID Sonar" />
      </td>
      <td>
        <button class="btn btn-primary btn-save-vehiculo-sonar" data-interno="${escapeHtml(interno)}">Guardar</button>
      </td>
    </tr>`;
  }).join("");
}

async function updateVehiculoSonarId(internoValue, nextIdValue){
  const interno = String(internoValue || "").trim();
  const nextId = String(nextIdValue || "").trim().toUpperCase();
  if (!interno || !nextId) {
    showToast("Escribe un interno y un ID Sonar valido.", "warn");
    return;
  }
  const row = findManualDispatchVehicleByInterno(interno);
  const previousId = String(row?.mid || "").trim();
  if (previousId === nextId) {
    showToast("El ID Sonar no cambio.", "warn");
    return;
  }
  try {
    const numericInterno = Number(interno);
    let query = planillaSupabaseClient
      .from(VEHICULOS_SONAR_TABLE_NAME)
      .update({ ID: nextId });
    query = Number.isFinite(numericInterno) && String(numericInterno) === interno
      ? query.eq("INTERNO", numericInterno)
      : query.eq("INTERNO", interno);
    const { data, error } = await query.select("*");
    if (error) throw error;
    const updatedRow = mergeVehiculoSonarRows(data);
    if (!updatedRow) throw new Error("No se encontro el vehiculo para actualizar.");
    renderVehiculosSonarTab();
    fillManualDispatchInternoList();
    if (manualDispatchInterno && String(manualDispatchInterno.value || "").trim() === interno) {
      applyManualDispatchVehicleRow(updatedRow);
    }
    showToast(`ID Sonar actualizado para interno ${interno}.`, "ok");
  } catch (error) {
    console.error(`Error actualizando ${VEHICULOS_SONAR_TABLE_NAME}:`, error);
    showToast(`No se pudo actualizar el ID Sonar: ${error?.message || "fallo de Supabase"}`, "err");
  }
}

function handleVehiculosSonarTableClick(ev){
  const btn = ev.target?.closest?.(".btn-save-vehiculo-sonar");
  if (!btn) return;
  const interno = String(btn.getAttribute("data-interno") || "").trim();
  const input = Array.from(vehiculosSonarBody?.querySelectorAll(".vehiculo-sonar-id-input") || [])
    .find(el => String(el.getAttribute("data-interno") || "").trim() === interno);
  updateVehiculoSonarId(interno, input?.value || "");
}

/* ===================== DESPACHOS SONAR (Edge Function) ===================== */
const DESPACHOS_SONAR_ENDPOINT = `${PLANILLA_SUPABASE_URL}/functions/v1/sonar-despachos`;
let despachosSonarRows = [];
let despachosSonarLoading = false;
let despachosSonarLastLoadedAt = null;
let despachosSonarItinFilter = ""; // "" = todos los itinerarios

function getDespachoSonarEstado(row){
  if (String(row?.lcanceled).toLowerCase() === "true") return "CANCELADO";
  if (String(row?.lrunning).toLowerCase() === "true") return "EN CURSO";
  if (String(row?.lclose).toLowerCase() === "true") return "CERRADO";
  return "DESCONOCIDO";
}

function getDespachoSonarInicio(row){
  const d = String(row?.initDate || "").trim();
  const t = String(row?.initTime || "").trim();
  return d && t ? `${d} ${t}` : d || t || "";
}

function getDespachoSonarEstadoColor(estado){
  switch (estado) {
    case "EN CURSO": return "#1d4ed8";
    case "CERRADO": return "#065f46";
    case "CANCELADO": return "#b91c1c";
    default: return "#64748b";
  }
}

async function loadDespachosSonarFromEdge(options = {}){
  if (despachosSonarLoading) return;
  despachosSonarLoading = true;
  if (despachosSonarStatus) despachosSonarStatus.textContent = "Consultando Sonar...";
  if (btnRefreshDespachosSonar) btnRefreshDespachosSonar.disabled = true;
  try {
    const t0 = Date.now();
    const resp = await fetch(DESPACHOS_SONAR_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: PLANILLA_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${PLANILLA_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(options.body || {}),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (!data?.success) throw new Error(data?.message || "respuesta sin success");
    despachosSonarRows = Array.isArray(data.despachos) ? data.despachos : [];
    despachosSonarLastLoadedAt = Date.now();
    renderDespachosSonarTab();
    const stamp = horaCO(new Date());
    const meta = data.meta || {};
    const elapsed = (Date.now() - t0);
    if (despachosSonarStatus) {
      const errs = meta.total_errores ? ` · ${meta.total_errores} errores` : "";
      despachosSonarStatus.textContent =
        `Actualizado ${stamp} · ${meta.buses_consultados || 0} buses · ${elapsed} ms${errs}`;
    }
  } catch (error) {
    console.error("Error consultando sonar-despachos:", error);
    if (despachosSonarStatus) despachosSonarStatus.textContent = `Error: ${error?.message || "fallo"}`;
    showToast(`No se pudo consultar Sonar: ${error?.message || "fallo"}`, "err");
  } finally {
    despachosSonarLoading = false;
    if (btnRefreshDespachosSonar) btnRefreshDespachosSonar.disabled = false;
  }
}

function getEnCursoDespachosSonarRows(){
  const rows = Array.isArray(despachosSonarRows) ? despachosSonarRows : [];
  return rows.filter(row => getDespachoSonarEstado(row) === "EN CURSO");
}

function getDespachosSonarItinerariosResumen(){
  const counts = new Map();
  for (const row of getEnCursoDespachosSonarRows()) {
    const itin = String(row?.itDesc || "").trim() || "Sin itinerario";
    counts.set(itin, (counts.get(itin) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es"));
}

function renderDespachosSonarItinChips(){
  if (!despachosSonarItinChips) return;
  const resumen = getDespachosSonarItinerariosResumen();
  const total = resumen.reduce((acc, r) => acc + r.count, 0);
  const activeFilter = despachosSonarItinFilter;
  const chips = [{ name: "", label: "Todos", count: total }]
    .concat(resumen.map(r => ({ name: r.name, label: r.name, count: r.count })));
  despachosSonarItinChips.innerHTML = chips.map(chip => {
    const isActive = String(chip.name) === String(activeFilter);
    const cls = `chip${isActive ? " active" : ""}`;
    return `<button type="button" class="${cls}" data-itin="${escapeHtml(chip.name)}">
      <span>${escapeHtml(chip.label)}</span>
      <span class="chip-count">${chip.count}</span>
    </button>`;
  }).join("");
}

function getFilteredDespachosSonarRows(){
  const term = String(despachosSonarSearch?.value || "").trim().toLowerCase();
  const itin = String(despachosSonarItinFilter || "").trim();
  const filtered = getEnCursoDespachosSonarRows().filter(row => {
    if (itin) {
      const rowItin = String(row?.itDesc || "").trim() || "Sin itinerario";
      if (rowItin !== itin) return false;
    }
    if (!term) return true;
    const haystack = [
      row?.mDesc, row?.mPlaca, row?.mId, row?.drName, row?.itDesc
    ].map(v => String(v || "").toLowerCase()).join(" ");
    return haystack.includes(term);
  });
  return filtered.sort((a, b) => {
    const ka = getDespachoSonarInicio(a);
    const kb = getDespachoSonarInicio(b);
    return kb.localeCompare(ka);
  });
}

function renderDespachosSonarTab(){
  renderDespachosSonarItinChips();
  if (!despachosSonarBody) return;
  const filtered = getFilteredDespachosSonarRows();
  if (despachosSonarCount) despachosSonarCount.textContent = String(filtered.length);
  if (!filtered.length) {
    despachosSonarBody.innerHTML =
      `<tr><td colspan="7" class="muted" style="text-align:center;padding:12px">Sin despachos en curso para mostrar.</td></tr>`;
    return;
  }
  despachosSonarBody.innerHTML = filtered.map(row => {
    const inicio = getDespachoSonarInicio(row);
    const estado = getDespachoSonarEstado(row);
    const color = getDespachoSonarEstadoColor(estado);
    const interno = String(row?.mDesc || row?.interno || "").trim();
    const placa = String(row?.mPlaca || "").trim();
    const conductor = String(row?.drName || "").trim();
    const itin = String(row?.itDesc || "").trim();
    const elapsed = String(row?.elapsed ?? "").trim();
    const baseNum = getBaseNumForInterno(interno);
    const baseBadge = baseNum ? `<span class="chip-base" title="Base afiliacion">B${escapeHtml(baseNum)}</span> ` : "";
    return `<tr>
      <td data-label="Inicio">${escapeHtml(inicio)}</td>
      <td data-label="Interno">${baseBadge}<strong style="color:#065f46">${escapeHtml(interno)}</strong></td>
      <td data-label="Placa">${escapeHtml(placa || "-")}</td>
      <td data-label="Conductor">${escapeHtml(conductor || "-")}</td>
      <td data-label="Itinerario">${escapeHtml(itin || "-")}</td>
      <td data-label="Min" style="text-align:right;font-variant-numeric:tabular-nums">${escapeHtml(elapsed)}</td>
      <td data-label="Estado"><strong style="color:${color}">${escapeHtml(estado)}</strong></td>
    </tr>`;
  }).join("");
}

function handleDespachosSonarChipClick(ev){
  const chip = ev.target?.closest?.(".chip");
  if (!chip || !despachosSonarItinChips?.contains(chip)) return;
  despachosSonarItinFilter = String(chip.getAttribute("data-itin") || "");
  renderDespachosSonarTab();
}

/* ===================== HISTORIAL DESPACHOS (despachos_realizados) ===================== */
const HISTORIAL_DESPACHOS_TABLE = "despachos_realizados";
const HISTORIAL_DESPACHOS_LIMIT = 500;
let historialDespachosRows = [];
let historialDespachosLoading = false;
let historialDespachosLastLoadedAt = null;
let historialDespachosItinFilter = "";
const historialCancelingIds = new Set();

function getHistorialDespachosRangeMs(){
  const v = String(historialDespachosRangeFilter?.value || "24h");
  switch (v) {
    case "7d":  return 7  * 24 * 60 * 60 * 1000;
    case "30d": return 30 * 24 * 60 * 60 * 1000;
    case "all": return null;
    case "24h":
    default:    return 24 * 60 * 60 * 1000;
  }
}

function formatHistorialDateTime(value){
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return fechaHoraCO(d);
  } catch (_) { return String(value); }
}

async function loadDespachosRealizadosFromSupabase(){
  if (historialDespachosLoading) return;
  if (!currentUserId) return;
  historialDespachosLoading = true;
  if (historialDespachosStatus) historialDespachosStatus.textContent = "Consultando Supabase...";
  if (btnRefreshHistorialDespachos) btnRefreshHistorialDespachos.disabled = true;
  try {
    let query = planillaSupabaseClient
      .from(HISTORIAL_DESPACHOS_TABLE)
      .select("id,reg_id,vehicle_id,interno,placa,itinerario_id,itinerario,driver_id,observaciones,ficho,pasajeros,estado,cancelled_at,created_by,created_at")
      .order("created_at", { ascending: false })
      .limit(HISTORIAL_DESPACHOS_LIMIT);
    const rangeMs = getHistorialDespachosRangeMs();
    if (rangeMs) {
      const desde = new Date(Date.now() - rangeMs).toISOString();
      query = query.gte("created_at", desde);
    }
    const { data, error } = await query;
    if (error) throw error;
    historialDespachosRows = Array.isArray(data) ? data : [];
    historialDespachosLastLoadedAt = Date.now();
    renderHistorialDespachosTab();
    if (historialDespachosStatus) {
      const stamp = horaCO(new Date());
      historialDespachosStatus.textContent =
        `Actualizado ${stamp} · ${historialDespachosRows.length} registros`;
    }
  } catch (err) {
    console.error(`[${HISTORIAL_DESPACHOS_TABLE}] consulta fallo:`, err);
    if (historialDespachosStatus) historialDespachosStatus.textContent = `Error: ${err?.message || "fallo"}`;
    showToast(`No se pudo cargar ${HISTORIAL_DESPACHOS_TABLE}: ${err?.message || "fallo"}`, "err");
  } finally {
    historialDespachosLoading = false;
    if (btnRefreshHistorialDespachos) btnRefreshHistorialDespachos.disabled = false;
  }
}

function getHistorialDespachosItinerariosResumen(){
  const estado = String(historialDespachosEstadoFilter?.value || "").trim().toUpperCase();
  const counts = new Map();
  for (const r of (historialDespachosRows || [])) {
    if (estado && String(r?.estado || "").toUpperCase() !== estado) continue;
    const itin = String(r?.itinerario || "").trim() || "Sin itinerario";
    counts.set(itin, (counts.get(itin) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es"));
}

function renderHistorialDespachosItinChips(){
  if (!historialDespachosItinChips) return;
  const resumen = getHistorialDespachosItinerariosResumen();
  const total = resumen.reduce((acc, r) => acc + r.count, 0);
  const activeFilter = historialDespachosItinFilter;
  const chips = [{ name: "", label: "Todos", count: total }]
    .concat(resumen.map(r => ({ name: r.name, label: r.name, count: r.count })));
  historialDespachosItinChips.innerHTML = chips.map(chip => {
    const isActive = String(chip.name) === String(activeFilter);
    const cls = `chip${isActive ? " active" : ""}`;
    return `<button type="button" class="${cls}" data-itin="${escapeHtml(chip.name)}">
      <span>${escapeHtml(chip.label)}</span>
      <span class="chip-count">${chip.count}</span>
    </button>`;
  }).join("");
}

function getFilteredHistorialDespachosRows(){
  const term = String(historialDespachosSearch?.value || "").trim().toLowerCase();
  const estado = String(historialDespachosEstadoFilter?.value || "").trim().toUpperCase();
  const itin = String(historialDespachosItinFilter || "").trim();
  return (historialDespachosRows || []).filter(row => {
    if (estado && String(row?.estado || "").toUpperCase() !== estado) return false;
    if (itin) {
      const rowItin = String(row?.itinerario || "").trim() || "Sin itinerario";
      if (rowItin !== itin) return false;
    }
    if (!term) return true;
    const haystack = [
      row?.reg_id, row?.interno, row?.placa, row?.vehicle_id, row?.driver_id, row?.itinerario
    ].map(v => String(v || "").toLowerCase()).join(" ");
    return haystack.includes(term);
  });
}

function getHistorialEstadoColor(estado){
  switch (String(estado || "").toUpperCase()) {
    case "ACTIVO":    return "#065f46";
    case "CANCELADO": return "#b91c1c";
    default:          return "#64748b";
  }
}

function isSameLocalDay(iso, refDate){
  if (!iso) return false;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return d.getFullYear() === refDate.getFullYear()
    && d.getMonth() === refDate.getMonth()
    && d.getDate() === refDate.getDate();
}

function renderHistorialInsights(){
  if (!historialInsights) return;
  const itinSel = String(historialDespachosItinFilter || "").trim();
  if (!itinSel) {
    historialInsights.hidden = true;
    historialInsights.innerHTML = "";
    return;
  }

  const today = new Date();
  const rowsHoyItin = (historialDespachosRows || []).filter(r => {
    if (String(r?.itinerario || "").trim() !== itinSel) return false;
    return isSameLocalDay(r?.created_at, today);
  });
  const activos = rowsHoyItin.filter(r => String(r?.estado || "").toUpperCase() === "ACTIVO");
  const cancelados = rowsHoyItin.filter(r => String(r?.estado || "").toUpperCase() === "CANCELADO");

  const countByInterno = new Map();
  activos.forEach(r => {
    const k = String(r?.interno || "").trim();
    if (!k) return;
    countByInterno.set(k, (countByInterno.get(k) || 0) + 1);
  });

  // Pool habilitado en vehiculossonar + mapa mId -> interno (para cruzar con Sonar).
  const sonarPool = (Array.isArray(vehiculosSonarRows) ? vehiculosSonarRows : [])
    .map(v => ({
      interno: String(v?.interno || "").trim(),
      placa: String(v?.placa || "").trim(),
      mid: String(v?.mid || "").trim(),
    }))
    .filter(v => v.interno);
  const sonarInternos = new Set(sonarPool.map(v => v.interno));
  const midToInterno = new Map();
  sonarPool.forEach(v => { if (v.mid) midToInterno.set(v.mid, v.interno); });

  // Posicion Sonar en vivo por interno (reemplaza a llegadas_104).
  const sonarPosByInterno = new Map();
  (sonarFleetLocations || []).forEach(p => {
    const interno = midToInterno.get(String(p?.id || "").trim());
    if (interno && !sonarPosByInterno.has(interno)) sonarPosByInterno.set(interno, p);
  });

  // Internos del itinerario: han despachado este itinerario en el historial cargado.
  const internosDelItinerario = new Set();
  (historialDespachosRows || []).forEach(r => {
    if (String(r?.itinerario || "").trim() !== itinSel) return;
    const k = String(r?.interno || "").trim();
    if (k) internosDelItinerario.add(k);
  });

  // "En ruta" = vehiculos del itinerario que reportan posicion en Sonar ahora.
  const internosEnRuta = new Map();
  for (const interno of internosDelItinerario) {
    const pos = sonarPosByInterno.get(interno);
    if (pos) internosEnRuta.set(interno, pos);
  }

  // Sugeridos para despachar: reportando en Sonar y sin despacho hoy (detenidos primero).
  const sinDespachar = [];
  for (const [interno, pos] of internosEnRuta.entries()) {
    if (!countByInterno.has(interno)) sinDespachar.push({ interno, pos });
  }
  sinDespachar.sort((a, b) => {
    const sa = Number(a.pos?.speed) || 0;
    const sb = Number(b.pos?.speed) || 0;
    if (sa !== sb) return sa - sb;
    return String(a.interno).localeCompare(String(b.interno), undefined, { numeric: true });
  });

  const repetidos = [...countByInterno.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));

  const sonarPoolItin = sonarPool.filter(v => internosDelItinerario.has(v.interno));
  const sonarDisponibles = sonarPoolItin.filter(v =>
    !internosEnRuta.has(v.interno) && !countByInterno.has(v.interno)
  );
  sonarDisponibles.sort((a, b) => String(a.interno).localeCompare(String(b.interno), undefined, { numeric: true }));
  const SONAR_MAX_VISIBLE = 30;
  const sonarVisibles = sonarDisponibles.slice(0, SONAR_MAX_VISIBLE);
  const sonarOcultos = Math.max(0, sonarDisponibles.length - sonarVisibles.length);

  // Vehiculos despachados hoy en este itinerario que NO estan habilitados en vehiculossonar.
  const despachadosFueraDeSonar = [...countByInterno.keys()].filter(k => sonarInternos.size && !sonarInternos.has(k));

  const totalDespachos = activos.length;
  const vehiculosUnicos = countByInterno.size;
  const vehiculosEnRuta = internosEnRuta.size;
  const habilitadosSonarItin = sonarPoolItin.length;

  const sinDespacharHtml = sinDespachar.length
    ? sinDespachar.map(x => {
        const speed = Number(x.pos?.speed) || 0;
        const detenido = speed === 0;
        const estadoCls = detenido ? " is-listo" : "";          // verde = detenido (mas disponible)
        const speedTxt = detenido ? "detenido" : `${speed} km/h`;
        const baseNum = getBaseNumForInterno(x.interno);
        const baseBadge = baseNum ? `<span class="chip-base" title="Base afiliacion">B${escapeHtml(baseNum)}</span>` : "";
        return `<span class="insight-chip${estadoCls}" title="Placa ${x.pos?.plate || "-"} · ${speedTxt}${x.pos?.driverName ? ` · ${x.pos.driverName}` : ""}${baseNum ? ` · Base ${baseNum}` : ""}">
          ${baseBadge}<strong>${escapeHtml(x.interno)}</strong> <small>${escapeHtml(speedTxt)}</small>
        </span>`;
      }).join("")
    : `<span class="muted">Ninguno: los vehiculos del itinerario que reportan en Sonar ya tienen despacho hoy.</span>`;

  const repetidosHtml = repetidos.length
    ? repetidos.map(([interno, n]) => {
        const baseNum = getBaseNumForInterno(interno);
        const baseBadge = baseNum ? `<span class="chip-base" title="Base afiliacion">B${escapeHtml(baseNum)}</span>` : "";
        return `<span class="insight-chip is-warn" title="${n} despachos hoy${baseNum ? ` · Base ${baseNum}` : ""}">
          ${baseBadge}<strong>${escapeHtml(interno)}</strong> <small>${n}x</small>
        </span>`;
      }).join("")
    : `<span class="muted">Ningun vehiculo lleva mas de un despacho hoy.</span>`;

  const sonarDisponiblesHtml = sonarPool.length === 0
    ? `<span class="muted">Lista de vehiculossonar no cargada.</span>`
    : (habilitadosSonarItin === 0
        ? `<span class="muted">Aun no hay vehiculos historicos para este itinerario en la lista Sonar.</span>`
        : (sonarVisibles.length
            ? sonarVisibles.map(v => {
                const placa = v.placa ? ` · ${v.placa}` : "";
                const mid = v.mid ? ` · MID ${v.mid}` : "";
                const baseNum = getBaseNumForInterno(v.interno);
                const baseBadge = baseNum ? `<span class="chip-base" title="Base afiliacion">B${escapeHtml(baseNum)}</span>` : "";
                return `<span class="insight-chip is-pool" title="Habilitado en Sonar${placa}${mid}${baseNum ? ` · Base ${baseNum}` : ""}">
                  ${baseBadge}<strong>${escapeHtml(v.interno)}</strong>${v.placa ? ` <small>${escapeHtml(v.placa)}</small>` : ""}
                </span>`;
              }).join("") + (sonarOcultos ? `<span class="muted" style="align-self:center">+${sonarOcultos} mas</span>` : "")
            : `<span class="muted">Todos los habilitados para este itinerario ya estan en ruta o despachados hoy.</span>`));

  const fueraSonarHtml = despachadosFueraDeSonar.length
    ? despachadosFueraDeSonar.map(interno => {
        const baseNum = getBaseNumForInterno(interno);
        const baseBadge = baseNum ? `<span class="chip-base" title="Base afiliacion">B${escapeHtml(baseNum)}</span>` : "";
        return `<span class="insight-chip is-warn" title="Despachado hoy pero no habilitado en vehiculossonar${baseNum ? ` · Base ${baseNum}` : ""}">
          ${baseBadge}<strong>${escapeHtml(interno)}</strong> <small>!</small>
        </span>`;
      }).join("")
    : "";

  historialInsights.hidden = false;
  historialInsights.innerHTML = `
    <div class="insights-header">
      <h4>Inteligencia del itinerario</h4>
      <span class="muted">${escapeHtml(itinSel)} · hoy</span>
    </div>
    <div class="insights-kpis">
      <div class="kpi"><div class="kpi-num">${totalDespachos}</div><div class="kpi-lbl">Despachos hoy</div></div>
      <div class="kpi"><div class="kpi-num">${vehiculosUnicos}</div><div class="kpi-lbl">Vehiculos despachados</div></div>
      <div class="kpi"><div class="kpi-num">${vehiculosEnRuta}</div><div class="kpi-lbl">En ruta (Sonar)</div></div>
      <div class="kpi"><div class="kpi-num">${sinDespachar.length}</div><div class="kpi-lbl">Sin despachar</div></div>
      <div class="kpi"><div class="kpi-num">${habilitadosSonarItin}</div><div class="kpi-lbl">Sonar del itin.</div></div>
      <div class="kpi"><div class="kpi-num">${sonarDisponibles.length}</div><div class="kpi-lbl">Pool Sonar libre</div></div>
      <div class="kpi"><div class="kpi-num">${repetidos.length}</div><div class="kpi-lbl">Con repeticion</div></div>
      <div class="kpi"><div class="kpi-num">${cancelados.length}</div><div class="kpi-lbl">Cancelados</div></div>
    </div>
    <div class="insights-section">
      <div class="insights-section-title">
        <span>Sugeridos para despachar (reportando en Sonar y sin despacho hoy)</span>
        <span class="muted">${sinDespachar.length}</span>
      </div>
      <div class="insights-chips">${sinDespacharHtml}</div>
    </div>
    <div class="insights-section">
      <div class="insights-section-title">
        <span>Pool Sonar del itinerario (habilitados, fuera de ruta y sin despacho hoy)</span>
        <span class="muted">${sonarDisponibles.length}</span>
      </div>
      <div class="insights-chips">${sonarDisponiblesHtml}</div>
    </div>
    <div class="insights-section">
      <div class="insights-section-title">
        <span>Vehiculos con mas de un despacho hoy</span>
        <span class="muted">${repetidos.length}</span>
      </div>
      <div class="insights-chips">${repetidosHtml}</div>
    </div>
    ${despachadosFueraDeSonar.length ? `
    <div class="insights-section">
      <div class="insights-section-title">
        <span>Despachados hoy no habilitados en vehiculossonar</span>
        <span class="muted">${despachadosFueraDeSonar.length}</span>
      </div>
      <div class="insights-chips">${fueraSonarHtml}</div>
    </div>` : ""}
  `;
}

function renderHistorialDespachosTab(){
  renderHistorialDespachosItinChips();
  renderHistorialInsights();
  if (!historialDespachosBody) return;
  const filtered = getFilteredHistorialDespachosRows();
  if (historialDespachosCount) historialDespachosCount.textContent = String(filtered.length);
  if (!filtered.length) {
    historialDespachosBody.innerHTML =
      `<tr><td colspan="11" class="muted" style="text-align:center;padding:12px">Sin despachos para mostrar.</td></tr>`;
    return;
  }
  historialDespachosBody.innerHTML = filtered.map(row => {
    const created = formatHistorialDateTime(row?.created_at);
    const cancelled = row?.cancelled_at ? formatHistorialDateTime(row?.cancelled_at) : "-";
    const estado = String(row?.estado || "").toUpperCase();
    const color = getHistorialEstadoColor(estado);
    const pasajeros = Number.isFinite(Number(row?.pasajeros)) ? Number(row.pasajeros) : 0;
    const rowId = escapeHtml(String(row?.id || ""));
    const regId = String(row?.reg_id || "").trim();
    const mId = String(row?.vehicle_id || "").trim();
    const isCanceling = historialCancelingIds.has(String(row?.id || ""));
    const ageMin = getMinutesSince(row?.created_at);
    const ageExpired = ageMin !== null && ageMin > MAX_CANCEL_AGE_MIN;
    let actionHtml = "";
    if (estado === "ACTIVO") {
      if (!regId || !mId) {
        actionHtml = `<span class="muted" title="Falta reg_id o vehicle_id">-</span>`;
      } else if (ageExpired) {
        actionHtml = `<span class="muted" title="Tiempo expirado: ${Math.floor(ageMin)} min (max ${MAX_CANCEL_AGE_MIN})">Expirado</span>`;
      } else {
        const label = isCanceling ? "Cancelando..." : "Cancelar";
        const minsLeft = Math.max(0, Math.ceil(MAX_CANCEL_AGE_MIN - (ageMin || 0)));
        const title = `Cancelar este despacho en Sonar (quedan ~${minsLeft} min)`;
        actionHtml = `<button type="button"
          class="btn btn-danger btn-cancel-historial"
          data-historial-id="${rowId}"
          ${isCanceling ? "disabled" : ""}
          title="${escapeHtml(title)}">${escapeHtml(label)}</button>`;
      }
    } else {
      actionHtml = `<span class="muted">-</span>`;
    }
    const interno = String(row?.interno || "");
    const baseNum = getBaseNumForInterno(interno);
    const baseBadge = baseNum
      ? `<span class="chip-base" title="Base afiliacion">B${escapeHtml(baseNum)}</span>`
      : "";
    return `<tr data-historial-id="${rowId}">
      <td>${escapeHtml(created)}</td>
      <td><strong>${escapeHtml(String(row?.reg_id || "-"))}</strong></td>
      <td>${baseBadge}<strong style="color:#065f46">${escapeHtml(interno || "-")}</strong></td>
      <td>${escapeHtml(String(row?.placa || "-"))}</td>
      <td>${escapeHtml(String(row?.driver_id || "-"))}</td>
      <td>${escapeHtml(String(row?.itinerario || "-"))}</td>
      <td style="text-align:right">
        <input type="number"
               class="cell-edit-input pasajeros-edit"
               min="0" max="999" step="1"
               value="${pasajeros}"
               data-original="${pasajeros}"
               data-historial-id="${rowId}"
               aria-label="Editar pasajeros" />
      </td>
      <td>
        <input type="text"
               class="cell-edit-input observaciones-edit"
               maxlength="500"
               value="${escapeHtml(String(row?.observaciones || ""))}"
               data-original="${escapeHtml(String(row?.observaciones || ""))}"
               data-historial-id="${rowId}"
               placeholder="Agregar observacion..."
               aria-label="Editar observaciones" />
      </td>
      <td><strong style="color:${color}">${escapeHtml(estado || "-")}</strong></td>
      <td>${escapeHtml(cancelled)}</td>
      <td>${actionHtml}</td>
    </tr>`;
  }).join("");
}

async function updateDespachoRealizadoPasajeros(id, nuevoValor){
  const rowId = String(id || "").trim();
  if (!rowId) throw new Error("id de despacho vacio");
  const num = parseInt(String(nuevoValor), 10);
  if (!Number.isFinite(num) || num < 0) throw new Error("Valor de pasajeros invalido");
  const { data, error } = await planillaSupabaseClient
    .from(HISTORIAL_DESPACHOS_TABLE)
    .update({ pasajeros: num })
    .eq("id", rowId)
    .select()
    .single();
  if (error) throw error;
  // Sincronizar la fila local
  const local = (historialDespachosRows || []).find(r => String(r?.id) === rowId);
  if (local) local.pasajeros = num;
  return data;
}

async function handlePasajerosEditCommit(input){
  if (!input || input.classList.contains("is-saving")) return;
  const id = String(input.getAttribute("data-historial-id") || "").trim();
  const original = String(input.getAttribute("data-original") || "");
  const valor = String(input.value || "").trim();
  if (!id) return;
  if (valor === original) return; // sin cambios
  const num = parseInt(valor, 10);
  if (!Number.isFinite(num) || num < 0 || num > 999) {
    input.classList.add("is-error");
    input.value = original;
    showToast("Pasajeros debe ser un numero entero entre 0 y 999.", "warn");
    setTimeout(() => input.classList.remove("is-error"), 1200);
    return;
  }
  input.classList.add("is-saving");
  input.classList.remove("is-error", "is-saved");
  input.disabled = true;
  try {
    await updateDespachoRealizadoPasajeros(id, num);
    input.classList.remove("is-saving");
    input.classList.add("is-saved");
    input.setAttribute("data-original", String(num));
    setTimeout(() => input.classList.remove("is-saved"), 900);
  } catch (err) {
    console.error("[despachos_realizados] update pasajeros fallo:", err);
    input.classList.remove("is-saving");
    input.classList.add("is-error");
    input.value = original;
    showToast(`No se pudo actualizar pasajeros: ${err?.message || err}`, "err");
    setTimeout(() => input.classList.remove("is-error"), 1500);
  } finally {
    input.disabled = false;
  }
}

async function updateDespachoRealizadoObservaciones(id, nuevoValor){
  const rowId = String(id || "").trim();
  if (!rowId) throw new Error("id de despacho vacio");
  const texto = String(nuevoValor ?? "").slice(0, 500);
  const payload = texto.trim() === "" ? null : texto;
  const { data, error } = await planillaSupabaseClient
    .from(HISTORIAL_DESPACHOS_TABLE)
    .update({ observaciones: payload })
    .eq("id", rowId)
    .select()
    .single();
  if (error) throw error;
  const local = (historialDespachosRows || []).find(r => String(r?.id) === rowId);
  if (local) local.observaciones = payload;
  return data;
}

async function handleObservacionesEditCommit(input){
  if (!input || input.classList.contains("is-saving")) return;
  const id = String(input.getAttribute("data-historial-id") || "").trim();
  const original = String(input.getAttribute("data-original") || "");
  const valor = String(input.value || "");
  if (!id) return;
  if (valor === original) return;
  if (valor.length > 500) {
    input.classList.add("is-error");
    input.value = original;
    showToast("Observaciones: maximo 500 caracteres.", "warn");
    setTimeout(() => input.classList.remove("is-error"), 1200);
    return;
  }
  input.classList.add("is-saving");
  input.classList.remove("is-error", "is-saved");
  input.disabled = true;
  try {
    await updateDespachoRealizadoObservaciones(id, valor);
    input.classList.remove("is-saving");
    input.classList.add("is-saved");
    input.setAttribute("data-original", valor);
    setTimeout(() => input.classList.remove("is-saved"), 900);
  } catch (err) {
    console.error("[despachos_realizados] update observaciones fallo:", err);
    input.classList.remove("is-saving");
    input.classList.add("is-error");
    input.value = original;
    showToast(`No se pudo actualizar observaciones: ${err?.message || err}`, "err");
    setTimeout(() => input.classList.remove("is-error"), 1500);
  } finally {
    input.disabled = false;
  }
}

function handleHistorialDespachosBodyChange(ev){
  const pasajeros = ev.target?.closest?.(".pasajeros-edit");
  if (pasajeros && historialDespachosBody?.contains(pasajeros)) {
    handlePasajerosEditCommit(pasajeros);
    return;
  }
  const obs = ev.target?.closest?.(".observaciones-edit");
  if (obs && historialDespachosBody?.contains(obs)) {
    handleObservacionesEditCommit(obs);
  }
}

function handleHistorialDespachosBodyKeydown(ev){
  if (ev.key !== "Enter") return;
  const input = ev.target?.closest?.(".pasajeros-edit, .observaciones-edit");
  if (!input || !historialDespachosBody?.contains(input)) return;
  ev.preventDefault();
  input.blur();
}

function findPlanillaRowByDispatchRegId(regId){
  const id = String(regId || "").trim();
  if (!id) return null;
  const rows = Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [];
  return rows.find(r => String(getRowDispatchRegId(r) || "").trim() === id) || null;
}

async function handleCancelDispatchFromHistorial(historialId){
  const id = String(historialId || "").trim();
  if (!id) return;
  if (historialCancelingIds.has(id)) return;
  const histRow = (historialDespachosRows || []).find(r => String(r?.id) === id);
  if (!histRow) {
    showToast("No se encontro el despacho a cancelar.", "warn");
    return;
  }
  if (String(histRow?.estado || "").toUpperCase() !== "ACTIVO") {
    showToast("Este despacho ya esta cancelado.", "warn");
    return;
  }
  const regId = String(histRow?.reg_id || "").trim();
  const mId = String(histRow?.vehicle_id || "").trim();
  if (!regId || !mId) {
    showToast("No se puede cancelar: falta reg_id o vehicle_id.", "warn");
    return;
  }
  const ageMin = getMinutesSince(histRow?.created_at);
  if (ageMin !== null && ageMin > MAX_CANCEL_AGE_MIN) {
    showToast(`Tiempo expirado: el despacho tiene ${Math.floor(ageMin)} min (max ${MAX_CANCEL_AGE_MIN}).`, "warn");
    renderHistorialDespachosTab();
    return;
  }
  const modalResult = await openCancelDispatchModal({
    interno: String(histRow?.interno || "-"),
    base: "-",
    mid: mId,
    regId,
    horaDespacho: formatHistorialDateTime(histRow?.created_at)
  });
  if (!modalResult?.confirmed) return;
  const comments = String(modalResult?.comments || "").trim();
  if (comments.length < 5) {
    showToast("Escribe un motivo de minimo 5 caracteres para cancelar.", "warn");
    return;
  }
  historialCancelingIds.add(id);
  renderHistorialDespachosTab();
  try {
    const payload = {
      mId,
      regId,
      comments,
      dispatchId: null,
      canceledBy: currentUserEmail || currentUserId || "desconocido",
      canceledAt: new Date().toISOString(),
      vehicle: {
        interno: String(histRow?.interno || "-"),
        base: "-"
      },
      dispatch: {
        itinerary: String(histRow?.itinerario || ""),
        hora_despacho: formatHistorialDateTime(histRow?.created_at),
        driver_id: String(histRow?.driver_id || "")
      },
      source: "historial-despachos"
    };
    const cancelResult = await sendCancelDispatchToSonar(payload);
    await markDespachoRealizadoAsCanceled(regId, cancelResult);
    histRow.estado = "CANCELADO";
    histRow.cancelled_at = new Date().toISOString();

    let planillaUpdated = false;
    const planillaRow = findPlanillaRowByDispatchRegId(regId);
    if (planillaRow) {
      planillaRow.hora_despacho = null;
      planillaRow.itinerario_despacho = "";
      planillaRow.estado = "En espera";
      invalidatePlanillaDispatchResolutionCache();
      try {
        await persistCancelOnPlanillaRow(planillaRow, { comments, driverId: planillaRow?.driver_id });
        planillaUpdated = true;
      } catch (persistErr) {
        console.error("Cancel desde historial: persist por id fallo:", persistErr);
      }
    }
    if (!planillaUpdated) {
      planillaUpdated = await clearPlanillaDispatchByRegIdInDb(regId);
      if (planillaUpdated) {
        await loadPlanillaAfiliadosFromSupabase();
        invalidatePlanillaDispatchResolutionCache();
      } else {
        console.warn("[historial cancel] no se encontro la fila en planilla por reg_id:", regId);
      }
    }
    renderLlegadasAeropuerto();
    renderLlegadasTerminalNorte();
    renderLlegadasSanDiego();
    renderLlegadasNutibara();
    renderNoDespachoTab();
    showToast(planillaUpdated
      ? "Despacho cancelado en Sonar y planilla actualizada."
      : "Despacho cancelado en Sonar (planilla no encontrada por reg_id).",
      planillaUpdated ? "ok" : "warn");
  } catch (err) {
    console.error("[historial] cancelacion fallo:", err);
    showToast(`Error al cancelar: ${err?.message || "fallo en sonar-cancel"}`, "err");
  } finally {
    historialCancelingIds.delete(id);
    renderHistorialDespachosTab();
  }
}

function handleHistorialDespachosBodyClick(ev){
  const btn = ev.target?.closest?.(".btn-cancel-historial");
  if (!btn || !historialDespachosBody?.contains(btn)) return;
  const id = String(btn.getAttribute("data-historial-id") || "").trim();
  if (!id) return;
  handleCancelDispatchFromHistorial(id);
}

/* ===================== DESPACHOS AEROPUERTO ===================== */
// Lista fundamental: despachos realizados por el medio Aeropuerto.
// Solo incluye los dos itinerarios Aeropuerto<->San Diego/ccsandiego:
//   3385 "Aeropuerto-San Diego-Tunel" y 4504 "ccsandiego-tunel-aeropuerto".
const DESPACHOS_AEROPUERTO_ITINERARY_IDS = ["3385", "4504"];
const DESPACHOS_AEROPUERTO_ITINERARY_NAMES = [
  "aeropuerto-san diego-tunel",
  "ccsandiego-tunel-aeropuerto",
  "aeropuerto-tunel-ccsandiego",
  "aeropuerto-tunel-san diego",
];
let despachosAeropuertoRows = [];
let despachosAeropuertoLoading = false;
let despachosAeropuertoLastLoadedAt = null;
let despachosAeropuertoItinFilter = "";

function isDespachoAeropuertoRow(row){
  const id = String(row?.itinerario_id || "").trim();
  if (id) {
    // Con itinerario_id confiable, se decide solo por id (excluye 3395, 4505, etc.).
    return DESPACHOS_AEROPUERTO_ITINERARY_IDS.includes(id);
  }
  // Sin id, se cae a coincidencia por nombre exacto conocido.
  const name = String(row?.itinerario || "").trim().toLowerCase();
  return DESPACHOS_AEROPUERTO_ITINERARY_NAMES.includes(name);
}

function getDespachosAeropuertoRangeMs(){
  const v = String(despachosAeropuertoRangeFilter?.value || "24h");
  switch (v) {
    case "7d":  return 7  * 24 * 60 * 60 * 1000;
    case "30d": return 30 * 24 * 60 * 60 * 1000;
    case "all": return null;
    case "24h":
    default:    return 24 * 60 * 60 * 1000;
  }
}

async function loadDespachosAeropuertoFromSupabase(){
  if (despachosAeropuertoLoading) return;
  if (!currentUserId) return;
  despachosAeropuertoLoading = true;
  if (despachosAeropuertoStatus) despachosAeropuertoStatus.textContent = "Consultando Supabase...";
  if (btnRefreshDespachosAeropuerto) btnRefreshDespachosAeropuerto.disabled = true;
  try {
    let query = planillaSupabaseClient
      .from(HISTORIAL_DESPACHOS_TABLE)
      .select("id,reg_id,vehicle_id,interno,placa,itinerario_id,itinerario,driver_id,observaciones,ficho,pasajeros,estado,cancelled_at,created_by,created_at")
      .in("itinerario_id", DESPACHOS_AEROPUERTO_ITINERARY_IDS)
      .order("created_at", { ascending: false })
      .limit(HISTORIAL_DESPACHOS_LIMIT);
    const rangeMs = getDespachosAeropuertoRangeMs();
    if (rangeMs) {
      const desde = new Date(Date.now() - rangeMs).toISOString();
      query = query.gte("created_at", desde);
    }
    const { data, error } = await query;
    if (error) throw error;
    // Filtro defensivo en cliente por si llegan filas con itinerario_id nulo.
    despachosAeropuertoRows = (Array.isArray(data) ? data : []).filter(isDespachoAeropuertoRow);
    despachosAeropuertoLastLoadedAt = Date.now();
    renderDespachosAeropuertoTab();
    if (despachosAeropuertoStatus) {
      const stamp = horaCO(new Date());
      despachosAeropuertoStatus.textContent =
        `Actualizado ${stamp} · ${despachosAeropuertoRows.length} registros`;
    }
  } catch (err) {
    console.error(`[despachos-aeropuerto] consulta fallo:`, err);
    if (despachosAeropuertoStatus) despachosAeropuertoStatus.textContent = `Error: ${err?.message || "fallo"}`;
    showToast(`No se pudo cargar despachos aeropuerto: ${err?.message || "fallo"}`, "err");
  } finally {
    despachosAeropuertoLoading = false;
    if (btnRefreshDespachosAeropuerto) btnRefreshDespachosAeropuerto.disabled = false;
  }
}

function getDespachosAeropuertoItinerariosResumen(){
  const estado = String(despachosAeropuertoEstadoFilter?.value || "").trim().toUpperCase();
  const counts = new Map();
  for (const r of (despachosAeropuertoRows || [])) {
    if (estado && String(r?.estado || "").toUpperCase() !== estado) continue;
    const itin = String(r?.itinerario || "").trim() || "Sin itinerario";
    counts.set(itin, (counts.get(itin) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es"));
}

function renderDespachosAeropuertoItinChips(){
  if (!despachosAeropuertoItinChips) return;
  const resumen = getDespachosAeropuertoItinerariosResumen();
  const total = resumen.reduce((acc, r) => acc + r.count, 0);
  const chips = [{ name: "", label: "Todos", count: total }]
    .concat(resumen.map(r => ({ name: r.name, label: r.name, count: r.count })));
  despachosAeropuertoItinChips.innerHTML = chips.map(chip => {
    const isActive = String(chip.name) === String(despachosAeropuertoItinFilter);
    const cls = `chip${isActive ? " active" : ""}`;
    return `<button type="button" class="${cls}" data-itin="${escapeHtml(chip.name)}">
      <span>${escapeHtml(chip.label)}</span>
      <span class="chip-count">${chip.count}</span>
    </button>`;
  }).join("");
}

function getFilteredDespachosAeropuertoRows(){
  const term = String(despachosAeropuertoSearch?.value || "").trim().toLowerCase();
  const estado = String(despachosAeropuertoEstadoFilter?.value || "").trim().toUpperCase();
  const itin = String(despachosAeropuertoItinFilter || "").trim();
  return (despachosAeropuertoRows || []).filter(row => {
    if (estado && String(row?.estado || "").toUpperCase() !== estado) return false;
    if (itin) {
      const rowItin = String(row?.itinerario || "").trim() || "Sin itinerario";
      if (rowItin !== itin) return false;
    }
    if (!term) return true;
    const haystack = [
      row?.reg_id, row?.interno, row?.placa, row?.vehicle_id, row?.driver_id, row?.itinerario
    ].map(v => String(v || "").toLowerCase()).join(" ");
    return haystack.includes(term);
  });
}

function renderDespachosAeropuertoTab(){
  renderDespachosAeropuertoItinChips();
  if (!despachosAeropuertoBody) return;
  const filtered = getFilteredDespachosAeropuertoRows();
  if (despachosAeropuertoCount) despachosAeropuertoCount.textContent = String(filtered.length);
  if (!filtered.length) {
    despachosAeropuertoBody.innerHTML =
      `<tr><td colspan="10" class="muted" style="text-align:center;padding:12px">Sin despachos por medio aeropuerto para mostrar.</td></tr>`;
    return;
  }
  despachosAeropuertoBody.innerHTML = filtered.map(row => {
    const created = formatHistorialDateTime(row?.created_at);
    const cancelled = row?.cancelled_at ? formatHistorialDateTime(row?.cancelled_at) : "-";
    const estado = String(row?.estado || "").toUpperCase();
    const color = getHistorialEstadoColor(estado);
    const pasajeros = Number.isFinite(Number(row?.pasajeros)) ? Number(row.pasajeros) : 0;
    const interno = String(row?.interno || "");
    const baseNum = getBaseNumForInterno(interno);
    const baseBadge = baseNum
      ? `<span class="chip-base" title="Base afiliacion">B${escapeHtml(baseNum)}</span>`
      : "";
    return `<tr>
      <td>${escapeHtml(created)}</td>
      <td><strong>${escapeHtml(String(row?.reg_id || "-"))}</strong></td>
      <td>${baseBadge}<strong style="color:#065f46">${escapeHtml(interno || "-")}</strong></td>
      <td>${escapeHtml(String(row?.placa || "-"))}</td>
      <td>${escapeHtml(String(row?.driver_id || "-"))}</td>
      <td>${escapeHtml(String(row?.itinerario || "-"))}</td>
      <td style="text-align:right">${pasajeros}</td>
      <td>${escapeHtml(String(row?.observaciones || ""))}</td>
      <td><strong style="color:${color}">${escapeHtml(estado || "-")}</strong></td>
      <td>${escapeHtml(cancelled)}</td>
    </tr>`;
  }).join("");
}

function handleDespachosAeropuertoChipClick(ev){
  const chip = ev.target?.closest?.(".chip");
  if (!chip || !despachosAeropuertoItinChips?.contains(chip)) return;
  despachosAeropuertoItinFilter = String(chip.getAttribute("data-itin") || "").trim();
  renderDespachosAeropuertoTab();
}

/* ===================== PREOPERACIONALES SICOV ===================== */
const PREOP_SICOV_TABLE = "preoperacionales_sicov";
let preopSicovCurrentPage = 1;
let preopSicovTotalCount = 0;
let preopSicovLastLoadedAt = null;
let preopSicovLoading = false;
let preopSicovSearchTimer = null;

function getPreopSicovPageSize(){
  const n = parseInt(String(preopSicovPageSize?.value || "50"), 10);
  return Number.isFinite(n) && n > 0 ? n : 50;
}

function buildPreopSicovQuery(){
  let q = planillaSupabaseClient
    .from(PREOP_SICOV_TABLE)
    .select("id, FechaHora, NumeroInterno, Placa, Documento, NombreConductor, EstadoEnvio, RespuestaSICOV, DetalleActividades, ErrorSheet", { count: "exact" })
    .order("FechaHora", { ascending: false });

  const from = String(preopSicovFrom?.value || "").trim();
  const to = String(preopSicovTo?.value || "").trim();
  if (from) q = q.gte("FechaHora", `${from}T00:00:00+00:00`);
  if (to)   q = q.lte("FechaHora", `${to}T23:59:59+00:00`);

  const term = String(preopSicovSearch?.value || "").trim();
  if (term) {
    const safe = term.replace(/[%,()]/g, " ").trim();
    if (safe) {
      q = q.or([
        `NumeroInterno.ilike.%${safe}%`,
        `Placa.ilike.%${safe}%`,
        `Documento.ilike.%${safe}%`,
        `NombreConductor.ilike.%${safe}%`
      ].join(","));
    }
  }
  return q;
}

async function loadPreoperacionalesSicov(targetPage){
  if (preopSicovLoading) return;
  preopSicovLoading = true;
  const pageSize = getPreopSicovPageSize();
  const page = Math.max(1, parseInt(targetPage || preopSicovCurrentPage || 1, 10));
  preopSicovCurrentPage = page;
  if (preopSicovStatus) preopSicovStatus.textContent = "Consultando Supabase...";
  if (btnRefreshPreopSicov) btnRefreshPreopSicov.disabled = true;
  try {
    const fromIdx = (page - 1) * pageSize;
    const toIdx = fromIdx + pageSize - 1;
    const { data, count, error } = await buildPreopSicovQuery().range(fromIdx, toIdx);
    if (error) throw error;
    preopSicovTotalCount = Number.isFinite(count) ? count : (Array.isArray(data) ? data.length : 0);
    renderPreoperacionalesSicov(Array.isArray(data) ? data : []);
    preopSicovLastLoadedAt = Date.now();
    const stamp = horaCO(new Date());
    if (preopSicovStatus) preopSicovStatus.textContent = `Actualizado ${stamp}`;
  } catch (err) {
    console.error(`[${PREOP_SICOV_TABLE}] consulta fallo:`, err);
    if (preopSicovStatus) preopSicovStatus.textContent = `Error: ${err?.message || "fallo"}`;
    showToast(`No se pudo cargar ${PREOP_SICOV_TABLE}: ${err?.message || "fallo"}`, "err");
  } finally {
    preopSicovLoading = false;
    if (btnRefreshPreopSicov) btnRefreshPreopSicov.disabled = false;
  }
}

function formatPreopSicovDate(iso){
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return fechaHoraCO(d);
  } catch (_) { return String(iso); }
}

function extractSicovIds(respuesta){
  if (!respuesta) return { id: "", idAlistamiento: "" };
  let obj = respuesta;
  if (typeof respuesta === "string") {
    try { obj = JSON.parse(respuesta); } catch (_) { return { id: "", idAlistamiento: "" }; }
  }
  const inner = obj?.sicovResponse || obj || {};
  return {
    id: String(inner?.id ?? ""),
    idAlistamiento: String(inner?.idAlistamiento ?? "")
  };
}

function renderPreoperacionalesSicov(rows){
  if (!preopSicovBody) return;
  const pageSize = getPreopSicovPageSize();
  const totalPages = Math.max(1, Math.ceil(preopSicovTotalCount / pageSize));
  if (preopSicovTotal) preopSicovTotal.textContent = String(preopSicovTotalCount);
  if (preopSicovPage) preopSicovPage.textContent = String(preopSicovCurrentPage);
  if (preopSicovPages) preopSicovPages.textContent = String(totalPages);
  if (btnPreopSicovFirst) btnPreopSicovFirst.disabled = preopSicovCurrentPage <= 1;
  if (btnPreopSicovPrev)  btnPreopSicovPrev.disabled  = preopSicovCurrentPage <= 1;
  if (btnPreopSicovNext)  btnPreopSicovNext.disabled  = preopSicovCurrentPage >= totalPages;
  if (btnPreopSicovLast)  btnPreopSicovLast.disabled  = preopSicovCurrentPage >= totalPages;

  if (!rows.length) {
    preopSicovBody.innerHTML =
      `<tr><td colspan="9" class="muted" style="text-align:center;padding:12px">Sin registros para los filtros aplicados.</td></tr>`;
    return;
  }

  preopSicovBody.innerHTML = rows.map(row => {
    const fecha = formatPreopSicovDate(row?.FechaHora);
    const interno = String(row?.NumeroInterno || "-");
    const placa = String(row?.Placa || "-");
    const doc = String(row?.Documento || "-");
    const cond = String(row?.NombreConductor || "-");
    const estado = String(row?.EstadoEnvio || "-").toUpperCase();
    const estadoColor = estado === "OK" ? "#065f46" : (estado === "ERROR" ? "#b91c1c" : "#64748b");
    const det = String(row?.DetalleActividades || "");
    const ids = extractSicovIds(row?.RespuestaSICOV);
    const baseNum = getBaseNumForInterno(interno);
    const baseBadge = baseNum ? `<span class="chip-base" title="Base afiliacion">B${escapeHtml(baseNum)}</span> ` : "";
    return `<tr>
      <td>${escapeHtml(fecha)}</td>
      <td>${baseBadge}<strong style="color:#065f46">${escapeHtml(interno)}</strong></td>
      <td>${escapeHtml(placa)}</td>
      <td style="font-variant-numeric:tabular-nums">${escapeHtml(doc)}</td>
      <td>${escapeHtml(cond)}</td>
      <td><strong style="color:${estadoColor}">${escapeHtml(estado)}</strong></td>
      <td style="font-variant-numeric:tabular-nums">${escapeHtml(ids.id || "-")}</td>
      <td style="font-variant-numeric:tabular-nums">${escapeHtml(ids.idAlistamiento || "-")}</td>
      <td><span class="muted" title="${escapeHtml(det)}">${escapeHtml(det.slice(0, 40))}${det.length > 40 ? "..." : ""}</span></td>
    </tr>`;
  }).join("");
}

function schedulePreopSicovSearch(){
  if (preopSicovSearchTimer) clearTimeout(preopSicovSearchTimer);
  preopSicovSearchTimer = setTimeout(() => { loadPreoperacionalesSicov(1); }, 350);
}

/* ===================== MAPA VEHICULOS (llegadas_104 + realtime) ===================== */
const MAPA_VEHICULOS_TABLE = "llegadas_104";
const SONAR_LASTLOCATION_ENDPOINT = `${PLANILLA_SUPABASE_URL}/functions/v1/sonar-lastlocation`;
const SONAR_POSICIONES_TABLE = "sonar_posiciones";
const MAPA_DEFAULT_CENTER = [6.171, -75.4315]; // Glorieta Aeropuerto JMC
const MAPA_DEFAULT_ZOOM = 17;
const MAPA_OVERLAP_PRECISION = 5; // decimales para detectar misma coordenada (~1m)
const MAPA_OVERLAP_BASE_RADIUS_M = 8; // metros
let mapaLeaflet = null;
const mapaMarkers = new Map(); // vehicle_id -> Leaflet marker
let mapaVehiculosRows = [];
let mapaVehiculosLastLoadedAt = null;
let mapaRealtimeChannel = null;
let mapaRealtimeRetryTimer = null;
let mapaRealtimeRetryDelay = 1000;
const MAPA_REALTIME_RETRY_MAX_MS = 30000;
let mapaPollingTimer = null;
const MAPA_POLLING_INTERVAL_MS = 45000;
const MAPA_VISIBILITY_STALE_MS = 15000;
let mapaVisibilityListenerAttached = false;

/**
 * Devuelve un Map<rowKey, [lat, lon]> con las coordenadas ya separadas
 * cuando varios vehiculos comparten exactamente el mismo punto.
 * Distribuye en circulo alrededor del original.
 */
function computeMapaDisplayCoords(rows){
  const out = new Map();
  if (!Array.isArray(rows) || !rows.length) return out;
  // Agrupar por coordenada redondeada
  const groups = new Map();
  for (const row of rows) {
    const lat = parseFloat(row?.lat);
    const lon = parseFloat(row?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const key = getMapaRowKey(row);
    if (!key) continue;
    const coordKey = `${lat.toFixed(MAPA_OVERLAP_PRECISION)}|${lon.toFixed(MAPA_OVERLAP_PRECISION)}`;
    if (!groups.has(coordKey)) groups.set(coordKey, []);
    groups.get(coordKey).push({ key, lat, lon });
  }
  for (const items of groups.values()) {
    if (items.length === 1) {
      const it = items[0];
      out.set(it.key, [it.lat, it.lon]);
      continue;
    }
    // Distribuir radialmente. Radio crece con N para mantener separacion visual.
    const n = items.length;
    const radiusM = MAPA_OVERLAP_BASE_RADIUS_M * Math.max(1, Math.sqrt(n / 3));
    // 1 grado lat ~ 111000 m; 1 grado lon ~ 111000 * cos(lat)
    const baseLat = items[0].lat;
    const baseLon = items[0].lon;
    const dLat = radiusM / 111000;
    const dLon = radiusM / (111000 * Math.cos(baseLat * Math.PI / 180));
    items.forEach((it, i) => {
      const angle = (2 * Math.PI * i) / n;
      const lat = baseLat + dLat * Math.cos(angle);
      const lon = baseLon + dLon * Math.sin(angle);
      out.set(it.key, [lat, lon]);
    });
  }
  return out;
}

function getMapaRowKey(row){
  return String(row?.vehicle_id || row?.interno || "").trim().toUpperCase();
}

function buildMapaMarkerIcon(row){
  if (typeof L === "undefined") return null;
  const interno = String(row?.interno || "?");
  const listo = row?.listo === true || row?.listo === "true";
  const bg = listo ? "#16a34a" : "#0078d4";
  return L.divIcon({
    className: "mapa-veh-marker",
    html: `<div style="
      background:${bg};color:#fff;padding:4px 9px;border-radius:10px;
      font-weight:800;font-size:12px;border:2px solid #fff;
      box-shadow:0 2px 8px rgba(15,23,42,.35);
      font-family:Inter, system-ui, sans-serif;line-height:1;white-space:nowrap;
    ">${escapeHtml(interno)}</div>`,
    iconSize: null,
    iconAnchor: [16, 12],
  });
}

function buildMapaPopupHtml(row){
  const fmt = (v) => escapeHtml(String(v ?? "-").trim() || "-");
  const listo = (row?.listo === true || row?.listo === "true")
    ? `<span style="color:#16a34a;font-weight:700">LISTO</span>`
    : `<span style="color:#0078d4;font-weight:700">EN ESPERA</span>`;
  return `
    <div style="min-width:200px;font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:1.45">
      <div style="font-weight:800;font-size:15px;margin-bottom:4px">
        Interno ${fmt(row?.interno)}
        <span style="color:var(--fg-soft);font-weight:600;font-size:12px">(${fmt(row?.vehicle_id)})</span>
      </div>
      <div><b>Itinerario:</b> ${fmt(row?.itinerario)}</div>
      <div><b>Posicion:</b> ${fmt(row?.posicion)} · <b>Base:</b> ${fmt(row?.base)}</div>
      <div><b>Driver ID:</b> ${fmt(row?.driver_id)}</div>
      <div><b>Hora llegada:</b> ${fmt(row?.hora_llegada)}</div>
      <div><b>Estado:</b> ${listo}</div>
      <div style="color:var(--fg-soft);font-size:11px;margin-top:4px">Actualizado: ${fmt(row?.updated_at)}</div>
    </div>
  `;
}

function ensureMapaLeaflet(){
  if (mapaLeaflet) return mapaLeaflet;
  if (typeof L === "undefined" || !mapaVehiculosContainer) return null;
  mapaLeaflet = L.map(mapaVehiculosContainer, {
    center: MAPA_DEFAULT_CENTER,
    zoom: MAPA_DEFAULT_ZOOM,
    preferCanvas: false,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(mapaLeaflet);
  // Clic en el mapa: si estamos ubicando una geocerca, la crea ahi.
  mapaLeaflet.on("click", handleGeocercaMapClick);
  return mapaLeaflet;
}

function renderMapaMarkers(){
  const map = ensureMapaLeaflet();
  if (!map) return;
  const coords = computeMapaDisplayCoords(mapaVehiculosRows);
  const seen = new Set();
  for (const row of (mapaVehiculosRows || [])) {
    const key = getMapaRowKey(row);
    if (!key) continue;
    const latlon = coords.get(key);
    if (!latlon) continue;
    seen.add(key);
    const icon = buildMapaMarkerIcon(row);
    const popupHtml = buildMapaPopupHtml(row);
    const existing = mapaMarkers.get(key);
    if (existing) {
      existing.setLatLng(latlon);
      if (icon) existing.setIcon(icon);
      existing.getPopup()?.setContent(popupHtml);
      existing._rowData = row;
    } else {
      const marker = L.marker(latlon, icon ? { icon } : {}).addTo(map);
      marker.bindPopup(popupHtml);
      marker._rowData = row;
      mapaMarkers.set(key, marker);
    }
  }
  for (const [key, marker] of mapaMarkers) {
    if (!seen.has(key)) {
      map.removeLayer(marker);
      mapaMarkers.delete(key);
    }
  }
  if (mapaVehiculosCount) mapaVehiculosCount.textContent = String(mapaMarkers.size);
}

function renderLlegadasVehiculosViews(){
  renderMapaMarkers();
  renderTablaLlegadasVehiculos();
  if (typeof renderHistorialInsights === "function") renderHistorialInsights();
}

/* ============ Posiciones reales de la flota (Sonar GET_LastLocation_FleetV2) ============ */
let sonarFleetLocations = [];
let sonarLocationsLayer = null;        // L.layerGroup con los markers de Sonar
let sonarLocationsVisible = true;      // se muestran automaticamente al abrir el mapa
let sonarLocationsLoading = false;
let sonarLocationsLastLoadedAt = null;

// --- Deteccion de GPS sin reportar (desconectado) ---
const SONAR_GPS_STALE_MIN = 20;        // minutos sin reporte para considerarlo "mudo"
let sonarStaleMids = new Set();         // mIds actualmente mudos (para avisar solo los nuevos)

// Minutos desde el ultimo reporte GPS (gps_gmt) de una posicion, o null.
function sonarAgeMin(p){
  const d = parseSonarGmt(p?.datetime);
  if (!d) return null;
  const m = (Date.now() - d.getTime()) / 60000;
  return m >= 0 ? m : null;
}

// Formatea minutos como "Xh Ym" (o "Xm" si <1h, o "Xd Yh" si es muchísimo).
function fmtDuracionMin(mins){
  if (mins == null || !Number.isFinite(mins)) return "-";
  const total = Math.floor(mins);
  const dias = Math.floor(total / 1440);
  const horas = Math.floor((total % 1440) / 60);
  const m = total % 60;
  if (dias > 0) return `${dias}d ${horas}h`;
  if (horas > 0) return `${horas}h ${String(m).padStart(2, "0")}m`;
  return `${m}m`;
}

// Interno asociado a un mId (segun la tabla vehiculossonar cargada).
function getInternoForMid(mid){
  const m = String(mid || "").trim().toUpperCase();
  if (!m) return "";
  for (const v of (vehiculosSonarRows || [])) {
    if (String(v?.mid || "").trim().toUpperCase() === m) return String(v?.interno || "").trim();
  }
  return "";
}

function setSonarLocStatus(txt, isErr){
  if (!sonarLocationsStatus) return;
  sonarLocationsStatus.textContent = txt;
  sonarLocationsStatus.style.color = isErr ? "var(--err)" : "var(--fg-soft)";
}

// Direccion del itinerario respecto al aeropuerto:
//   "baja" = sale del aeropuerto hacia la ciudad (Aeropuerto-...)
//   "sube" = va hacia el aeropuerto (...-aeropuerto)
// Prioriza lo que el usuario configuro en itinerarios_direccion (por id);
// si no hay configuracion, lo deduce por el nombre.
function getItineraryDirection(itinerario, id){
  const sid = String(id || "").trim();
  if (sid && itinerariosDireccionMap.has(sid)) return itinerariosDireccionMap.get(sid) || "";
  const s = String(itinerario || "").trim().toLowerCase();
  if (!s) return "";
  const startsAirport = s.startsWith("aeropuerto");
  const endsAirport = /aeropuerto\s*$/.test(s);
  if (startsAirport && !endsAirport) return "baja";
  if (endsAirport && !startsAirport) return "sube";
  return "";
}

// ===== Despachos ACTIVO para el mapa =====
// Se cargan TODOS los despachos con estado ACTIVO (sin el límite de 500 ni el
// rango de 24h de la pestaña "Despachos Realizados"). Así el mapa nunca deja un
// carro despachado en morado por una caché vieja o por el corte de registros.
let mapaActivosByVid = new Map();
let mapaActivosLoadedAt = 0;
let mapaActivosLoading = false;
const MAPA_ACTIVOS_STALE_MS = 90000; // 1m30s: se refresca solo en el polling del mapa

async function loadMapaDespachosActivos(){
  if (mapaActivosLoading) return;
  if (!currentUserId) return;
  mapaActivosLoading = true;
  try {
    const { data, error } = await planillaSupabaseClient
      .from(HISTORIAL_DESPACHOS_TABLE)
      .select("vehicle_id,interno,placa,itinerario_id,itinerario,estado,created_at")
      .eq("estado", "ACTIVO")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const map = new Map();
    for (const r of (Array.isArray(data) ? data : [])) {
      const vid = String(r?.vehicle_id || "").trim();
      if (vid && !map.has(vid)) map.set(vid, r); // el más reciente por vehículo
    }
    mapaActivosByVid = map;
    mapaActivosLoadedAt = Date.now();
  } catch (err) {
    console.error("[mapa] carga de despachos activos falló:", err);
  } finally {
    mapaActivosLoading = false;
  }
}

// Mapa vehicle_id (ID Sonar) -> fila de despacho ACTIVO, para enriquecer los markers.
// Prefiere la foto fresca y completa de activos; solo mientras esa foto aún no se
// haya cargado ni una vez, cae al historial ya cargado (para no quedar en blanco).
function getActiveDispatchByVehicleId(){
  if (mapaActivosLoadedAt) return mapaActivosByVid;
  const map = new Map();
  for (const r of (historialDespachosRows || [])) {
    if (String(r?.estado || "").toUpperCase() !== "ACTIVO") continue;
    const vid = String(r?.vehicle_id || "").trim();
    if (vid && !map.has(vid)) map.set(vid, r);
  }
  return map;
}

function buildSonarMarkerIcon(p, disp, dir, stale){
  if (typeof L === "undefined") return null;
  // Siempre mostrar el interno: del despacho o resuelto por la flota (mid->interno).
  // Solo si no se puede resolver, cae a placa/ID como último recurso.
  const interno = String((disp ? disp.interno : "") || getInternoForMid(p?.id) || "").trim();
  const label = interno || String(p?.plate || p?.id || "?");
  // Color = sentido del itinerario (naranja=sube, verde=baja, morado=sin despacho, gris=mudo).
  const bg = stale ? "#64748b" : (dir === "sube" ? "#d97706" : dir === "baja" ? "#0d9488" : "#7c3aed");
  const border = stale ? "#dc2626" : "#fff";
  // Flecha = RUMBO REAL del GPS. ▲ apunta al norte (arriba) y se rota por el
  // rumbo (0=N, gira en sentido horario), asi siempre coincide con el mapa.
  const course = Number(p?.course);
  const spd = Number(p?.speed);
  const hasCourse = Number.isFinite(course);
  const detenido = Number.isFinite(spd) && spd < 3; // casi quieto: no hay direccion util
  let pre;
  if (stale) {
    pre = "⚠ ";
  } else if (detenido || !hasCourse) {
    pre = `<span style="margin-right:4px;font-size:9px;line-height:1;opacity:.9">●</span>`; // quieto
  } else {
    pre = `<span style="display:inline-block;transform:rotate(${course}deg);margin-right:4px;font-size:11px;line-height:1">▲</span>`;
  }
  return L.divIcon({
    className: "mapa-sonar-marker",
    html: `<div style="
      background:${bg};color:#fff;padding:3px 8px;border-radius:10px;
      font-weight:800;font-size:11px;border:2px solid ${border};
      box-shadow:0 2px 8px rgba(15,23,42,.35);${stale ? "opacity:.85;" : ""}
      font-family:Inter, system-ui, sans-serif;line-height:1;white-space:nowrap;
      display:inline-flex;align-items:center;
    ">${pre}${escapeHtml(label)}</div>`,
    iconSize: null,
    iconAnchor: [14, 11],
  });
}

// gps_GMT llega como "YYYY-MM-DD HH:mm:ss" en GMT (sin zona). Se interpreta como UTC.
function parseSonarGmt(value){
  const s = String(value || "").trim();
  if (!s) return null;
  const iso = s.includes("T") ? s : s.replace(" ", "T");
  const d = new Date(/[zZ]|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : iso + "Z");
  return Number.isNaN(d.getTime()) ? null : d;
}

function buildSonarPopupHtml(p, disp, dir){
  const fmt = (v) => escapeHtml(String(v ?? "-").trim() || "-");
  const reportDate = parseSonarGmt(p?.datetime);
  const ageMin = reportDate ? (Date.now() - reportDate.getTime()) / 60000 : null;
  const ageTxt = ageMin !== null && ageMin >= 0 ? `hace ${fmtDuracionMin(ageMin)}` : "-";
  const stale = ageMin !== null && ageMin >= SONAR_GPS_STALE_MIN;
  const dirTxt = dir === "sube" ? "SUBE (hacia aeropuerto)"
    : dir === "baja" ? "BAJA (desde aeropuerto)" : "-";
  return `
    <div style="min-width:210px;font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:1.45">
      <div style="font-weight:800;font-size:15px;margin-bottom:4px">
        ${(() => { const it = String((disp ? disp.interno : "") || getInternoForMid(p?.id) || "").trim(); return it ? `Interno ${escapeHtml(it)}` : fmt(p?.plate || p?.id); })()}
      </div>
      ${disp ? `<div><b>Itinerario:</b> ${fmt(disp.itinerario)}</div>
      <div><b>Direccion:</b> ${dirTxt}</div>` : `<div style="color:var(--fg-soft)">Sin despacho activo asociado</div>`}
      <div><b>Placa:</b> ${fmt(p?.plate)} &middot; <b>ID Sonar:</b> ${fmt(p?.id)}</div>
      <div><b>Velocidad:</b> ${fmt(p?.speed)} km/h &middot; <b>Rumbo:</b> ${fmt(p?.course)}&deg;</div>
      ${p?.driverName ? `<div><b>Conductor:</b> ${fmt(p.driverName)}</div>` : ""}
      ${stale ? `<div style="margin-top:5px;padding:4px 7px;border-radius:6px;background:#fee2e2;color:#b91c1c;font-weight:700;font-size:12px">⚠ GPS sin reportar ${escapeHtml(ageTxt)}</div>` : ""}
      <div style="color:var(--fg-soft);font-size:11px;margin-top:4px">Reporte: ${reportDate ? escapeHtml(fechaHoraCO(reportDate)) : fmt(p?.datetime)} (${ageTxt})</div>
    </div>
  `;
}

function renderSonarFleetMarkers(){
  const map = ensureMapaLeaflet();
  if (!map) return;
  if (!sonarLocationsLayer) sonarLocationsLayer = L.layerGroup();
  sonarLocationsLayer.clearLayers();
  if (!sonarLocationsVisible) {
    if (map.hasLayer(sonarLocationsLayer)) map.removeLayer(sonarLocationsLayer);
    if (mapaVehiculosCount) mapaVehiculosCount.textContent = "0";
    return;
  }
  if (!map.hasLayer(sonarLocationsLayer)) sonarLocationsLayer.addTo(map);
  const dispatchByVid = getActiveDispatchByVehicleId();
  sonarMarkerIndex = [];
  sonarAllCars = [];
  const filtroActivo = mapaSeleccion.length > 0; // si hay selección, se muestran SOLO esos
  let plotted = 0;
  for (const p of (sonarFleetLocations || [])) {
    const lat = Number(p?.lat);
    const lon = Number(p?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const vid = String(p?.id || "").trim();
    const disp = vid ? dispatchByVid.get(vid) : null;
    const interno = String((disp ? disp.interno : "") || getInternoForMid(p?.id) || "").trim();
    // Catálogo completo (para el check list y el buscador), aunque el mapa esté filtrado.
    sonarAllCars.push({ interno, plate: String(p?.plate || "").trim(), id: vid, lat, lon });
    if (filtroActivo && !mapaSeleccion.includes(vid)) continue; // filtrado: saltar los no marcados
    const dir = disp ? getItineraryDirection(disp.itinerario, disp.itinerario_id) : "";
    const age = sonarAgeMin(p);
    const stale = age !== null && age >= SONAR_GPS_STALE_MIN;
    const icon = buildSonarMarkerIcon(p, disp, dir, stale);
    const marker = L.marker([lat, lon], icon ? { icon } : {});
    marker.bindPopup(buildSonarPopupHtml(p, disp, dir));
    sonarLocationsLayer.addLayer(marker);
    sonarMarkerIndex.push({ interno, plate: String(p?.plate || "").trim(), id: vid, lat, lon, marker });
    plotted++;
  }
  if (mapaVehiculosCount) mapaVehiculosCount.textContent = filtroActivo ? `${plotted} de ${sonarAllCars.length}` : String(plotted);
  refreshMapaCarrosDatalist();
  if (mapaSeleccion.length) renderMapaSeleccion();
  if (!document.getElementById("mapaFiltroPanel")?.classList.contains("hidden")) renderMapaCheckList();
  renderSonarStaleAlerts();
  return plotted;
}

// Índice de carros plotados (para centrar) y catálogo completo (para checklist/buscador).
let sonarMarkerIndex = [];
let sonarAllCars = [];
function refreshMapaCarrosDatalist(){
  const dl = document.getElementById("mapaCarrosLista");
  if (!dl) return;
  const internos = Array.from(new Set(sonarAllCars.map(x => x.interno).filter(Boolean)))
    .sort((a, b) => String(a).localeCompare(String(b), "es", { numeric: true }));
  dl.innerHTML = internos.map(i => `<option value="${escapeHtml(i)}"></option>`).join("");
}

// ===== Check list para filtrar qué carros se ven en el mapa =====
function toggleMapaFiltro(show){
  const panel = document.getElementById("mapaFiltroPanel");
  if (!panel) return;
  const mostrar = (show === undefined) ? panel.classList.contains("hidden") : show;
  panel.classList.toggle("hidden", !mostrar);
  if (mostrar) {
    if (!sonarAllCars.length && sonarLocationsVisible) renderSonarFleetMarkers();
    renderMapaCheckList();
  }
}

function renderMapaCheckList(){
  const lista = document.getElementById("mapaFiltroLista");
  const cnt = document.getElementById("mapaFiltroCount");
  if (!lista) return;
  const term = String(document.getElementById("mapaFiltroSearch")?.value || "").trim().toLowerCase();
  // Carros únicos por id, ordenados por interno.
  const vistos = new Set();
  const cars = sonarAllCars
    .filter(c => { if (!c.id || vistos.has(c.id)) return false; vistos.add(c.id); return true; })
    .filter(c => !term || String(c.interno).toLowerCase().includes(term) || String(c.plate).toLowerCase().includes(term))
    .sort((a, b) => String(a.interno || a.plate).localeCompare(String(b.interno || b.plate), "es", { numeric: true }));
  if (cnt) cnt.textContent = `${mapaSeleccion.length} seleccionados de ${sonarAllCars.length}`;
  if (!cars.length) { lista.innerHTML = `<div class="muted" style="padding:8px">Sin carros con posición.</div>`; return; }
  lista.innerHTML = cars.map(c => {
    const label = c.interno || c.plate || c.id;
    const checked = mapaSeleccion.includes(c.id) ? "checked" : "";
    return `<label class="mapa-filtro-item"><input type="checkbox" class="mapa-filtro-chk" data-id="${escapeHtml(c.id)}" ${checked}/> <span>${escapeHtml(label)}</span>${c.plate && c.plate !== label ? ` <span class="muted" style="font-size:11px">${escapeHtml(c.plate)}</span>` : ""}</label>`;
  }).join("");
}

function toggleCarroFiltro(id, on){
  const vid = String(id || "").trim(); if (!vid) return;
  if (on) { if (!mapaSeleccion.includes(vid)) mapaSeleccion.push(vid); }
  else { mapaSeleccion = mapaSeleccion.filter(i => i !== vid); }
  renderSonarFleetMarkers();
  renderMapaSeleccion();
  renderMapaCheckList();
}

// Encuentra un carro en el catálogo del mapa por interno (o placa/ID).
function findCarroEnIndice(query){
  const q = String(query || "").trim().toLowerCase();
  if (!q) return null;
  if (!sonarLocationsVisible) { sonarLocationsVisible = true; renderSonarFleetMarkers(); }
  else if (!sonarAllCars.length) { renderSonarFleetMarkers(); }
  const idx = sonarAllCars;
  return idx.find(x => String(x.interno || "").toLowerCase() === q)
    || idx.find(x => String(x.plate || "").toLowerCase() === q)
    || idx.find(x => String(x.interno || "").toLowerCase().includes(q))
    || idx.find(x => String(x.plate || "").toLowerCase().includes(q))
    || idx.find(x => String(x.id || "").toLowerCase() === q) || null;
}

function centrarEnCarro(hit){
  const map = ensureMapaLeaflet();
  if (!map || !hit) return;
  if (Number.isFinite(hit.lat) && Number.isFinite(hit.lon)) map.setView([hit.lat, hit.lon], Math.max(map.getZoom() || 0, 17));
  const m = sonarMarkerIndex.find(x => x.id === hit.id);
  if (m && m.marker) setTimeout(() => { try { m.marker.openPopup(); } catch (_) {} }, 150);
}

// Centra el mapa en un carro (sin agregarlo a la selección). Usado por los chips.
function buscarCarroEnMapa(query){
  const hit = findCarroEnIndice(query);
  if (!hit) { if (typeof showToast === "function") showToast(`No se encontró "${query}" en el mapa.`, "warn"); return; }
  centrarEnCarro(hit);
}

// ===== Selección múltiple de carros en el mapa =====
let mapaSeleccion = []; // ids (mid) seleccionados

// Estado de despacho de un carro por su ID Sonar.
function statusDespachoCarro(id){
  const disp = getActiveDispatchByVehicleId().get(String(id || "").trim());
  if (disp) {
    const dir = getItineraryDirection(disp.itinerario, disp.itinerario_id);
    const flecha = dir === "sube" ? "↑" : dir === "baja" ? "↓" : "";
    const color = dir === "sube" ? "#d97706" : dir === "baja" ? "#0d9488" : "#7c3aed";
    return { despachado: true, color, texto: `Despachado${disp.itinerario ? `: ${disp.itinerario} ${flecha}` : ""}` };
  }
  return { despachado: false, color: "#94a3b8", texto: "Sin despacho activo" };
}

function agregarCarroSeleccion(query){
  const hit = findCarroEnIndice(query);
  if (!hit) { if (typeof showToast === "function") showToast(`No se encontró "${query}" en el mapa.`, "warn"); return; }
  if (hit.id && !mapaSeleccion.includes(hit.id)) mapaSeleccion.push(hit.id);
  renderSonarFleetMarkers(); // aplica el filtro en el mapa
  renderMapaSeleccion();
  centrarEnCarro(hit);
  const el = document.getElementById("mapaBuscarCarro");
  if (el) el.value = "";
}

function renderMapaSeleccion(){
  const cont = document.getElementById("mapaSeleccion");
  const chips = document.getElementById("mapaSeleccionChips");
  const resumen = document.getElementById("mapaSeleccionResumen");
  if (!cont || !chips) return;
  if (!mapaSeleccion.length) {
    cont.classList.add("hidden"); chips.innerHTML = ""; if (resumen) resumen.textContent = "";
    return;
  }
  cont.classList.remove("hidden");
  let desp = 0;
  chips.innerHTML = mapaSeleccion.map(id => {
    const info = sonarMarkerIndex.find(x => x.id === id) || { interno: "", plate: "", id };
    const st = statusDespachoCarro(id);
    if (st.despachado) desp++;
    const label = info.interno || info.plate || id;
    return `<span class="mapa-chip" data-id="${escapeHtml(id)}" title="${escapeHtml(st.texto)}">
      <span class="mapa-chip-dot" style="background:${st.color}"></span>
      <b>${escapeHtml(label)}</b>
      <span class="mapa-chip-est">${st.despachado ? "Despachado" : "Sin despacho"}</span>
      <span class="mapa-chip-x" data-x="${escapeHtml(id)}" title="Quitar">×</span>
    </span>`;
  }).join("");
  if (resumen) resumen.textContent = `${mapaSeleccion.length} seleccionados · ${desp} despachados · ${mapaSeleccion.length - desp} sin despacho`;
}

// Detecta los GPS que dejaron de reportar y avisa al operador (banner + toast).
function renderSonarStaleAlerts(){
  const banner = document.getElementById("sonarGpsAlert");
  const list = (sonarFleetLocations || [])
    .map(p => ({ p, age: sonarAgeMin(p) }))
    .filter(x => x.age !== null && x.age >= SONAR_GPS_STALE_MIN)
    .sort((a, b) => b.age - a.age);

  // Toast solo para los que ACABAN de quedar mudos (no repetir cada 30s).
  const nowStale = new Set(list.map(x => String(x.p?.id || "")));
  const nuevos = list.filter(x => !sonarStaleMids.has(String(x.p?.id || "")));
  if (nuevos.length && sonarLocationsLastLoadedAt) {
    const etiqueta = nuevos.slice(0, 4).map(x => {
      const interno = getInternoForMid(x.p?.id);
      return interno ? `interno ${interno}` : (x.p?.plate || x.p?.id || "?");
    }).join(", ");
    const extra = nuevos.length > 4 ? ` y ${nuevos.length - 4} mas` : "";
    if (typeof showToast === "function") {
      showToast(`⚠️ GPS sin reportar: ${etiqueta}${extra}`, "warn");
    }
  }
  sonarStaleMids = nowStale;

  if (!banner) return;
  if (!list.length) {
    banner.classList.add("hidden");
    banner.innerHTML = "";
    return;
  }
  const chips = list.map(x => {
    const interno = getInternoForMid(x.p?.id);
    const label = interno ? `Int ${escapeHtml(interno)}` : escapeHtml(String(x.p?.plate || x.p?.id || "?"));
    return `<span class="gps-stale-chip" title="Placa ${escapeHtml(String(x.p?.plate || "-"))} · ID ${escapeHtml(String(x.p?.id || "-"))} · inactivo ${escapeHtml(fmtDuracionMin(x.age))}">
      ${label} <b>${escapeHtml(fmtDuracionMin(x.age))}</b></span>`;
  }).join("");
  banner.innerHTML = `<span class="gps-stale-title">⚠️ ${list.length} GPS sin reportar (≥${SONAR_GPS_STALE_MIN} min):</span> ${chips}`;
  banner.classList.remove("hidden");
}

// Mapea una fila de la tabla sonar_posiciones al objeto que usan los markers.
function mapSonarRow(row){
  return {
    id: row?.mid ?? null,
    plate: row?.plate ?? null,
    lat: row?.lat,
    lon: row?.lon,
    speed: row?.speed,
    course: row?.course,
    datetime: row?.gps_gmt ?? null,
    driverName: row?.driver_name ?? null,
    address: row?.address ?? null,
  };
}

// Lee las posiciones desde la tabla sonar_posiciones (la alimenta el cron en
// el servidor cada 30s). Lectura barata: NO llama a Sonar por cliente.
async function loadSonarFleetLocations(){
  if (sonarLocationsLoading) return;
  if (!currentUserId) return;
  sonarLocationsLoading = true;
  try {
    // Solo las columnas que usan los markers/popup (se omiten address y updated_at
    // para reducir el egress: se descargaban y no se mostraban).
    const { data, error } = await planillaSupabaseClient
      .from(SONAR_POSICIONES_TABLE)
      .select("mid,plate,lat,lon,speed,course,gps_gmt,driver_name");
    if (error) throw error;
    sonarFleetLocations = (Array.isArray(data) ? data : []).map(mapSonarRow);
    sonarLocationsLastLoadedAt = Date.now();
    renderSonarFleetMarkers();
    renderGeocercas(); // actualizar conteo "dentro" de cada geocerca
    if (typeof renderHistorialInsights === "function") renderHistorialInsights();
    const stamp = horaCO(new Date());
    setSonarLocStatus(`Sonar: ${sonarFleetLocations.length} posiciones · ${stamp}`);
    if (mapaVehiculosStatus) mapaVehiculosStatus.textContent = `Actualizado ${stamp}`;
  } catch (err) {
    console.error("[sonar_posiciones] lectura fallo:", err);
    setSonarLocStatus(`Sonar error: ${err?.message || "fallo"}`, true);
    showToast(`No se pudo cargar posiciones Sonar: ${err?.message || "fallo"}`, "err");
  } finally {
    sonarLocationsLoading = false;
  }
}


async function toggleSonarPositions(){
  sonarLocationsVisible = !sonarLocationsVisible;
  if (btnToggleSonarPositions) {
    btnToggleSonarPositions.textContent = `Posiciones Sonar: ${sonarLocationsVisible ? "ON" : "OFF"}`;
    btnToggleSonarPositions.classList.toggle("btn-primary", sonarLocationsVisible);
    btnToggleSonarPositions.classList.toggle("btn-ghost", !sonarLocationsVisible);
  }
  if (sonarLocationsVisible) {
    // Cruce de despachos activos (sube/baja) para el mapa: foto fresca y completa.
    loadMapaDespachosActivos().then(() => renderSonarFleetMarkers());
    // El historial completo se carga aparte para la pestaña "Despachos Realizados".
    if (!historialDespachosLastLoadedAt) {
      loadDespachosRealizadosFromSupabase();
    }
    await loadSonarFleetLocations();
    // Se refresca cada 30s desde la tabla via el polling del mapa (barato y
    // con la misma frescura que la fuente). No usamos Realtime aqui a proposito
    // para no generar ~51 mensajes/30s por cliente.
  } else {
    renderSonarFleetMarkers();
    setSonarLocStatus("Sonar: -");
  }
}

/* ============ Geocercas (enturnamiento por GPS) ============ */
const GEOCERCAS_TABLE = "geocercas";
let geocercasRows = [];
let geocercasLayer = null;          // L.layerGroup con los circulos
let geocercaPlacementMode = false;

// Distancia en metros entre dos coordenadas (Haversine).
function haversineMeters(lat1, lon1, lat2, lon2){
  const R = 6371000;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Devuelve los puntos [[lat,lon],...] de una geocerca poligonal, o null si es circular.
function geocercaPoligono(g){
  const pol = g?.poligono;
  if (Array.isArray(pol) && pol.length >= 3) {
    const pts = pol
      .map(p => Array.isArray(p) ? [Number(p[0]), Number(p[1])] : [Number(p?.lat), Number(p?.lon)])
      .filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1]));
    return pts.length >= 3 ? pts : null;
  }
  return null;
}

// Linea de cruce: geocerca con EXACTAMENTE 2 puntos.
function geocercaLinea(g){
  const pol = g?.poligono;
  if (Array.isArray(pol) && pol.length === 2) {
    const pts = pol
      .map(p => Array.isArray(p) ? [Number(p[0]), Number(p[1])] : [NaN, NaN])
      .filter(p => Number.isFinite(p[0]) && Number.isFinite(p[1]));
    return pts.length === 2 ? pts : null;
  }
  return null;
}

// Punto dentro de poligono (ray casting). poly = [[lat,lon],...].
function puntoEnPoligono(lat, lon, poly){
  let dentro = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const yi = poly[i][0], xi = poly[i][1];
    const yj = poly[j][0], xj = poly[j][1];
    const cruza = ((yi > lat) !== (yj > lat)) &&
      (lon < (xj - xi) * (lat - yi) / ((yj - yi) || 1e-12) + xi);
    if (cruza) dentro = !dentro;
  }
  return dentro;
}

// True si (lat,lon) esta dentro de la geocerca (poligono o circulo).
function dentroDeGeocerca(g, lat, lon){
  const poly = geocercaPoligono(g);
  if (poly) return puntoEnPoligono(lat, lon, poly);
  if (Number.isFinite(Number(g?.lat)) && Number.isFinite(Number(g?.lon))) {
    return haversineMeters(Number(g.lat), Number(g.lon), lat, lon) <= Number(g.radio_m || 150);
  }
  return false;
}

function countVehiclesInsideGeocerca(g){
  let n = 0;
  for (const p of (sonarFleetLocations || [])) {
    const lat = Number(p?.lat), lon = Number(p?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (dentroDeGeocerca(g, lat, lon)) n++;
  }
  return n;
}

function fillGeocercaItinOptions(){
  const box = document.getElementById("geocercaItinBox");
  if (!box) return;
  box.innerHTML = SONAR_ITINERARIES.map(it => `
    <label class="geocerca-itin-item">
      <input type="checkbox" value="${escapeHtml(it.id)}" />
      <span>${escapeHtml(it.nombre)} <span class="muted">(${escapeHtml(it.id)})</span></span>
    </label>`).join("");
}

// IDs de itinerarios marcados en el formulario de geocerca.
function getSelectedGeocercaItins(){
  const box = document.getElementById("geocercaItinBox");
  if (!box) return [];
  return Array.from(box.querySelectorAll('input[type="checkbox"]:checked')).map(c => String(c.value));
}

function setAllGeocercaItins(checked){
  const box = document.getElementById("geocercaItinBox");
  if (!box) return;
  box.querySelectorAll('input[type="checkbox"]').forEach(c => { c.checked = checked; });
}

// ===== Configuracion de direccion de itinerarios (sube/baja) =====
// Tabla editable por el usuario; el cron 24/7 la lee para filtrar.
const ITINERARIOS_DIRECCION_TABLE = "itinerarios_direccion";
let itinerariosDireccionRows = [];
// Mapa id -> "baja" | "sube" (lo que el usuario configuro).
let itinerariosDireccionMap = new Map();

function rebuildItinerariosDireccionMap(){
  itinerariosDireccionMap = new Map();
  for (const r of (itinerariosDireccionRows || [])) {
    const id = String(r?.id || "").trim();
    const dir = String(r?.direccion || "").trim().toLowerCase();
    if (id && (dir === "baja" || dir === "sube")) itinerariosDireccionMap.set(id, dir);
  }
}

async function loadItinerariosDireccion(){
  if (!currentUserId) return;
  try {
    const { data, error } = await planillaSupabaseClient
      .from(ITINERARIOS_DIRECCION_TABLE)
      .select("id,nombre,grupo,direccion")
      .order("id");
    if (error) throw error;
    itinerariosDireccionRows = Array.isArray(data) ? data : [];
    rebuildItinerariosDireccionMap();
    renderItinerariosConfig();
  } catch (err) {
    console.error("[itinerarios_direccion] carga fallo:", err);
  }
}

function renderItinerariosConfig(){
  const grid = document.getElementById("itinerariosConfigGrid");
  if (!grid) return;
  // Une la lista base (SONAR_ITINERARIES) con lo guardado en la tabla.
  const byId = new Map(itinerariosDireccionRows.map(r => [String(r.id), r]));
  const base = SONAR_ITINERARIES.map(it => ({
    id: it.id, nombre: it.nombre, grupo: it.grupo,
    direccion: byId.get(it.id)?.direccion || null,
  }));
  // Incluye itinerarios que esten en la tabla pero no en la lista base.
  for (const r of itinerariosDireccionRows) {
    if (!base.some(b => b.id === String(r.id))) {
      base.push({ id: String(r.id), nombre: r.nombre || r.id, grupo: r.grupo || "", direccion: r.direccion || null });
    }
  }
  grid.innerHTML = base.map(it => {
    const d = it.direccion || "";
    const badge = d === "baja" ? '<span style="color:#0d9488;font-weight:700">↓ baja</span>'
      : d === "sube" ? '<span style="color:#d97706;font-weight:700">↑ sube</span>'
      : '<span class="muted">sin definir</span>';
    return `<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;background:#fff;border:1px solid var(--line);border-radius:var(--r-sm)">
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(it.nombre)}</div>
        <div class="muted" style="font-size:11px">${escapeHtml(it.id)} · ${badge}</div>
      </div>
      <select data-itin-dir="${escapeHtml(it.id)}" data-itin-nombre="${escapeHtml(it.nombre)}" data-itin-grupo="${escapeHtml(it.grupo || "")}" style="font-size:12px">
        <option value=""${d === "" ? " selected" : ""}>—</option>
        <option value="baja"${d === "baja" ? " selected" : ""}>↓ Baja (desde aeropuerto)</option>
        <option value="sube"${d === "sube" ? " selected" : ""}>↑ Sube (hacia aeropuerto)</option>
      </select>
    </div>`;
  }).join("");
}

async function setItinerarioDireccion(id, nombre, grupo, direccion){
  const statusEl = document.getElementById("itinerariosConfigStatus");
  const dir = (direccion === "baja" || direccion === "sube") ? direccion : null;
  try {
    if (statusEl) statusEl.textContent = "Guardando...";
    const { error } = await planillaSupabaseClient
      .from(ITINERARIOS_DIRECCION_TABLE)
      .upsert({ id: String(id), nombre: nombre || null, grupo: grupo || null, direccion: dir, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (error) throw error;
    // Refleja en memoria sin recargar todo.
    const idx = itinerariosDireccionRows.findIndex(r => String(r.id) === String(id));
    if (idx >= 0) itinerariosDireccionRows[idx].direccion = dir;
    else itinerariosDireccionRows.push({ id: String(id), nombre, grupo, direccion: dir });
    rebuildItinerariosDireccionMap();
    renderItinerariosConfig();
    if (typeof renderSonarFleetMarkers === "function") renderSonarFleetMarkers();
    if (statusEl) statusEl.textContent = "Guardado " + horaCO(new Date());
  } catch (err) {
    console.error("[itinerarios_direccion] guardar fallo:", err);
    if (statusEl) statusEl.textContent = "Error al guardar";
  }
}

function toggleItinerariosConfig(show){
  const panel = document.getElementById("itinerariosConfig");
  if (!panel) return;
  const willShow = (show === undefined) ? panel.classList.contains("hidden") : show;
  panel.classList.toggle("hidden", !willShow);
  if (willShow) loadItinerariosDireccion();
}

async function loadGeocercas(){
  if (!currentUserId) return;
  try {
    const { data, error } = await planillaSupabaseClient
      .from(GEOCERCAS_TABLE)
      .select("id,nombre,lat,lon,radio_m,poligono,itinerarios,itinerario_id,itinerario,direccion,activa")
      .eq("activa", true);
    if (error) throw error;
    geocercasRows = Array.isArray(data) ? data : [];
    renderGeocercas();
  } catch (err) {
    console.error("[geocercas] carga fallo:", err);
  }
}

function renderGeocercas(){
  const map = ensureMapaLeaflet();
  if (!map) return;
  if (!geocercasLayer) geocercasLayer = L.layerGroup().addTo(map);
  geocercasLayer.clearLayers();
  for (const g of (geocercasRows || [])) {
    const dentro = countVehiclesInsideGeocerca(g);
    const sentido = String(g.direccion || "").toLowerCase().startsWith("sub") ? "↑ Subiendo" : "↓ Bajando";
    const popup = `
      <div style="font-family:Inter,system-ui,sans-serif;font-size:13px;min-width:210px">
        <div style="font-weight:800;font-size:14px">${escapeHtml(g.nombre || "Geocerca")}</div>
        <div><b>Itinerario:</b> ${escapeHtml(g.itinerario || g.itinerario_id || "-")}</div>
        <div><b>Sentido:</b> ${sentido} · <b>Dentro ahora:</b> ${dentro}</div>
        ${geocercaAdminUnlocked ? `<button type="button" class="btn btn-danger btn-del-geocerca" data-geocerca-id="${escapeHtml(String(g.id))}"
          style="margin-top:8px;padding:5px 10px">Eliminar geocerca</button>` : ""}
      </div>`;
    const poly = geocercaPoligono(g);
    const linea = geocercaLinea(g);
    let shape = null;
    if (linea) {
      shape = L.polyline(linea, { color: "#7c3aed", weight: 5, opacity: 0.9 });
    } else if (poly) {
      shape = L.polygon(poly, { color: "#7c3aed", weight: 2, fillColor: "#7c3aed", fillOpacity: 0.14 });
    } else {
      const lat = Number(g.lat), lon = Number(g.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      shape = L.circle([lat, lon], { radius: Number(g.radio_m || 150), color: "#7c3aed", weight: 2, fillColor: "#7c3aed", fillOpacity: 0.12 });
    }
    shape.bindPopup(popup);
    geocercasLayer.addLayer(shape);
  }
  renderGeocercasList();
}

// Modo edición: solo cuando está activo aparecen las X para eliminar.
// Así un clic normal en el mapa NUNCA borra una geocerca por accidente.
let geocercasEditMode = false;
// Modo administrador: crear/editar/borrar geocercas. Requiere contraseña (validada en el servidor).
let geocercaAdminUnlocked = false;
try { geocercaAdminUnlocked = sessionStorage.getItem("geocercaAdmin") === "1"; } catch (_) {}

// Lista visible de geocercas activas (informativa). Eliminar requiere modo edición.
function renderGeocercasList(){
  const cont = document.getElementById("geocercasList");
  if (!cont) return;
  const rows = geocercasRows || [];
  if (!rows.length) {
    cont.classList.add("hidden");
    cont.innerHTML = "";
    geocercasEditMode = false;
    return;
  }
  const items = rows.map(g => {
    const sentido = String(g.direccion || "").toLowerCase().startsWith("sub") ? "↑ sube" : "↓ baja";
    const tipo = geocercaLinea(g) ? "línea" : geocercaPoligono(g) ? `zona ${geocercaPoligono(g).length} pts` : "círculo";
    const itin = String(g.itinerario || g.itinerario_id || "-");
    const delBtn = geocercasEditMode
      ? `<button type="button" class="geocerca-chip-del btn-del-geocerca-list" data-geocerca-id="${escapeHtml(String(g.id))}" title="Eliminar esta geocerca">✕</button>`
      : "";
    return `<span class="geocerca-chip${geocercasEditMode ? " is-edit" : ""}">
      <b>${escapeHtml(String(g.nombre || "Geocerca"))}</b>
      <span class="geocerca-chip-meta">${sentido} · ${escapeHtml(tipo)} · ${escapeHtml(itin)}</span>
      ${delBtn}
    </span>`;
  }).join("");
  const editBtn = geocercaAdminUnlocked
    ? `<button type="button" class="btn-geocercas-edit${geocercasEditMode ? " is-on" : ""}" title="${geocercasEditMode ? "Terminar edición (ocultar eliminar)" : "Habilitar eliminación de geocercas"}">${geocercasEditMode ? "🔓 Listo" : "🔒 Editar"}</button>`
    : "";
  cont.innerHTML = `<span class="geocerca-list-title">Geocercas activas (${rows.length}):</span> ${items} ${editBtn}`;
  cont.classList.remove("hidden");
}

// Puntos del polígono que se está dibujando + su capa de previsualización.
let geocercaDraftPoints = [];
let geocercaDraftLayer = null;

function updateGeocercaPuntosLabel(){
  const el = document.getElementById("geocercaPuntos");
  if (el) el.textContent = String(geocercaDraftPoints.length);
}

// Redibuja la previsualización del polígono en construcción.
function redrawGeocercaDraft(){
  const map = ensureMapaLeaflet();
  if (!map) return;
  if (!geocercaDraftLayer) geocercaDraftLayer = L.layerGroup().addTo(map);
  geocercaDraftLayer.clearLayers();
  // Vértices.
  geocercaDraftPoints.forEach((pt, i) => {
    L.circleMarker(pt, {
      radius: 5, color: "#7c3aed", weight: 2, fillColor: "#fff", fillOpacity: 1,
    }).bindTooltip(String(i + 1), { permanent: true, direction: "top", className: "geocerca-pt-tip" })
      .addTo(geocercaDraftLayer);
  });
  // Línea o polígono según cantidad.
  if (geocercaDraftPoints.length === 2) {
    L.polyline(geocercaDraftPoints, { color: "#7c3aed", weight: 2, dashArray: "5,5" }).addTo(geocercaDraftLayer);
  } else if (geocercaDraftPoints.length >= 3) {
    L.polygon(geocercaDraftPoints, { color: "#7c3aed", weight: 2, dashArray: "5,5", fillColor: "#7c3aed", fillOpacity: 0.12 }).addTo(geocercaDraftLayer);
  }
  updateGeocercaPuntosLabel();
}

function clearGeocercaDraft(){
  geocercaDraftPoints = [];
  if (geocercaDraftLayer) geocercaDraftLayer.clearLayers();
  updateGeocercaPuntosLabel();
}

function startGeocercaPlacement(){
  if (!geocercaForm) return;
  fillGeocercaItinOptions();
  geocercaForm.classList.remove("hidden");
  geocercaPlacementMode = true;
  clearGeocercaDraft();
  if (mapaVehiculosContainer) mapaVehiculosContainer.style.cursor = "crosshair";
  if (geocercaHint) geocercaHint.innerHTML =
    '<b>2 puntos = línea de cruce</b> (recomendada, atraviesa la vía de lado a lado · más robusta ante huecos de señal). ' +
    '<b>3+ puntos = zona</b>. Luego pulsa "Terminar y guardar".';
}

function cancelGeocercaPlacement(){
  geocercaPlacementMode = false;
  if (geocercaForm) geocercaForm.classList.add("hidden");
  if (mapaVehiculosContainer) mapaVehiculosContainer.style.cursor = "";
  clearGeocercaDraft();
}

function undoGeocercaPoint(){
  if (!geocercaDraftPoints.length) return;
  geocercaDraftPoints.pop();
  redrawGeocercaDraft();
}

function handleGeocercaMapClick(e){
  if (!geocercaPlacementMode) return;
  const { lat, lng } = e.latlng || {};
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  geocercaDraftPoints.push([lat, lng]);
  redrawGeocercaDraft();
}

// Centroide simple del polígono (para guardar lat/lon de referencia).
function centroidePoligono(pts){
  let sLat = 0, sLon = 0;
  for (const p of pts) { sLat += p[0]; sLon += p[1]; }
  return [sLat / pts.length, sLon / pts.length];
}

async function finishGeocerca(){
  if (geocercaDraftPoints.length < 2) {
    showToast("Marca 2 puntos (línea de cruce) o 3+ (zona) en el mapa.", "warn");
    return;
  }
  const nombre = String(geocercaNombre?.value || "").trim() || "Geocerca";
  const itinIds = getSelectedGeocercaItins();
  const itinsSel = SONAR_ITINERARIES.filter(it => itinIds.includes(String(it.id)));
  const direccion = String(document.getElementById("geocercaDireccion")?.value || "bajando").trim() || "bajando";
  const pts = geocercaDraftPoints.map(p => [Number(p[0]), Number(p[1])]);
  const [clat, clon] = centroidePoligono(pts);
  try {
    const { error } = await planillaSupabaseClient.from(GEOCERCAS_TABLE).insert({
      nombre,
      poligono: pts,
      lat: clat,
      lon: clon,
      radio_m: 0,
      itinerarios: itinIds.length ? itinIds : null,
      itinerario_id: itinIds[0] || null,
      itinerario: itinsSel.length ? itinsSel.map(it => it.nombre).join(", ") : null,
      direccion,
      activa: true,
    });
    if (error) throw error;
    showToast(`Geocerca "${nombre}" creada (${pts.length} puntos).`, "ok");
    cancelGeocercaPlacement();
    await loadGeocercas();
  } catch (err) {
    console.error("[geocercas] crear fallo:", err);
    showToast(`No se pudo crear la geocerca: ${err?.message || "fallo"}`, "err");
  }
}

// Muestra/oculta los controles de administrador segun el estado de desbloqueo.
function applyGeocercaAdminUI(){
  const b1 = document.getElementById("btnDefinirGeocerca");
  const b2 = document.getElementById("btnConfigItinerarios");
  const adminBtn = document.getElementById("btnAdminGeocercas");
  if (b1) b1.classList.toggle("hidden", !geocercaAdminUnlocked);
  if (b2) b2.classList.toggle("hidden", !geocercaAdminUnlocked);
  if (adminBtn) {
    adminBtn.textContent = geocercaAdminUnlocked ? "🔓 Admin geocercas" : "🔒 Admin geocercas";
    adminBtn.title = geocercaAdminUnlocked
      ? "Administrador activo. Clic para bloquear de nuevo."
      : "Zona de administrador: crear/editar geocercas (requiere contraseña)";
    adminBtn.classList.toggle("is-on", geocercaAdminUnlocked);
  }
  if (!geocercaAdminUnlocked) geocercasEditMode = false;
  if (typeof renderGeocercasList === "function") renderGeocercasList();
  if (typeof renderGeocercas === "function") renderGeocercas();
}

// Pide y valida la contraseña de administrador (en el servidor). Alterna bloqueo/desbloqueo.
async function promptGeocercaAdmin(){
  if (geocercaAdminUnlocked) {
    geocercaAdminUnlocked = false;
    try { sessionStorage.removeItem("geocercaAdmin"); } catch (_) {}
    // Por seguridad, si había un formulario abierto, ciérralo.
    if (typeof cancelGeocercaPlacement === "function") { try { cancelGeocercaPlacement(); } catch (_) {} }
    if (typeof toggleItinerariosConfig === "function") { try { toggleItinerariosConfig(false); } catch (_) {} }
    applyGeocercaAdminUI();
    showToast("Modo administrador de geocercas bloqueado.", "ok");
    return;
  }
  const pass = window.prompt("Contraseña de administrador para gestionar geocercas:");
  if (pass === null) return; // canceló
  try {
    const resp = await fetch(GEOCERCA_ADMIN_CHECK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: PLANILLA_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${PLANILLA_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ password: String(pass) }),
    });
    const data = await resp.json().catch(() => ({}));
    if (data?.ok) {
      geocercaAdminUnlocked = true;
      try { sessionStorage.setItem("geocercaAdmin", "1"); } catch (_) {}
      applyGeocercaAdminUI();
      showToast("Modo administrador activado. Ya puedes crear/editar geocercas.", "ok");
    } else {
      showToast("Contraseña incorrecta.", "err");
    }
  } catch (err) {
    console.error("[geocerca-admin] validación falló:", err);
    showToast("No se pudo validar la contraseña. Revisa la conexión.", "err");
  }
}

async function deleteGeocerca(id){
  const gid = String(id || "").trim();
  if (!gid) return;
  try {
    const { error } = await planillaSupabaseClient.from(GEOCERCAS_TABLE).update({ activa: false }).eq("id", gid);
    if (error) throw error;
    showToast("Geocerca eliminada.", "ok");
    await loadGeocercas();
  } catch (err) {
    console.error("[geocercas] eliminar fallo:", err);
    showToast(`No se pudo eliminar: ${err?.message || "fallo"}`, "err");
  }
}

/* ============ Enturnamiento (lista de llegadas por geocerca) ============ */
const ENTURNAMIENTOS_TABLE = "enturnamientos";
let enturnamientosRows = [];
let enturnamientoRealtimeChannel = null;
let enturnamientoRealtimeRetryTimer = null;
let enturnamientoRealtimeRetryDelay = 1000;
let enturnamientoPollTimer = null;

function minutosDesde(iso){
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.max(0, (Date.now() - d.getTime()) / 60000);
}

async function loadEnturnamientos(){
  if (!currentUserId) return;
  if (enturnamientoStatus) enturnamientoStatus.textContent = "Consultando...";
  try {
    const { data, error } = await planillaSupabaseClient
      .from(ENTURNAMIENTOS_TABLE)
      .select("id,interno,placa,mid,reg_id,itinerario,itinerario_id,entro_en,estado,sin_despacho,manual,sentido,driver_id,driver_name,prioridad")
      .eq("estado", "EN_ESPERA")
      .order("entro_en", { ascending: true });
    if (error) throw error;
    enturnamientosRows = Array.isArray(data) ? data : [];
    await cruzarDespachosAutomaticos(); // saca los que ya salieron por despacho automático (Sonar)
    renderEnturnamientoTab();
    const stamp = horaCO(new Date());
    if (enturnamientoStatus) enturnamientoStatus.textContent = `Actualizado ${stamp}`;
    ["salidasStatus", "almacentroGeoStatus", "exposicionesGeoStatus"].forEach(sid => {
      const el = document.getElementById(sid);
      if (el) el.textContent = `Actualizado ${stamp}`;
    });
  } catch (err) {
    console.error("[enturnamientos] carga fallo:", err);
    if (enturnamientoStatus) enturnamientoStatus.textContent = `Error: ${err?.message || "fallo"}`;
  }
}

// Cruce con Sonar: si un carro en espera YA tiene un despacho ACTIVO posterior a su
// llegada y en sentido CONTRARIO (el retorno), es que ya salió (p.ej. la subida
// Nutibara-exposiciones-tunel-aeropuerto se despacha automática). Se saca de la lista
// y se marca DESPACHADO para que no reaparezca.
async function cruzarDespachosAutomaticos(){
  try {
    if (!Array.isArray(enturnamientosRows) || !enturnamientosRows.length) return;
    // Foto fresca de despachos ACTIVOS (más ágil que el refresco del mapa para este cruce).
    if (!mapaActivosLoadedAt || (Date.now() - mapaActivosLoadedAt) > 10000) {
      await loadMapaDespachosActivos();
    }
    const activos = getActiveDispatchByVehicleId();
    if (!activos || !activos.size) return;
    const yaSalieron = [];
    for (const r of enturnamientosRows) {
      const vid = String(r?.mid || "").trim();
      if (!vid) continue; // sin MID no se puede cruzar (ej. manual sin Sonar)
      const disp = activos.get(vid);
      if (!disp) continue;
      const tDisp = new Date(disp.created_at || 0).getTime();
      const tLleg = new Date(r?.entro_en || 0).getTime();
      if (!(Number.isFinite(tDisp) && Number.isFinite(tLleg) && tDisp > tLleg)) continue; // el despacho debe ser POSTERIOR a esta llegada
      // El retorno va en sentido contrario a la llegada; mismo sentido no es retorno.
      if (sentidoDeItinerario(disp.itinerario_id) === sentidoDeFila(r)) continue;
      yaSalieron.push(r.id);
    }
    if (!yaSalieron.length) return;
    const quitar = new Set(yaSalieron.map(String));
    // Saca de memoria ya (para que desaparezcan de la lista al instante)...
    enturnamientosRows = enturnamientosRows.filter(r => !quitar.has(String(r?.id)));
    // ...y marca en BD en segundo plano para que no reaparezcan en la próxima carga.
    planillaSupabaseClient.from(ENTURNAMIENTOS_TABLE)
      .update({ estado: "DESPACHADO", motivo: "Despacho automático detectado (cruce Sonar)" })
      .in("id", yaSalieron)
      .then(({ error }) => { if (error) console.warn("[enturnamientos] marca auto-despacho falló:", error); });
  } catch (err) {
    console.warn("[enturnamientos] cruce de despachos automáticos falló:", err);
  }
}

// Pestañas de salida (bajada) por destino, filtradas por itinerario.
// Puntos de despacho por corredor: cada lista muestra los itinerarios que se
// despachan DESDE ese punto (los de SUBIDA, hacia el aeropuerto).
//   Almacentro (corredor San Diego): 4505, 4504, 3395
//   Exposiciones (corredor Nutibara): 4502, 3387, 3394
// La bajada (salen del aeropuerto) se despacha toda desde el punto Aeropuerto.
const SALIDAS_DESTINO_TABS = [
  { tab: "llegadas-almacentro-geo", gridId: "almacentroGeoGrid", countId: "almacentroGeoCount", statusId: "almacentroGeoStatus", itin: ["4505", "4504", "3395"] },
  { tab: "llegadas-exposiciones-geo", gridId: "exposicionesGeoGrid", countId: "exposicionesGeoCount", statusId: "exposicionesGeoStatus", itin: ["4502", "3387", "3394"] },
];

// ===== Programación de filas (plan diario por vehículo) =====
const PROGRAMACION_TABLE = "programacion_filas";
let programacionByInterno = new Map();

function fechaBogotaISO(){
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const g = t => p.find(x => x.type === t)?.value || "";
  return `${g("year")}-${g("month")}-${g("day")}`;
}
function ahoraMinBogota(){
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const g = t => p.find(x => x.type === t)?.value || "0";
  return (parseInt(g("hour"), 10) || 0) * 60 + (parseInt(g("minute"), 10) || 0);
}
function hhmmToMin(s){
  const m = String(s || "").match(/(\d{1,2}):(\d{2})/);
  return m ? (parseInt(m[1], 10) * 60 + parseInt(m[2], 10)) : null;
}
// ¿now está en [a,b)? Maneja cruce de medianoche (b < a).
function enRangoMin(now, a, b){
  if (a == null || b == null) return false;
  return b >= a ? (now >= a && now < b) : (now >= a || now < b);
}

async function loadProgramacionHoy(){
  if (!currentUserId) return;
  try {
    const { data, error } = await planillaSupabaseClient
      .from(PROGRAMACION_TABLE)
      .select("vehiculo,base,row_data")
      .eq("fecha", fechaBogotaISO());
    if (error) throw error;
    const map = new Map();
    for (const r of (data || [])) {
      const interno = String(r?.vehiculo || "").trim();
      if (!interno) continue;
      const d = r.row_data || {};
      const c1 = String(d["CONDUCTOR 1"] || "").trim();
      const prog = {
        puesto: String(d["PUESTO"] || "").trim(),
        inicia: String(d["INICIA"] || "").trim(),
        inicia2: String(d["INICIA 2"] || "").trim(),
        horafin: String(d["HORA FIN"] || "").trim(),
        conductor1: c1,
        conductor2: String(d["CONDUCTOR 2"] || "").trim(),
        base: String(r?.base || d["BASE"] || "").trim(),
        _real: !!(prog_inicia(d) && c1 && !/SIN CONDUCTOR/i.test(c1)),
      };
      const ex = map.get(interno);
      if (!ex || (prog._real && !ex._real)) map.set(interno, prog);
    }
    programacionByInterno = map;
    renderEnturnamientoTab();
  } catch (err) {
    console.error("[programacion] carga fallo:", err);
  }
}
function prog_inicia(d){ return String(d["INICIA"] || "").trim(); }

// Traduce el nombre del PUESTO de la programación al usado en la operación.
function nombrePuesto(puesto){
  const s = String(puesto || "").trim();
  if (!s) return "-";
  const u = s.toUpperCase();
  if (u.includes("SAN DIEGO")) return "Almacentro";
  if (u.includes("EXPOSICIONES") || u.includes("NUTIBARA")) return "Exposiciones";
  if (u.includes("TERMINAL")) return "Terminal Norte";
  return s;
}

// Turno y conductor programado para la hora actual (Colombia).
function turnoYConductor(prog){
  if (!prog) return { turno: null, conductor: "" };
  const now = ahoraMinBogota();
  const ini = hhmmToMin(prog.inicia), i2 = hhmmToMin(prog.inicia2), fin = hhmmToMin(prog.horafin);
  if (i2 != null && fin != null && enRangoMin(now, i2, fin)) return { turno: 2, conductor: prog.conductor2 || prog.conductor1 };
  const finT1 = i2 != null ? i2 : fin;
  if (ini != null && finT1 != null && enRangoMin(now, ini, finT1)) return { turno: 1, conductor: prog.conductor1 };
  return { turno: null, conductor: prog.conductor1 || prog.conductor2 };
}
// ¿El bus está operando fuera de su horario programado? (o no programado hoy)
function fueraDeHorario(prog){
  if (!prog) return "noprog";
  const now = ahoraMinBogota();
  const ini = hhmmToMin(prog.inicia), fin = hhmmToMin(prog.horafin);
  if (ini == null || fin == null) return false; // sin horas válidas: no se valida
  return enRangoMin(now, ini, fin) ? false : "fuera";
}

function renderEnturnamientoTab(){
  const rows = enturnamientosRows || [];
  const aeropuerto = rows.filter(r => listaDeFila(r) === "aeropuerto");
  const almacentro = rows.filter(r => listaDeFila(r) === "almacentro");
  const exposiciones = rows.filter(r => listaDeFila(r) === "exposiciones");
  // Llegadas AEROPUERTO = TODO lo que SUBE (va hacia el aeropuerto = llega al aeropuerto).
  renderListaLlegadas(enturnamientoGrid, enturnamientoCount, aeropuerto, "Sin llegadas por ahora.");
  // Llegadas ALMACENTRO = lo que BAJA hacia Almacentro/San Diego (sin Exposiciones).
  renderListaLlegadas(document.getElementById("almacentroGeoGrid"), document.getElementById("almacentroGeoCount"), almacentro, "Sin llegadas por ahora.");
  // Llegadas EXPOSICIONES = lo que BAJA hacia Exposiciones/Nutibara (pestaña aparte).
  renderListaLlegadas(document.getElementById("exposicionesGeoGrid"), document.getElementById("exposicionesGeoCount"), exposiciones, "Sin llegadas por ahora.");
  // "Salidas Aeropuerto" (oculta) sigue de respaldo: todas las bajadas (Almacentro + Exposiciones).
  renderListaLlegadas(document.getElementById("salidasGrid"), document.getElementById("salidasCount"), almacentro.concat(exposiciones), "Sin salidas por ahora.");
}

// Render de una lista (tabla) de enturnamientos en orden de llegada.
function renderListaLlegadas(grid, countEl, rows, vacioMsg){
  if (!grid) return;
  if (countEl) countEl.textContent = String(rows.length);
  grid.classList.remove("itinerario-grid");
  if (!rows.length) {
    grid.innerHTML = `
      <div class="lista-vacia">
        <div class="lista-vacia-icon">🕓</div>
        <div class="lista-vacia-title">${escapeHtml(vacioMsg || "Sin datos.")}</div>
        <div class="lista-vacia-sub">Esta lista se llena <b>sola</b> cuando un carro cruza la geocerca (24/7). Si un carro pasó y no aparece (ej. GPS mudo), agrégalo con <b>“+ Agregar manual”</b>.</div>
      </div>`;
    return;
  }
  const ordenados = [...rows].sort((a, b) => {
    const ta = new Date(a?.entro_en || 0).getTime();
    const tb = new Date(b?.entro_en || 0).getTime();
    return ta - tb;
  });
  const filaHtml = (r, i) => {
    const min = minutosDesde(r?.entro_en);
    const hace = min !== null ? `hace ${Math.floor(min)} min` : "-";
    const horaTxt = r?.entro_en ? horaCO(r.entro_en) : "-";
    const interno = String(r?.interno || "-");
    const baseNum = getBaseNumForInterno(interno);
    const baseTxt = baseNum ? `B${escapeHtml(baseNum)}` : "-";
    const itin = String(r?.itinerario || "Sin itinerario").trim() || "Sin itinerario";
    const sinDesp = r?.sin_despacho === true;
    const esManual = r?.manual === true;
    // Programación del bus para hoy (puesto, turno, conductor).
    const prog = programacionByInterno.get(interno);
    const tc = turnoYConductor(prog);
    const puestoTxt = nombrePuesto(prog?.puesto);
    const condProg = tc.conductor || "";
    const turnoTag = tc.turno ? `<span class="turno-tag">T${tc.turno}</span> ` : "";
    // En carros MANUALES se respeta el conductor elegido al ingresarlo; si no, la programación.
    const conductorManual = String(r?.driver_name || "").trim();
    const conductorCell = (esManual && conductorManual)
      ? escapeHtml(conductorManual)
      : (condProg ? `${turnoTag}${escapeHtml(condProg)}` : escapeHtml(conductorManual || "-"));
    // Solo evaluar horario si la programación ya cargó (evita falsos "NO PROGRAMADO").
    const fh = programacionByInterno.size > 0 ? fueraDeHorario(prog) : false;
    const horarioBadge = fh === "fuera"
      ? `<span class="veh-fuera" title="Operando fuera de su horario programado">FUERA DE HORARIO</span> `
      : fh === "noprog"
      ? `<span class="veh-noprog" title="Este interno no está programado hoy">NO PROGRAMADO</span> `
      : "";
    const prio = r?.prioridad === true ? `<span class="veh-prio" title="Prelación: ubicado a mano en esta posición">PRELACIÓN</span> ` : "";
    const estado = prio + horarioBadge + (esManual
      ? `<span class="veh-manual">MANUAL</span>`
      : sinDesp
      ? `<span class="veh-sindesp">SIN DESPACHO</span>`
      : `<span class="ent-ok">Con despacho</span>`);
    const esPrimero = i === 0;
    const rowClass = esPrimero ? "ent-row-primero" : (esManual ? "ent-row-manual" : sinDesp ? "ent-row-sindesp" : "");
    const posCell = esPrimero
      ? `<td class="ent-pos ent-pos-1">1<div class="ent-prox">PRÓXIMO</div></td>`
      : `<td class="ent-pos">${i + 1}</td>`;
    return `<tr class="${rowClass}">
      ${posCell}
      <td><b>${escapeHtml(horaTxt)}</b><div class="muted" style="font-size:11px">${escapeHtml(hace)}</div></td>
      <td class="ent-interno">${escapeHtml(interno)}</td>
      <td>${escapeHtml(String(r?.placa || r?.mid || "-"))}</td>
      <td>${baseTxt}</td>
      <td>${escapeHtml(puestoTxt)}</td>
      <td>${conductorCell}</td>
      <td>${escapeHtml(itin)}</td>
      <td>${estado}</td>
      <td style="white-space:nowrap">
        <button type="button" class="btn btn-primary btn-despachar-enturno"
          data-enturno-id="${escapeHtml(String(r?.id || ""))}"
          title="${esPrimero ? "Despachar el próximo (orden correcto). Va a Sonar y a Despachos Realizados." : "Despachar este carro. No es el #1: se pedirá el motivo del desorden."}"
          style="padding:3px 10px;font-size:11px;margin-right:4px">Despachar</button>
        <button type="button" class="btn btn-danger btn-quitar-enturno"
          data-enturno-id="${escapeHtml(String(r?.id || ""))}"
          title="Sacar de la lista (pide motivo: varada, prelación, error…). No lo despacha."
          style="padding:3px 10px;font-size:11px">Quitar</button>
      </td>
    </tr>`;
  };
  grid.innerHTML = `
    <div class="ent-grupo">
      <table class="ent-tabla">
        <thead>
          <tr><th>#</th><th>Hora de paso</th><th>Interno</th><th>Placa</th><th>Base</th><th>Puesto</th><th>Conductor</th><th>Itinerario</th><th>Estado</th><th>Acción</th></tr>
        </thead>
        <tbody>${ordenados.map(filaHtml).join("")}</tbody>
      </table>
    </div>`;
}

async function quitarEnturnamiento(id, motivo){
  const eid = String(id || "").trim();
  if (!eid) return;
  try {
    const upd = { estado: "SALIO" };
    if (motivo) upd.motivo = String(motivo);
    const { error } = await planillaSupabaseClient
      .from(ENTURNAMIENTOS_TABLE)
      .update(upd)
      .eq("id", eid);
    if (error) throw error;
    enturnamientosRows = enturnamientosRows.filter(r => String(r?.id) !== eid);
    renderEnturnamientoTab();
  } catch (err) {
    console.error("[enturnamientos] quitar fallo:", err);
    showToast(`No se pudo quitar: ${err?.message || "fallo"}`, "err");
  }
}

function handleEnturnamientoClick(ev){
  const dispBtn = ev.target?.closest?.(".btn-despachar-enturno");
  if (dispBtn) {
    const id = dispBtn.getAttribute("data-enturno-id");
    if (id) handleDispatchEnturnamiento(id);
    return;
  }
  const btn = ev.target?.closest?.(".btn-quitar-enturno");
  if (!btn) return;
  const id = btn.getAttribute("data-enturno-id");
  if (!id) return;
  const motivo = pedirMotivoQuitar();
  if (motivo === null) return; // canceló
  quitarEnturnamiento(id, motivo);
}

// Pide el motivo para quitar/desenturnar un carro. Devuelve el texto o null si cancela.
function pedirMotivoQuitar(){
  const v = window.prompt(
    "Motivo para quitar de la lista:\n\n1 = Varada\n2 = Prelación (pasa a otro)\n3 = Error\n4 = Otro\n\nEscribe el número (o el motivo):",
    "1"
  );
  if (v === null) return null;
  const t = String(v).trim();
  const map = { "1": "Varada", "2": "Prelación", "3": "Error", "4": "Otro" };
  return map[t] || t || "Otro";
}

// Devuelve las filas EN ESPERA de la MISMA lista visible para este carro, ordenadas por hora de paso.
function listaDelEnturno(row){
  const rows = enturnamientosRows || [];
  // 3 listas: Aeropuerto (sube), Almacentro (baja) y Exposiciones (baja hacia Exposiciones).
  const target = listaDeFila(row);
  const lista = rows.filter(r => listaDeFila(r) === target);
  return [...lista].sort((a, b) =>
    new Date(a?.entro_en || 0).getTime() - new Date(b?.entro_en || 0).getTime()
  );
}

// Posición (1-based) del carro en su lista y qué carros se estarían adelantando.
function posicionEnLista(row){
  const lista = listaDelEnturno(row);
  const idx = lista.findIndex(r => String(r?.id) === String(row?.id));
  const pos = idx < 0 ? 1 : idx + 1;
  const saltadosRows = idx > 0 ? lista.slice(0, idx) : [];
  return {
    pos,
    saltados: saltadosRows.length,
    saltadosInternos: saltadosRows.map(r => String(r?.interno || "?")),
  };
}

// Pide el motivo cuando se despacha en DESORDEN (no es el próximo). Devuelve texto o null si cancela.
function pedirMotivoDesorden(info){
  const listaTxt = info.saltadosInternos.length
    ? `\nSe adelantaría a: ${info.saltadosInternos.join(", ")}`
    : "";
  const v = window.prompt(
    `⚠ Este carro está en la POSICIÓN ${info.pos} (no es el próximo a despachar).${listaTxt}\n\n` +
    `Debes justificar por qué se despacha en desorden:\n` +
    `1 = Prelación\n2 = El próximo está varado\n3 = Cambio de programación\n4 = Otro\n\n` +
    `Escribe el número o el motivo:`,
    ""
  );
  if (v === null) return null; // canceló -> no se despacha
  const t = String(v).trim();
  const map = { "1": "Prelación", "2": "El próximo está varado", "3": "Cambio de programación", "4": "Otro" };
  return map[t] || t || "Otro";
}

// Despacha a Sonar un carro desde la lista de llegadas (sin tocar planilla_afiliados_2).
// Carros con un despacho EN CURSO (para no enviar el mismo dos veces).
const despachosEnCurso = new Set();

// Overlay de carga mientras el despacho viaja a Sonar (bloquea la pantalla).
function showDispatchLoading(msg){
  let ov = document.getElementById("dispatchLoadingOverlay");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "dispatchLoadingOverlay";
    ov.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center";
    ov.innerHTML = `<div style="background:#fff;border-radius:12px;padding:22px 30px;box-shadow:0 10px 40px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;gap:14px;min-width:230px">
      <div style="width:40px;height:40px;border:4px solid #dbeafe;border-top-color:#2563eb;border-radius:50%;animation:dispSpin .8s linear infinite"></div>
      <div id="dispatchLoadingMsg" style="font-weight:700;color:#1e293b;text-align:center">Enviando…</div>
    </div>`;
    document.body.appendChild(ov);
    if (!document.getElementById("dispatchLoadingStyle")) {
      const st = document.createElement("style");
      st.id = "dispatchLoadingStyle";
      st.textContent = "@keyframes dispSpin{to{transform:rotate(360deg)}}";
      document.head.appendChild(st);
    }
  }
  const m = document.getElementById("dispatchLoadingMsg");
  if (m) m.textContent = msg || "Enviando…";
  ov.style.display = "flex";
}
function hideDispatchLoading(){
  const ov = document.getElementById("dispatchLoadingOverlay");
  if (ov) ov.style.display = "none";
}

async function handleDispatchEnturnamiento(enturnoId){
  const row = (enturnamientosRows || []).find(r => String(r?.id) === String(enturnoId));
  if (!row) { showToast("No se encontró la llegada para despachar.", "warn"); return; }
  const mId = String(row?.mid || "").trim();
  if (!mId) {
    showToast("Esta llegada no tiene vehículo (MID) asociado; no se puede despachar.", "warn");
    return;
  }
  // Conductor: 1) el programado para la hora actual; 2) el capturado al cruzar; 3) el de Sonar.
  const pos = (sonarFleetLocations || []).find(p => String(p?.id || "").trim().toUpperCase() === mId.toUpperCase());
  const prog = programacionByInterno.get(String(row?.interno || ""));
  const tc = turnoYConductor(prog);
  let driverPrefill = "";
  if (tc.conductor && typeof findDriverIdByName === "function") {
    driverPrefill = String(findDriverIdByName(tc.conductor, prog?.base) || "").trim();
  }
  if (!driverPrefill) driverPrefill = String(row?.driver_id || pos?.driverId || "").trim();
  const modalResult = await openDispatchConfirmModal({
    interno: String(row?.interno || "-"),
    base: "",
    mid: mId,
    driverId: driverPrefill,
    itineraryId: String(row?.itinerario_id || ""),
    itineraryOptions: itinerariosDelPunto(row), // solo los itinerarios del punto de este carro
    observaciones: "-",
  });
  if (!modalResult?.confirmed) return;
  const drvId = String(modalResult?.driverId || "").trim();
  const itinerary = String(modalResult?.itineraryId || "").trim();
  if (!drvId) { showToast("Selecciona un Driver ID en el modal.", "warn"); return; }
  if (!itinerary) { showToast("Selecciona un itinerario en el modal.", "warn"); return; }
  // Si NO es el próximo (posición 1) de su lista, exigir motivo del despacho en desorden.
  let obsDesorden = "";
  const posInfo = posicionEnLista(row);
  if (posInfo.pos > 1) {
    const motivo = pedirMotivoDesorden(posInfo);
    if (motivo === null) return; // canceló: no se despacha
    obsDesorden = `DESPACHO EN DESORDEN (posición ${posInfo.pos}, se adelantó a ${posInfo.saltados} carro(s): ${posInfo.saltadosInternos.join(", ")}). Motivo: ${motivo}`;
  }
  const payload = {
    mId,
    drvId,
    itinerary,
    itineraryLabel: String(getSonarItineraryById(itinerary)?.nombre || itinerary),
    interno: String(row?.interno || ""),
    observaciones: obsDesorden,
    ficho: String(modalResult?.ficho || ""),
  };
  // Confirmación final para evitar un despacho por error.
  if (!window.confirm(`¿Confirmar el despacho?\n\nInterno: ${payload.interno}\nItinerario: ${payload.itineraryLabel}\nDriver ID: ${drvId}`)) return;
  // Candado anti doble-despacho + overlay de carga (evita dobles envíos).
  const dispKey = String(enturnoId);
  if (despachosEnCurso.has(dispKey)) { showToast("Este carro ya se está despachando…", "warn"); return; }
  despachosEnCurso.add(dispKey);
  showDispatchLoading(`Despachando interno ${payload.interno}…`);
  try {
    const result = await sendDispatchToSonar(payload);
    const regId = extractDispatchRegId(result);
    if (regId) payload.dispatchRegId = regId;
    insertDespachoRealizado(payload, result, { interno: row?.interno, pasajeros: 0 })
      .then(() => {
        // Refresca la vista de Despachos Realizados para que aparezca de una vez.
        if (typeof loadDespachosRealizadosFromSupabase === "function") loadDespachosRealizadosFromSupabase();
        // Y refresca el cruce del mapa para que el carro se pinte 🟠/🟢 al instante.
        if (typeof loadMapaDespachosActivos === "function") {
          loadMapaDespachosActivos().then(() => {
            if (typeof renderSonarFleetMarkers === "function") renderSonarFleetMarkers();
          });
        }
      })
      .catch(() => {});
    showToast(`Despacho enviado${regId ? ` (regId ${regId})` : ""}.`, "ok");
    // Ya fue despachado: se marca DESPACHADO y desaparece de la lista.
    try {
      const upd = { estado: "DESPACHADO" };
      if (obsDesorden) upd.motivo = obsDesorden; // deja constancia del desorden en la llegada
      await planillaSupabaseClient
        .from(ENTURNAMIENTOS_TABLE)
        .update(upd)
        .eq("id", enturnoId);
    } catch (_) { /* si falla el marcado, igual lo sacamos de la vista */ }
    enturnamientosRows = (enturnamientosRows || []).filter(r => String(r?.id) !== String(enturnoId));
    renderEnturnamientoTab();
  } catch (err) {
    console.error("[enturnamientos] despacho fallo:", err);
    showToast(`Error al despachar: ${err?.message || "fallo en sonar-dispatch"}`, "err");
  } finally {
    despachosEnCurso.delete(dispKey);
    hideDispatchLoading();
  }
}

// ===== Enturnamiento manual (carro que paso con el GPS mudo, etc.) =====
// Fecha/hora actual de Colombia en formato datetime-local (YYYY-MM-DDTHH:MM).
function nowBogotaLocalInput(){
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find(p => p.type === t)?.value || "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

// Itinerarios fuera de operación: no se ofrecen ni al agregar manual ni al despachar (ej. 3385).
const ITINERARIOS_OCULTOS = ["3385"];
// Interno del que ya se propuso conductor por defecto (para no pisar lo que el usuario elija).
let enturnoManualLastInterno = "";

// Puebla el datalist del campo "Otro conductor" con los conductores de Sonar (habilitados).
// Si el catálogo aún no está cargado, lo pide y repuebla al terminar.
function fillEnturnoManualSonarConductores(){
  const dl = document.getElementById("enturnoManualSonarConductores");
  if (!dl) return;
  const nombres = Array.from(new Set((driversCatalogRows || [])
    .filter(v => String(v?.status || "").toUpperCase() === "ENABLED")
    .map(v => String(v?.nombre || "").trim())
    .filter(Boolean))).sort((a, b) => a.localeCompare(b));
  dl.innerHTML = nombres.map(n => `<option value="${escapeHtml(n)}"></option>`).join("");
  if (!nombres.length && typeof loadDriversFromCSV === "function") {
    loadDriversFromCSV().then(() => {
      const dl2 = document.getElementById("enturnoManualSonarConductores");
      if (!dl2) return;
      const ns = Array.from(new Set((driversCatalogRows || [])
        .filter(v => String(v?.status || "").toUpperCase() === "ENABLED")
        .map(v => String(v?.nombre || "").trim())
        .filter(Boolean))).sort((a, b) => a.localeCompare(b));
      dl2.innerHTML = ns.map(n => `<option value="${escapeHtml(n)}"></option>`).join("");
    }).catch(() => {});
  }
}

function fillEnturnoManualOptions(allowedItins){
  // Itinerarios. Si se pasa allowedItins (los del punto), se muestran SOLO esos.
  const sel = document.getElementById("enturnoManualItin");
  if (sel) {
    const allow = Array.isArray(allowedItins) && allowedItins.length ? allowedItins.map(String) : null;
    sel.innerHTML = SONAR_ITINERARIES
      .filter(it => !ITINERARIOS_OCULTOS.includes(String(it.id)))
      .filter(it => !allow || allow.includes(String(it.id)))
      .map(it => `<option value="${escapeHtml(it.id)}">${escapeHtml(it.nombre)} (${escapeHtml(it.id)})</option>`)
      .join("");
  }
  // Internos sugeridos (datalist) desde vehiculossonar.
  const dl = document.getElementById("enturnoManualInternos");
  if (dl) {
    const internos = (vehiculosSonarRows || [])
      .map(v => String(v?.interno || "").trim())
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b));
    dl.innerHTML = internos.map(i => `<option value="${escapeHtml(i)}"></option>`).join("");
  }
}

function toggleEnturnoManual(show, preselectItin, allowedItins){
  const modal = document.getElementById("enturnoManualModal");
  if (!modal) return;
  const willShow = (show === undefined) ? modal.classList.contains("hidden") : show;
  modal.classList.toggle("hidden", !willShow);
  if (willShow) {
    fillEnturnoManualOptions(allowedItins);
    // Si se abrió desde una planilla puntual, preselecciona un itinerario de ese punto.
    if (preselectItin) {
      const selItin = document.getElementById("enturnoManualItin");
      if (selItin && [...selItin.options].some(o => o.value === String(preselectItin))) {
        selItin.value = String(preselectItin);
      }
    }
    const hora = document.getElementById("enturnoManualHora");
    if (hora) hora.value = nowBogotaLocalInput().slice(11, 16);
    const fechaHoyLbl = document.getElementById("enturnoManualFechaHoy");
    if (fechaHoyLbl) fechaHoyLbl.textContent = fechaBogotaISO();
    const pos = document.getElementById("enturnoManualPos");
    if (pos) pos.value = "";
    const mot = document.getElementById("enturnoManualMotivo");
    if (mot) mot.value = "";
    const just = document.getElementById("enturnoManualJustificacion");
    if (just) just.value = "";
    const condOtro = document.getElementById("enturnoManualConductorOtro");
    if (condOtro) { condOtro.value = ""; condOtro.style.display = "none"; }
    fillEnturnoManualSonarConductores(); // conductores Sonar para el campo "Otro"
    enturnoManualLastInterno = null; // fuerza reconstruir el desplegable de conductor
    const st = document.getElementById("enturnoManualStatus");
    if (st) st.textContent = "";
    refreshEnturnoManualPreview();
    const interno = document.getElementById("enturnoManualInterno");
    if (interno) setTimeout(() => interno.focus(), 30);
  }
}

// Busca interno/placa/mid en vehiculossonar a partir del interno tecleado.
function buscarVehiculoPorInterno(interno){
  const target = String(interno || "").trim();
  if (!target) return null;
  return (vehiculosSonarRows || []).find(v => String(v?.interno || "").trim() === target) || null;
}

// Itinerarios que BAJAN (salen del aeropuerto). -> caen en "Llegadas Almacentro".
const ITINERARIOS_BAJADA_AEROPUERTO = ["3385", "4503", "4507", "4413", "4501"];
// Itinerarios que SUBEN (van hacia el aeropuerto). -> caen en "Llegadas Aeropuerto".
const ITINERARIOS_SUBIDA_AEROPUERTO = ["4505", "4504", "3395", "4502", "3387", "3394"];

// Sentido (sube/baja) de un itinerario, segun lo configurado o el nombre/catalogo.
function sentidoDeItinerario(itinId){
  const id = String(itinId);
  const cfg = itinerariosDireccionMap.get(id);
  if (cfg === "baja" || cfg === "sube") return cfg;
  // Fallback: por el nombre del catalogo y, si es ambiguo, por la lista de bajada conocida.
  const it = SONAR_ITINERARIES.find(x => String(x.id) === id);
  const dir = it ? getItineraryDirection(it.nombre, id) : "";
  if (dir === "baja" || dir === "sube") return dir;
  return ITINERARIOS_BAJADA_AEROPUERTO.includes(id) ? "baja" : "sube";
}

// Sentido efectivo de una fila de enturnamiento: usa el guardado y, si viene vacío
// (p.ej. una inserción por geocerca que no fijó "sentido"), lo deriva del itinerario
// para que la fila NO desaparezca del tablero.
function sentidoDeFila(row){
  const s = String(row?.sentido || "").toLowerCase();
  if (s === "sube" || s === "baja") return s;
  return sentidoDeItinerario(row?.itinerario_id);
}

// De lo que BAJA del aeropuerto, estos itinerarios van hacia Exposiciones/Nutibara y
// tienen su propia pestaña "Llegadas Exposiciones" (no se mezclan con Almacentro).
const ITINERARIOS_EXPOSICIONES = ["4503", "4413"];
// Solo bajada hacia Almacentro/San Diego (bajada - Exposiciones - ocultos).
const ITINERARIOS_ALMACENTRO_LLEGADA = ITINERARIOS_BAJADA_AEROPUERTO
  .filter(id => !ITINERARIOS_EXPOSICIONES.includes(id) && !ITINERARIOS_OCULTOS.includes(id));
const NOMBRE_LISTA = {
  aeropuerto: "Llegadas Aeropuerto",
  almacentro: "Llegadas Almacentro",
  exposiciones: "Llegadas Exposiciones",
};

// Pestaña a la que pertenece un itinerario: "aeropuerto" (sube), "exposiciones" o "almacentro" (baja).
function listaDeItinerario(itinId){
  const id = String(itinId || "").trim();
  if (sentidoDeItinerario(id) === "sube") return "aeropuerto";
  return ITINERARIOS_EXPOSICIONES.includes(id) ? "exposiciones" : "almacentro";
}
// Pestaña de una fila de enturnamiento (usa el sentido guardado + el itinerario).
function listaDeFila(row){
  if (sentidoDeFila(row) === "sube") return "aeropuerto";
  return ITINERARIOS_EXPOSICIONES.includes(String(row?.itinerario_id || "").trim()) ? "exposiciones" : "almacentro";
}

// Itinerarios que se PUEDEN despachar segun el punto (lista) del carro.
// Almacentro/Exposiciones -> solo los de su corredor (subida).
// Aeropuerto (bajada) -> solo los de bajada. Evita elegir un itinerario de otro punto.
function itinerariosDelPunto(row){
  const itinId = String(row?.itinerario_id || "").trim();
  const visible = it => !ITINERARIOS_OCULTOS.includes(String(it.id)); // ej. 3385 fuera de operación
  const llegoBajando = String(row?.sentido || "").toLowerCase() === "baja"
    || ITINERARIOS_BAJADA_AEROPUERTO.includes(itinId);
  // Al DESPACHAR el carro va en sentido CONTRARIO al de llegada:
  //  - Llegó bajando (Llegadas Almacentro) -> se despacha SUBIENDO (itinerarios de subida).
  //  - Llegó subiendo (Llegadas Aeropuerto) -> se despacha BAJANDO (itinerarios de bajada).
  const set = llegoBajando ? ITINERARIOS_SUBIDA_AEROPUERTO : ITINERARIOS_BAJADA_AEROPUERTO;
  return SONAR_ITINERARIES.filter(it => set.includes(String(it.id))).filter(visible);
}

// Nombre legible de la lista (pestaña) a la que caería un itinerario.
function nombreListaParaItinerario(itinId){
  return NOMBRE_LISTA[listaDeItinerario(itinId)] || "Llegadas Aeropuerto";
}

// Actualiza la vista previa del modal manual (placa/base, conductor, sentido, lista destino).
function refreshEnturnoManualPreview(){
  const interno = String(document.getElementById("enturnoManualInterno")?.value || "").trim();
  const itinId = String(document.getElementById("enturnoManualItin")?.value || "").trim();
  const vehEl = document.getElementById("enturnoManualVeh");
  const condEl = document.getElementById("enturnoManualConductor");
  const sentEl = document.getElementById("enturnoManualSentido");
  const listaEl = document.getElementById("enturnoManualLista");

  if (vehEl) {
    if (!interno) {
      vehEl.textContent = "Escribe el interno…";
    } else {
      const veh = buscarVehiculoPorInterno(interno);
      const baseNum = typeof getBaseNumForInterno === "function" ? getBaseNumForInterno(interno) : "";
      const partes = [
        veh?.placa ? `Placa ${veh.placa}` : "Placa —",
        baseNum ? `Base B${baseNum}` : "Base —",
        veh?.mid ? `MID ${veh.mid}` : "⚠ sin MID (no está en Sonar)",
      ];
      vehEl.textContent = partes.join(" · ");
    }
  }
  {
    const selEl = document.getElementById("enturnoManualConductorSelect");
    const otroEl = document.getElementById("enturnoManualConductorOtro");
    const prog = interno ? programacionByInterno.get(interno) : null;
    // Los 2 conductores de la programación (sin vacíos, sin "SIN CONDUCTOR", sin duplicar).
    const conductores = [];
    if (prog) {
      [prog.conductor1, prog.conductor2].forEach(c => {
        const v = String(c || "").trim();
        if (v && !/SIN CONDUCTOR/i.test(v) && !conductores.includes(v)) conductores.push(v);
      });
    }
    // Reconstruye el desplegable SOLO al cambiar de interno (no pisa la elección del usuario).
    if (selEl && interno !== enturnoManualLastInterno) {
      if (!interno) {
        selEl.innerHTML = `<option value="">—</option>`;
        if (otroEl) { otroEl.style.display = "none"; otroEl.value = ""; }
      } else {
        const tc = prog ? turnoYConductor(prog) : null;
        const def = (tc && tc.conductor && !/SIN CONDUCTOR/i.test(tc.conductor)) ? tc.conductor : "";
        const opts = conductores.map(c => `<option value="${escapeHtml(c)}"${c === def ? " selected" : ""}>${escapeHtml(c)}</option>`).join("");
        const otroSel = (!conductores.length || !def) ? " selected" : "";
        selEl.innerHTML = opts + `<option value="__OTRO__"${otroSel}>Otro conductor (escribir)…</option>`;
        const isOtro = selEl.value === "__OTRO__";
        if (otroEl) { otroEl.style.display = isOtro ? "block" : "none"; if (!isOtro) otroEl.value = ""; }
      }
      enturnoManualLastInterno = interno;
    }
    if (condEl) {
      if (conductores.length) condEl.textContent = `Programados: ${conductores.join("  ·  ")}`;
      else if (interno) condEl.textContent = "No programado hoy (elige 'Otro' y escribe el nombre)";
      else condEl.textContent = "—";
    }
  }
  if (itinId) {
    const sentido = sentidoDeItinerario(itinId);
    if (sentEl) { sentEl.style.display = "inline-flex"; sentEl.textContent = sentido === "baja" ? "BAJA" : "SUBE"; }
    if (listaEl) listaEl.textContent = `Irá a: ${nombreListaParaItinerario(itinId)}`;
  } else {
    if (sentEl) sentEl.style.display = "none";
    if (listaEl) listaEl.textContent = "—";
  }
}

// Filas EN_ESPERA que comparten lista (pestaña) con un itinerario dado.
function listaRowsParaItinerario(itinId){
  const rows = enturnamientosRows || [];
  const target = listaDeItinerario(itinId);
  return rows.filter(r => listaDeFila(r) === target);
}

// Calcula un entro_en que ubique al carro en la posicion deseada de su lista.
function isoParaPosicion(itinId, posicion){
  const lista = listaRowsParaItinerario(itinId);
  const times = lista.map(r => new Date(r?.entro_en || 0).getTime())
    .filter(t => Number.isFinite(t)).sort((a, b) => a - b);
  const n = times.length;
  const p = Math.max(1, Math.min(posicion, n + 1));
  let t;
  if (n === 0) t = Date.now();
  else if (p === 1) t = times[0] - 1000;                 // antes del actual #1
  else if (p > n) t = Math.max(times[n - 1] + 1000, Date.now()); // al final
  else t = Math.floor((times[p - 2] + times[p - 1]) / 2); // entre p-1 y p
  return new Date(t).toISOString();
}

async function guardarEnturnoManual(){
  const st = document.getElementById("enturnoManualStatus");
  const internoVal = String(document.getElementById("enturnoManualInterno")?.value || "").trim();
  const itinId = String(document.getElementById("enturnoManualItin")?.value || "").trim();
  const horaVal = String(document.getElementById("enturnoManualHora")?.value || "").trim();
  const posVal = parseInt(String(document.getElementById("enturnoManualPos")?.value || "").trim(), 10);
  const tienePos = Number.isFinite(posVal) && posVal >= 1;
  if (!internoVal) { if (st) st.textContent = "Escribe el interno."; return; }
  if (!itinId) { if (st) st.textContent = "Elige el itinerario."; return; }
  if (!tienePos && !horaVal) { if (st) st.textContent = "Indica la hora de paso o una posición (prelación)."; return; }
  // Justificación OBLIGATORIA (por qué se ingresa a mano) — control anti-fraude.
  const justificacionVal = String(document.getElementById("enturnoManualJustificacion")?.value || "").trim();
  if (justificacionVal.length < 8) { if (st) st.textContent = "Escribe la justificación (mínimo 8 caracteres): por qué se ingresa a mano."; return; }
  // La FECHA es SIEMPRE hoy (Colombia) y no se puede cambiar; solo se toma la hora escrita.
  const hoyISO = fechaBogotaISO();
  const entroEnIso = tienePos ? isoParaPosicion(itinId, posVal) : `${hoyISO}T${horaVal}:00-05:00`;
  // Anti-fraude: la hora de paso no puede ser futura.
  if (!tienePos) {
    const tPaso = new Date(entroEnIso).getTime();
    if (Number.isFinite(tPaso) && tPaso > Date.now() + 120000) { if (st) st.textContent = "La hora de paso no puede ser futura."; return; }
  }
  const veh = buscarVehiculoPorInterno(internoVal);
  const itin = SONAR_ITINERARIES.find(it => String(it.id) === itinId);
  const motivoVal = String(document.getElementById("enturnoManualMotivo")?.value || "").trim();
  const condSelEl = document.getElementById("enturnoManualConductorSelect");
  const condOtroEl = document.getElementById("enturnoManualConductorOtro");
  const conductorVal = (condSelEl && condSelEl.value === "__OTRO__")
    ? String(condOtroEl?.value || "").trim()
    : String(condSelEl?.value || "").trim();
  try {
    if (st) st.textContent = "Guardando...";
    const { data: insData, error } = await planillaSupabaseClient.from(ENTURNAMIENTOS_TABLE).insert({
      mid: veh?.mid || null,
      vehicle_id: veh?.mid || null,
      interno: internoVal,
      placa: veh?.placa || null,
      reg_id: null,
      itinerario_id: itinId,
      itinerario: itin?.nombre || null,
      entro_en: entroEnIso,
      estado: "EN_ESPERA",
      sin_despacho: false,
      manual: true,
      prioridad: tienePos,
      sentido: sentidoDeItinerario(itinId),
      motivo: motivoVal || null,
      driver_name: conductorVal || null,
    }).select("id").maybeSingle();
    // maybeSingle (no single): si el INSERT pasó pero el SELECT de retorno no devuelve
    // la fila (p.ej. RLS que permite insert pero no read), NO lanzamos: el carro ya quedó
    // guardado y no queremos que el operador vea "Error" y reintente creando un duplicado.
    if (error) throw error;
    // Auditoría del ingreso manual (base pequeña aparte): quién, cuándo real y por qué.
    try {
      await planillaSupabaseClient.from("enturnamientos_manual_log").insert({
        enturnamiento_id: insData?.id != null ? String(insData.id) : null,
        interno: internoVal,
        placa: veh?.placa || null,
        itinerario_id: itinId,
        itinerario: itin?.nombre || null,
        conductor: conductorVal || null,
        hora_paso: entroEnIso,
        posicion: tienePos ? posVal : null,
        motivo: motivoVal || null,
        justificacion: justificacionVal,
        usuario: currentUserEmail || currentUserId || "desconocido",
      });
    } catch (logErr) { console.warn("[enturnamientos] no se pudo guardar la auditoría:", logErr); }
    showToast(`Interno ${internoVal} agregado${tienePos ? ` en posición ${posVal} (prelación)` : ""}.`, "ok");
    // Limpia para el siguiente.
    const internoEl = document.getElementById("enturnoManualInterno");
    if (internoEl) internoEl.value = "";
    const condOtroEl2 = document.getElementById("enturnoManualConductorOtro");
    if (condOtroEl2) { condOtroEl2.value = ""; condOtroEl2.style.display = "none"; }
    enturnoManualLastInterno = null; // fuerza reconstruir el desplegable de conductor
    const posEl = document.getElementById("enturnoManualPos");
    if (posEl) posEl.value = "";
    const horaEl = document.getElementById("enturnoManualHora");
    if (horaEl) horaEl.value = nowBogotaLocalInput().slice(11, 16);
    const justEl = document.getElementById("enturnoManualJustificacion");
    if (justEl) justEl.value = "";
    if (st) st.textContent = "Agregado " + horaCO(new Date()) + ". Puedes agregar otro o cerrar.";
    refreshEnturnoManualPreview();
    await loadEnturnamientos();
  } catch (err) {
    console.error("[enturnamientos] manual fallo:", err);
    if (st) st.textContent = `Error: ${err?.message || "fallo"}`;
  }
}

// Realtime: pocos eventos (solo cuando un carro cruza), ideal para push instantaneo.
function ensureEnturnamientoRealtime(){
  if (enturnamientoRealtimeChannel) return;
  if (!planillaSupabaseClient?.channel) return;
  try {
    enturnamientoRealtimeChannel = planillaSupabaseClient
      .channel("enturnamientos_rt")
      .on("postgres_changes",
        { event: "*", schema: "public", table: ENTURNAMIENTOS_TABLE },
        () => { loadEnturnamientos(); })
      .subscribe((status) => {
        console.info("[enturnamientos] realtime status:", status);
        if (status === "SUBSCRIBED") {
          enturnamientoRealtimeRetryDelay = 1000;
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          // El canal se cayó: lo cerramos, reintentamos con backoff y refrescamos ya
          // (para no quedarnos con el tablero congelado hasta el próximo evento).
          try { planillaSupabaseClient.removeChannel?.(enturnamientoRealtimeChannel); } catch (_) {}
          enturnamientoRealtimeChannel = null;
          scheduleEnturnamientoRealtimeRetry();
          loadEnturnamientos();
        }
      });
  } catch (err) {
    console.warn("[enturnamientos] realtime no disponible:", err);
    scheduleEnturnamientoRealtimeRetry();
  }
}

// Reintenta re-suscribirse al Realtime con backoff exponencial (máx 30s) si el canal se cae.
function scheduleEnturnamientoRealtimeRetry(){
  if (enturnamientoRealtimeRetryTimer) return;
  const delay = enturnamientoRealtimeRetryDelay;
  enturnamientoRealtimeRetryDelay = Math.min(enturnamientoRealtimeRetryDelay * 2, 30000);
  enturnamientoRealtimeRetryTimer = setTimeout(() => {
    enturnamientoRealtimeRetryTimer = null;
    ensureEnturnamientoRealtime();
  }, delay);
}

// Respaldo: aunque el Realtime se caiga (wifi inestable, Supabase reinicia), refresca
// el tablero cada 20s mientras el usuario esté viendo alguna pestaña de enturnamiento.
function ensureEnturnamientoPolling(){
  if (enturnamientoPollTimer) return;
  enturnamientoPollTimer = setInterval(() => {
    if (document.hidden) return;
    if (!currentUserId) return;
    const tab = getActiveTabId();
    const viendo = tab === "enturnamiento" || tab === "salidas-aeropuerto"
      || tab === "llegadas-almacentro-geo" || tab === "llegadas-exposiciones-geo";
    if (!viendo) return;
    loadEnturnamientos();
  }, 20000);
}

/* ============ Tabla en vivo de llegadas_104 ============ */
function getFilteredTablaLlegadasRows(){
  const term = String(tablaLlegadasSearch?.value || "").trim().toLowerCase();
  return (mapaVehiculosRows || [])
    .filter(row => {
      if (!term) return true;
      const haystack = [
        row?.vehicle_id, row?.interno, row?.itinerario, row?.base,
        row?.driver_id, row?.ubicacion
      ].map(v => String(v || "").toLowerCase()).join(" ");
      return haystack.includes(term);
    })
    .sort((a, b) => {
      const pa = Number(a?.posicion);
      const pb = Number(b?.posicion);
      if (Number.isFinite(pa) && Number.isFinite(pb) && pa !== pb) return pa - pb;
      const ha = String(a?.hora_llegada || "");
      const hb = String(b?.hora_llegada || "");
      return hb.localeCompare(ha);
    });
}

function formatTablaLlegadasDateTime(value){
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return fechaHoraCO(d);
  } catch (_) { return String(value); }
}

function renderTablaLlegadasVehiculos(){
  if (!tablaLlegadasGrid) return;
  const rows = getFilteredTablaLlegadasRows();
  if (tablaLlegadasCount) tablaLlegadasCount.textContent = String(rows.length);
  if (!rows.length) {
    tablaLlegadasGrid.innerHTML =
      `<div class="muted" style="grid-column:1/-1;text-align:center;padding:18px">Sin registros.</div>`;
    return;
  }

  const groups = new Map();
  for (const row of rows) {
    const itin = String(row?.itinerario || "Sin itinerario").trim() || "Sin itinerario";
    if (!groups.has(itin)) groups.set(itin, []);
    groups.get(itin).push(row);
  }

  const ordered = Array.from(groups.entries()).map(([itin, items]) => {
    items.sort((a, b) => {
      const pa = Number(a?.posicion);
      const pb = Number(b?.posicion);
      if (Number.isFinite(pa) && Number.isFinite(pb) && pa !== pb) return pa - pb;
      return String(a?.hora_llegada || "").localeCompare(String(b?.hora_llegada || ""));
    });
    const listos = items.filter(r => r?.listo === true || r?.listo === "true").length;
    return { itin, items, listos };
  }).sort((a, b) => a.itin.localeCompare(b.itin, "es"));

  tablaLlegadasGrid.innerHTML = ordered.map(group => {
    const cards = group.items.map(row => {
      const listo = row?.listo === true || row?.listo === "true";
      const pos = Number.isFinite(Number(row?.posicion)) ? String(row.posicion) : "-";
      const interno = String(row?.interno || "-");
      const mid = String(row?.vehicle_id || "-");
      const baseRaw = String(row?.base ?? "").trim();
      const baseMap = getBaseNumForInterno(row?.interno);
      const baseLabel = baseMap || baseRaw || "?";
      const baseMismatch = baseMap && baseRaw && baseMap !== baseRaw;
      const baseTitle = baseMap
        ? `Base ${baseMap} (afiliacion)${baseRaw && baseRaw !== baseMap ? ` · operativa ${baseRaw}` : ""}`
        : (baseRaw ? `Base ${baseRaw} (operativa)` : "Sin base asignada");
      const driver = String(row?.driver_id || "-");
      const hora = formatTablaLlegadasDateTime(row?.hora_llegada);
      const dist = Number.isFinite(Number(row?.distancia_m)) ? `${Number(row.distancia_m)} m` : "-";
      const ubic = String(row?.ubicacion || "-");
      const cls = listo ? "veh-card is-listo" : "veh-card is-espera";
      return `<div class="${cls}">
        <div class="veh-pos">${escapeHtml(pos)}</div>
        <div class="veh-main">
          <div class="veh-head">
            <span class="veh-interno">${escapeHtml(interno)}</span>
            <span class="veh-mid">${escapeHtml(mid)}</span>
            <span class="veh-base${baseMismatch ? " is-mismatch" : ""}" title="${escapeHtml(baseTitle)}">B${escapeHtml(baseLabel)}</span>
          </div>
          <div class="veh-meta">
            <span title="Hora llegada">${escapeHtml(hora)}</span>
            <span title="Distancia">${escapeHtml(dist)}</span>
            <span title="Driver">Driver ${escapeHtml(driver)}</span>
          </div>
          <div class="veh-ubic" title="${escapeHtml(ubic)}">${escapeHtml(ubic)}</div>
        </div>
      </div>`;
    }).join("");

    return `<section class="itinerario-col">
      <header class="itinerario-col-header">
        <h4>${escapeHtml(group.itin)}</h4>
        <span class="itinerario-col-count">${group.items.length} veh</span>
      </header>
      <div class="itinerario-col-body">${cards}</div>
    </section>`;
  }).join("");
}

function fitMapaToMarkers(){
  const map = ensureMapaLeaflet();
  if (!map) return;
  const points = [];
  // Ajustar a las posiciones Sonar (llegadas_104 desconectada).
  if (sonarLocationsLayer) {
    sonarLocationsLayer.eachLayer((marker) => {
      if (marker?.getLatLng) points.push(marker.getLatLng());
    });
  }
  if (!points.length) return;
  const bounds = L.latLngBounds(points);
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
}

// Pantalla completa del mapa (estilo YouTube): el contenedor ocupa toda la
// pantalla y se navega libremente. Se sale con Esc o pulsando de nuevo.
function toggleMapaFullscreen(){
  const el = mapaVehiculosContainer;
  if (!el) return;
  const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fsEl) {
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) { try { req.call(el); } catch (_) {} }
  } else {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) { try { exit.call(document); } catch (_) {} }
  }
}

function handleMapaFullscreenChange(){
  const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
  const isFs = !!fsEl;
  if (btnFullscreenMapa) {
    btnFullscreenMapa.textContent = isFs ? "⛶ Salir de pantalla completa" : "⛶ Pantalla completa";
  }
  // Leaflet necesita recalcular su tamano al cambiar de dimensiones.
  if (mapaLeaflet) setTimeout(() => mapaLeaflet.invalidateSize(), 200);
}

/* ============ Mapa flotante (picture-in-picture) ============ */
let mapaFloating = false;
let mapaFloatingHomeParent = null;   // donde vive el contenedor normalmente
let mapaFloatingHomeNext = null;     // hermano siguiente, para restaurar la posicion
let mapaFloatingResizeObs = null;

function openMapaFloating(){
  if (mapaFloating || !mapaVehiculosContainer || !mapaFloatingBody || !mapaFloatingPanel) return;
  ensureMapaLeaflet();
  // Recordar su lugar original para devolverlo luego.
  mapaFloatingHomeParent = mapaVehiculosContainer.parentNode;
  mapaFloatingHomeNext = mapaVehiculosContainer.nextSibling;
  mapaFloatingBody.appendChild(mapaVehiculosContainer);
  mapaVehiculosContainer.classList.add("is-floating");
  mapaFloatingPanel.classList.remove("hidden");
  mapaFloating = true;
  if (btnFloatingMapa) btnFloatingMapa.textContent = "🗖 Anclar mapa";
  // Recalcular tamano y observar cambios de tamano de la ventanita.
  setTimeout(() => { if (mapaLeaflet) mapaLeaflet.invalidateSize(); }, 150);
  if (typeof ResizeObserver !== "undefined" && !mapaFloatingResizeObs) {
    mapaFloatingResizeObs = new ResizeObserver(() => {
      if (mapaLeaflet) mapaLeaflet.invalidateSize();
    });
    mapaFloatingResizeObs.observe(mapaFloatingPanel);
  }
}

function closeMapaFloating(){
  if (!mapaFloating || !mapaVehiculosContainer) return;
  // Devolver el contenedor a su lugar original en la pestana.
  if (mapaFloatingHomeParent) {
    if (mapaFloatingHomeNext && mapaFloatingHomeNext.parentNode === mapaFloatingHomeParent) {
      mapaFloatingHomeParent.insertBefore(mapaVehiculosContainer, mapaFloatingHomeNext);
    } else {
      mapaFloatingHomeParent.appendChild(mapaVehiculosContainer);
    }
  }
  mapaVehiculosContainer.classList.remove("is-floating");
  if (mapaFloatingPanel) mapaFloatingPanel.classList.add("hidden");
  mapaFloating = false;
  if (btnFloatingMapa) btnFloatingMapa.textContent = "🗖 Flotante";
  setTimeout(() => { if (mapaLeaflet) mapaLeaflet.invalidateSize(); }, 150);
}

function toggleMapaFloating(){
  if (mapaFloating) closeMapaFloating();
  else openMapaFloating();
}

// Arrastrar la ventana flotante por su encabezado.
function initMapaFloatingDrag(){
  if (!mapaFloatingHeader || !mapaFloatingPanel) return;
  let dragging = false, offX = 0, offY = 0;
  mapaFloatingHeader.addEventListener("pointerdown", (e) => {
    // No arrastrar si se hizo clic en un boton del encabezado.
    if (e.target?.closest?.("button")) return;
    dragging = true;
    const rect = mapaFloatingPanel.getBoundingClientRect();
    offX = e.clientX - rect.left;
    offY = e.clientY - rect.top;
    mapaFloatingPanel.style.right = "auto";
    mapaFloatingPanel.style.bottom = "auto";
    mapaFloatingHeader.setPointerCapture?.(e.pointerId);
  });
  mapaFloatingHeader.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const maxL = window.innerWidth - 80;
    const maxT = window.innerHeight - 40;
    const left = Math.max(0, Math.min(maxL, e.clientX - offX));
    const top = Math.max(0, Math.min(maxT, e.clientY - offY));
    mapaFloatingPanel.style.left = `${left}px`;
    mapaFloatingPanel.style.top = `${top}px`;
  });
  const stop = () => { dragging = false; };
  mapaFloatingHeader.addEventListener("pointerup", stop);
  mapaFloatingHeader.addEventListener("pointercancel", stop);
}

async function loadMapaVehiculos(){
  if (!currentUserId) return;
  const setStatus = (txt) => {
    if (mapaVehiculosStatus) mapaVehiculosStatus.textContent = txt;
    if (tablaLlegadasStatus) tablaLlegadasStatus.textContent = txt;
  };
  setStatus("Consultando Supabase...");
  if (btnRefreshMapaVehiculos) btnRefreshMapaVehiculos.disabled = true;
  if (btnRefreshTablaLlegadas) btnRefreshTablaLlegadas.disabled = true;
  try {
    const { data, error } = await planillaSupabaseClient
      .from(MAPA_VEHICULOS_TABLE)
      .select("vehicle_id,interno,itinerario,posicion,hora_llegada,base,driver_id,distancia_m,listo,ubicacion,updated_at,lat,lon")
      .order("hora_llegada", { ascending: false })
      .limit(500);
    if (error) throw error;
    mapaVehiculosRows = Array.isArray(data) ? data : [];
    mapaVehiculosLastLoadedAt = Date.now();
    renderLlegadasVehiculosViews();
    // Realtime de llegadas_104 desactivado a proposito (no se necesita):
    // el mapa se mantiene al dia con el auto-refresco cada 30s (polling).
    ensureMapaPolling();
    ensureMapaVisibilityListener();
    const setRtLabel = (el) => {
      if (!el) return;
      el.textContent = "Auto-refresco: 30s";
      el.style.color = "var(--fg-soft)";
    };
    setRtLabel(mapaVehiculosRealtime);
    setRtLabel(tablaLlegadasRealtime);
    const stamp = horaCO(new Date());
    setStatus(`Actualizado ${stamp} · ${mapaVehiculosRows.length} registros`);
  } catch (err) {
    console.error(`[${MAPA_VEHICULOS_TABLE}] consulta fallo:`, err);
    setStatus(`Error: ${err?.message || "fallo"}`);
    showToast(`No se pudo cargar ${MAPA_VEHICULOS_TABLE}: ${err?.message || "fallo"}`, "err");
  } finally {
    if (btnRefreshMapaVehiculos) btnRefreshMapaVehiculos.disabled = false;
    if (btnRefreshTablaLlegadas) btnRefreshTablaLlegadas.disabled = false;
  }
}

function applyRealtimeChangeToMapa(payload){
  if (!payload) return;
  const eventType = payload.eventType || payload.type;
  const newRow = payload.new || null;
  const oldRow = payload.old || null;
  const target = newRow || oldRow;
  if (!target) return;
  const key = getMapaRowKey(target);
  if (!key) return;
  if (eventType === "DELETE") {
    mapaVehiculosRows = mapaVehiculosRows.filter(r => getMapaRowKey(r) !== key);
  } else {
    const idx = mapaVehiculosRows.findIndex(r => getMapaRowKey(r) === key);
    if (idx >= 0) {
      mapaVehiculosRows[idx] = { ...mapaVehiculosRows[idx], ...newRow };
    } else if (newRow) {
      mapaVehiculosRows.unshift(newRow);
    }
  }
  renderLlegadasVehiculosViews();
}

function scheduleMapaRealtimeRetry(){
  if (mapaRealtimeRetryTimer) return;
  const delay = mapaRealtimeRetryDelay;
  mapaRealtimeRetryDelay = Math.min(mapaRealtimeRetryDelay * 2, MAPA_REALTIME_RETRY_MAX_MS);
  mapaRealtimeRetryTimer = setTimeout(() => {
    mapaRealtimeRetryTimer = null;
    ensureMapaRealtime();
  }, delay);
}

function ensureMapaRealtime(){
  if (mapaRealtimeChannel) return;
  if (!planillaSupabaseClient?.channel) return;
  if (mapaVehiculosRealtime) mapaVehiculosRealtime.textContent = "Realtime: conectando...";
  mapaRealtimeChannel = planillaSupabaseClient
    .channel(`${MAPA_VEHICULOS_TABLE}_live`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: MAPA_VEHICULOS_TABLE },
      (payload) => {
        applyRealtimeChangeToMapa(payload);
      }
    )
    .subscribe((status) => {
      console.info("[realtime] llegadas_104 status:", status);
      const setLabel = (el, txt, color) => {
        if (!el) return;
        el.textContent = txt;
        el.style.color = color;
      };
      let txt = `Realtime llegadas: ${String(status || "").toLowerCase()}`;
      let color = "var(--fg-soft)";
      if (status === "SUBSCRIBED") {
        txt = "Realtime llegadas: activo";
        color = "var(--ok)";
        mapaRealtimeRetryDelay = 1000;
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        color = "var(--err)";
        try { planillaSupabaseClient.removeChannel?.(mapaRealtimeChannel); } catch (_) {}
        mapaRealtimeChannel = null;
        scheduleMapaRealtimeRetry();
        loadMapaVehiculos();
      }
      setLabel(mapaVehiculosRealtime, txt, color);
      setLabel(tablaLlegadasRealtime, txt, color);
    });
}

function ensureMapaPolling(){
  if (mapaPollingTimer) return;
  mapaPollingTimer = setInterval(() => {
    if (document.hidden) return;
    if (!currentUserId) return;
    if (!sonarLocationsVisible) return;
    // Solo consumir egress si el usuario realmente está viendo el mapa
    // (pestaña del mapa activa o mapa flotante abierto). En otras pestañas no refresca.
    const viendoMapa = getActiveTabId() === "mapa-vehiculos" || mapaFloating;
    if (!viendoMapa) return;
    loadSonarFleetLocations();
    // Refrescar el cruce de despachos activos si ya está viejo, para que un carro
    // recién despachado deje de verse morado sin tener que recargar la app.
    if (!mapaActivosLoadedAt || (Date.now() - mapaActivosLoadedAt) > MAPA_ACTIVOS_STALE_MS) {
      loadMapaDespachosActivos().then(() => renderSonarFleetMarkers());
    }
  }, MAPA_POLLING_INTERVAL_MS);
}

function ensureMapaVisibilityListener(){
  if (mapaVisibilityListenerAttached) return;
  mapaVisibilityListenerAttached = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    if (!currentUserId) return;
    const stale = !sonarLocationsLastLoadedAt
      || (Date.now() - sonarLocationsLastLoadedAt) > MAPA_VISIBILITY_STALE_MS;
    if (stale && sonarLocationsVisible) {
      loadSonarFleetLocations();
      loadMapaDespachosActivos().then(() => renderSonarFleetMarkers());
    }
  });
}

// ===== Aviones aterrizados (capa visual sobre el aeropuerto) =====
// Los vuelos que ya aterrizaron aparecen como aviones sobre la pista y se van
// desvaneciendo con las horas hasta desaparecer (efecto de "cambio por las horas").
const AVION_FADE_MIN = 150;                 // 2h30m: al cumplirse, el avión aterrizado desaparece
const MDE_AIRPORT = [6.1645, -75.4231];     // pista/terminal JMC (Rionegro)
const AVION_RUTA_WINDOW_MIN = 60;           // se muestran "en ruta" desde 60 min antes de aterrizar
const AVION_RUTA_MAX_DEG = 0.16;            // qué tan lejos del aeropuerto arrancan (≈17 km en el mapa)

// Coordenadas (aprox. del aeropuerto de origen) por nombre de ciudad, para simular
// desde qué dirección se aproxima el vuelo. Debe coincidir con el nombre que guarda
// la función vuelos-mde (mapa CIUDADES).
const ORIGIN_COORDS = {
  "Bogotá": [4.7016, -74.1469], "Cali": [3.5432, -76.3816], "Cartagena": [10.4424, -75.513],
  "Barranquilla": [10.8896, -74.7808], "Santa Marta": [11.1196, -74.2306], "Bucaramanga": [7.1265, -73.1848],
  "Cúcuta": [7.9275, -72.5115], "Pereira": [4.8127, -75.7395], "Armenia": [4.4528, -75.7664],
  "Montería": [8.8237, -75.8258], "San Andrés": [12.5836, -81.7112], "Riohacha": [11.5262, -72.926],
  "Pasto": [1.3964, -77.2915], "Medellín (Olaya)": [6.2196, -75.5906], "Apartadó": [7.8119, -76.7164],
  "Neiva": [2.95, -75.2939], "Villavicencio": [4.1678, -73.6138], "Ibagué": [4.4216, -75.1333],
  "Panamá": [9.0714, -79.3835], "Panamá Pacífico": [8.9739, -79.5556], "Guatemala": [14.5833, -90.5275],
  "San José CR": [9.9939, -84.2088], "Santo Domingo": [18.4297, -69.6689], "Punta Cana": [18.5674, -68.3634],
  "San Juan PR": [18.4394, -66.0018], "Montego Bay": [18.5037, -77.9134], "Aruba": [12.5014, -70.0152],
  "Curazao": [12.1889, -68.9598], "Miami": [25.7959, -80.287], "Fort Lauderdale": [26.0742, -80.1506],
  "Orlando": [28.4312, -81.3081], "Nueva York (JFK)": [40.6413, -73.7781], "Houston": [29.9902, -95.3368],
  "Ciudad de México": [19.4363, -99.0721], "Cancún": [21.0365, -86.877], "Los Ángeles": [33.9416, -118.4085],
  "Lima": [-12.0219, -77.1143], "Quito": [-0.1292, -78.3575], "Santiago": [-33.393, -70.7858],
  "Buenos Aires": [-34.8222, -58.5358], "Guayaquil": [-2.1574, -79.8836], "São Paulo": [-23.4356, -46.4731],
  "Madrid": [40.4936, -3.5668], "Barcelona": [41.2974, 2.0833], "París (CDG)": [49.0097, 2.5479],
};

// Prefijo de aerolínea: ICAO (que usa AeroAPI, ej. AVA) → IATA (que usa Airplan, ej. AV).
const AIRLINE_ICAO_IATA = {
  AVA: "AV", ARE: "4C", LAN: "LA", LPE: "LA", TAM: "JJ", RPB: "P5", CMP: "CM",
  EFY: "EF", NSE: "9R", AAL: "AA", DAL: "DL", UAL: "UA", GLO: "G3", AZU: "AD",
  ACA: "AC", IBE: "IB", ELY: "LY", AFR: "AF", KLM: "KL", TAP: "TP", DWI: "WD",
  JES: "J7", JZR: "J9", SKU: "H2", VOI: "Y4", AMX: "AM", CUB: "CU",
};

// Cruza un avión REAL (AeroAPI) con la llegada PROGRAMADA de Airplan (vuelos_mde).
// Empareja por aerolínea (ICAO→IATA) + número de vuelo. Devuelve la llegada o null.
function cruzarVueloReal(f){
  if (String(f.destination || "") !== "SKRG") return null; // solo llegadas a MDE
  const ident = String(f.ident || "").toUpperCase();
  const m = ident.match(/^([A-Z]{2,3})(\d+)$/);
  if (!m) return null;
  const iata = AIRLINE_ICAO_IATA[m[1]] || null;
  const num = m[2];
  const cand = iata ? (iata + num) : null;
  return avionesArrivals.find(v => {
    const vu = String(v.vuelo || "").toUpperCase();
    if (cand && vu === cand) return true;
    return num.length >= 3 && vu.endsWith(num); // respaldo: mismo número final
  }) || null;
}

// SVG de avión apuntando al NORTE (arriba); se rota luego según el rumbo.
function avionSvg(rotDeg, px, color){
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" style="transform:rotate(${rotDeg.toFixed(0)}deg);display:block">
    <path fill="${color}" stroke="#fff" stroke-width="0.6" d="M12 1.5l1.4 6.2 8.1 4.6v2l-8-2.4 0.4 5.6 2.7 1.9v1.4L12 20.6l-4.6 0.2v-1.4l2.7-1.9 0.4-5.6-8 2.4v-2l8.1-4.6z"/>
  </svg>`;
}
let avionesLayer = null;
let avionesArrivals = [];
let avionesLastLoad = null;
let avionesTimer = null;
let avionesVisible = true;
let avionHoraFiltro = null; // null = en vivo; 0..23 = revisar aterrizajes de esa hora
let avionesReales = [];     // posiciones REALES (AeroAPI) de aviones en el aire cerca de MDE
let avionRealLastPoll = null;
let avionRealConsultas = null; // consultas gastadas hoy (informativo)
const AVION_REAL_URL = `${PLANILLA_SUPABASE_URL}/functions/v1/aeroapi-mde`;
// CANDADO DURO: rastreo real por AeroAPI DESCONECTADO (no se necesita). Con esto
// nunca se llama a FlightAware → cero gasto. Solo queda la simulación gratis.
const AVION_REAL_HABILITADO = false;
// Rastreo real ON/OFF (se recuerda en el navegador). OFF = no consulta AeroAPI, cero gasto.
let avionRealActivo = (() => { try { return (localStorage.getItem("avion_real_activo") ?? "1") === "1"; } catch (_) { return true; } })();

function actualizarBtnRealQuery(){
  const btn = document.getElementById("btnToggleRealQuery");
  if (!btn) return;
  const cons = avionRealConsultas != null ? ` (${avionRealConsultas} hoy)` : "";
  btn.textContent = `🛰️ Rastreo real: ${avionRealActivo ? "ON" : "OFF"}${avionRealActivo ? cons : ""}`;
  btn.classList.toggle("btn-primary", avionRealActivo);
  btn.classList.toggle("btn-ghost", !avionRealActivo);
}

function toggleRealQuery(){
  avionRealActivo = !avionRealActivo;
  try { localStorage.setItem("avion_real_activo", avionRealActivo ? "1" : "0"); } catch (_) {}
  actualizarBtnRealQuery();
  if (!avionRealActivo) {
    avionesReales = [];
    renderAvionesAterrizados();
    if (typeof showToast === "function") showToast("Rastreo real (FlightAware) desactivado. No consumirá consultas.", "ok");
  } else if (typeof showToast === "function") {
    showToast("Rastreo real activado (solo consulta en aproximación final).", "warn");
  }
}

// Hora de aterrizaje (0..23) según la hora Colombia guardada en la llegada.
function avionHoraDe(v){
  const h = parseInt(String(v?.hora || "").slice(0, 2), 10);
  return Number.isFinite(h) ? h : null;
}

// Llena el desplegable con las horas que tienen aterrizajes hoy (con su conteo).
function refreshAvionHoraSelect(){
  const sel = document.getElementById("avionHoraSel");
  if (!sel) return;
  const porHora = new Map();
  avionesArrivals.forEach(v => {
    const h = avionHoraDe(v);
    if (h == null) return;
    porHora.set(h, (porHora.get(h) || 0) + 1);
  });
  const horas = [...porHora.keys()].sort((a, b) => a - b);
  const prev = String(avionHoraFiltro == null ? "" : avionHoraFiltro);
  sel.innerHTML = `<option value="">Aterrizajes: en vivo</option>` +
    horas.map(h => `<option value="${h}">${String(h).padStart(2, "0")}:00 — ${porHora.get(h)} aterrizaje(s)</option>`).join("");
  sel.value = prev; // conservar selección si sigue existiendo
  if (sel.value !== prev) avionHoraFiltro = null; // esa hora ya no tiene datos
}

// Minutos desde que aterrizó (usa operation_time = hora de llegada).
function avionMinDesdeAterrizaje(v){
  const t = v?.operation_time ? new Date(v.operation_time).getTime() : NaN;
  if (!Number.isFinite(t)) return null;
  return (Date.now() - t) / 60000;
}
// ¿El vuelo ya aterrizó? (estado "Aterrizó" o ya pasó su hora de llegada).
function avionYaAterrizo(v, age){
  const e = String(v?.estado || "").toLowerCase();
  if (e.includes("aterr")) return true;
  return age != null && age >= 0;
}

async function loadAvionesAterrizados(){
  if (!currentUserId) return;
  try {
    const hoy = fechaBogotaISO();
    const { data, error } = await planillaSupabaseClient
      .from("vuelos_mde")
      .select("vuelo,aerolinea,ciudad,hora,operation_time,estado,estado_code")
      .eq("tipo", "llegada").eq("fecha", hoy).limit(1000);
    if (error) throw error;
    avionesArrivals = Array.isArray(data) ? data : [];
    avionesLastLoad = Date.now();
    refreshAvionHoraSelect();
    renderAvionesAterrizados();
  } catch (err) {
    console.warn("[aviones] no se pudieron cargar llegadas:", err);
  }
}

// Cuadrícula compacta sobre la plataforma del aeropuerto (aviones "estacionados").
const AVION_GRID = { lat0: 6.16590, lon0: -75.42405, dLat: -0.00050, dLon: 0.00055, cols: 6 };

function avionPopup(v, edad){
  const hhmm = String(v.hora || "").slice(0, 5);
  return `<div style="font-family:Inter,system-ui,sans-serif;font-size:13px">
    <div style="font-weight:800">✈️ ${escapeHtml(v.vuelo || "")} · ${escapeHtml(v.aerolinea || "")}</div>
    <div>Origen: <b>${escapeHtml(v.ciudad || "-")}</b></div>
    <div>Llegada: <b>${escapeHtml(hhmm)}</b> · ${escapeHtml(v.estado || "")}</div>
    <div style="color:var(--fg-soft);font-size:11px">${edad}</div>
  </div>`;
}

// ¿Hay un vuelo en APROXIMACIÓN FINAL (llega en <=15 min) o recién aterrizado (<=5 min)?
// Solo entonces se gasta AeroAPI (posición real justo antes de despachar).
function hayVueloEntrando(){
  return avionesArrivals.some(v => {
    const age = avionMinDesdeAterrizaje(v); // >0 ya aterrizó, <0 aún viene
    return age != null && age >= -15 && age <= 5;
  });
}

// Trae las posiciones REALES desde la Edge Function (que a su vez llama a AeroAPI
// con los candados de costo). Solo se invoca cuando hay vuelo entrando.
async function loadAvionesReales(){
  if (!AVION_REAL_HABILITADO) return; // desconectado: nunca consulta AeroAPI
  if (!currentUserId) return;
  avionRealLastPoll = Date.now();
  try {
    const resp = await fetch(AVION_REAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${PLANILLA_SUPABASE_ANON_KEY}` },
      body: "{}",
    });
    const d = await resp.json();
    avionesReales = Array.isArray(d?.flights) ? d.flights : [];
    if (typeof d?.consultas === "number") avionRealConsultas = d.consultas;
    actualizarBtnRealQuery();
    renderAvionesAterrizados();
  } catch (err) {
    console.warn("[aviones-reales] fallo:", err);
  }
}

function renderAvionesAterrizados(){
  const map = ensureMapaLeaflet();
  if (!map || typeof L === "undefined") return;
  if (!avionesLayer) avionesLayer = L.layerGroup().addTo(map);
  avionesLayer.clearLayers();
  if (!avionesVisible) return;

  const conEdad = avionesArrivals.map(v => ({ v, age: avionMinDesdeAterrizaje(v) }));

  // MODO "POR HORA": revisar los aterrizajes de una hora específica del día.
  // Se muestran todos los de esa hora en la plataforma, a plena opacidad y con etiqueta.
  if (avionHoraFiltro != null) {
    const deLaHora = avionesArrivals
      .filter(v => avionHoraDe(v) === avionHoraFiltro)
      .sort((a, b) => String(a.hora || "").localeCompare(String(b.hora || "")));
    deLaHora.forEach((v, i) => {
      const col = i % AVION_GRID.cols, row = Math.floor(i / AVION_GRID.cols);
      const lat = AVION_GRID.lat0 + row * AVION_GRID.dLat;
      const lon = AVION_GRID.lon0 + col * AVION_GRID.dLon;
      const html = `<div style="transform:translate(-50%,-50%);text-align:center">
        <div style="font-size:18px;line-height:1">🛬</div>
        <div style="font-size:9px;font-weight:800;color:#0f172a;background:rgba(255,255,255,.85);border-radius:3px;padding:0 2px;white-space:nowrap;margin-top:-1px">${escapeHtml(v.vuelo || "")}</div>
      </div>`;
      L.marker([lat, lon], { icon: L.divIcon({ html, className: "avion-aterrizado", iconSize: [0, 0] }), zIndexOffset: 500 })
        .bindPopup(avionPopup(v, `Aterrizaje ${String(v.hora || "").slice(0, 5)}`))
        .addTo(avionesLayer);
    });
    return;
  }

  // 1) EN EL AIRE: si tenemos posiciones REALES (AeroAPI), las usamos (mapa tipo
  //    FlightAware). Si no, caemos a la simulación desde el origen.
  if (avionesReales.length) {
    avionesReales.forEach(f => {
      if (!Number.isFinite(f.lat) || !Number.isFinite(f.lon)) return;
      if (String(f.destination || "") !== "SKRG") return; // SOLO los que LLEGAN a MDE
      const prog = cruzarVueloReal(f);              // llegada programada de Airplan (o null)
      const rot = Number(f.heading) || 0;
      // Etiqueta: si cruzó con Airplan, muestra el vuelo IATA + hora programada.
      const etq = prog ? `${prog.vuelo} · ${String(prog.hora || "").slice(0, 5)}` : f.ident;
      const label = etq
        ? `<div style="font-size:9px;font-weight:800;color:#065f46;background:rgba(255,255,255,.9);border-radius:3px;padding:0 2px;white-space:nowrap;margin-top:-2px">${escapeHtml(etq)}</div>`
        : "";
      const html = `<div style="transform:translate(-50%,-50%);text-align:center">${avionSvg(rot, 24, "#16a34a")}${label}</div>`;
      const altFt = (Number(f.altitude) || 0) * 100;
      // Cruce con lo programado.
      let progHtml = "";
      if (prog) {
        const age = avionMinDesdeAterrizaje(prog); // <0 aún viene
        const eta = age != null && age < 0 ? `llega en ${fmtDuracionMin(-age)}` : (age != null ? `hora prog. cumplida` : "");
        progHtml = `<div style="border-top:1px solid #e2e8f0;margin-top:5px;padding-top:5px">
          <div style="font-weight:800;color:#065f46">📋 Programado (Airplan)</div>
          <div>Vuelo <b>${escapeHtml(prog.vuelo || "")}</b> · ${escapeHtml(prog.aerolinea || "")}</div>
          <div>Origen: <b>${escapeHtml(prog.ciudad || "-")}</b></div>
          <div>Llega: <b>${escapeHtml(String(prog.hora || "").slice(0, 5))}</b> · ${escapeHtml(prog.estado || "")} ${eta ? `· ${eta}` : ""}</div>
          ${prog.asientos ? `<div>~<b>${prog.asientos}</b> asientos</div>` : ""}
        </div>`;
      }
      L.marker([f.lat, f.lon], { icon: L.divIcon({ html, className: "avion-real", iconSize: [0, 0] }), zIndexOffset: 700 })
        .bindPopup(`<div style="font-family:Inter,system-ui,sans-serif;font-size:13px">
          <div style="font-weight:800">✈️ ${escapeHtml(f.ident || "")}${f.aircraft_type ? ` · ${escapeHtml(f.aircraft_type)}` : ""}</div>
          <div>${escapeHtml(f.origin || "?")} → ${escapeHtml(f.destination || "?")}${f.es_mde ? " <b>(MDE)</b>" : ""}</div>
          <div>Altitud <b>${altFt.toLocaleString("es-CO")} ft</b> · Vel <b>${Number(f.groundspeed) || 0} kt</b> · Rumbo ${Number(f.heading) || 0}°</div>
          <div style="color:var(--fg-soft);font-size:11px">Posición real (FlightAware)</div>
          ${progHtml}
        </div>`)
        .addTo(avionesLayer);
    });
  } else {
  // 1b) SIMULACIÓN basada en Airplan: usa el ESTADO real del vuelo.
  //   ER (En ruta)   → volando ahora: se muestra aunque falte más de 1h.
  //   OT (A tiempo) / DL (Demorado) → solo cuando se acerca la hora.
  //   LD (Aterrizó) / CN (Cancelado) → no se dibujan.
  const AVION_SIM_WINDOW = 60;   // min antes de la hora para OT/DL
  const APPROACH_MIN = 7;        // min finales: aproximación alineada a la pista
  conEdad
    .filter(x => {
      if (x.age == null || !ORIGIN_COORDS[x.v.ciudad]) return false;
      const ec = String(x.v.estado_code || "").toUpperCase();
      if (ec === "CN" || ec === "LD") return false;
      if (String(x.v.estado || "").toLowerCase().includes("aterr")) return false;
      const min = -x.age; // >0 aún viene, <0 ya pasó la hora
      if (ec === "ER") return min >= -8 && min <= 150;          // en ruta: ventana amplia
      return min >= -8 && min <= AVION_SIM_WINDOW;               // OT/DL: cerca de la hora
    })
    .forEach(x => {
      const ec = String(x.v.estado_code || "").toUpperCase();
      const minRem = Math.max(0, -x.age);              // minutos restantes (0 = en aproximación)
      const o = ORIGIN_COORDS[x.v.ciudad];
      let uLat = o[0] - MDE_AIRPORT[0], uLon = o[1] - MDE_AIRPORT[1];
      const len = Math.hypot(uLat, uLon) || 1;
      uLat /= len; uLon /= len;                        // vector unitario hacia el origen
      const distFinal = (APPROACH_MIN / 90) * AVION_RUTA_MAX_DEG; // distancia al empezar el final
      let lat, lon, rot;
      if (minRem > APPROACH_MIN) {
        // Crucero: sobre la línea al origen, escalado por el tiempo restante.
        const dist = Math.max(distFinal, Math.min(1, minRem / 90) * AVION_RUTA_MAX_DEG);
        lat = MDE_AIRPORT[0] + uLat * dist;
        lon = MDE_AIRPORT[1] + uLon * dist;
        rot = (Math.atan2(-uLon, -uLat) * 180 / Math.PI + 360) % 360; // apunta a la pista
      } else {
        // Aproximación final: alineado al eje de la pista (~N-S), por el lado del origen.
        const desdeNorte = o[0] > MDE_AIRPORT[0];
        const along = (minRem / APPROACH_MIN) * distFinal;
        lat = MDE_AIRPORT[0] + (desdeNorte ? 1 : -1) * along;
        lon = MDE_AIRPORT[1];
        rot = desdeNorte ? 180 : 0;                    // encara la pista
      }
      // Color e info por estado.
      const color = ec === "ER" ? "#16a34a" : (ec === "DL" ? "#ea580c" : "#2563eb");
      const estadoTxt = ec === "ER" ? "En ruta" : (ec === "DL" ? "Demorado" : "A tiempo");
      const size = 20 + Math.round((1 - Math.min(1, minRem / 90)) * 8); // crece al acercarse

      L.polyline([[lat, lon], MDE_AIRPORT], { color, weight: 1.5, opacity: 0.35, dashArray: "4 6" }).addTo(avionesLayer);

      const etq = `${x.v.vuelo || ""} · ${String(x.v.hora || "").slice(0, 5)}`;
      const html = `<div style="transform:translate(-50%,-50%);text-align:center">
        ${avionSvg(rot, size, color)}
        <div style="font-size:9px;font-weight:800;color:#0f172a;background:rgba(255,255,255,.88);border-radius:3px;padding:0 2px;white-space:nowrap;margin-top:-2px">${escapeHtml(etq)}</div>
      </div>`;
      const etaTxt = minRem > 0 ? `aterriza en ${fmtDuracionMin(minRem)}` : "en aproximación final";
      L.marker([lat, lon], { icon: L.divIcon({ html, className: "avion-ruta", iconSize: [0, 0] }), zIndexOffset: 600 })
        .bindPopup(avionPopup(x.v, `${estadoTxt} · ${etaTxt}`))
        .addTo(avionesLayer);
    });
  } // fin simulación

  // 2) ATERRIZADOS: cuadrícula sobre la plataforma. Desactivada en modo EN VIVO
  //    (se veía amontonada y ya tenemos los aviones reales). Se sigue mostrando
  //    solo al revisar por hora (bloque de arriba con avionHoraFiltro).
  const MOSTRAR_ATERRIZADOS_VIVO = false;
  const landed = !MOSTRAR_ATERRIZADOS_VIVO ? [] : conEdad
    .filter(x => avionYaAterrizo(x.v, x.age) && x.age != null && x.age >= -5 && x.age <= AVION_FADE_MIN)
    .sort((a, b) => a.age - b.age);
  landed.forEach((x, i) => {
    const ageClamp = Math.max(0, x.age);
    const op = Math.max(0.15, 1 - ageClamp / AVION_FADE_MIN);
    const col = i % AVION_GRID.cols, row = Math.floor(i / AVION_GRID.cols);
    const lat = AVION_GRID.lat0 + row * AVION_GRID.dLat;
    const lon = AVION_GRID.lon0 + col * AVION_GRID.dLon;
    const recien = ageClamp <= 20;
    const label = recien
      ? `<div style="font-size:9px;font-weight:800;color:#0f172a;background:rgba(255,255,255,.8);border-radius:3px;padding:0 2px;white-space:nowrap;margin-top:-1px">${escapeHtml(x.v.vuelo || "")}</div>`
      : "";
    const html = `<div style="opacity:${op.toFixed(2)};transform:translate(-50%,-50%);text-align:center;transition:opacity .8s">
      <div style="font-size:18px;line-height:1;${recien ? "filter:drop-shadow(0 0 3px #16a34a)" : ""}">🛬</div>${label}
    </div>`;
    L.marker([lat, lon], { icon: L.divIcon({ html, className: "avion-aterrizado", iconSize: [0, 0] }), zIndexOffset: 500 })
      .bindPopup(avionPopup(x.v, `Aterrizó hace ${fmtDuracionMin(ageClamp)}`))
      .addTo(avionesLayer);
  });
}

function ensureAvionesPolling(){
  if (avionesTimer) return;
  avionesTimer = setInterval(() => {
    if (document.hidden || !currentUserId) return;
    const viendoMapa = getActiveTabId() === "mapa-vehiculos" || mapaFloating;
    if (!viendoMapa || !avionesVisible) return;
    // Recarga datos cada ~3 min; el resto de ciclos re-renderiza (mueve los "en ruta"
    // y aplica el desvanecimiento) — cada 15 s para que el vuelo se vea fluido.
    if (!avionesLastLoad || (Date.now() - avionesLastLoad) > 180000) loadAvionesAterrizados();
    else renderAvionesAterrizados();

    // Posiciones REALES (AeroAPI): SOLO si el rastreo real está activo (botón), hay
    // vuelo en aproximación final y estás viendo el mapa. Servidor con tope + throttle.
    const hayLlegadaReal = avionesReales.some(f => String(f.destination || "") === "SKRG");
    if (AVION_REAL_HABILITADO && avionRealActivo && avionHoraFiltro == null && (hayVueloEntrando() || hayLlegadaReal)) {
      if (!avionRealLastPoll || (Date.now() - avionRealLastPoll) > 60000) loadAvionesReales();
    } else if (avionesReales.length && (!avionRealActivo || (!hayVueloEntrando() && !hayLlegadaReal))) {
      avionesReales = []; // OFF o sin llegadas → volver a simulación
    }
  }, 15000);
}

function toggleAviones(){
  avionesVisible = !avionesVisible;
  const btn = document.getElementById("btnToggleAviones");
  if (btn) {
    btn.textContent = `✈️ Aterrizajes: ${avionesVisible ? "ON" : "OFF"}`;
    btn.classList.toggle("btn-primary", avionesVisible);
    btn.classList.toggle("btn-ghost", !avionesVisible);
  }
  if (avionesVisible) { if (!avionesLastLoad || (Date.now() - avionesLastLoad) > 180000) loadAvionesAterrizados(); else renderAvionesAterrizados(); }
  else renderAvionesAterrizados();
}

function activateMapaVehiculosTab(){
  if (typeof L === "undefined") {
    if (mapaVehiculosStatus) mapaVehiculosStatus.textContent = "Leaflet no cargo (revisa conexion)";
    return;
  }
  ensureMapaLeaflet();
  setTimeout(() => {
    if (mapaLeaflet) {
      mapaLeaflet.invalidateSize();
      if (sonarLocationsLastLoadedAt) fitMapaToMarkers();
    }
  }, 150);
  // El mapa muestra las posiciones Sonar (llegadas_104 quedo desconectada).
  if (sonarLocationsVisible) {
    loadMapaDespachosActivos().then(() => renderSonarFleetMarkers());
    if (!historialDespachosLastLoadedAt) {
      loadDespachosRealizadosFromSupabase();
    }
    loadSonarFleetLocations();
  }
  loadGeocercas();
  loadItinerariosDireccion();
  loadVehiculosSonarFromSupabase().then(() => renderSonarFleetMarkers()).catch(() => {});
  ensureMapaPolling();
  ensureMapaVisibilityListener();
  // Aterrizajes: siempre activo al abrir el mapa.
  avionesVisible = true;
  const btnAv = document.getElementById("btnToggleAviones");
  if (btnAv) { btnAv.textContent = "✈️ Aterrizajes: ON"; btnAv.classList.add("btn-primary"); btnAv.classList.remove("btn-ghost"); }
  actualizarBtnRealQuery(); // refleja el estado recordado del rastreo real
  loadAvionesAterrizados();
  ensureAvionesPolling();
}

function handleHistorialDespachosChipClick(ev){
  const chip = ev.target?.closest?.(".chip");
  if (!chip || !historialDespachosItinChips?.contains(chip)) return;
  historialDespachosItinFilter = String(chip.getAttribute("data-itin") || "");
  renderHistorialDespachosTab();
}

async function fetchVehiculoSonarByInterno(internoValue){
  const interno = String(internoValue || "").trim();
  if (!interno || !currentUserId) return null;
  try {
    const numericInterno = Number(interno);
    let query = planillaSupabaseClient
      .from(VEHICULOS_SONAR_TABLE_NAME)
      .select("*")
      .limit(5);
    query = Number.isFinite(numericInterno) && String(numericInterno) === interno
      ? query.eq("INTERNO", numericInterno)
      : query.eq("INTERNO", interno);
    const { data, error } = await query;
    if (error) throw error;
    return mergeVehiculoSonarRows(data);
  } catch (error) {
    console.error(`Error consultando ${VEHICULOS_SONAR_TABLE_NAME} por INTERNO:`, error);
    return null;
  }
}

function getManualDispatchVehicleRows(){
  const sonarRows = Array.isArray(vehiculosSonarRows) ? vehiculosSonarRows : [];
  if (sonarRows.length > 0) {
    const seen = new Set();
    const unique = [];
    sonarRows
      .slice()
      .sort((a, b) => String(a.interno).localeCompare(String(b.interno), "es", { numeric: true }))
      .forEach(row => {
        const interno = String(row?.interno || "").trim();
        if (!interno || seen.has(interno)) return;
        seen.add(interno);
        unique.push(row);
      });
    return unique;
  }

  const rows = Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [];
  const sorted = rows
    .filter(row => !!String(row?.interno || "").trim())
    .slice()
    .sort(comparePlanillaRowsByCurrentDateTime);
  const seen = new Set();
  const unique = [];
  sorted.forEach(row => {
    const interno = String(row?.interno || "").trim();
    if (!interno || seen.has(interno)) return;
    seen.add(interno);
    unique.push(row);
  });
  return unique;
}

function fillManualDispatchInternoList(){
  if (!manualDispatchInternoList) return;
  const rows = getManualDispatchVehicleRows();
  manualDispatchInternoList.innerHTML = rows.map(row => {
    const interno = String(row?.interno || "").trim();
    const base = formatBaseLabel(getBaseCanonical(row?.base || "") || getManualDispatchDefaultBase());
    const mid = String(row?.mid || "").trim();
    const placa = String(row?.placa || row?.Placa || "").trim();
    const labelParts = [];
    if (placa) labelParts.push(`Placa ${placa}`);
    if (base) labelParts.push(base);
    labelParts.push(`MID ${mid || "-"}`);
    return `<option value="${escapeHtml(interno)}" label="${escapeHtml(labelParts.join(" | "))}"></option>`;
  }).join("");
}

function findManualDispatchVehicleByInterno(internoValue){
  const interno = String(internoValue || "").trim();
  if (!interno) return null;
  const rows = getManualDispatchVehicleRows();
  return rows.find(row => String(row?.interno || "").trim() === interno) || null;
}

function fillManualDispatchConductorList(baseValue){
  if (!manualDispatchConductorList) return;
  const baseCanonical = getBaseCanonical(baseValue || "");
  const enabled = (driversCatalogRows || [])
    .filter(row => String(row?.status || "").trim().toUpperCase() === "ENABLED")
    .filter(row => !baseCanonical || getCsvDriverBase(row) === baseCanonical);
  manualDispatchConductorList.innerHTML = enabled.map(row => {
    const nombre = String(row?.nombre || "").trim();
    const drId = String(row?.dr_id || "").trim();
    const value = `${nombre} | ${drId}`;
    return `<option value="${escapeHtml(value)}"></option>`;
  }).join("");
}

function applyManualDispatchConductorSelection(){
  if (!manualDispatchDriverId) return;
  const conductor = String(manualDispatchConductorName?.value || "").trim();
  const base = String(manualDispatchBase?.value || "").trim();
  const fromPipe = conductor.includes("|")
    ? String(conductor.split("|").pop() || "").trim()
    : "";
  const drvId = fromPipe || findDriverIdByName(conductor, base);
  manualDispatchDriverId.value = drvId || "";
}

function applyManualDispatchVehicleRow(row){
  if (!row) {
    if (manualDispatchBase) manualDispatchBase.value = "";
    if (manualDispatchMid) manualDispatchMid.value = "";
    fillManualDispatchConductorList("");
    applyManualDispatchConductorSelection();
    return;
  }
  const base = getBaseCanonical(row?.base || "") || getManualDispatchDefaultBase();
  const mid = String(row?.mid || "").trim();
  if (manualDispatchBase) manualDispatchBase.value = base;
  if (manualDispatchMid) manualDispatchMid.value = mid;
  fillManualDispatchConductorList(base);
  const conductorEnFila = String(row?.conductor || "").trim();
  if (conductorEnFila && manualDispatchConductorName && !String(manualDispatchConductorName.value || "").trim()) {
    const baseCanonical = getBaseCanonical(base || "");
    const drvIdFromRow = findDriverIdByName(conductorEnFila, baseCanonical);
    manualDispatchConductorName.value = drvIdFromRow
      ? `${conductorEnFila} | ${drvIdFromRow}`
      : conductorEnFila;
  }
  applyManualDispatchConductorSelection();
}

async function applyManualDispatchVehicleSelection(){
  const internoValue = manualDispatchInterno?.value || "";
  const lookupSeq = ++manualDispatchVehicleLookupSeq;
  let row = findManualDispatchVehicleByInterno(internoValue);
  if (!row) {
    row = await fetchVehiculoSonarByInterno(internoValue);
    if (lookupSeq !== manualDispatchVehicleLookupSeq) return;
    if (row) fillManualDispatchInternoList();
  }
  if (lookupSeq !== manualDispatchVehicleLookupSeq) return;
  applyManualDispatchVehicleRow(row);
}

async function openManualDispatchModal(){
  if (!manualDispatchModal || !btnManualDispatchCancel || !btnManualDispatchConfirm) {
    return Promise.resolve({ confirmed: false });
  }
  await loadVehiculosSonarFromSupabase();
  fillManualDispatchInternoList();
  fillManualDispatchConductorList("");
  if (manualDispatchInterno) manualDispatchInterno.value = "";
  if (manualDispatchBase) manualDispatchBase.value = "";
  if (manualDispatchMid) manualDispatchMid.value = "";
  if (manualDispatchConductorName) manualDispatchConductorName.value = "";
  if (manualDispatchDriverId) manualDispatchDriverId.value = "";
  if (manualDispatchObs) manualDispatchObs.value = "";
  if (manualDispatchItinerarySelect) {
    manualDispatchItinerarySelect.innerHTML = buildItineraryOptionsHtml();
    manualDispatchItinerarySelect.value = "";
  }
  manualDispatchModal.classList.remove("hidden");
  setTimeout(() => manualDispatchInterno?.focus(), 10);
  return new Promise(resolve => {
    manualDispatchModalResolver = resolve;
  });
}

function applyAuthState(session){
  const loggedIn = !!session;
  authPanel.classList.toggle("hidden", loggedIn);
  appWrap.classList.toggle("hidden", !loggedIn);
  btnLogout.classList.toggle("hidden", !loggedIn);

  if(loggedIn){
    const user = session.user;
    currentUserId = user.id;
    currentUserEmail = user.email || "";
    loadOutOfListVehiclesLocal();
    authUserLabel.textContent = `Usuario: ${currentUserEmail || "sin correo"}`;
    setAuthStatus("Sesion iniciada.", "ok");
    const shouldInitialize = !appInitialized;
    if(shouldInitialize){
      appInitialized = true;
      initializeApp().catch((error) => {
        console.error("Error inicializando app:", error);
        showToast("No se pudo inicializar la app.", "err");
        appInitialized = false;
      });
    }
    // Vigilancia global de jornada máxima (se superpone en toda la app).
    if (typeof ensureAsisAlertaGlobal === "function") ensureAsisAlertaGlobal();
  }else{
    currentUserId = null;
    currentUserEmail = "";
    vehiculosSonarRows = [];
    vehiculosSonarLoadedOnce = false;
    vehiculosSonarLastLoadedAt = 0;
    authUserLabel.textContent = "No autenticado";
    setAuthStatus("Inicia sesion para continuar.", "warn");
    appInitialized = false;
    outOfListVehicles = [];
    rebuildOutOfListVehicleIndex();
    // Detener vigilancia global y quitar el flotante.
    if (asisAlertaGlobalTimer) { clearInterval(asisAlertaGlobalTimer); asisAlertaGlobalTimer = null; }
    const fb = document.getElementById("asisAlertaFlotante");
    if (fb) fb.remove();
  }
}

btnSignIn.onclick = async () => {
  const email = authEmail.value.trim();
  const password = authPassword.value;
  if(!email || !password){
    setAuthStatus("Escribe correo y contrasena.", "err");
    return;
  }
  setAuthStatus("Validando acceso...", "warn");
  const { error } = await authSupabaseClient.auth.signInWithPassword({ email, password });
  if(error){
    setAuthStatus(error.message, "err");
    return;
  }
  authPassword.value = "";
};

btnSignUp.onclick = async () => {
  if (!ALLOW_PUBLIC_SIGNUP) {
    setAuthStatus("Registro deshabilitado. Solicita tu usuario al administrador.", "warn");
    return;
  }
  const email = authEmail.value.trim();
  const password = authPassword.value;
  if(!email || !password){
    setAuthStatus("Escribe correo y contrasena.", "err");
    return;
  }
  setAuthStatus("Creando cuenta...", "warn");
  const { error } = await authSupabaseClient.auth.signUp({ email, password });
  if(error){
    setAuthStatus(error.message, "err");
    return;
  }
  setAuthStatus("Cuenta creada. Revisa tu correo si la confirmacion esta activa.", "ok");
  authPassword.value = "";
};

if (btnSignUp && !ALLOW_PUBLIC_SIGNUP) {
  btnSignUp.classList.add("hidden");
  btnSignUp.disabled = true;
}

btnLogout.onclick = async () => {
  const { error } = await authSupabaseClient.auth.signOut();
  if(error){
    setAuthStatus(error.message, "err");
  }
};

async function initAuth(){
  const { data, error } = await authSupabaseClient.auth.getSession();
  if(error){
    setAuthStatus(error.message, "err");
    applyAuthState(null);
  }else{
    applyAuthState(data.session);
  }
  authSupabaseClient.auth.onAuthStateChange((_event, session) => {
    applyAuthState(session);
  });
}

if (btnDispatchCancel) btnDispatchCancel.onclick = () => closeDispatchModal(false);
if (btnDispatchConfirm) btnDispatchConfirm.onclick = () => closeDispatchModal(true);
if (btnCancelDispatchCancel) btnCancelDispatchCancel.onclick = () => closeCancelDispatchModal(false);
if (btnCancelDispatchConfirm) btnCancelDispatchConfirm.onclick = () => closeCancelDispatchModal(true);
if (btnRemoveFromListCancel) btnRemoveFromListCancel.onclick = () => closeRemoveFromListModal(false);
if (btnRemoveFromListConfirm) btnRemoveFromListConfirm.onclick = () => closeRemoveFromListModal(true);
if (btnEditPlanillaCancel) btnEditPlanillaCancel.onclick = () => closeEditPlanillaModal(false);
if (btnEditPlanillaSave) btnEditPlanillaSave.onclick = () => closeEditPlanillaModal(true);
if (btnManualDispatchCancel) btnManualDispatchCancel.onclick = () => closeManualDispatchModal(false);
if (btnManualDispatchConfirm) btnManualDispatchConfirm.onclick = () => closeManualDispatchModal(true);
if (btnManualDispatch) btnManualDispatch.onclick = () => handleManualDispatch();
if (manualDispatchInterno) manualDispatchInterno.addEventListener("change", () => { applyManualDispatchVehicleSelection(); });
if (manualDispatchInterno) manualDispatchInterno.addEventListener("input", () => { applyManualDispatchVehicleSelection(); });
if (manualDispatchConductorName) manualDispatchConductorName.addEventListener("change", applyManualDispatchConductorSelection);
if (manualDispatchConductorName) manualDispatchConductorName.addEventListener("input", applyManualDispatchConductorSelection);
if (dispatchModal) {
  dispatchModal.addEventListener("click", (ev) => {
    if (ev.target === dispatchModal) closeDispatchModal(false);
  });
}
if (cancelDispatchModal) {
  cancelDispatchModal.addEventListener("click", (ev) => {
    if (ev.target === cancelDispatchModal) closeCancelDispatchModal(false);
  });
}
if (removeFromListModal) {
  removeFromListModal.addEventListener("click", (ev) => {
    if (ev.target === removeFromListModal) closeRemoveFromListModal(false);
  });
}
if (editPlanillaModal) {
  editPlanillaModal.addEventListener("click", (ev) => {
    if (ev.target === editPlanillaModal) closeEditPlanillaModal(false);
  });
}
if (manualDispatchModal) {
  manualDispatchModal.addEventListener("click", (ev) => {
    if (ev.target === manualDispatchModal) closeManualDispatchModal(false);
  });
}
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && dispatchModal && !dispatchModal.classList.contains("hidden")) {
    closeDispatchModal(false);
    return;
  }
  if (ev.key === "Enter" && dispatchModal && !dispatchModal.classList.contains("hidden")) {
    closeDispatchModal(true);
    return;
  }
  if (ev.key === "Escape" && cancelDispatchModal && !cancelDispatchModal.classList.contains("hidden")) {
    closeCancelDispatchModal(false);
    return;
  }
  if (ev.key === "Enter" && cancelDispatchModal && !cancelDispatchModal.classList.contains("hidden") && ev.ctrlKey) {
    closeCancelDispatchModal(true);
    return;
  }
  if (ev.key === "Escape" && removeFromListModal && !removeFromListModal.classList.contains("hidden")) {
    closeRemoveFromListModal(false);
    return;
  }
  if (ev.key === "Enter" && removeFromListModal && !removeFromListModal.classList.contains("hidden") && ev.ctrlKey) {
    closeRemoveFromListModal(true);
    return;
  }
  if (ev.key === "Escape" && editPlanillaModal && !editPlanillaModal.classList.contains("hidden")) {
    closeEditPlanillaModal(false);
    return;
  }
  if (ev.key === "Enter" && editPlanillaModal && !editPlanillaModal.classList.contains("hidden") && ev.ctrlKey) {
    closeEditPlanillaModal(true);
    return;
  }
  if (ev.key === "Escape" && manualDispatchModal && !manualDispatchModal.classList.contains("hidden")) {
    closeManualDispatchModal(false);
    return;
  }
  if (ev.key === "Enter" && manualDispatchModal && !manualDispatchModal.classList.contains("hidden")) {
    closeManualDispatchModal(true);
  }
});

/* ===================== DATA ===================== */
let rows = [];
let currentBase = "";
let driversByBase = {};     // { "2": ["NOMBRE", ...] }
let driversCatalogRows = []; // [{dr_id, cedula, fleet, nombre, status, email, celular, base}]
let assignedByBase = {};    // { "2": Set(["..."]) }
let basesCatalog = [];
let isLoadingDrivers = false;
let programacionesHistory = [];
let planillaAfiliadosRows = [];
let planillaAfiliadosLoading = false;
let planillaAfiliadosLoadedOnce = false;
let planillaLastLoadedAt = 0;
let planillaLastDeltaUpdatedAt = "";
let planillaDeltaCycles = 0;
let planillaRowsRevision = 0;
let planillaDispatchResolutionCache = {
  rowsRef: null,
  revision: -1,
  resolvedByKey: new Map()
};
let planillaAutoRefreshTimer = null;
let currentPlanillaTableName = PLANILLA_TABLE_NAME;
let aeropuertoSelectedItinerary = "";
let sanDiegoSelectedItinerary = "";
let nutibaraSelectedItinerary = "";
let lastAeropuertoRenderedRows = [];
let lastTerminalNorteRenderedRows = [];
let lastSanDiegoRenderedRows = [];
let lastNutibaraRenderedRows = [];
const dispatchingRowUiIds = new Set();
let outOfListVehicles = [];
let outOfListVehicleKeySet = new Set();
let operativoViewMode = "operativo";
const ARRIVALS_PANEL_TAB_IDS = ["llegadas-aeropuerto", "llegadas-terminalnorte", "llegadas-san-diego", "llegadas-nutibara", "no-despacho", "fuera-lista", "vehiculos-sonar", "asistencia-biometrica", "conductores-csv", "planilla-afiliados"];
const ARRIVALS_ONLY_APP = true;
const PLANILLA_REFRESH_MAX_AGE_MS = 60000;
const PLANILLA_AUTO_REFRESH_MS = 60000;
const PLANILLA_DELTA_SYNC_ENABLED = true;
const PLANILLA_FULL_SYNC_EVERY_DELTA_CYCLES = 20;
const PLANILLA_DELTA_LIMIT = 600;
const TERMINAL_NORTE_ITINERARY = "Aeropuerto-autopista-terminalnorte";
const NO_DESPACHO_THRESHOLD_MINUTES = 210; // 3 h 30 min
const ARRIVAL_DEDUPE_WINDOW_MINUTES = 30; // Ventana para consolidar llegadas repetidas
const DISPATCH_MATCH_TOLERANCE_MINUTES = 2; // tolerancia de reloj entre llegada y despacho
const DISPATCH_MAX_AFTER_ARRIVAL_MINUTES = 8 * 60; // despacho maximo esperado tras llegada
const ARRIVAL_POINT_TYPES = new Set(["101", "104", "110", "129"]);

// Estructura para novedades (conductores con estado)
let novedades = []; // Array de objetos { nombre, base, estado, fecha }
const AppState = {
  get hasRows(){
    return Array.isArray(rows) && rows.length > 0;
  },
  clearProgramacion(){
    rows = [];
    assignedByBase = {};
  },
  replaceRows(nextRows){
    rows = Array.isArray(nextRows) ? nextRows : [];
    assignedByBase = {};
  }
};

const NOVEDADES = {
  DISPONIBLE: { class: 'disponible', color: '#22c55e', label: 'Disponible' },
  INCAPACITADO: { class: 'incapacitado', color: '#ef4444', label: 'Incapacitado' },
  PERMISO: { class: 'permiso', color: '#f59e0b', label: 'Permiso' },
  DESCANSO: { class: 'descanso', color: '#6b7280', label: 'Descanso' },
  VACACIONES: { class: 'vacaciones', color: '#0ea5e9', label: 'Vacaciones' },
  "RECONOCIMIENTO DE RUTA": { class: 'reconocimiento_ruta', color: '#7c3aed', label: 'Reconocimiento de ruta' },
  "DIA NO REMUNERADO": { class: 'dia_no_remunerado', color: '#b45309', label: 'Dia no remunerado' },
  CALAMIDAD: { class: 'calamidad', color: '#be123c', label: 'Calamidad' },
  RENUNCIA: { class: 'renuncia', color: '#334155', label: 'Renuncia' },
  PENDIENTE: { class: 'pendiente', color: '#9ca3af', label: 'Pendiente' }
};

// Importante: PUESTO (NUTIBARA/SAN DIEGO/EXPOSICIONES) no representa la base operativa.
const BASE_COLUMN_ALIASES = ["BASE", "PATIO", "ESTACION", "ESTACIÓN"];

/* ===================== UI ===================== */
const operativoPanel = document.getElementById("operativoPanel");
const operativoInner = document.getElementById("operativoInner");
const btnRefreshConductoresCsv = document.getElementById("btnRefreshConductoresCsv");
const conductoresCsvSearch = document.getElementById("conductoresCsvSearch");
const conductoresCsvBaseFilter = document.getElementById("conductoresCsvBaseFilter");
const conductoresCsvStatusFilter = document.getElementById("conductoresCsvStatusFilter");
const conductoresCsvCount = document.getElementById("conductoresCsvCount");
const conductoresCsvStatus = document.getElementById("conductoresCsvStatus");
const conductoresCsvBody = document.getElementById("conductoresCsvBody");
const btnRefreshVehiculosSonar = document.getElementById("btnRefreshVehiculosSonar");
const vehiculosSonarSearch = document.getElementById("vehiculosSonarSearch");
const vehiculosSonarCount = document.getElementById("vehiculosSonarCount");
const vehiculosSonarStatus = document.getElementById("vehiculosSonarStatus");
const vehiculosSonarBody = document.getElementById("vehiculosSonarBody");
const btnRefreshDespachosSonar = document.getElementById("btnRefreshDespachosSonar");
const despachosSonarSearch = document.getElementById("despachosSonarSearch");
const despachosSonarItinChips = document.getElementById("despachosSonarItinChips");
const despachosSonarCount = document.getElementById("despachosSonarCount");
const despachosSonarStatus = document.getElementById("despachosSonarStatus");
const despachosSonarBody = document.getElementById("despachosSonarBody");
const btnRefreshMapaVehiculos = document.getElementById("btnRefreshMapaVehiculos");
const btnFitMapaVehiculos = document.getElementById("btnFitMapaVehiculos");
const btnFullscreenMapa = document.getElementById("btnFullscreenMapa");
const btnFloatingMapa = document.getElementById("btnFloatingMapa");
const mapaFloatingPanel = document.getElementById("mapaFloating");
const mapaFloatingHeader = document.getElementById("mapaFloatingHeader");
const mapaFloatingBody = document.getElementById("mapaFloatingBody");
const btnFloatingClose = document.getElementById("btnFloatingClose");
const btnFloatingFit = document.getElementById("btnFloatingFit");
const btnDefinirGeocerca = document.getElementById("btnDefinirGeocerca");
const btnConfigItinerarios = document.getElementById("btnConfigItinerarios");
const btnCloseConfigItin = document.getElementById("btnCloseConfigItin");
const itinerariosConfigGrid = document.getElementById("itinerariosConfigGrid");
const btnCancelGeocerca = document.getElementById("btnCancelGeocerca");
const btnFinishGeocerca = document.getElementById("btnFinishGeocerca");
const btnUndoGeocerca = document.getElementById("btnUndoGeocerca");
const geocercaForm = document.getElementById("geocercaForm");
const geocercaNombre = document.getElementById("geocercaNombre");
const geocercaHint = document.getElementById("geocercaHint");
const btnRefreshEnturnamiento = document.getElementById("btnRefreshEnturnamiento");
const btnEnturnoManual = document.getElementById("btnEnturnoManual");
const btnEnturnoManualSave = document.getElementById("btnEnturnoManualSave");
const btnEnturnoManualCancel = document.getElementById("btnEnturnoManualCancel");
const enturnamientoCount = document.getElementById("enturnamientoCount");
const enturnamientoStatus = document.getElementById("enturnamientoStatus");
const enturnamientoGrid = document.getElementById("enturnamientoGrid");
const mapaVehiculosContainer = document.getElementById("mapaVehiculosContainer");
const mapaVehiculosCount = document.getElementById("mapaVehiculosCount");
const mapaVehiculosStatus = document.getElementById("mapaVehiculosStatus");
const mapaVehiculosRealtime = document.getElementById("mapaVehiculosRealtime");
const btnToggleSonarPositions = document.getElementById("btnToggleSonarPositions");
const sonarLocationsStatus = document.getElementById("sonarLocationsStatus");
const btnRefreshTablaLlegadas = document.getElementById("btnRefreshTablaLlegadas");
const tablaLlegadasSearch = document.getElementById("tablaLlegadasSearch");
const tablaLlegadasGrid = document.getElementById("tablaLlegadasGrid");
const tablaLlegadasCount = document.getElementById("tablaLlegadasCount");
const tablaLlegadasStatus = document.getElementById("tablaLlegadasStatus");
const tablaLlegadasRealtime = document.getElementById("tablaLlegadasRealtime");
const btnRefreshHistorialDespachos = document.getElementById("btnRefreshHistorialDespachos");
const historialDespachosSearch = document.getElementById("historialDespachosSearch");
const historialDespachosEstadoFilter = document.getElementById("historialDespachosEstadoFilter");
const historialDespachosRangeFilter = document.getElementById("historialDespachosRangeFilter");
const historialDespachosItinChips = document.getElementById("historialDespachosItinChips");
const historialInsights = document.getElementById("historialInsights");
const historialDespachosCount = document.getElementById("historialDespachosCount");
const historialDespachosStatus = document.getElementById("historialDespachosStatus");
const historialDespachosBody = document.getElementById("historialDespachosBody");
const btnRefreshDespachosAeropuerto = document.getElementById("btnRefreshDespachosAeropuerto");
const despachosAeropuertoSearch = document.getElementById("despachosAeropuertoSearch");
const despachosAeropuertoEstadoFilter = document.getElementById("despachosAeropuertoEstadoFilter");
const despachosAeropuertoRangeFilter = document.getElementById("despachosAeropuertoRangeFilter");
const despachosAeropuertoItinChips = document.getElementById("despachosAeropuertoItinChips");
const despachosAeropuertoCount = document.getElementById("despachosAeropuertoCount");
const despachosAeropuertoStatus = document.getElementById("despachosAeropuertoStatus");
const despachosAeropuertoBody = document.getElementById("despachosAeropuertoBody");
const btnRefreshPreopSicov = document.getElementById("btnRefreshPreopSicov");
const preopSicovSearch = document.getElementById("preopSicovSearch");
const preopSicovFrom = document.getElementById("preopSicovFrom");
const preopSicovTo = document.getElementById("preopSicovTo");
const preopSicovPageSize = document.getElementById("preopSicovPageSize");
const preopSicovTotal = document.getElementById("preopSicovTotal");
const preopSicovStatus = document.getElementById("preopSicovStatus");
const preopSicovBody = document.getElementById("preopSicovBody");
const preopSicovPage = document.getElementById("preopSicovPage");
const preopSicovPages = document.getElementById("preopSicovPages");
const btnPreopSicovFirst = document.getElementById("btnPreopSicovFirst");
const btnPreopSicovPrev = document.getElementById("btnPreopSicovPrev");
const btnPreopSicovNext = document.getElementById("btnPreopSicovNext");
const btnPreopSicovLast = document.getElementById("btnPreopSicovLast");
const asistenciaBiometricaFrame = document.getElementById("asistenciaBiometricaFrame");
const btnReloadAsistenciaBiometrica = document.getElementById("btnReloadAsistenciaBiometrica");
const BIOMETRICO_ORIGIN = "https://desarrollocombuses.github.io";

async function getBiometricoSessionPayload(){
  try {
    const { data } = await authSupabaseClient.auth.getSession();
    const s = data?.session;
    if (!s || !s.access_token || !s.refresh_token) return null;
    return {
      access_token: s.access_token,
      refresh_token: s.refresh_token,
      expires_at: s.expires_at ?? null,
      token_type: s.token_type || "bearer",
      user_email: s.user?.email || currentUserEmail || ""
    };
  } catch (_) { return null; }
}

async function pushBiometricoSession(){
  if (!asistenciaBiometricaFrame || !asistenciaBiometricaFrame.contentWindow) {
    console.warn("[biometrico-autologin] iframe no disponible");
    return;
  }
  const payload = await getBiometricoSessionPayload();
  if (!payload) {
    console.warn("[biometrico-autologin] sin sesion Supabase para enviar");
    return;
  }
  try {
    asistenciaBiometricaFrame.contentWindow.postMessage(
      { type: "BIOMETRICO_SESSION", payload },
      BIOMETRICO_ORIGIN
    );
    console.info("[biometrico-autologin] sesion enviada al iframe", payload.user_email);
  } catch (e) {
    console.error("[biometrico-autologin] postMessage fallo:", e);
  }
}

function setupBiometricoAutoLogin(){
  if (!asistenciaBiometricaFrame) return;
  console.info("[biometrico-autologin] listener instalado, esperando iframe");
  asistenciaBiometricaFrame.addEventListener("load", () => {
    console.info("[biometrico-autologin] iframe load detectado");
    pushBiometricoSession();
  });
  window.addEventListener("message", (event) => {
    if (event.origin !== BIOMETRICO_ORIGIN) return;
    const data = event.data;
    if (!data || typeof data !== "object") return;
    if (data.type === "BIOMETRICO_READY") {
      console.info("[biometrico-autologin] iframe READY recibido");
      pushBiometricoSession();
    }
    if (data.type === "BIOMETRICO_SESSION_OK") {
      console.info("[biometrico-autologin] iframe confirmo login", data.email || "");
    }
    if (data.type === "BIOMETRICO_SESSION_FAIL") {
      console.error("[biometrico-autologin] iframe reporto error:", data.error || "");
    }
  });
  try {
    authSupabaseClient.auth.onAuthStateChange((_evt, _session) => { pushBiometricoSession(); });
  } catch (_) { /* sdk sin onAuthStateChange */ }
}
const mobileTabSwitcher = document.getElementById("mobileTabSwitcher");
const mobileTabSelect = document.getElementById("mobileTabSelect");
const planillaFilterInterno = document.getElementById("planillaFilterInterno");
const planillaFilterBase = document.getElementById("planillaFilterBase");
const planillaFilterTipo = document.getElementById("planillaFilterTipo");
const planillaFilterHoraLlegada = document.getElementById("planillaFilterHoraLlegada");
const planillaTableSource = document.getElementById("planillaTableSource");
const btnRefreshPlanilla = document.getElementById("btnRefreshPlanilla");
const btnDownloadLlegadas = document.getElementById("btnDownloadLlegadas");
const btnDownloadDespachos = document.getElementById("btnDownloadDespachos");
const planillaStatus = document.getElementById("planillaStatus");
const planillaCount = document.getElementById("planillaCount");
const planillaHead = document.getElementById("planillaHead");
const planillaBody = document.getElementById("planillaBody");
const btnRefreshLlegadasAeropuerto = document.getElementById("btnRefreshLlegadasAeropuerto");
const aeropuertoSearch = document.getElementById("aeropuertoSearch");
const aeropuertoEstadoFilter = document.getElementById("aeropuertoEstadoFilter");
const aeropuertoBaseFilter = document.getElementById("aeropuertoBaseFilter");
const aeropuertoUploadFrom = document.getElementById("aeropuertoUploadFrom");
const aeropuertoUploadTo = document.getElementById("aeropuertoUploadTo");
const btnDownloadLlegadasAeropuerto = document.getElementById("btnDownloadLlegadasAeropuerto");
const llegadasAeropuertoTitle = document.getElementById("llegadasAeropuertoTitle");
const llegadasAeropuertoCount = document.getElementById("llegadasAeropuertoCount");
const llegadasAeropuertoStatus = document.getElementById("llegadasAeropuertoStatus");
const llegadasAeropuertoBody = document.getElementById("llegadasAeropuertoBody");
const llegadasAeropuertoTabs = document.getElementById("llegadasAeropuertoTabs");
const btnRefreshLlegadasTerminalNorte = document.getElementById("btnRefreshLlegadasTerminalNorte");
const terminalNorteSearch = document.getElementById("terminalNorteSearch");
const terminalNorteEstadoFilter = document.getElementById("terminalNorteEstadoFilter");
const terminalNorteBaseFilter = document.getElementById("terminalNorteBaseFilter");
const terminalNorteUploadFrom = document.getElementById("terminalNorteUploadFrom");
const terminalNorteUploadTo = document.getElementById("terminalNorteUploadTo");
const btnDownloadLlegadasTerminalNorte = document.getElementById("btnDownloadLlegadasTerminalNorte");
const llegadasTerminalNorteTitle = document.getElementById("llegadasTerminalNorteTitle");
const llegadasTerminalNorteCount = document.getElementById("llegadasTerminalNorteCount");
const llegadasTerminalNorteStatus = document.getElementById("llegadasTerminalNorteStatus");
const llegadasTerminalNorteBody = document.getElementById("llegadasTerminalNorteBody");
const btnRefreshLlegadasSanDiego = document.getElementById("btnRefreshLlegadasSanDiego");
const sanDiegoSearch = document.getElementById("sanDiegoSearch");
const sanDiegoEstadoFilter = document.getElementById("sanDiegoEstadoFilter");
const sanDiegoBaseFilter = document.getElementById("sanDiegoBaseFilter");
const sanDiegoUploadFrom = document.getElementById("sanDiegoUploadFrom");
const sanDiegoUploadTo = document.getElementById("sanDiegoUploadTo");
const btnDownloadLlegadasSanDiego = document.getElementById("btnDownloadLlegadasSanDiego");
const llegadasSanDiegoTitle = document.getElementById("llegadasSanDiegoTitle");
const llegadasSanDiegoCount = document.getElementById("llegadasSanDiegoCount");
const llegadasSanDiegoStatus = document.getElementById("llegadasSanDiegoStatus");
const llegadasSanDiegoBody = document.getElementById("llegadasSanDiegoBody");
const llegadasSanDiegoTabs = document.getElementById("llegadasSanDiegoTabs");
const btnRefreshLlegadasNutibara = document.getElementById("btnRefreshLlegadasNutibara");
const nutibaraSearch = document.getElementById("nutibaraSearch");
const nutibaraEstadoFilter = document.getElementById("nutibaraEstadoFilter");
const nutibaraBaseFilter = document.getElementById("nutibaraBaseFilter");
const nutibaraUploadFrom = document.getElementById("nutibaraUploadFrom");
const nutibaraUploadTo = document.getElementById("nutibaraUploadTo");
const btnDownloadLlegadasNutibara = document.getElementById("btnDownloadLlegadasNutibara");
const llegadasNutibaraTitle = document.getElementById("llegadasNutibaraTitle");
const llegadasNutibaraCount = document.getElementById("llegadasNutibaraCount");
const llegadasNutibaraStatus = document.getElementById("llegadasNutibaraStatus");
const llegadasNutibaraBody = document.getElementById("llegadasNutibaraBody");
const llegadasNutibaraTabs = document.getElementById("llegadasNutibaraTabs");
const btnRefreshNoDespacho = document.getElementById("btnRefreshNoDespacho");
const noDespachoSearch = document.getElementById("noDespachoSearch");
const noDespachoPuntoFilter = document.getElementById("noDespachoPuntoFilter");
const noDespachoBaseFilter = document.getElementById("noDespachoBaseFilter");
const noDespachoFrom = document.getElementById("noDespachoFrom");
const noDespachoTo = document.getElementById("noDespachoTo");
const noDespachoTitle = document.getElementById("noDespachoTitle");
const noDespachoCount = document.getElementById("noDespachoCount");
const noDespachoStatus = document.getElementById("noDespachoStatus");
const noDespachoBody = document.getElementById("noDespachoBody");
const fueraListaSearch = document.getElementById("fueraListaSearch");
const fueraListaCount = document.getElementById("fueraListaCount");
const fueraListaBody = document.getElementById("fueraListaBody");
const fueraListaStatus = document.getElementById("fueraListaStatus");

/* ===================== UTIL ===================== */
function norm(s){ return (s||"").toString().trim().toUpperCase(); }
function normCompact(s){ return norm(s).replace(/\s+/g, ""); }

function getBaseCanonical(value){
  const raw = String(value ?? "").trim().toUpperCase();
  if (!raw) return "";
  const m = raw.match(/^BASE\s*(\d+)$/i);
  if (m) return m[1];
  return raw;
}

function formatBaseLabel(value){
  const canonical = getBaseCanonical(value);
  if (/^\d+$/.test(canonical)) return `BASE ${canonical}`;
  return canonical;
}

function sameBase(a, b){
  const ca = getBaseCanonical(a);
  const cb = getBaseCanonical(b);
  return !!ca && !!cb && ca === cb;
}

function getCsvDriverBase(row){
  const rawEmail = String(row?.email || "").trim();
  const fromEmail = rawEmail.match(/BASE\s*(\d+)/i)?.[1] || "";
  const rawBase = String(row?.base || "").trim();
  const raw = fromEmail || rawBase;
  return getBaseCanonical(raw);
}

function getFilteredDriversCatalogRows(){
  const rows = Array.isArray(driversCatalogRows) ? driversCatalogRows : [];
  const term = String(conductoresCsvSearch?.value || "").trim().toLowerCase();
  const base = String(conductoresCsvBaseFilter?.value || "").trim();
  const status = String(conductoresCsvStatusFilter?.value || "ENABLED").trim().toUpperCase();
  return rows.filter(row => {
    const rowBase = getCsvDriverBase(row);
    const rowStatus = String(row?.status || "").trim().toUpperCase();
    if (base && rowBase !== base) return false;
    if (status && rowStatus !== status) return false;
    if (!term) return true;
    const tokens = [
      row?.dr_id,
      row?.cedula,
      row?.nombre,
      row?.status,
      row?.email,
      row?.celular,
      rowBase
    ];
    return tokens.join(" ").toLowerCase().includes(term);
  });
}

function refreshConductoresCsvBaseOptions(){
  if (!conductoresCsvBaseFilter) return;
  const prev = String(conductoresCsvBaseFilter.value || "");
  const setBases = new Set();
  (driversCatalogRows || []).forEach(row => {
    const base = getCsvDriverBase(row);
    if (base) setBases.add(base);
  });
  const options = Array.from(setBases).sort((a, b) => Number(a) - Number(b));
  conductoresCsvBaseFilter.innerHTML = `<option value="">Todas las bases</option>${
    options.map(base => `<option value="${escapeHtml(base)}">${escapeHtml(formatBaseLabel(base))}</option>`).join("")
  }`;
  if (prev && options.includes(prev)) conductoresCsvBaseFilter.value = prev;
}

function renderConductoresCsvTab(){
  if (!conductoresCsvBody) return;
  const filtered = getFilteredDriversCatalogRows();
  if (conductoresCsvCount) conductoresCsvCount.textContent = String(filtered.length);
  if (!filtered.length) {
    conductoresCsvBody.innerHTML = `<tr><td colspan="7" class="muted" style="text-align:center;padding:12px">Sin conductores para los filtros.</td></tr>`;
    return;
  }
  conductoresCsvBody.innerHTML = filtered.map(row => {
    const base = getCsvDriverBase(row);
    return `<tr>
      <td>${escapeHtml(formatPlanillaCell(row?.dr_id))}</td>
      <td>${escapeHtml(formatPlanillaCell(row?.cedula))}</td>
      <td>${escapeHtml(base ? formatBaseLabel(base) : "-")}</td>
      <td>${escapeHtml(formatPlanillaCell(row?.nombre))}</td>
      <td>${escapeHtml(formatPlanillaCell(row?.status))}</td>
      <td>${escapeHtml(formatPlanillaCell(row?.email))}</td>
      <td>${escapeHtml(formatPlanillaCell(row?.celular))}</td>
    </tr>`;
  }).join("");
}

function escapeHtml(value){
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPlanillaCell(value){
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }
  return String(value);
}

function getPlanillaRowStableKey(row){
  if (!row || typeof row !== "object") return "";
  const id = String(row?.id ?? "").trim();
  if (id) return `id:${id}`;
  const cruce = String(row?.cruce_key ?? "").trim();
  if (cruce) return `cruce:${cruce}`;
  const parts = [
    String(row?.tipo_llegada ?? "").trim(),
    String(row?.base ?? "").trim(),
    String(row?.interno ?? "").trim(),
    String(row?.mid ?? "").trim(),
    String(row?.hora_llegada ?? "").trim(),
    String(row?.generated_at ?? row?.generado_en ?? row?.created_at ?? "").trim()
  ];
  return `row:${parts.join("|")}`;
}

function getRowVehicleKey(row){
  const interno = formatPlanillaCell(row?.interno).trim();
  const mid = formatPlanillaCell(row?.mid).trim();
  return interno || mid || "";
}

function invalidatePlanillaDispatchResolutionCache(){
  planillaRowsRevision += 1;
  planillaDispatchResolutionCache.rowsRef = null;
  planillaDispatchResolutionCache.revision = -1;
  planillaDispatchResolutionCache.resolvedByKey = new Map();
}

function mapTipoLlegada(value){
  const code = String(value ?? "").trim();
  if (code === "104") return "Llegada Aeropuerto";
  if (code === "101") return "Llegada San Diego";
  if (code === "110") return "Llegada Nutibara";
  return code || "-";
}

function getPlanillaDisplayColumnKeys(rowsInput){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  const preferred = currentPlanillaTableName === PLANILLA_TABLE_NAME ? PLANILLA_AFILIADOS_2_COLUMNS : [];
  const ordered = [];
  const seen = new Set();
  preferred.forEach(col => {
    const k = String(col || "").trim();
    if (!k || seen.has(k)) return;
    seen.add(k);
    ordered.push(k);
  });
  rows.forEach(row => {
    if (!row || typeof row !== "object") return;
    Object.keys(row).forEach(key => {
      const k = String(key || "").trim();
      if (!k || seen.has(k)) return;
      seen.add(k);
      ordered.push(k);
    });
  });
  return ordered;
}

function getPlanillaSelectColumnsForCurrentTable(){
  if (currentPlanillaTableName === PLANILLA_TABLE_NAME) {
    return PLANILLA_AFILIADOS_2_COLUMNS.join(",");
  }
  return "*";
}

async function fetchPlanillaOptionalColumn(columnName, rowIds){
  const col = String(columnName || "").trim();
  if (!col) return null;
  try {
    let query = planillaSupabaseClient
      .from(currentPlanillaTableName)
      .select(`id,${col}`)
      .limit(PLANILLA_DELTA_LIMIT);
    const ids = Array.isArray(rowIds) ? rowIds.map(v => String(v || "").trim()).filter(Boolean) : [];
    if (ids.length > 0) {
      query = query.in("id", ids);
    } else {
      query = query.order("hora_llegada", { ascending: false, nullsFirst: false });
    }
    const { data, error } = await query;
    if (error) return null;
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return null;
  }
}

async function enrichPlanillaRowsWithOptionalColumns(rowsInput, rowIds){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  if (!rows.length) return rows;
  const byId = new Map();
  rows.forEach(row => {
    const id = row?.id;
    if (id !== undefined && id !== null) byId.set(String(id), row);
  });
  const ids = Array.isArray(rowIds) ? rowIds : [];
  for (const col of PLANILLA_OPTIONAL_REG_ID_COLUMNS) {
    const data = await fetchPlanillaOptionalColumn(col, ids);
    if (!Array.isArray(data) || !data.length) continue;
    data.forEach(item => {
      const id = item?.id;
      if (id === undefined || id === null) return;
      const row = byId.get(String(id));
      if (!row) return;
      const value = String(item?.[col] || "").trim();
      if (!value) return;
      setRowDispatchRegId(row, value);
    });
  }
  return rows;
}

function getPlanillaRowUpdatedAtValue(row){
  return String(row?.updated_at || row?.created_at || "").trim();
}

function getMaxPlanillaUpdatedAt(rowsInput, fallbackValue = ""){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  let maxValue = String(fallbackValue || "").trim();
  rows.forEach(row => {
    const value = getPlanillaRowUpdatedAtValue(row);
    if (!value) return;
    if (!maxValue || value > maxValue) maxValue = value;
  });
  return maxValue;
}

function mergePlanillaRowsById(baseRowsInput, deltaRowsInput){
  const baseRows = Array.isArray(baseRowsInput) ? baseRowsInput : [];
  const deltaRows = Array.isArray(deltaRowsInput) ? deltaRowsInput : [];
  if (!deltaRows.length) return baseRows.slice();
  const merged = baseRows.slice();
  const indexById = new Map();
  const indexByCruceKey = new Map();
  merged.forEach((row, idx) => {
    const id = row?.id;
    const cruce = String(row?.cruce_key || "").trim();
    if (id !== undefined && id !== null) indexById.set(String(id), idx);
    if (cruce) indexByCruceKey.set(cruce, idx);
  });
  deltaRows.forEach(delta => {
    const id = delta?.id;
    const cruce = String(delta?.cruce_key || "").trim();
    let idx = -1;
    if (id !== undefined && id !== null && indexById.has(String(id))) {
      idx = indexById.get(String(id));
    } else if (cruce && indexByCruceKey.has(cruce)) {
      idx = indexByCruceKey.get(cruce);
    }
    if (idx >= 0) {
      merged[idx] = delta;
      return;
    }
    merged.push(delta);
    const newIndex = merged.length - 1;
    if (id !== undefined && id !== null) indexById.set(String(id), newIndex);
    if (cruce) indexByCruceKey.set(cruce, newIndex);
  });
  return merged;
}

function formatPlanillaHeaderLabel(key){
  const raw = String(key || "").trim();
  if (!raw) return "-";
  return raw.replace(/_/g, " ");
}

function getPlanillaFilteredRows(rowsInput){
  const rowsList = Array.isArray(rowsInput) ? rowsInput : [];
  const internoTerm = String(planillaFilterInterno?.value || "").trim().toLowerCase();
  const baseTerm = String(planillaFilterBase?.value || "").trim().toLowerCase();
  const tipoTerm = String(planillaFilterTipo?.value || "").trim().toLowerCase();
  const horaLlegadaTerm = String(planillaFilterHoraLlegada?.value || "").trim().toLowerCase();
  const filtered = rowsList.filter(row => {
    const internoOk = !internoTerm || formatPlanillaCell(row?.interno).toLowerCase().includes(internoTerm);
    const baseOk = !baseTerm || formatPlanillaCell(row?.base).toLowerCase().includes(baseTerm);
    const tipoTxt = mapTipoLlegada(row?.tipo_llegada).toLowerCase();
    const tipoOk = !tipoTerm || tipoTxt.includes(tipoTerm);
    const horaLlegadaOk = !horaLlegadaTerm || formatPlanillaCell(row?.hora_llegada).toLowerCase().includes(horaLlegadaTerm);
    return internoOk && baseOk && tipoOk && horaLlegadaOk;
  });
  const ordered = filtered.sort(comparePlanillaRowsByCurrentDateTime);
  return dedupeLlegadasByHour(ordered);
}

function parsePlanillaDateTime(value){
  const raw = String(value || "").trim();
  if (!raw) return null;

  // 1) Formatos tipo ISO: yyyy-mm-dd hh:mm[:ss[.ms]] o con T.
  const normalizedIsoLike = raw.includes("T") ? raw : raw.replace(" ", "T");
  let date = new Date(normalizedIsoLike);
  if (!Number.isNaN(date.getTime())) return date;

  // 2) Formatos latinos: dd/mm/yyyy hh:mm[:ss]
  const latin = raw.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/
  );
  if (latin) {
    const dd = Number(latin[1]);
    const mm = Number(latin[2]);
    const yyyy = Number(latin[3]);
    const hh = Number(latin[4] || 0);
    const mi = Number(latin[5] || 0);
    const ss = Number(latin[6] || 0);
    date = new Date(yyyy, Math.max(0, mm - 1), dd, hh, mi, ss);
    if (!Number.isNaN(date.getTime())) return date;
  }

  return null;
}

function comparePlanillaRowsByCurrentDateTime(a, b){
  const now = new Date();
  const aDate = getLlegadaDateForMatching(a) || parsePlanillaDateTime(a?.hora_despacho);
  const bDate = getLlegadaDateForMatching(b) || parsePlanillaDateTime(b?.hora_despacho);
  if (!aDate && !bDate) return 0;
  if (!aDate) return 1;
  if (!bDate) return -1;

  const aIsToday = isSameLocalDate(aDate, now);
  const bIsToday = isSameLocalDate(bDate, now);
  if (aIsToday !== bIsToday) return aIsToday ? -1 : 1;

  if (aIsToday && bIsToday) {
    const aDiff = Math.abs(aDate.getTime() - now.getTime());
    const bDiff = Math.abs(bDate.getTime() - now.getTime());
    if (aDiff !== bDiff) return aDiff - bDiff;
  }

  return bDate.getTime() - aDate.getTime();
}

function formatPlanillaDateTime(value){
  const date = parsePlanillaDateTime(value);
  if (!date) return formatPlanillaCell(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function toIsoDateFromDateTime(value){
  const date = parsePlanillaDateTime(value);
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getPlanillaUploadDateIso(row){
  return toIsoDateFromDateTime(row?.generado_en || row?.created_at || row?.hora_llegada || row?.hora_despacho);
}

function getPlanillaUploadDateText(row){
  return formatPlanillaDateTime(row?.generado_en || row?.created_at);
}

function getLlegadaDateForMatching(row){
  return parsePlanillaDateTime(row?.hora_llegada || row?.generado_en || row?.created_at);
}

function getRawDespachoDate(row){
  return parsePlanillaDateTime(row?.hora_despacho);
}

function isDispatchChronologicallyValid(despDate, llegadaDate, nextLlegadaDate){
  if (!(despDate instanceof Date) || Number.isNaN(despDate.getTime())) return false;
  if (!(llegadaDate instanceof Date) || Number.isNaN(llegadaDate.getTime())) return true;
  const tolMs = DISPATCH_MATCH_TOLERANCE_MINUTES * 60000;
  const maxAfterMs = DISPATCH_MAX_AFTER_ARRIVAL_MINUTES * 60000;
  const despMs = despDate.getTime();
  const llegadaMs = llegadaDate.getTime();
  if (despMs < (llegadaMs - tolMs)) return false;
  if ((despMs - llegadaMs) > maxAfterMs) return false;
  if (nextLlegadaDate instanceof Date && !Number.isNaN(nextLlegadaDate.getTime())) {
    const nextMs = nextLlegadaDate.getTime();
    if (despMs > (nextMs + tolMs)) return false;
  }
  return true;
}

function ensurePlanillaDispatchResolutionCache(){
  if (planillaDispatchResolutionCache.rowsRef === planillaAfiliadosRows
    && planillaDispatchResolutionCache.revision === planillaRowsRevision) {
    return;
  }
  const rows = Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [];
  const byVehicle = new Map();
  rows.forEach(row => {
    const vehicleKey = getRowVehicleKey(row);
    if (!vehicleKey) return;
    if (!byVehicle.has(vehicleKey)) {
      byVehicle.set(vehicleKey, { arrivals: [], dispatches: [] });
    }
    const bucket = byVehicle.get(vehicleKey);
    const llegadaDate = getLlegadaDateForMatching(row);
    if (llegadaDate) bucket.arrivals.push({ row, timeMs: llegadaDate.getTime() });
    const despachoDate = getRawDespachoDate(row);
    if (despachoDate) bucket.dispatches.push({ row, date: despachoDate, timeMs: despachoDate.getTime() });
  });

  const resolvedByKey = new Map();
  byVehicle.forEach(bucket => {
    bucket.arrivals.sort((a, b) => a.timeMs - b.timeMs);
    bucket.dispatches.sort((a, b) => a.timeMs - b.timeMs);
    const assignedDispatchByArrivalIndex = new Array(bucket.arrivals.length).fill(null);
    const tolMs = DISPATCH_MATCH_TOLERANCE_MINUTES * 60000;
    const maxAfterMs = DISPATCH_MAX_AFTER_ARRIVAL_MINUTES * 60000;

    // Emparejamiento 1:1: cada despacho se pega a la llegada mas reciente compatible.
    bucket.dispatches.forEach(dispatchItem => {
      let targetIdx = -1;
      for (let i = bucket.arrivals.length - 1; i >= 0; i--) {
        if (assignedDispatchByArrivalIndex[i]) continue;
        const arrivalMs = bucket.arrivals[i].timeMs;
        const diff = dispatchItem.timeMs - arrivalMs;
        if (arrivalMs > (dispatchItem.timeMs + tolMs)) continue; // llegada posterior al despacho
        if (diff < -tolMs) continue; // despacho demasiado antes de llegada
        if (diff > maxAfterMs) continue; // despacho demasiado tarde para esa llegada
        targetIdx = i;
        break;
      }
      if (targetIdx >= 0) {
        assignedDispatchByArrivalIndex[targetIdx] = dispatchItem;
      }
    });

    bucket.arrivals.forEach((entry, idx) => {
      const row = entry.row;
      const rowKey = getPlanillaRowStableKey(row);
      if (!rowKey) return;
      const arrivalDate = new Date(entry.timeMs);
      const matched = assignedDispatchByArrivalIndex[idx];
      if (matched?.date && isDispatchChronologicallyValid(matched.date, arrivalDate, null)) {
        resolvedByKey.set(rowKey, {
          date: matched.date,
          sourceRow: matched.row
        });
        return;
      }
      const directDesp = getRawDespachoDate(row);
      if (isDispatchChronologicallyValid(directDesp, arrivalDate, null)) {
        resolvedByKey.set(rowKey, {
          date: directDesp,
          sourceRow: row
        });
        return;
      }
      resolvedByKey.set(rowKey, null);
    });
  });

  planillaDispatchResolutionCache.rowsRef = planillaAfiliadosRows;
  planillaDispatchResolutionCache.revision = planillaRowsRevision;
  planillaDispatchResolutionCache.resolvedByKey = resolvedByKey;
}

function getResolvedDispatchInfo(row){
  const rowKey = getPlanillaRowStableKey(row);
  if (!rowKey) return null;
  ensurePlanillaDispatchResolutionCache();
  if (planillaDispatchResolutionCache.resolvedByKey.has(rowKey)) {
    return planillaDispatchResolutionCache.resolvedByKey.get(rowKey) || null;
  }
  const direct = getRawDespachoDate(row);
  if (!direct) return null;
  return { date: direct, sourceRow: row };
}

function hasValidDespacho(row){
  const info = getResolvedDispatchInfo(row);
  return !!(info?.date instanceof Date);
}

function getDespachoDateTimeText(row){
  const info = getResolvedDispatchInfo(row);
  if (!info?.date) return "-";
  return formatPlanillaDateTime(info.date);
}

function getOperacionEstadoText(row){
  if (hasValidDespacho(row)) return "Despachado";
  return "En espera";
}

function getDisplayItinerarioByEstado(row){
  const itinLlegada = formatPlanillaCell(row?.itinerario_llegada).trim();
  const itinDespacho = getItinerarioDespachoText(row);
  if (!hasValidDespacho(row)) {
    return itinLlegada || "-";
  }
  return itinDespacho || itinLlegada || "-";
}

function getItinerarioLlegadaText(row){
  const itin = formatPlanillaCell(row?.itinerario_llegada).trim();
  return itin || "-";
}

function getItinerarioDespachoText(row){
  const info = getResolvedDispatchInfo(row);
  const sourceRow = info?.sourceRow || row;
  const itin = formatPlanillaCell(sourceRow?.itinerario_despacho).trim();
  return itin || "-";
}

function getPlanillaResolvedDispatchSourceRow(row){
  const info = getResolvedDispatchInfo(row);
  return info?.sourceRow || row;
}

function getPlanillaDisplayValueByColumn(row, columnName){
  const col = String(columnName || "").trim().toLowerCase();
  if (col === "hora_despacho") return getDespachoDateTimeText(row);
  if (col === "itinerario_despacho") return getItinerarioDespachoText(row);
  if (col === "estado") return getOperacionEstadoText(row);
  if (col === "conductor") {
    const source = getPlanillaResolvedDispatchSourceRow(row);
    return formatPlanillaCell(source?.conductor || row?.conductor);
  }
  if (col === "driver_id") {
    const source = getPlanillaResolvedDispatchSourceRow(row);
    return formatPlanillaCell(source?.driver_id || row?.driver_id);
  }
  return formatPlanillaCell(row?.[columnName]);
}

function getItinerarioLlegadaCellHtml(row){
  const itin = escapeHtml(getItinerarioLlegadaText(row));
  const itinColor = getItinerarioTextColorByRow(row);
  if (hasValidDespacho(row)) {
    return `<strong style="color:${itinColor}">${itin}</strong>`;
  }
  return `<strong style="color:${itinColor}">${itin}</strong> <span style="display:inline-block;margin-left:6px;padding:2px 8px;border:1px solid #fdba74;border-radius:999px;background:#fff7ed;color:#9a3412;font-size:12px;line-height:1.2" title="Vehiculo en espera por este itinerario de llegada">En espera</span>`;
}

function getItineraryGroupLabel(itinValue){
  const raw = String(itinValue || "").trim();
  if (!raw || raw === "-" || raw.toLowerCase() === "sin itinerario") {
    return "Proximos a despachar";
  }
  return raw;
}

function getItineraryThemeByRows(rowsInput, estadoMode){
  const mode = String(estadoMode || "").trim().toLowerCase();
  if (mode === "en_espera") return "espera";
  if (mode === "despachado") return "despachado";
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  if (!rows.length) return "mixed";
  const hasDesp = rows.some(r => hasValidDespacho(r));
  const hasEspera = rows.some(r => !hasValidDespacho(r));
  if (hasDesp && !hasEspera) return "despachado";
  if (!hasDesp && hasEspera) return "espera";
  return "mixed";
}

function getItineraryButtonStyle(theme, active){
  if (theme === "espera") {
    return active
      ? "background:#b45309;border-color:#b45309;color:#ffffff"
      : "background:#fff7ed;border-color:#fdba74;color:#9a3412";
  }
  if (theme === "despachado") {
    return active
      ? "background:#047857;border-color:#047857;color:#ffffff"
      : "background:#ecfdf5;border-color:#86efac;color:#065f46";
  }
  return "";
}

function getItinerarioTextColorByRow(row){
  return hasValidDespacho(row) ? "#065f46" : "#9a3412";
}

function normalizeItineraryKey(value){
  return String(value || "").trim().toLowerCase();
}

function getGroupingItineraryForRow(row, estadoMode){
  const mode = String(estadoMode || "").trim().toLowerCase();
  if (mode === "en_espera") {
    if (hasValidDespacho(row)) return getItinerarioDespachoText(row);
    return getItinerarioLlegadaText(row);
  }
  return getDisplayItinerarioByEstado(row);
}

function rowMatchesSelectedItinerary(row, selectedItinerary, estadoMode){
  const selectedKey = normalizeItineraryKey(selectedItinerary);
  if (!selectedKey) return false;
  const mode = String(estadoMode || "").trim().toLowerCase();
  if (mode === "en_espera") {
    if (hasValidDespacho(row)) {
      return normalizeItineraryKey(getItinerarioDespachoText(row)) === selectedKey;
    }
    return normalizeItineraryKey(getItinerarioLlegadaText(row)) === selectedKey;
  }
  return normalizeItineraryKey(getGroupingItineraryForRow(row, mode)) === selectedKey;
}

function getRowsFilteredByUploadDate(rowsInput, fromIso, toIso){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  if (!fromIso && !toIso) return rows;
  return rows.filter(row => {
    const uploadIso = getPlanillaUploadDateIso(row);
    if (!uploadIso) return false;
    if (fromIso && uploadIso < fromIso) return false;
    if (toIso && uploadIso > toIso) return false;
    return true;
  });
}

function getRowsFilteredByEstado(rowsInput, estadoMode){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  const mode = String(estadoMode || "").trim().toLowerCase();
  if (!mode) return rows;
  let filtered = rows.filter(row => {
    const isDespachado = hasValidDespacho(row);
    if (mode === "en_espera") return !isDespachado;
    if (mode === "despachado") return isDespachado;
    return true;
  });
  if (mode === "en_espera") {
    filtered = getRowsFilteredByEsperaOperationalDay(filtered);
  }
  return filtered;
}

function isSameLocalCalendarDate(a, b){
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function getRowsFilteredByEsperaOperationalDay(rowsInput){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  if (!rows.length) return rows;
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  return rows.filter(row => {
    const date = getLlegadaReferenceDate(row);
    if (!date) return false;

    if (isSameLocalCalendarDate(date, now)) return true;
    if (isSameLocalCalendarDate(date, yesterday) && date.getHours() >= 21) return true;
    return false;
  });
}

function getRowsFilteredBySearchTerm(rowsInput, searchTerm){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  const term = String(searchTerm || "").trim().toLowerCase();
  if (!term) return rows;
  return rows.filter(row => {
    const tokens = [
      formatPlanillaDateTime(row?.hora_llegada),
      getPlanillaUploadDateText(row),
      formatTimeAgoEs(getLlegadaReferenceDate(row)),
      formatPlanillaCell(row?.base),
      formatPlanillaCell(row?.interno),
      getItinerarioLlegadaText(row),
      getItinerarioDespachoText(row),
      getDespachoDateTimeText(row),
      getOperacionEstadoText(row),
      formatPlanillaCell(row?.conductor),
      formatPlanillaCell(row?.estado),
      mapTipoLlegada(row?.tipo_llegada)
    ];
    return tokens.join(" ").toLowerCase().includes(term);
  });
}

function getRowsFilteredByBase(rowsInput, baseFilterValue){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  const selected = String(baseFilterValue || "").trim().toLowerCase();
  if (!selected) return rows;
  return rows.filter(row => {
    const rawBase = formatPlanillaCell(row?.base).trim();
    if (!rawBase) return false;
    const canonical = getBaseCanonical(rawBase);
    const canonicalText = canonical ? String(canonical).toLowerCase() : "";
    const formatted = canonical ? formatBaseLabel(canonical).toLowerCase() : rawBase.toLowerCase();
    const rawLower = rawBase.toLowerCase();
    return rawLower === selected
      || canonicalText === selected
      || formatted === selected;
  });
}

function syncLlegadasBaseFilterOptions(selectEl, rowsInput){
  if (!selectEl) return;
  const previous = String(selectEl.value || "");
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  const options = [];
  const seen = new Set();
  rows.forEach(row => {
    const raw = formatPlanillaCell(row?.base).trim();
    if (!raw) return;
    const canonical = getBaseCanonical(raw);
    const value = canonical ? String(canonical) : raw.toLowerCase();
    if (!value || seen.has(value)) return;
    seen.add(value);
    options.push({
      value,
      label: canonical ? formatBaseLabel(canonical) : raw
    });
  });
  options.sort((a, b) => a.label.localeCompare(b.label, "es", { numeric: true }));
  selectEl.innerHTML = `<option value="">Todas las bases</option>${
    options.map(opt => `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`).join("")
  }`;
  if (previous && options.some(opt => String(opt.value) === previous)) {
    selectEl.value = previous;
  } else {
    selectEl.value = "";
  }
}

function getLlegadasRowsForView(tipoCode, options = {}){
  const searchTerm = String(options.searchTerm || "");
  const fromIso = String(options.fromIso || "").trim();
  const toIso = String(options.toIso || "").trim();
  const estadoMode = String(options.estadoMode || "");
  const baseFilterValue = String(options.baseFilterValue || "");
  const hasExplicitFilters = !!searchTerm.trim() || !!fromIso || !!toIso || !!estadoMode;
  const rows = getLlegadasRowsByTipo(tipoCode, { preferToday: !hasExplicitFilters });
  const byEstado = getRowsFilteredByEstado(rows, estadoMode);
  const byDate = getRowsFilteredByUploadDate(byEstado, fromIso, toIso);
  const byBase = getRowsFilteredByBase(byDate, baseFilterValue);
  return getRowsFilteredBySearchTerm(byBase, searchTerm);
}

function exportPlanillaRowsToExcel(rowsInput, mode, filePrefix){
  if (!window.XLSX) {
    showToast("No se pudo cargar XLSX para exportar.", "err");
    return;
  }
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  if (!rows.length) {
    showToast("No hay datos para exportar.", "warn");
    return;
  }
  const mapped = rows.map(row => {
    const base = {
      "Fecha subida": getPlanillaUploadDateText(row),
      "Tipo": mapTipoLlegada(row?.tipo_llegada),
      "Base": formatPlanillaCell(row?.base),
      "Interno": formatPlanillaCell(row?.interno),
      "Conductor": formatPlanillaCell(row?.conductor),
      "Estado": formatPlanillaCell(row?.estado),
      "Espera": formatPlanillaCell(row?.espera)
    };
    if (mode === "despachos") {
      return {
        "Hora despacho": getDespachoDateTimeText(row),
        "Itinerario despacho": getItinerarioDespachoText(row),
        ...base
      };
    }
    return {
      "Hora llegada": formatPlanillaDateTime(row?.hora_llegada),
      "Itinerario llegada": formatPlanillaCell(row?.itinerario_llegada),
      ...base
    };
  });
  const ws = XLSX.utils.json_to_sheet(mapped);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, mode === "despachos" ? "Despachos" : "Llegadas");
  const stamp = new Date();
  const y = stamp.getFullYear();
  const m = String(stamp.getMonth() + 1).padStart(2, "0");
  const d = String(stamp.getDate()).padStart(2, "0");
  const hh = String(stamp.getHours()).padStart(2, "0");
  const mi = String(stamp.getMinutes()).padStart(2, "0");
  const safeName = String(`${filePrefix}_${y}${m}${d}_${hh}${mi}.xlsx`).replace(/[^a-z0-9_\-.]+/gi, "_");
  XLSX.writeFile(wb, safeName);
}

function formatTimeAgoEs(dateInput){
  const date = dateInput instanceof Date ? dateInput : parsePlanillaDateTime(dateInput);
  if (!date) return "-";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return "hace 0 min";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (rem === 0) return `hace ${hours} h`;
  return `hace ${hours} h ${rem} min`;
}

function getHourBucketKey(value){
  const date = parsePlanillaDateTime(value);
  if (!date) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}`;
}

function getLlegadaRowPriorityTime(row){
  return getLlegadaReferenceDate(row) || parsePlanillaDateTime(row?.hora_despacho);
}

function hasItinerarioDespacho(row){
  const txt = formatPlanillaCell(row?.itinerario_despacho).trim();
  return !!txt && txt !== "-";
}

function shouldPreferLlegadaRow(candidate, current){
  const currentHasDespacho = hasValidDespacho(current);
  const candidateHasDespacho = hasValidDespacho(candidate);
  if (candidateHasDespacho !== currentHasDespacho) return candidateHasDespacho;

  if (candidateHasDespacho && currentHasDespacho) {
    const currentHasItinDesp = hasItinerarioDespacho(current);
    const candidateHasItinDesp = hasItinerarioDespacho(candidate);
    if (candidateHasItinDesp !== currentHasItinDesp) return candidateHasItinDesp;
  }

  const currentTime = getLlegadaRowPriorityTime(current);
  const candidateTime = getLlegadaRowPriorityTime(candidate);
  if (!currentTime && !candidateTime) return false;
  if (!candidateTime) return false;
  if (!currentTime) return true;
  return candidateTime.getTime() > currentTime.getTime();
}

function dedupeLlegadasByHour(rowsInput){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  const keyToLastIndex = new Map();
  const out = [];
  rows.forEach(row => {
    const tipo = formatPlanillaCell(row?.tipo_llegada);
    const interno = formatPlanillaCell(row?.interno).trim();
    const base = formatPlanillaCell(row?.base).trim();
    const mid = formatPlanillaCell(row?.mid).trim();
    const vehicleKey = interno || mid;
    const itin = formatPlanillaCell(row?.itinerario_llegada);
    const rowDate = getLlegadaReferenceDate(row);
    const dedupeKey = `${tipo}|${base}|${vehicleKey}|${itin}`;
    if (!rowDate || !vehicleKey || !dedupeKey.trim()) {
      out.push(row);
      return;
    }
    if (!keyToLastIndex.has(dedupeKey)) {
      keyToLastIndex.set(dedupeKey, out.length);
      out.push(row);
      return;
    }
    const idx = keyToLastIndex.get(dedupeKey);
    const current = out[idx];
    const currentDate = parsePlanillaDateTime(current?.hora_llegada || current?.generado_en || current?.hora_despacho);
    const diffMinutes = (!currentDate)
      ? Number.POSITIVE_INFINITY
      : Math.abs(rowDate.getTime() - currentDate.getTime()) / 60000;

    // Solo unificar registros cercanos (<= 30 min). Si pasa esa ventana, se considera otra llegada.
    if (diffMinutes <= ARRIVAL_DEDUPE_WINDOW_MINUTES) {
      if (shouldPreferLlegadaRow(row, current)) {
        out[idx] = row;
      }
      return;
    }
    keyToLastIndex.set(dedupeKey, out.length);
    out.push(row);
  });
  return out;
}

function getLlegadasRowsByTipo(tipoCode, options = {}){
  const preferToday = options.preferToday !== false;
  const allRows = Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [];
  const rowsFiltered = allRows.filter(r => String(r?.tipo_llegada ?? "").trim() === String(tipoCode));
  const eligibleRows = filterOutOfListRows(rowsFiltered);
  let source = rowsFiltered;
  if (preferToday) {
    const now = new Date();
    const todayRows = eligibleRows.filter(r => {
      const date = getLlegadaReferenceDate(r);
      return !!date && isSameLocalDate(date, now);
    });
    source = todayRows.length > 0 ? todayRows : eligibleRows;
  } else {
    source = eligibleRows;
  }
  const sorted = source
    .slice()
    .sort((a, b) => {
      const da = getLlegadaReferenceDate(a);
      const db = getLlegadaReferenceDate(b);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db.getTime() - da.getTime();
    });
  return dedupeLlegadasByHour(sorted);
}

function getLlegadasRowsByItinerarioLlegada(itineraryText, options = {}){
  const preferToday = options.preferToday !== false;
  const itineraryKey = normalizeItineraryKey(itineraryText);
  const allRows = Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [];
  const rowsFiltered = allRows.filter(row => normalizeItineraryKey(getItinerarioLlegadaText(row)) === itineraryKey);
  const eligibleRows = filterOutOfListRows(rowsFiltered);
  let source = rowsFiltered;
  if (preferToday) {
    const now = new Date();
    const todayRows = eligibleRows.filter(r => {
      const date = getLlegadaReferenceDate(r);
      return !!date && isSameLocalDate(date, now);
    });
    source = todayRows.length > 0 ? todayRows : eligibleRows;
  } else {
    source = eligibleRows;
  }
  const sorted = source
    .slice()
    .sort((a, b) => {
      const da = getLlegadaReferenceDate(a);
      const db = getLlegadaReferenceDate(b);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db.getTime() - da.getTime();
    });
  return dedupeLlegadasByHour(sorted);
}

function getTerminalNorteRowsForView(options = {}){
  const searchTerm = String(options.searchTerm || "");
  const fromIso = String(options.fromIso || "").trim();
  const toIso = String(options.toIso || "").trim();
  const estadoMode = String(options.estadoMode || "");
  const baseFilterValue = String(options.baseFilterValue || "");
  const hasExplicitFilters = !!searchTerm.trim() || !!fromIso || !!toIso || !!estadoMode;
  const rows = getLlegadasRowsByItinerarioLlegada(TERMINAL_NORTE_ITINERARY, { preferToday: !hasExplicitFilters });
  const byEstado = getRowsFilteredByEstado(rows, estadoMode);
  const byDate = getRowsFilteredByUploadDate(byEstado, fromIso, toIso);
  const byBase = getRowsFilteredByBase(byDate, baseFilterValue);
  return getRowsFilteredBySearchTerm(byBase, searchTerm);
}

function getLlegadaReferenceDate(row){
  return parsePlanillaDateTime(row?.hora_llegada || row?.generado_en || row?.created_at);
}

function buildArrivalTimelineByInterno(){
  const timeline = new Map();
  const allRows = Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [];
  allRows.forEach(row => {
    const tipo = String(row?.tipo_llegada ?? "").trim();
    if (!ARRIVAL_POINT_TYPES.has(tipo)) return;
    const interno = formatPlanillaCell(row?.interno).trim();
    if (!interno) return;
    const date = getLlegadaReferenceDate(row);
    if (!date) return;
    if (!timeline.has(interno)) timeline.set(interno, []);
    timeline.get(interno).push({ tipo, timeMs: date.getTime() });
  });
  timeline.forEach(list => list.sort((a, b) => b.timeMs - a.timeMs));
  return timeline;
}

function splitRowsByNoDespachoRule(rowsInput){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  if (!rows.length) return { activeRows: [], noDespachoRows: [] };
  const nowMs = Date.now();
  const timelineByInterno = buildArrivalTimelineByInterno();
  const activeRows = [];
  const noDespachoRows = [];

  rows.forEach(row => {
    if (hasValidDespacho(row)) {
      activeRows.push(row);
      return;
    }
    const date = getLlegadaReferenceDate(row);
    const rowTimeMs = date ? date.getTime() : 0;
    const elapsedMin = date ? Math.max(0, Math.floor((nowMs - rowTimeMs) / 60000)) : 0;
    const isOverThreshold = !!date && elapsedMin >= NO_DESPACHO_THRESHOLD_MINUTES;
    const tipo = String(row?.tipo_llegada ?? "").trim();
    const interno = formatPlanillaCell(row?.interno).trim();
    const timeline = timelineByInterno.get(interno) || [];
    const hasArrivalInAnotherPoint = timeline.some(item => item.timeMs > rowTimeMs && item.tipo !== tipo);
    const shouldMove = isOverThreshold || hasArrivalInAnotherPoint;

    if (!shouldMove) {
      activeRows.push(row);
      return;
    }
    const reason = hasArrivalInAnotherPoint
      ? "llegada posterior en otro punto"
      : "en espera por mas de 3 h 30 min";
    noDespachoRows.push({ ...row, __noDespachoReason: reason });
  });

  return { activeRows, noDespachoRows };
}

function resolveDispatchItineraryValue(row){
  const directId = String(row?.itinerary ?? row?.itinerary_id ?? row?.itinerario_id ?? "").trim();
  if (directId && SONAR_ITINERARIES.some(item => String(item.id) === directId)) return directId;
  const byNameCandidates = [
    row?.itinerario_llegada,
    row?.itinerario_despacho
  ];
  for (const rawName of byNameCandidates) {
    const key = normalizeItineraryKey(rawName);
    if (!key) continue;
    const found = SONAR_ITINERARIES.find(item => normalizeItineraryKey(item.nombre) === key);
    if (found?.id) return String(found.id);
  }
  const candidates = [
    row?.tipo_llegada
  ];
  for (const item of candidates) {
    const val = String(item ?? "").trim();
    if (val && SONAR_ITINERARIES.some(it => String(it.id) === val)) return val;
  }
  return "";
}

function getDispatchItineraryOptionsForRow(row){
  const pointKey = getNoDespachoPointKey(row);
  if (pointKey === "aeropuerto") {
    return SONAR_ITINERARIES.filter(item => String(item?.grupo || "").trim().toUpperCase() === "AEROPUERTO");
  }
  return SONAR_ITINERARIES;
}

function getSonarItineraryById(itineraryId){
  const id = String(itineraryId || "").trim();
  if (!id) return null;
  return SONAR_ITINERARIES.find(item => String(item.id) === id) || null;
}

function getRowDispatchRegId(row){
  const source = row && typeof row === "object" ? row : {};
  const candidates = [
    source.reg_id,
    source.regid,
    source.regId
  ];
  for (const item of candidates) {
    const value = String(item || "").trim();
    if (value) return value;
  }
  return "";
}

function setRowDispatchRegId(row, regId){
  if (!row || typeof row !== "object") return;
  const value = String(regId || "").trim();
  if (!value) return;
  row.reg_id = value;
  row.regid = value;
  row.regId = value;
}

function extractDispatchRegId(result){
  const candidates = [
    result?.data?.regId,
    result?.regId,
    result?.data?.regid,
    result?.regid
  ];
  for (const item of candidates) {
    const value = String(item || "").trim();
    if (value) return value;
  }
  return "";
}

function normalizeDriverName(value){
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

function findDriverIdByName(driverName, base){
  const raw = String(driverName || "").trim();
  if (!raw) return "";
  const enabledRows = (driversCatalogRows || []).filter(row => String(row?.status || "").trim().toUpperCase() === "ENABLED");
  const directById = enabledRows.find(row => String(row?.dr_id || "").trim() === raw);
  if (directById?.dr_id) return String(directById.dr_id).trim();
  const nameKey = normalizeDriverName(raw);
  const baseCanonical = getBaseCanonical(base || "");
  const exactInBase = enabledRows.find(row => normalizeDriverName(row?.nombre) === nameKey && (!baseCanonical || getCsvDriverBase(row) === baseCanonical));
  if (exactInBase?.dr_id) return String(exactInBase.dr_id).trim();
  const exactAny = enabledRows.find(row => normalizeDriverName(row?.nombre) === nameKey);
  if (exactAny?.dr_id) return String(exactAny.dr_id).trim();
  return "";
}

function canDispatchRow(row){
  return !hasValidDespacho(row)
    && !!String(row?.mid ?? "").trim();
}

const MAX_CANCEL_AGE_MIN = 60;

function getMinutesSince(dateLike){
  if (!dateLike) return null;
  const d = (dateLike instanceof Date) ? dateLike : new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;
  return (Date.now() - d.getTime()) / 60000;
}

function isWithinCancelWindow(dateLike, maxMinutes = MAX_CANCEL_AGE_MIN){
  const mins = getMinutesSince(dateLike);
  if (mins === null) return false;
  if (mins < 0) return true; // tolera relojes desincronizados
  return mins <= maxMinutes;
}

function getDispatchAgeMinutes(row){
  const d = parsePlanillaDateTime(row?.hora_despacho);
  return d ? getMinutesSince(d) : null;
}

function canCancelDispatchRow(row){
  if (!hasValidDespacho(row)) return false;
  if (!String(row?.mid ?? "").trim()) return false;
  if (!getRowDispatchRegId(row)) return false;
  const age = getDispatchAgeMinutes(row);
  if (age !== null && age > MAX_CANCEL_AGE_MIN) return false;
  return true;
}

function canRemoveRowFromArrivalList(row){
  return !isRowOutOfList(row);
}

function getDispatchButtonHtml(row){
  const rowUiId = ensureRowUiId(row);
  const mobileMoreBtn = `<button type="button" class="btn btn-ghost btn-mobile-more" data-row-ui="${escapeHtml(rowUiId)}" title="Mostrar mas datos">Ver mas</button>`;
  const editBtn = `<button type="button" class="btn btn-ghost btn-edit-planilla" data-row-ui="${escapeHtml(rowUiId)}" title="Editar pasajeros y observaciones">Editar</button>`;
  const loadingRemove = removingFromListRowUiIds.has(rowUiId);
  const removeDisabled = loadingRemove || !canRemoveRowFromArrivalList(row);
  const removeLabel = loadingRemove ? "Sacando..." : "Sacar";
  const removeTitle = removeDisabled && !loadingRemove
    ? "Este vehiculo ya fue retirado de la lista"
    : "Sacar vehiculo de la lista por novedad";
  const removeBtn = `<button type="button" class="btn btn-danger btn-remove-list" data-row-ui="${escapeHtml(rowUiId)}" ${removeDisabled ? "disabled" : ""} title="${escapeHtml(removeTitle)}">${escapeHtml(removeLabel)}</button>`;
  if (hasValidDespacho(row)) {
    const loadingCancel = cancelingRowUiIds.has(rowUiId);
    const canCancel = canCancelDispatchRow(row);
    const age = getDispatchAgeMinutes(row);
    const ageExpired = age !== null && age > MAX_CANCEL_AGE_MIN;
    const label = loadingCancel ? "Cancelando..." : "Cancelar";
    let title = "Cancelar este despacho en Sonar";
    if (!canCancel) {
      if (ageExpired) {
        title = `Tiempo expirado: el despacho tiene ${Math.floor(age)} min (max ${MAX_CANCEL_AGE_MIN} min)`;
      } else if (!getRowDispatchRegId(row)) {
        title = "No se puede cancelar: falta regId guardado";
      } else {
        title = "No se puede cancelar este despacho";
      }
    }
    const cancelBtn = `<button type="button" class="btn btn-danger btn-cancel-sonar" data-row-ui="${escapeHtml(rowUiId)}" ${loadingCancel || !canCancel ? "disabled" : ""} title="${escapeHtml(title)}">${escapeHtml(label)}</button>`;
    return `<div class="row" style="gap:6px;flex-wrap:wrap">${cancelBtn}${removeBtn}${editBtn}${mobileMoreBtn}</div>`;
  }
  const loading = dispatchingRowUiIds.has(rowUiId);
  const disabled = loading || !canDispatchRow(row);
  const label = loading ? "Despachando..." : "Despachar";
  const title = disabled && !loading
    ? "Requiere MID."
    : "Enviar despacho a Sonar";
  const dispatchBtn = `<button type="button" class="btn btn-ghost btn-dispatch-sonar" data-row-ui="${escapeHtml(rowUiId)}" ${disabled ? "disabled" : ""} title="${escapeHtml(title)}">${escapeHtml(label)}</button>`;
  return `<div class="row" style="gap:6px;flex-wrap:wrap">${dispatchBtn}${removeBtn}${editBtn}${mobileMoreBtn}</div>`;
}

async function sendOutOfListWebhook(entry){
  if (!OUT_OF_LIST_WEBHOOK_URL) return { success: false, skipped: true, message: "Webhook no configurado" };
  const payload = {
    event: "vehiculo_fuera_lista",
    sent_at: new Date().toISOString(),
    app: "panel_llegadas_vehiculos",
    data: entry
  };
  const response = await fetch(OUT_OF_LIST_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Webhook HTTP ${response.status}${body ? `: ${body.slice(0, 180)}` : ""}`);
  }
  return { success: true, status: response.status };
}

function getRowByUiId(rowUiId){
  const target = String(rowUiId || "").trim();
  if (!target) return null;
  const allRows = Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [];
  return allRows.find(row => ensureRowUiId(row) === target) || null;
}

async function persistDispatchOnPlanillaRow(row, payload){
  const rowId = row?.id;
  if (!rowId) return;
  const patch = {
    estado: "Despachado",
    hora_despacho: payload?.horaDespachoIso || new Date().toISOString(),
    observaciones: payload.observaciones ?? row?.observaciones ?? "",
    driver_id: payload.drvId || row?.driver_id || null
  };
  if (payload?.itineraryLabel) patch.itinerario_despacho = payload.itineraryLabel;
  const { error } = await planillaSupabaseClient
    .from(currentPlanillaTableName)
    .update(patch)
    .eq("id", rowId);
  if (error) throw error;
  const regId = String(payload?.dispatchRegId || payload?.regId || "").trim();
  if (regId) {
    const persistedColumn = await persistPlanillaRegIdByKnownColumns(rowId, regId);
    if (!persistedColumn) {
      throw new Error("No existe columna reg_id/regid/regId para guardar regId.");
    }
  }
}

async function persistPlanillaRegIdByKnownColumns(rowId, regId){
  const id = rowId;
  const value = String(regId || "").trim();
  if (!id || !value) return "";
  for (const columnName of PLANILLA_OPTIONAL_REG_ID_COLUMNS) {
    const patch = { [columnName]: value };
    const { error } = await planillaSupabaseClient
      .from(currentPlanillaTableName)
      .update(patch)
      .eq("id", id);
    if (!error) return columnName;
  }
  return "";
}

async function persistCancelOnPlanillaRow(row, payload){
  const rowId = row?.id;
  if (!rowId) return;
  const patch = {
    hora_despacho: null,
    estado: "En espera",
    itinerario_despacho: null
  };
  if (payload?.driverId) patch.driver_id = payload.driverId;
  const { error } = await planillaSupabaseClient
    .from(currentPlanillaTableName)
    .update(patch)
    .eq("id", rowId);
  if (error) throw error;
}

async function clearPlanillaDispatchByRegIdInDb(regId){
  const value = String(regId || "").trim();
  if (!value) return false;
  for (const col of PLANILLA_OPTIONAL_REG_ID_COLUMNS) {
    try {
      const { data, error } = await planillaSupabaseClient
        .from(currentPlanillaTableName)
        .update({
          hora_despacho: null,
          estado: "En espera",
          itinerario_despacho: null
        })
        .eq(col, value)
        .select("id");
      if (error) continue;
      if (Array.isArray(data) && data.length > 0) return true;
    } catch (_) { /* prueba siguiente columna */ }
  }
  return false;
}

async function resolvePlanillaRowIdForUpdate(row){
  let rowId = row?.id;
  if (!rowId) {
    const targetKey = String(row?.cruce_key || "").trim();
    if (targetKey) {
      const match = (Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [])
        .find(item => String(item?.cruce_key || "").trim() === targetKey && !!item?.id);
      if (match?.id) rowId = match.id;
    }
  }
  if (!rowId) {
    const targetKey = String(row?.cruce_key || "").trim();
    if (targetKey) {
      const { data, error } = await planillaSupabaseClient
        .from(PLANILLA_TABLE_NAME)
        .select("id")
        .eq("cruce_key", targetKey)
        .limit(1);
      if (error) throw error;
      if (Array.isArray(data) && data[0]?.id) rowId = data[0].id;
    }
  }
  if (!rowId) {
    const mid = String(row?.mid || "").trim();
    const interno = String(row?.interno || "").trim();
    if (mid || interno) {
      let query = planillaSupabaseClient
        .from(PLANILLA_TABLE_NAME)
        .select("id")
        .order("hora_llegada", { ascending: false, nullsFirst: false })
        .limit(1);
      if (mid) query = query.eq("mid", mid);
      else query = query.eq("interno", interno);
      const { data, error } = await query;
      if (error) throw error;
      if (Array.isArray(data) && data[0]?.id) rowId = data[0].id;
    }
  }
  if (!rowId) {
    throw new Error("No se pudo identificar el id de la fila para actualizar.");
  }
  return rowId;
}

async function persistPassengersAndObservacionesOnPlanillaRow(row, payload){
  const rowId = await resolvePlanillaRowIdForUpdate(row);
  const patch = {
    pasajeros: String(payload?.pasajeros ?? row?.pasajeros ?? "").trim(),
    observaciones: String(payload?.observaciones ?? row?.observaciones ?? "").trim()
  };
  const { error } = await planillaSupabaseClient
    .from(PLANILLA_TABLE_NAME)
    .update(patch)
    .eq("id", rowId);
  if (error) throw error;

  const { data: checkData, error: checkError } = await planillaSupabaseClient
    .from(PLANILLA_TABLE_NAME)
    .select("id, pasajeros, observaciones")
    .eq("id", rowId)
    .limit(1);
  if (checkError) throw checkError;
  const updatedRow = Array.isArray(checkData) ? checkData[0] : checkData;
  if (updatedRow) {
    const savedPasajeros = String(updatedRow?.pasajeros ?? "").trim();
    const savedObservaciones = String(updatedRow?.observaciones ?? "").trim();
    if (savedPasajeros !== patch.pasajeros || savedObservaciones !== patch.observaciones) {
      throw new Error("Supabase respondio sin error, pero la fila no quedo actualizada. Revisa que la policy UPDATE aplique para esta fila.");
    }
    return updatedRow;
  }
  return { id: rowId, ...patch };
}

/* ============ Registro en despachos_realizados ============ */
const DESPACHOS_REALIZADOS_TABLE = "despachos_realizados";

function getPlacaForMidLocal(mid){
  const m = String(mid || "").trim().toUpperCase();
  if (!m) return "";
  const rows = Array.isArray(vehiculosSonarRows) ? vehiculosSonarRows : [];
  const found = rows.find(r => String(r?.mid || "").trim().toUpperCase() === m);
  return String(found?.placa || "").trim();
}

async function insertDespachoRealizado(payload, dispatchResult, row){
  if (!currentUserId) return null;
  let regId = String(
    payload?.dispatchRegId || extractDispatchRegId(dispatchResult) || ""
  ).trim();
  let regIdSintetico = false;
  if (!regId) {
    // Sonar no devolvio reg_id: NO perdemos el despacho. Lo registramos igual
    // con un id local (prefijo LOCAL-) para que aparezca en la planilla y el
    // historial. No se marca en la fila viva, asi el flujo de cancelacion por
    // reg_id real de Sonar no se ve afectado.
    regId = `LOCAL-${String(payload?.mId || "").trim() || "x"}-${Date.now()}`;
    regIdSintetico = true;
    console.warn("[despachos_realizados] Sonar no devolvio reg_id; se registra con id local:", regId);
  }
  const pasajerosNum = parseInt(String(row?.pasajeros ?? "").trim(), 10);
  const record = {
    reg_id: regId,
    vehicle_id: String(payload?.mId || "").trim().toUpperCase(),
    interno: String(payload?.interno || row?.interno || "").trim(),
    placa: getPlacaForMidLocal(payload?.mId),
    itinerario_id: String(payload?.itinerary || "").trim(),
    itinerario: String(payload?.itineraryLabel || "").trim(),
    driver_id: String(payload?.drvId || "").trim(),
    observaciones: [
      String(payload?.observaciones || "").trim(),
      regIdSintetico ? "[Sonar no devolvio reg_id]" : "",
    ].filter(Boolean).join(" ").trim(),
    ficho: String(payload?.ficho || "").trim() || null,
    pasajeros: Number.isFinite(pasajerosNum) ? pasajerosNum : 0,
    estado: "ACTIVO",
    created_by: currentUserId,
  };
  try {
    const { data, error } = await planillaSupabaseClient
      .from(DESPACHOS_REALIZADOS_TABLE)
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`[${DESPACHOS_REALIZADOS_TABLE}] Insert fallo:`, err);
    showToast(
      `Despacho enviado, pero no se registro en ${DESPACHOS_REALIZADOS_TABLE}: ${err?.message || err}`,
      "warn"
    );
    return null;
  }
}

async function markDespachoRealizadoAsCanceled(regId, cancelResponse){
  const id = String(regId || "").trim();
  if (!id) return;
  try {
    const { error } = await planillaSupabaseClient
      .from(DESPACHOS_REALIZADOS_TABLE)
      .update({
        estado: "CANCELADO",
        cancelled_at: new Date().toISOString(),
        cancel_response: cancelResponse ?? null,
      })
      .eq("reg_id", id);
    if (error) throw error;
  } catch (err) {
    console.error(`[${DESPACHOS_REALIZADOS_TABLE}] Update cancel fallo:`, err);
    showToast(
      `Cancelacion enviada, pero no se reflejo en ${DESPACHOS_REALIZADOS_TABLE}: ${err?.message || err}`,
      "warn"
    );
  }
}

async function sendDispatchToSonar(payload){
  const response = await fetch(SONAR_DISPATCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SONAR_DISPATCH_KEY,
      Authorization: `Bearer ${SONAR_DISPATCH_KEY}`
    },
    body: JSON.stringify(payload)
  });
  const raw = await response.text();
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch (e) {
    parsed = null;
  }
  if (!response.ok) {
    throw new Error(parsed?.message || `HTTP ${response.status}`);
  }
  if (parsed && parsed.success === false) {
    throw new Error(String(parsed?.message || "sonar-dispatch rechazo la solicitud"));
  }
  return parsed ?? { success: true, raw };
}

async function sendCancelDispatchToSonar(payload){
  const response = await fetch(SONAR_CANCEL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SONAR_CANCEL_KEY,
      Authorization: `Bearer ${SONAR_CANCEL_KEY}`
    },
    body: JSON.stringify(payload)
  });
  const raw = await response.text();
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch (e) {
    parsed = null;
  }
  if (!response.ok) {
    throw new Error(parsed?.message || `HTTP ${response.status}`);
  }
  if (parsed && parsed.success === false) {
    throw new Error(String(parsed?.message || "sonar-cancel rechazo la solicitud"));
  }
  return parsed ?? { success: true, raw };
}

async function handleDispatchRow(rowUiId){
  const row = getRowByUiId(rowUiId);
  if (!row) {
    showToast("No se encontro la fila para despachar.", "warn");
    return;
  }
  if (hasValidDespacho(row)) {
    showToast("Esta fila ya tiene despacho.", "warn");
    return;
  }
  const payload = {
    mId: String(row?.mid ?? "").trim(),
    drvId: String(row?.driver_id ?? "").trim() || findDriverIdByName(row?.conductor, row?.base),
    observaciones: String(row?.observaciones ?? "")
  };
  if (!payload.mId) {
    showToast("Falta MID para despachar.", "warn");
    return;
  }
  const suggestedItineraryId = resolveDispatchItineraryValue(row);
  const itineraryOptions = getDispatchItineraryOptionsForRow(row);
  const modalResult = await openDispatchConfirmModal({
    interno: formatPlanillaCell(row?.interno),
    base: formatPlanillaCell(row?.base),
    mid: payload.mId,
    driverId: payload.drvId,
    itineraryId: suggestedItineraryId,
    itineraryOptions,
    observaciones: payload.observaciones || "-"
  });
  if (!modalResult?.confirmed) return;
  payload.drvId = String(modalResult?.driverId || payload.drvId || "").trim();
  payload.itinerary = String(modalResult?.itineraryId || suggestedItineraryId || "").trim();
  if (!payload.drvId) {
    showToast("Selecciona un Driver ID en el modal para despachar.", "warn");
    return;
  }
  if (!payload.itinerary) {
    showToast("Selecciona un itinerario en el modal para despachar.", "warn");
    return;
  }
  payload.itineraryLabel = String(getSonarItineraryById(payload.itinerary)?.nombre || payload.itinerary);
  const uiId = ensureRowUiId(row);
  let shouldReloadFromDb = false;
  dispatchingRowUiIds.add(uiId);
  renderLlegadasAeropuerto();
  renderLlegadasTerminalNorte();
  renderLlegadasSanDiego();
  renderLlegadasNutibara();
  renderNoDespachoTab();
  try {
    const result = await sendDispatchToSonar(payload);
    const dispatchRegId = extractDispatchRegId(result);
    if (dispatchRegId) {
      payload.dispatchRegId = dispatchRegId;
      setRowDispatchRegId(row, dispatchRegId);
    }
    const nowIso = new Date().toISOString();
    row.driver_id = payload.drvId;
    row.estado = "Despachado";
    row.hora_despacho = nowIso;
    if (payload.itineraryLabel) row.itinerario_despacho = payload.itineraryLabel;
    payload.horaDespachoIso = nowIso;
    invalidatePlanillaDispatchResolutionCache();
    insertDespachoRealizado(payload, result, row).catch(() => {});
    try {
      await persistDispatchOnPlanillaRow(row, payload);
      shouldReloadFromDb = true;
    } catch (persistErr) {
      console.error("No se pudo persistir despacho en planilla:", persistErr);
      showToast("Despacho enviado, pero no se guardo en tabla planilla.", "warn");
    }
    const regIdTxt = dispatchRegId;
    showToast(`Despacho enviado${regIdTxt ? ` (regId ${regIdTxt})` : ""}.`, "ok");
    notifyDispatchServerSyncDelay();
  } catch (error) {
    showToast(`Error al despachar: ${error?.message || "fallo en sonar-dispatch"}`, "err");
  } finally {
    dispatchingRowUiIds.delete(uiId);
    if (shouldReloadFromDb) {
      await loadPlanillaAfiliadosFromSupabase();
      return;
    }
    renderLlegadasAeropuerto();
    renderLlegadasTerminalNorte();
    renderLlegadasSanDiego();
    renderLlegadasNutibara();
    renderNoDespachoTab();
  }
}

function findPlanillaRowForManualDispatch(payload){
  const rowsList = Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [];
  const mid = String(payload?.mId || "").trim();
  const interno = String(payload?.interno || "").trim();
  const matches = rowsList.filter(row => {
    const rowMid = String(row?.mid || "").trim();
    const rowInterno = String(row?.interno || "").trim();
    if (mid && rowMid && rowMid === mid) return true;
    if (interno && rowInterno && rowInterno === interno) return true;
    return false;
  });
  if (!matches.length) return null;
  matches.sort((a, b) => {
    const da = getLlegadaReferenceDate(a);
    const db = getLlegadaReferenceDate(b);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db.getTime() - da.getTime();
  });
  return matches[0];
}

async function handleManualDispatch(){
  const modalResult = await openManualDispatchModal();
  if (!modalResult?.confirmed) return;
  const payload = {
    mId: String(modalResult?.mId || "").trim(),
    drvId: String(modalResult?.drvId || "").trim(),
    itinerary: String(modalResult?.itinerary || "").trim(),
    observaciones: String(modalResult?.observaciones || "").trim(),
    interno: String(modalResult?.interno || "").trim(),
    base: String(modalResult?.base || getManualDispatchDefaultBase() || "").trim(),
    conductorName: String(modalResult?.conductorName || "").trim()
  };
  if (!payload.interno || !payload.mId || !payload.drvId || !payload.itinerary) {
    showToast("Despacho manual: faltan Interno, MID, Driver ID o Itinerario.", "warn");
    return;
  }
  payload.itineraryLabel = String(getSonarItineraryById(payload.itinerary)?.nombre || payload.itinerary);
  let shouldReloadFromDb = false;
  try {
    const result = await sendDispatchToSonar(payload);
    const row = findPlanillaRowForManualDispatch(payload);
    const dispatchRegId = extractDispatchRegId(result);
    if (dispatchRegId) payload.dispatchRegId = dispatchRegId;
    const nowIso = new Date().toISOString();
    payload.horaDespachoIso = nowIso;
    insertDespachoRealizado(payload, result, row).catch(() => {});
    if (row) {
      if (dispatchRegId) setRowDispatchRegId(row, dispatchRegId);
      row.driver_id = payload.drvId;
      row.estado = "Despachado";
      row.hora_despacho = nowIso;
      if (payload.itineraryLabel) row.itinerario_despacho = payload.itineraryLabel;
      invalidatePlanillaDispatchResolutionCache();
      try {
        await persistDispatchOnPlanillaRow(row, payload);
        shouldReloadFromDb = true;
      } catch (persistErr) {
        console.error("No se pudo persistir despacho manual en planilla:", persistErr);
        showToast("Despacho manual enviado, pero no se guardo en planilla.", "warn");
      }
    }
    const regIdTxt = dispatchRegId;
    showToast(`Despacho manual enviado${regIdTxt ? ` (regId ${regIdTxt})` : ""}.`, "ok");
    notifyDispatchServerSyncDelay();
  } catch (error) {
    showToast(`Error en despacho manual: ${error?.message || "fallo en sonar-dispatch"}`, "err");
  } finally {
    if (shouldReloadFromDb) {
      await loadPlanillaAfiliadosFromSupabase();
      return;
    }
    renderLlegadasAeropuerto();
    renderLlegadasTerminalNorte();
    renderLlegadasSanDiego();
    renderLlegadasNutibara();
    renderNoDespachoTab();
  }
}

async function handleCancelDispatchRow(rowUiId){
  const row = getRowByUiId(rowUiId);
  if (!row) {
    showToast("No se encontro la fila para cancelar.", "warn");
    return;
  }
  if (!hasValidDespacho(row)) {
    showToast("La fila no tiene despacho activo para cancelar.", "warn");
    return;
  }
  const regId = getRowDispatchRegId(row);
  const mId = String(row?.mid || "").trim();
  if (!mId || !regId) {
    showToast("No se puede cancelar: falta MID o regId.", "warn");
    return;
  }
  const ageMin = getDispatchAgeMinutes(row);
  if (ageMin !== null && ageMin > MAX_CANCEL_AGE_MIN) {
    showToast(`Tiempo expirado: el despacho tiene ${Math.floor(ageMin)} min (max ${MAX_CANCEL_AGE_MIN}).`, "warn");
    return;
  }
  const modalResult = await openCancelDispatchModal({
    interno: formatPlanillaCell(row?.interno),
    base: formatPlanillaCell(row?.base),
    mid: mId,
    regId,
    horaDespacho: getDespachoDateTimeText(row)
  });
  if (!modalResult?.confirmed) return;
  const comments = String(modalResult?.comments || "").trim();
  if (comments.length < 5) {
    showToast("Escribe un motivo de minimo 5 caracteres para cancelar.", "warn");
    return;
  }
  const uiId = ensureRowUiId(row);
  cancelingRowUiIds.add(uiId);
  renderLlegadasAeropuerto();
  renderLlegadasTerminalNorte();
  renderLlegadasSanDiego();
  renderLlegadasNutibara();
  renderNoDespachoTab();
  try {
    const payload = {
      mId,
      regId,
      comments,
      dispatchId: row?.id ?? null,
      canceledBy: currentUserEmail || currentUserId || "desconocido",
      canceledAt: new Date().toISOString(),
      vehicle: {
        interno: formatPlanillaCell(row?.interno),
        base: formatPlanillaCell(row?.base)
      },
      dispatch: {
        itinerary: formatPlanillaCell(row?.itinerario_despacho),
        hora_despacho: formatPlanillaCell(row?.hora_despacho),
        driver_id: formatPlanillaCell(row?.driver_id)
      }
    };
    const cancelResult = await sendCancelDispatchToSonar(payload);
    row.hora_despacho = null;
    row.itinerario_despacho = "";
    row.estado = "En espera";
    invalidatePlanillaDispatchResolutionCache();
    markDespachoRealizadoAsCanceled(regId, cancelResult).catch(() => {});
    let persisted = false;
    try {
      await persistCancelOnPlanillaRow(row, { comments, driverId: row?.driver_id });
      persisted = true;
    } catch (persistErr) {
      console.error("No se pudo persistir cancelacion por id:", persistErr);
    }
    if (!persisted) {
      persisted = await clearPlanillaDispatchByRegIdInDb(regId);
      if (persisted) await loadPlanillaAfiliadosFromSupabase();
    }
    showToast(persisted
      ? "Despacho cancelado en Sonar."
      : "Cancelacion enviada, pero no se actualizo planilla.", persisted ? "ok" : "warn");
  } catch (error) {
    showToast(`Error al cancelar: ${error?.message || "fallo en sonar-cancel"}`, "err");
  } finally {
    cancelingRowUiIds.delete(uiId);
    renderLlegadasAeropuerto();
    renderLlegadasTerminalNorte();
    renderLlegadasSanDiego();
    renderLlegadasNutibara();
    renderNoDespachoTab();
  }
}

function renderFueraListaTab(){
  if (!fueraListaBody) return;
  const search = String(fueraListaSearch?.value || "").trim().toLowerCase();
  const list = Array.isArray(outOfListVehicles) ? outOfListVehicles : [];
  const visible = search
    ? list.filter(item => {
      const tokens = [
        item?.interno,
        item?.mid,
        item?.base,
        item?.punto,
        item?.observacion,
        item?.retirado_por,
        item?.hora_llegada
      ];
      return tokens.join(" ").toLowerCase().includes(search);
    })
    : list;
  if (fueraListaCount) fueraListaCount.textContent = String(visible.length);
  if (!visible.length) {
    fueraListaBody.innerHTML = `<tr><td colspan="9" class="muted" style="text-align:center;padding:12px">Sin vehiculos retirados localmente.</td></tr>`;
    return;
  }
  fueraListaBody.innerHTML = visible.map(item => {
    const retiroAt = formatPlanillaDateTime(item?.retirado_en || item?.created_at || "");
    const webhookTxt = item?.webhook_ok
      ? "Enviado"
      : (item?.webhook_error ? "Error" : "Pendiente");
    return `<tr>
      <td>${escapeHtml(retiroAt)}</td>
      <td>${escapeHtml(formatPlanillaCell(item?.punto || "-"))}</td>
      <td>${escapeHtml(formatPlanillaCell(item?.base || "-"))}</td>
      <td><strong style="color:#065f46">${escapeHtml(formatPlanillaCell(item?.interno || "-"))}</strong></td>
      <td>${escapeHtml(formatPlanillaCell(item?.mid || "-"))}</td>
      <td>${escapeHtml(formatPlanillaCell(item?.hora_llegada || "-"))}</td>
      <td>${escapeHtml(formatPlanillaCell(item?.observacion || "-"))}</td>
      <td>${escapeHtml(formatPlanillaCell(item?.retirado_por || "-"))}</td>
      <td>${escapeHtml(webhookTxt)}</td>
    </tr>`;
  }).join("");
}

async function handleRemoveFromListRow(rowUiId){
  const row = getRowByUiId(rowUiId);
  if (!row) {
    showToast("No se encontro la fila para retirar.", "warn");
    return;
  }
  if (isRowOutOfList(row)) {
    showToast("Ese vehiculo ya fue retirado de la lista.", "warn");
    return;
  }
  const punto = getNoDespachoPointLabel(row);
  const modalResult = await openRemoveFromListModal({
    interno: formatPlanillaCell(row?.interno),
    base: formatPlanillaCell(row?.base),
    mid: formatPlanillaCell(row?.mid),
    punto
  });
  if (!modalResult?.confirmed) return;
  const observacion = String(modalResult?.observacion || "").trim();
  if (observacion.length < 8) {
    showToast("La observacion debe tener minimo 8 caracteres.", "warn");
    return;
  }
  const uiId = ensureRowUiId(row);
  removingFromListRowUiIds.add(uiId);
  renderLlegadasAeropuerto();
  renderLlegadasTerminalNorte();
  renderLlegadasSanDiego();
  renderLlegadasNutibara();
  renderNoDespachoTab();
  try {
    const entry = {
      id: `out-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      row_id: row?.id ?? null,
      row_key: buildOutOfListRowKey(row),
      interno: formatPlanillaCell(row?.interno),
      mid: formatPlanillaCell(row?.mid),
      base: formatPlanillaCell(row?.base),
      punto,
      hora_llegada: formatPlanillaDateTime(row?.hora_llegada || row?.generado_en || row?.created_at),
      itinerario_llegada: formatPlanillaCell(row?.itinerario_llegada),
      observacion,
      retirado_por: currentUserEmail || currentUserId || "desconocido",
      retirado_en: new Date().toISOString(),
      webhook_ok: false,
      webhook_error: ""
    };
    const added = addOutOfListVehicleEntry(entry);
    if (!added) {
      showToast("Ese vehiculo ya estaba retirado localmente.", "warn");
      return;
    }
    try {
      await sendOutOfListWebhook(entry);
      updateOutOfListEntry(entry.id, { webhook_ok: true, webhook_error: "" });
      if (fueraListaStatus) fueraListaStatus.textContent = `Webhook enviado: ${fechaHoraCO(new Date())}`;
    } catch (webErr) {
      updateOutOfListEntry(entry.id, { webhook_ok: false, webhook_error: String(webErr?.message || "Error webhook") });
      if (fueraListaStatus) fueraListaStatus.textContent = `Error webhook: ${String(webErr?.message || "sin detalle")}`;
      showToast("Retirado localmente, pero fallo el webhook.", "warn");
    }
    showToast("Vehiculo retirado de la lista.", "ok");
  } finally {
    removingFromListRowUiIds.delete(uiId);
    renderLlegadasAeropuerto();
    renderLlegadasTerminalNorte();
    renderLlegadasSanDiego();
    renderLlegadasNutibara();
    renderNoDespachoTab();
    renderFueraListaTab();
  }
}

async function handleEditPlanillaRow(rowUiId){
  const row = getRowByUiId(rowUiId);
  if (!row) {
    showToast("No se encontro la fila para editar.", "warn");
    return;
  }
  const modalResult = await openEditPlanillaModal({
    interno: formatPlanillaCell(row?.interno),
    base: formatPlanillaCell(row?.base),
    mid: formatPlanillaCell(row?.mid),
    pasajeros: formatPlanillaCell(row?.pasajeros),
    observaciones: formatPlanillaCell(row?.observaciones)
  });
  if (!modalResult?.confirmed) return;
  const pasajerosRaw = String(modalResult?.pasajeros || "").trim();
  const observaciones = String(modalResult?.observaciones || "").trim();
  if (pasajerosRaw && !/^\d+$/.test(pasajerosRaw)) {
    showToast("Pasajeros debe ser un numero entero.", "warn");
    return;
  }
  const pasajerosNumber = pasajerosRaw === "" ? null : Number(pasajerosRaw);
  if (pasajerosNumber !== null && (!Number.isFinite(pasajerosNumber) || pasajerosNumber < 0)) {
    showToast("Pasajeros no puede ser negativo.", "warn");
    return;
  }
  const pasajeros = pasajerosRaw;
  try {
    const updated = await persistPassengersAndObservacionesOnPlanillaRow(row, { pasajeros, observaciones });
    row.pasajeros = updated?.pasajeros == null ? "" : String(updated.pasajeros);
    row.observaciones = String(updated?.observaciones ?? "");
    const updatedId = String(updated?.id || row?.id || "").trim();
    if (updatedId) {
      (Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : []).forEach(item => {
        if (String(item?.id || "").trim() !== updatedId) return;
        item.pasajeros = row.pasajeros;
        item.observaciones = row.observaciones;
      });
    }
    invalidatePlanillaDispatchResolutionCache();
    showToast("Pasajeros y observaciones actualizados.", "ok");
  } catch (error) {
    showToast(`No se pudo actualizar en Supabase: ${error?.message || "sin detalle"}`, "err");
    return;
  } finally {
    renderPlanillaAfiliados();
    renderLlegadasAeropuerto();
    renderLlegadasTerminalNorte();
    renderLlegadasSanDiego();
    renderLlegadasNutibara();
    renderNoDespachoTab();
    renderFueraListaTab();
  }
}

function bindDispatchButtons(containerEl){
  if (!containerEl) return;
  containerEl.querySelectorAll(".btn-dispatch-sonar[data-row-ui]").forEach(btn => {
    btn.addEventListener("click", () => {
      const rowUiId = btn.getAttribute("data-row-ui") || "";
      handleDispatchRow(rowUiId);
    });
  });
  containerEl.querySelectorAll(".btn-cancel-sonar[data-row-ui]").forEach(btn => {
    btn.addEventListener("click", () => {
      const rowUiId = btn.getAttribute("data-row-ui") || "";
      handleCancelDispatchRow(rowUiId);
    });
  });
  containerEl.querySelectorAll(".btn-remove-list[data-row-ui]").forEach(btn => {
    btn.addEventListener("click", () => {
      const rowUiId = btn.getAttribute("data-row-ui") || "";
      handleRemoveFromListRow(rowUiId);
    });
  });
  containerEl.querySelectorAll(".btn-edit-planilla[data-row-ui]").forEach(btn => {
    btn.addEventListener("click", () => {
      const rowUiId = btn.getAttribute("data-row-ui") || "";
      handleEditPlanillaRow(rowUiId);
    });
  });
  containerEl.querySelectorAll(".btn-mobile-more[data-row-ui]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tr = btn.closest("tr");
      if (!tr) return;
      const expanded = tr.classList.toggle("mobile-expanded");
      btn.textContent = expanded ? "Ver menos" : "Ver mas";
    });
  });
}

function renderLlegadasRowsHtml(rowsInput, includeReason){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  return rows.map(row => {
    ensureRowUiId(row);
    const date = getLlegadaReferenceDate(row);
    const horaTxt = formatPlanillaDateTime(row?.hora_llegada || row?.generado_en || row?.hora_despacho);
    const despachoTxt = getDespachoDateTimeText(row);
    const operacionTxt = getOperacionEstadoText(row);
    const baseRaw = formatPlanillaCell(row?.base);
    const internoTxt = formatPlanillaCell(row?.interno);
    const baseMap = getBaseNumForInterno(row?.interno);
    const baseTxt = baseMap || baseRaw;
    const baseTitle = baseMap
      ? `Base ${baseMap} (afiliacion)${baseRaw && baseRaw !== "-" && baseRaw !== baseMap ? ` · operativa ${baseRaw}` : ""}`
      : (baseRaw && baseRaw !== "-" ? `Base ${baseRaw} (operativa)` : "Sin base asignada");
    const itinLlegadaHtml = getItinerarioLlegadaCellHtml(row);
    const itinDespachoTxt = getItinerarioDespachoText(row);
    const reasonTxt = includeReason ? formatPlanillaCell(row?.__noDespachoReason || "-") : "";
    const dispatchBtn = getDispatchButtonHtml(row);
    return `<tr>
      <td data-label="Hora ultima llegada">${escapeHtml(horaTxt)}</td>
      <td data-label="Despacho">${escapeHtml(despachoTxt)}</td>
      <td data-label="Estado"><strong style="color:${operacionTxt === "Despachado" ? "#065f46" : "#b45309"}">${escapeHtml(operacionTxt)}</strong></td>
      <td data-label="Base" title="${escapeHtml(baseTitle)}">${escapeHtml(baseTxt)}</td>
      <td data-label="Interno"><strong style="color:#065f46">${escapeHtml(internoTxt)}</strong></td>
      <td data-label="Itinerario llegada" data-mobile-secondary="1">${itinLlegadaHtml}</td>
      <td data-label="Itinerario despacho" data-mobile-secondary="1"><strong>${escapeHtml(itinDespachoTxt)}</strong></td>
      ${includeReason ? `<td data-label="Motivo no despacho" data-mobile-secondary="1">${escapeHtml(reasonTxt)}</td>` : ""}
      <td data-label="Accion">${dispatchBtn}</td>
    </tr>`;
  }).join("");
}

function getNoDespachoPointKey(row){
  const tipo = String(row?.tipo_llegada ?? "").trim();
  const itinKey = normalizeItineraryKey(getItinerarioLlegadaText(row));
  if (tipo === "129" || itinKey === normalizeItineraryKey(TERMINAL_NORTE_ITINERARY)) return "terminalnorte";
  if (tipo === "104") return "aeropuerto";
  if (tipo === "101") return "sandiego";
  if (tipo === "110") return "nutibara";
  return "otro";
}

function getNoDespachoPointLabel(row){
  const key = getNoDespachoPointKey(row);
  if (key === "aeropuerto") return "Aeropuerto";
  if (key === "terminalnorte") return "Terminalnorte";
  if (key === "sandiego") return "Almacentro";
  if (key === "nutibara") return "Nutibara";
  return "Otro";
}

function getAllOperationalArrivalRows(){
  const allRows = Array.isArray(planillaAfiliadosRows) ? planillaAfiliadosRows : [];
  const arrivals = allRows.filter(row => ARRIVAL_POINT_TYPES.has(String(row?.tipo_llegada ?? "").trim()));
  const eligibleArrivals = filterOutOfListRows(arrivals);
  const operational = getRowsFilteredByEsperaOperationalDay(eligibleArrivals);
  const sorted = operational.slice().sort(comparePlanillaRowsByCurrentDateTime);
  return dedupeLlegadasByHour(sorted);
}

function getNoDespachoRowsForView(options = {}){
  const searchTerm = String(options.searchTerm || "").trim().toLowerCase();
  const punto = String(options.punto || "").trim().toLowerCase();
  const fromIso = String(options.fromIso || "").trim();
  const toIso = String(options.toIso || "").trim();
  const baseFilterValue = String(options.baseFilterValue || "");
  const arrivals = getAllOperationalArrivalRows();
  let rows = splitRowsByNoDespachoRule(arrivals).noDespachoRows;
  if (punto) rows = rows.filter(row => getNoDespachoPointKey(row) === punto);
  rows = getRowsFilteredByUploadDate(rows, fromIso, toIso);
  rows = getRowsFilteredByBase(rows, baseFilterValue);
  if (searchTerm) {
    rows = rows.filter(row => {
      const tokens = [
        getNoDespachoPointLabel(row),
        formatPlanillaDateTime(row?.hora_llegada || row?.generado_en || row?.hora_despacho),
        getDespachoDateTimeText(row),
        getOperacionEstadoText(row),
        formatTimeAgoEs(getLlegadaReferenceDate(row)),
        formatPlanillaCell(row?.base),
        formatPlanillaCell(row?.interno),
        formatPlanillaCell(row?.usuario),
        formatPlanillaCell(row?.pasajeros),
        formatPlanillaCell(row?.observaciones),
        getItinerarioLlegadaText(row),
        getItinerarioDespachoText(row),
        formatPlanillaCell(row?.__noDespachoReason)
      ];
      return tokens.join(" ").toLowerCase().includes(searchTerm);
    });
  }
  return rows.slice().sort(comparePlanillaRowsByCurrentDateTime);
}

function renderNoDespachoTabRows(rowsInput){
  const rows = Array.isArray(rowsInput) ? rowsInput : [];
  return rows.map(row => {
    ensureRowUiId(row);
    const pointTxt = getNoDespachoPointLabel(row);
    const horaTxt = formatPlanillaDateTime(row?.hora_llegada || row?.generado_en || row?.hora_despacho);
    const despachoTxt = getDespachoDateTimeText(row);
    const operacionTxt = getOperacionEstadoText(row);
    const baseRaw = formatPlanillaCell(row?.base);
    const internoTxt = formatPlanillaCell(row?.interno);
    const baseMap = getBaseNumForInterno(row?.interno);
    const baseTxt = baseMap || baseRaw;
    const baseTitle = baseMap
      ? `Base ${baseMap} (afiliacion)${baseRaw && baseRaw !== "-" && baseRaw !== baseMap ? ` · operativa ${baseRaw}` : ""}`
      : (baseRaw && baseRaw !== "-" ? `Base ${baseRaw} (operativa)` : "Sin base asignada");
    const itinLlegadaHtml = getItinerarioLlegadaCellHtml(row);
    const itinDespachoTxt = getItinerarioDespachoText(row);
    const reasonTxt = formatPlanillaCell(row?.__noDespachoReason || "-");
    const dispatchBtn = getDispatchButtonHtml(row);
    return `<tr>
      <td data-label="Punto">${escapeHtml(pointTxt)}</td>
      <td data-label="Hora ultima llegada">${escapeHtml(horaTxt)}</td>
      <td data-label="Despacho">${escapeHtml(despachoTxt)}</td>
      <td data-label="Estado"><strong style="color:${operacionTxt === "Despachado" ? "#065f46" : "#b45309"}">${escapeHtml(operacionTxt)}</strong></td>
      <td data-label="Base" title="${escapeHtml(baseTitle)}">${escapeHtml(baseTxt)}</td>
      <td data-label="Interno"><strong style="color:#065f46">${escapeHtml(internoTxt)}</strong></td>
      <td data-label="Itinerario llegada" data-mobile-secondary="1">${itinLlegadaHtml}</td>
      <td data-label="Itinerario despacho" data-mobile-secondary="1"><strong>${escapeHtml(itinDespachoTxt)}</strong></td>
      <td data-label="Motivo no despacho" data-mobile-secondary="1">${escapeHtml(reasonTxt)}</td>
      <td data-label="Accion">${dispatchBtn}</td>
    </tr>`;
  }).join("");
}

function renderNoDespachoTab(){
  if (!noDespachoBody) return;
  let baseFilterValue = noDespachoBaseFilter?.value || "";
  const rowsForBaseOptions = getNoDespachoRowsForView({
    searchTerm: "",
    punto: noDespachoPuntoFilter?.value || "",
    fromIso: noDespachoFrom?.value || "",
    toIso: noDespachoTo?.value || ""
  });
  syncLlegadasBaseFilterOptions(noDespachoBaseFilter, rowsForBaseOptions);
  baseFilterValue = noDespachoBaseFilter?.value || "";
  const rows = getNoDespachoRowsForView({
    searchTerm: noDespachoSearch?.value || "",
    punto: noDespachoPuntoFilter?.value || "",
    fromIso: noDespachoFrom?.value || "",
    toIso: noDespachoTo?.value || "",
    baseFilterValue
  });
  if (noDespachoCount) noDespachoCount.textContent = String(rows.length);
  if (noDespachoTitle) noDespachoTitle.textContent = "Vehiculos sin despacho (3 h 30 min)";
  if (!rows.length) {
    noDespachoBody.innerHTML = `<tr><td colspan="14" class="muted" style="text-align:center;padding:12px">Sin registros en no despacho.</td></tr>`;
    return;
  }
  noDespachoBody.innerHTML = renderNoDespachoTabRows(rows);
  bindDispatchButtons(noDespachoBody);
}

function renderLlegadasAeropuerto(){
  if (!llegadasAeropuertoBody) return;
  const estadoMode = aeropuertoEstadoFilter?.value || "";
  let baseFilterValue = aeropuertoBaseFilter?.value || "";
  const rowsForBaseOptions = getLlegadasRowsForView("104", {
    searchTerm: "",
    estadoMode: estadoMode === "en_espera" ? "" : estadoMode,
    fromIso: aeropuertoUploadFrom?.value || "",
    toIso: aeropuertoUploadTo?.value || ""
  });
  syncLlegadasBaseFilterOptions(aeropuertoBaseFilter, rowsForBaseOptions);
  baseFilterValue = aeropuertoBaseFilter?.value || "";
  const rowsSource = getLlegadasRowsForView("104", {
    searchTerm: aeropuertoSearch?.value || "",
    estadoMode: estadoMode === "en_espera" ? "" : estadoMode,
    fromIso: aeropuertoUploadFrom?.value || "",
    toIso: aeropuertoUploadTo?.value || "",
    baseFilterValue
  });
  const rows = estadoMode === "en_espera"
    ? getRowsFilteredByEsperaOperationalDay(rowsSource)
    : rowsSource;
  const rowsByRule = splitRowsByNoDespachoRule(rows);
  const visibleRows = rowsByRule.activeRows;
  lastAeropuertoRenderedRows = visibleRows.slice();
  if (llegadasAeropuertoCount) llegadasAeropuertoCount.textContent = String(visibleRows.length);
  if (llegadasAeropuertoTitle) llegadasAeropuertoTitle.textContent = "Ultimas Llegadas Aeropuerto (104)";
  if (visibleRows.length === 0) {
    if (llegadasAeropuertoTabs) llegadasAeropuertoTabs.innerHTML = "";
    llegadasAeropuertoBody.innerHTML = `<tr><td colspan="12" class="muted" style="text-align:center;padding:12px">Sin llegadas de aeropuerto.</td></tr>`;
    return;
  }
  const grouped = new Map();
  visibleRows.forEach(row => {
    const itin = getGroupingItineraryForRow(row, estadoMode);
    if (!grouped.has(itin)) grouped.set(itin, []);
    grouped.get(itin).push(row);
  });

  const itineraries = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b, "es"));
  if (!aeropuertoSelectedItinerary || !grouped.has(aeropuertoSelectedItinerary)) {
    aeropuertoSelectedItinerary = itineraries[0];
  }
  if (llegadasAeropuertoTabs) {
    llegadasAeropuertoTabs.innerHTML = itineraries.map(itin => {
      const active = itin === aeropuertoSelectedItinerary;
      const count = grouped.get(itin)?.length || 0;
      const cls = active ? "btn btn-primary" : "btn btn-ghost";
      const theme = getItineraryThemeByRows(grouped.get(itin), estadoMode);
      const style = getItineraryButtonStyle(theme, active);
      const label = getItineraryGroupLabel(itin);
      return `<button type="button" class="${cls}" style="${style}" data-aep-itin="${escapeHtml(itin)}">${escapeHtml(label)} (${count})</button>`;
    }).join("");
    llegadasAeropuertoTabs.querySelectorAll("[data-aep-itin]").forEach(btn => {
      btn.addEventListener("click", () => {
        aeropuertoSelectedItinerary = btn.getAttribute("data-aep-itin") || "";
        renderLlegadasAeropuerto();
      });
    });
  }

  const selectedRows = visibleRows.filter(row => rowMatchesSelectedItinerary(row, aeropuertoSelectedItinerary, estadoMode));
  lastAeropuertoRenderedRows = selectedRows.slice();
  if (selectedRows.length === 0) {
    llegadasAeropuertoBody.innerHTML = `<tr><td colspan="12" class="muted" style="text-align:center;padding:12px">Sin datos para el itinerario seleccionado.</td></tr>`;
    return;
  }
  llegadasAeropuertoBody.innerHTML = renderLlegadasRowsHtml(selectedRows, false);
  bindDispatchButtons(llegadasAeropuertoBody);
}

function renderLlegadasTerminalNorte(){
  if (!llegadasTerminalNorteBody) return;
  const estadoMode = terminalNorteEstadoFilter?.value || "";
  let baseFilterValue = terminalNorteBaseFilter?.value || "";
  const rowsForBaseOptions = getTerminalNorteRowsForView({
    searchTerm: "",
    estadoMode: estadoMode === "en_espera" ? "" : estadoMode,
    fromIso: terminalNorteUploadFrom?.value || "",
    toIso: terminalNorteUploadTo?.value || ""
  });
  syncLlegadasBaseFilterOptions(terminalNorteBaseFilter, rowsForBaseOptions);
  baseFilterValue = terminalNorteBaseFilter?.value || "";
  const rowsSource = getTerminalNorteRowsForView({
    searchTerm: terminalNorteSearch?.value || "",
    estadoMode: estadoMode === "en_espera" ? "" : estadoMode,
    fromIso: terminalNorteUploadFrom?.value || "",
    toIso: terminalNorteUploadTo?.value || "",
    baseFilterValue
  });
  const rows = estadoMode === "en_espera"
    ? getRowsFilteredByEsperaOperationalDay(rowsSource)
    : rowsSource;
  const rowsByRule = splitRowsByNoDespachoRule(rows);
  const visibleRows = rowsByRule.activeRows;
  lastTerminalNorteRenderedRows = visibleRows.slice();
  if (llegadasTerminalNorteCount) llegadasTerminalNorteCount.textContent = String(visibleRows.length);
  if (llegadasTerminalNorteTitle) llegadasTerminalNorteTitle.textContent = "Ultimas Llegadas Terminalnorte";
  if (visibleRows.length === 0) {
    llegadasTerminalNorteBody.innerHTML = `<tr><td colspan="12" class="muted" style="text-align:center;padding:12px">Sin llegadas de Terminalnorte.</td></tr>`;
    return;
  }
  llegadasTerminalNorteBody.innerHTML = renderLlegadasRowsHtml(visibleRows, false);
  bindDispatchButtons(llegadasTerminalNorteBody);
}

function renderLlegadasSanDiego(){
  if (!llegadasSanDiegoBody) return;
  const estadoMode = sanDiegoEstadoFilter?.value || "";
  let baseFilterValue = sanDiegoBaseFilter?.value || "";
  const rowsForBaseOptions = getLlegadasRowsForView("101", {
    searchTerm: "",
    estadoMode: estadoMode === "en_espera" ? "" : estadoMode,
    fromIso: sanDiegoUploadFrom?.value || "",
    toIso: sanDiegoUploadTo?.value || ""
  });
  syncLlegadasBaseFilterOptions(sanDiegoBaseFilter, rowsForBaseOptions);
  baseFilterValue = sanDiegoBaseFilter?.value || "";
  const rowsSource = getLlegadasRowsForView("101", {
    searchTerm: sanDiegoSearch?.value || "",
    estadoMode: estadoMode === "en_espera" ? "" : estadoMode,
    fromIso: sanDiegoUploadFrom?.value || "",
    toIso: sanDiegoUploadTo?.value || "",
    baseFilterValue
  });
  const rows = estadoMode === "en_espera"
    ? getRowsFilteredByEsperaOperationalDay(rowsSource)
    : rowsSource;
  const rowsByRule = splitRowsByNoDespachoRule(rows);
  const visibleRows = rowsByRule.activeRows;
  lastSanDiegoRenderedRows = visibleRows.slice();
  if (llegadasSanDiegoCount) llegadasSanDiegoCount.textContent = String(visibleRows.length);
  if (llegadasSanDiegoTitle) llegadasSanDiegoTitle.textContent = "Ultimas Llegadas Almacentro (101)";
  if (visibleRows.length === 0) {
    if (llegadasSanDiegoTabs) llegadasSanDiegoTabs.innerHTML = "";
    llegadasSanDiegoBody.innerHTML = `<tr><td colspan="12" class="muted" style="text-align:center;padding:12px">Sin llegadas de Almacentro.</td></tr>`;
    return;
  }

  const grouped = new Map();
  visibleRows.forEach(row => {
    const itin = getGroupingItineraryForRow(row, estadoMode);
    if (!grouped.has(itin)) grouped.set(itin, []);
    grouped.get(itin).push(row);
  });

  const itineraries = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b, "es"));
  if (!sanDiegoSelectedItinerary || !grouped.has(sanDiegoSelectedItinerary)) {
    sanDiegoSelectedItinerary = itineraries[0];
  }

  if (llegadasSanDiegoTabs) {
    llegadasSanDiegoTabs.innerHTML = itineraries.map(itin => {
      const active = itin === sanDiegoSelectedItinerary;
      const count = grouped.get(itin)?.length || 0;
      const cls = active ? "btn btn-primary" : "btn btn-ghost";
      const theme = getItineraryThemeByRows(grouped.get(itin), estadoMode);
      const style = getItineraryButtonStyle(theme, active);
      const label = getItineraryGroupLabel(itin);
      return `<button type="button" class="${cls}" style="${style}" data-sd-itin="${escapeHtml(itin)}">${escapeHtml(label)} (${count})</button>`;
    }).join("");
    llegadasSanDiegoTabs.querySelectorAll("[data-sd-itin]").forEach(btn => {
      btn.addEventListener("click", () => {
        sanDiegoSelectedItinerary = btn.getAttribute("data-sd-itin") || "";
        renderLlegadasSanDiego();
      });
    });
  }

  const selectedRows = visibleRows.filter(row => rowMatchesSelectedItinerary(row, sanDiegoSelectedItinerary, estadoMode));
  lastSanDiegoRenderedRows = selectedRows.slice();
  if (selectedRows.length === 0) {
    llegadasSanDiegoBody.innerHTML = `<tr><td colspan="12" class="muted" style="text-align:center;padding:12px">Sin datos para el itinerario seleccionado.</td></tr>`;
    return;
  }
  llegadasSanDiegoBody.innerHTML = renderLlegadasRowsHtml(selectedRows, false);
  bindDispatchButtons(llegadasSanDiegoBody);
}

function renderLlegadasNutibara(){
  if (!llegadasNutibaraBody) return;
  const estadoMode = nutibaraEstadoFilter?.value || "";
  let baseFilterValue = nutibaraBaseFilter?.value || "";
  const rowsForBaseOptions = getLlegadasRowsForView("110", {
    searchTerm: "",
    estadoMode: estadoMode === "en_espera" ? "" : estadoMode,
    fromIso: nutibaraUploadFrom?.value || "",
    toIso: nutibaraUploadTo?.value || ""
  });
  syncLlegadasBaseFilterOptions(nutibaraBaseFilter, rowsForBaseOptions);
  baseFilterValue = nutibaraBaseFilter?.value || "";
  const rowsSource = getLlegadasRowsForView("110", {
    searchTerm: nutibaraSearch?.value || "",
    estadoMode: estadoMode === "en_espera" ? "" : estadoMode,
    fromIso: nutibaraUploadFrom?.value || "",
    toIso: nutibaraUploadTo?.value || "",
    baseFilterValue
  });
  const rows = estadoMode === "en_espera"
    ? getRowsFilteredByEsperaOperationalDay(rowsSource)
    : rowsSource;
  const rowsByRule = splitRowsByNoDespachoRule(rows);
  const visibleRows = rowsByRule.activeRows;
  lastNutibaraRenderedRows = visibleRows.slice();
  if (llegadasNutibaraCount) llegadasNutibaraCount.textContent = String(visibleRows.length);
  if (llegadasNutibaraTitle) llegadasNutibaraTitle.textContent = "Ultimas Llegadas Nutibara (110)";
  if (visibleRows.length === 0) {
    if (llegadasNutibaraTabs) llegadasNutibaraTabs.innerHTML = "";
    llegadasNutibaraBody.innerHTML = `<tr><td colspan="12" class="muted" style="text-align:center;padding:12px">Sin llegadas de Nutibara.</td></tr>`;
    return;
  }
  const grouped = new Map();
  visibleRows.forEach(row => {
    const itin = getGroupingItineraryForRow(row, estadoMode);
    if (!grouped.has(itin)) grouped.set(itin, []);
    grouped.get(itin).push(row);
  });

  const itineraries = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b, "es"));
  if (!nutibaraSelectedItinerary || !grouped.has(nutibaraSelectedItinerary)) {
    nutibaraSelectedItinerary = itineraries[0];
  }
  if (llegadasNutibaraTabs) {
    llegadasNutibaraTabs.innerHTML = itineraries.map(itin => {
      const active = itin === nutibaraSelectedItinerary;
      const count = grouped.get(itin)?.length || 0;
      const cls = active ? "btn btn-primary" : "btn btn-ghost";
      const theme = getItineraryThemeByRows(grouped.get(itin), estadoMode);
      const style = getItineraryButtonStyle(theme, active);
      const label = getItineraryGroupLabel(itin);
      return `<button type="button" class="${cls}" style="${style}" data-nut-itin="${escapeHtml(itin)}">${escapeHtml(label)} (${count})</button>`;
    }).join("");
    llegadasNutibaraTabs.querySelectorAll("[data-nut-itin]").forEach(btn => {
      btn.addEventListener("click", () => {
        nutibaraSelectedItinerary = btn.getAttribute("data-nut-itin") || "";
        renderLlegadasNutibara();
      });
    });
  }

  const selectedRows = visibleRows.filter(row => rowMatchesSelectedItinerary(row, nutibaraSelectedItinerary, estadoMode));
  lastNutibaraRenderedRows = selectedRows.slice();
  if (selectedRows.length === 0) {
    llegadasNutibaraBody.innerHTML = `<tr><td colspan="12" class="muted" style="text-align:center;padding:12px">Sin datos para el itinerario seleccionado.</td></tr>`;
    return;
  }
  llegadasNutibaraBody.innerHTML = renderLlegadasRowsHtml(selectedRows, false);
  bindDispatchButtons(llegadasNutibaraBody);
}

function renderPlanillaAfiliados(){
  if (!planillaHead || !planillaBody) return;
  const displayColumns = getPlanillaDisplayColumnKeys(planillaAfiliadosRows);
  const filtered = getPlanillaFilteredRows(planillaAfiliadosRows);

  if (planillaCount) planillaCount.textContent = String(filtered.length);

  if (displayColumns.length === 0) {
    planillaHead.innerHTML = "";
    planillaBody.innerHTML = `<tr><td class="muted" style="text-align:center;padding:12px">Sin datos.</td></tr>`;
    return;
  }

  planillaHead.innerHTML = `<tr>${displayColumns.map(col => `<th>${escapeHtml(formatPlanillaHeaderLabel(col))}</th>`).join("")}</tr>`;
  if (filtered.length === 0) {
    planillaBody.innerHTML = `<tr><td colspan="${displayColumns.length}" class="muted" style="text-align:center;padding:12px">No hay coincidencias.</td></tr>`;
    return;
  }

  planillaBody.innerHTML = filtered.map(row => {
    const cells = displayColumns.map(col => `<td>${escapeHtml(getPlanillaDisplayValueByColumn(row, col))}</td>`).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
}

function getFilteredPlanillaRowsForExport(){
  return getPlanillaFilteredRows(planillaAfiliadosRows);
}

function handleDownloadLlegadas(){
  const filtered = getFilteredPlanillaRowsForExport();
  const onlyLlegadas = filtered.filter(row => !!String(row?.hora_llegada || "").trim());
  exportPlanillaRowsToExcel(onlyLlegadas, "llegadas", "llegadas_planilla");
}

function handleDownloadDespachos(){
  const filtered = getFilteredPlanillaRowsForExport();
  const onlyDespachos = filtered.filter(row => hasValidDespacho(row));
  exportPlanillaRowsToExcel(onlyDespachos, "despachos", "despachos_planilla");
}

function handleDownloadLlegadasAeropuerto(){
  exportPlanillaRowsToExcel(lastAeropuertoRenderedRows, "llegadas", "llegadas_aeropuerto");
}

function handleDownloadLlegadasTerminalNorte(){
  exportPlanillaRowsToExcel(lastTerminalNorteRenderedRows, "llegadas", "llegadas_terminalnorte");
}

function handleDownloadLlegadasSanDiego(){
  exportPlanillaRowsToExcel(lastSanDiegoRenderedRows, "llegadas", "llegadas_san_diego");
}

function handleDownloadLlegadasNutibara(){
  exportPlanillaRowsToExcel(lastNutibaraRenderedRows, "llegadas", "llegadas_nutibara");
}

function getActiveTabId(){
  return document.querySelector(".tab.active")?.getAttribute("data-tab") || "";
}

function refreshMobileTabSwitcher(){
  if (!mobileTabSelect) return;
  const visibleTabs = Array.from(document.querySelectorAll(".tab[data-tab]"))
    .filter(tab => !tab.classList.contains("hidden"));
  const currentValue = String(mobileTabSelect.value || "");
  const activeId = getActiveTabId();
  mobileTabSelect.innerHTML = "";
  visibleTabs.forEach(tab => {
    const tabId = String(tab.getAttribute("data-tab") || "");
    if (!tabId) return;
    const option = document.createElement("option");
    option.value = tabId;
    option.textContent = String(tab.textContent || tabId).trim();
    mobileTabSelect.appendChild(option);
  });
  const preferred = visibleTabs.some(tab => String(tab.getAttribute("data-tab") || "") === activeId)
    ? activeId
    : currentValue;
  if (preferred && Array.from(mobileTabSelect.options).some(op => op.value === preferred)) {
    mobileTabSelect.value = preferred;
  } else if (mobileTabSelect.options.length > 0) {
    mobileTabSelect.value = mobileTabSelect.options[0].value;
  }
  mobileTabSelect.disabled = mobileTabSelect.options.length === 0;
  if (mobileTabSwitcher) mobileTabSwitcher.classList.toggle("hidden", mobileTabSelect.options.length === 0);
}

function openTabById(tabId){
  const id = String(tabId || "").trim();
  if (!id) return;
  const target = Array.from(document.querySelectorAll(".tab[data-tab]"))
    .find(tab => String(tab.getAttribute("data-tab") || "") === id && !tab.classList.contains("hidden"));
  if (!target) return;
  target.click();
}

function isPlanillaRelatedTab(tabId){
  const id = String(tabId || "");
  return id === "planilla-afiliados"
    || id === "llegadas-aeropuerto"
    || id === "llegadas-terminalnorte"
    || id === "llegadas-san-diego"
    || id === "llegadas-nutibara"
    || id === "no-despacho";
}

function getAllowedPlanillaTableSources(){
  return [PLANILLA_TABLE_NAME];
}

function resetPlanillaCache(){
  planillaAfiliadosRows = [];
  invalidatePlanillaDispatchResolutionCache();
  planillaAfiliadosLoadedOnce = false;
  planillaLastLoadedAt = 0;
  planillaLastDeltaUpdatedAt = "";
  planillaDeltaCycles = 0;
}

function setCurrentPlanillaTableSource(nextTable){
  const normalized = String(nextTable || "").trim();
  currentPlanillaTableName = normalized === PLANILLA_TABLE_NAME ? PLANILLA_TABLE_NAME : PLANILLA_TABLE_NAME;
  try {
    localStorage.setItem(PLANILLA_TABLE_SOURCE_STORAGE_KEY, currentPlanillaTableName);
  } catch (e) {}
  if (planillaTableSource) planillaTableSource.value = currentPlanillaTableName;
}

function loadPlanillaTableSourcePreference(){
  try {
    localStorage.removeItem(PLANILLA_TABLE_SOURCE_STORAGE_KEY);
  } catch (e) {}
  setCurrentPlanillaTableSource(PLANILLA_TABLE_NAME);
}

async function ensureFreshPlanillaData(options = {}){
  const force = !!options.force;
  const forceFull = !!options.forceFull;
  const maxAgeMs = Number(options.maxAgeMs || PLANILLA_REFRESH_MAX_AGE_MS);
  const stale = !planillaAfiliadosLoadedOnce || !planillaLastLoadedAt || ((Date.now() - planillaLastLoadedAt) > maxAgeMs);
  if (force || stale) {
    await loadPlanillaAfiliadosFromSupabase({ forceFull });
    return;
  }
  renderPlanillaAfiliados();
  renderLlegadasAeropuerto();
  renderLlegadasTerminalNorte();
  renderLlegadasSanDiego();
  renderLlegadasNutibara();
  renderNoDespachoTab();
  renderFueraListaTab();
}

async function loadPlanillaAfiliadosFromSupabase(options = {}){
  if (planillaAfiliadosLoading) return;
  if (!currentUserId) return;
  const forceFull = !!options.forceFull;
  currentPlanillaTableName = PLANILLA_TABLE_NAME;
  if (planillaTableSource) planillaTableSource.value = PLANILLA_TABLE_NAME;
  planillaAfiliadosLoading = true;
  if (planillaStatus) planillaStatus.textContent = `Consultando Supabase (${currentPlanillaTableName})...`;
  if (llegadasTerminalNorteStatus) llegadasTerminalNorteStatus.textContent = "Consultando...";
  if (noDespachoStatus) noDespachoStatus.textContent = "Consultando...";
  try {
    const selectColumns = getPlanillaSelectColumnsForCurrentTable();
    const canUseDelta = PLANILLA_DELTA_SYNC_ENABLED
      && planillaAfiliadosLoadedOnce
      && !!planillaLastDeltaUpdatedAt
      && !forceFull
      && planillaDeltaCycles < PLANILLA_FULL_SYNC_EVERY_DELTA_CYCLES;
    let fetchedRows = [];
    let modeLabel = "full";

    if (canUseDelta) {
      modeLabel = "delta";
      const { data, error } = await planillaSupabaseClient
        .from(currentPlanillaTableName)
        .select(selectColumns)
        .gt("updated_at", planillaLastDeltaUpdatedAt)
        .order("updated_at", { ascending: true })
        .limit(PLANILLA_DELTA_LIMIT);
      if (error) {
        console.warn("Delta sync fallo, se usa full sync:", error);
        modeLabel = "full";
      } else {
        fetchedRows = Array.isArray(data) ? data : [];
      }
    }

    if (modeLabel === "full") {
      const { data, error } = await planillaSupabaseClient
        .from(currentPlanillaTableName)
        .select(selectColumns)
        .order("hora_llegada", { ascending: false, nullsFirst: false })
        .limit(PLANILLA_DELTA_LIMIT);
      if (error) throw error;
      fetchedRows = Array.isArray(data) ? data : [];
      planillaAfiliadosRows = fetchedRows;
      await enrichPlanillaRowsWithOptionalColumns(planillaAfiliadosRows);
      planillaDeltaCycles = 0;
    } else {
      if (fetchedRows.length > 0) {
        const deltaIds = fetchedRows.map(row => row?.id).filter(v => v !== undefined && v !== null);
        planillaAfiliadosRows = mergePlanillaRowsById(planillaAfiliadosRows, fetchedRows);
        await enrichPlanillaRowsWithOptionalColumns(planillaAfiliadosRows, deltaIds);
      }
      planillaDeltaCycles += 1;
    }

    planillaLastDeltaUpdatedAt = getMaxPlanillaUpdatedAt(planillaAfiliadosRows, planillaLastDeltaUpdatedAt);
    invalidatePlanillaDispatchResolutionCache();
    planillaAfiliadosLoadedOnce = true;
    planillaLastLoadedAt = Date.now();
    renderPlanillaAfiliados();
    renderLlegadasAeropuerto();
    renderLlegadasTerminalNorte();
    renderLlegadasSanDiego();
    renderLlegadasNutibara();
    renderNoDespachoTab();
    renderFueraListaTab();
    if (planillaStatus) {
      const stamp = fechaHoraCO(new Date());
      const syncTxt = modeLabel === "delta" ? "delta" : "full";
      planillaStatus.textContent = `Actualizado: ${stamp} | Tabla: ${currentPlanillaTableName} | Sync: ${syncTxt}`;
    }
    if (llegadasAeropuertoStatus) {
      const stamp2 = fechaHoraCO(new Date());
      llegadasAeropuertoStatus.textContent = `Actualizado: ${stamp2}`;
    }
    if (llegadasSanDiegoStatus) {
      const stampSd = fechaHoraCO(new Date());
      llegadasSanDiegoStatus.textContent = `Actualizado: ${stampSd}`;
    }
    if (llegadasTerminalNorteStatus) {
      const stampTn = fechaHoraCO(new Date());
      llegadasTerminalNorteStatus.textContent = `Actualizado: ${stampTn}`;
    }
    if (llegadasNutibaraStatus) {
      const stamp3 = fechaHoraCO(new Date());
      llegadasNutibaraStatus.textContent = `Actualizado: ${stamp3}`;
    }
    if (noDespachoStatus) {
      const stamp4 = fechaHoraCO(new Date());
      noDespachoStatus.textContent = `Actualizado: ${stamp4}`;
    }
  } catch (error) {
    console.error(`Error cargando ${currentPlanillaTableName}:`, error);
    if (planillaStatus) planillaStatus.textContent = `Error: ${error?.message || "consulta fallida"}`;
    if (llegadasAeropuertoStatus) llegadasAeropuertoStatus.textContent = `Error: ${error?.message || "consulta fallida"}`;
    if (llegadasSanDiegoStatus) llegadasSanDiegoStatus.textContent = `Error: ${error?.message || "consulta fallida"}`;
    if (llegadasTerminalNorteStatus) llegadasTerminalNorteStatus.textContent = `Error: ${error?.message || "consulta fallida"}`;
    if (llegadasNutibaraStatus) llegadasNutibaraStatus.textContent = `Error: ${error?.message || "consulta fallida"}`;
    if (noDespachoStatus) noDespachoStatus.textContent = `Error: ${error?.message || "consulta fallida"}`;
    showToast(`No se pudo cargar ${currentPlanillaTableName} desde Supabase.`, "err");
  } finally {
    planillaAfiliadosLoading = false;
  }
}

const VEHICLE_TO_BASE_MAP = {
  "703":"BASE 4","705":"BASE 4","707":"BASE 4","708":"BASE 5","709":"BASE 3",
  "714":"BASE 3","715":"BASE 4","710":"BASE 3","717":"BASE 4","718":"BASE 3",
  "719":"BASE 2","720":"BASE 3","721":"BASE 4","722":"BASE 3","723":"BASE 3",
  "724":"BASE 3","725":"BASE 4","726":"BASE 3","727":"BASE 3","728":"BASE 4",
  "729":"BASE 1","730":"BASE 1","731":"BASE 4","732":"BASE 1","733":"BASE 5",
  "734":"BASE 3","735":"BASE 4","736":"BASE 8","737":"BASE 3","738":"BASE 3",
  "739":"BASE 3","740":"BASE 3","741":"BASE 3","742":"BASE 3","743":"BASE 3",
  "744":"BASE 3","745":"BASE 3","746":"BASE 4","747":"BASE 5","748":"BASE 2",
  "749":"BASE 2","750":"BASE 3","751":"BASE 3","752":"BASE 3","753":"BASE 3",
  "754":"BASE 3","755":"BASE 3","756":"BASE 8","757":"BASE 5","758":"BASE 3",
  "759":"BASE 6","15":"BASE 5","17":"BASE 3","59":"BASE 5","64":"BASE 5",
  "89":"BASE 5","100":"BASE 5","157":"BASE 5","163":"BASE 5","211":"BASE 5",
  "232":"BASE 5","507":"BASE 3","510":"BASE 3",
  "764":"BASE 0","766":"BASE 0","767":"BASE 0","768":"BASE 0","769":"BASE 0"
};

function getBaseLabelForInterno(interno){
  const key = String(interno || "").trim();
  if (!key) return "";
  return VEHICLE_TO_BASE_MAP[key] || "";
}

function getBaseNumForInterno(interno){
  const label = getBaseLabelForInterno(interno);
  const m = String(label).match(/(\d+)/);
  return m ? m[1] : "";
}

const FICHO_POSITION_RULES = {
  "SAN DIEGO": [
    { ficho: 1, after: 14 },
    { ficho: 2, after: 18 },
    { ficho: 3, after: 22 },
    { ficho: 4, after: 26 },
    { ficho: 5, after: 30 },
    { ficho: 6, after: 34 }
  ],
  "EXPOSICIONES": [
    { ficho: 7, after: 38 },
    { ficho: 8, after: 42 },
    { ficho: 9, after: 46 },
    { ficho: 10, after: 51 }
  ]
};

/* ===================== CARGAR CONDUCTORES DESDE CSV ===================== */
// Normaliza una fila de conductor a la estructura interna del catálogo.
// La BASE se saca del campo email ("BASE 3"), igual convención en Sonar y en el CSV.
function normalizarFilaConductor(r){
  const email = String(r?.email || "").trim();
  const base = getBaseCanonical(String(email).match(/BASE\s*(\d+)/i)?.[1] || "");
  return {
    dr_id: String(r?.dr_id ?? r?.id ?? "").trim(),
    cedula: String(r?.cedula ?? "").trim(),
    fleet: String(r?.fleet ?? "").trim(),
    nombre: String(r?.nombre ?? "").trim(),
    status: String(r?.status ?? r?.estado ?? "ENABLED").trim().toUpperCase(),
    email,
    celular: String(r?.celular ?? "").trim(),
    base,
  };
}

// Aplica un arreglo de filas de conductor al catálogo global. Devuelve # de habilitados.
function aplicarCatalogoConductores(rows){
  const newDriversByBase = {};
  const newDriversCatalogRows = [];
  let totalEnabled = 0;
  for (const raw of (rows || [])) {
    const r = normalizarFilaConductor(raw);
    if (r.dr_id || r.nombre || r.cedula) newDriversCatalogRows.push(r);
    if (r.base && r.nombre && r.status === "ENABLED") {
      if (!newDriversByBase[r.base]) newDriversByBase[r.base] = [];
      newDriversByBase[r.base].push(r.nombre);
      totalEnabled++;
    }
  }
  Object.keys(newDriversByBase).forEach(b => newDriversByBase[b].sort((a, b) => a.localeCompare(b)));
  driversByBase = newDriversByBase;
  driversCatalogRows = newDriversCatalogRows;
  return totalEnabled;
}

// Conductores desde Sonar (GET_Drivers_v2 vía Edge Function). Fuente principal.
async function fetchDriversFromSonar(){
  const resp = await fetch(SONAR_DRIVERS_URL, {
    headers: { apikey: PLANILLA_SUPABASE_ANON_KEY, Authorization: `Bearer ${PLANILLA_SUPABASE_ANON_KEY}` },
  });
  const data = await resp.json();
  if (!data?.success || !Array.isArray(data.todos)) throw new Error("Respuesta de Sonar inválida");
  return data.todos; // [{id, cedula, nombre, estado, email, celular, mId}]
}

// Carga el catálogo de conductores desde Sonar (GET_Drivers_v2). Única fuente.
// (Se conserva el nombre loadDriversFromCSV por compatibilidad con las llamadas existentes.)
async function loadDriversFromCSV() {
  if (isLoadingDrivers) return;
  isLoadingDrivers = true;
  if (conductoresCsvStatus) conductoresCsvStatus.textContent = "Cargando conductores (Sonar)...";
  try {
    const rows = await fetchDriversFromSonar();
    const totalEnabled = aplicarCatalogoConductores(rows);
    if (conductoresCsvStatus) {
      const stamp = fechaHoraCO(new Date());
      conductoresCsvStatus.textContent = `Actualizado: ${stamp} (${totalEnabled} conductores · Sonar)`;
    }
    refreshConductoresCsvBaseOptions();
    renderConductoresCsvTab();
  } catch (error) {
    console.error('Error cargando conductores desde Sonar:', error);
    if (conductoresCsvStatus) conductoresCsvStatus.textContent = `Error Sonar: ${error?.message || "consulta fallida"}`;
  } finally {
    isLoadingDrivers = false;
  }
}

/* ===================== BASES ===================== */

/* ===================== CONDUCTORES ===================== */

/* ===================== NOVEDADES ===================== */

/* ===================== TABLA PROGRAMACION ===================== */
const PROGRAMACION_FILAS_TABLE = "programacion_filas";
const PROGRAMACION_HIDDEN_TOP = new Set(["id", "programacion_id", "row_key", "row_data"]);
const PROGRAMACION_HIDDEN_JSON = new Set(["#", "FECHA"]);
const PROGRAMACION_FIXED_COLS = ["fecha", "base"];
const PROGRAMACION_JSON_PRIORITY = [
  "PUESTO", "ORIGEN", "RUTA", "DESTINO", "ITINERARIO", "TRAYECTO",
  "VEH", "INTERNO", "VEHICULO", "PLACA",
  "INICIA", "INICIO", "HORA_INICIO", "H_INICIO",
  "INICIA2", "INICIO2", "INICIO_2", "HORA_INICIO_2", "H_INICIO_2",
  "HORA_FIN", "FIN", "TERMINA", "H_FIN",
  "HORA_LLEGADA", "LLEGADA", "HORA_DESPACHO", "DESPACHO", "HORA",
  "CONDUCTOR", "AFILIADO", "PROPIETARIO"
];
const PROGRAMACION_HEADER_LABELS = {
  "fecha": "Fecha",
  "base": "Base",
  "PUESTO": "Puesto",
  "VEH": "Vehiculo",
  "INTERNO": "Interno",
  "RUTA": "Ruta",
  "ORIGEN": "Origen",
  "DESTINO": "Destino",
  "ITINERARIO": "Itinerario",
  "INICIA": "Inicia",
  "INICIO": "Inicia",
  "HORA_INICIO": "Inicia",
  "INICIA2": "Inicia 2",
  "INICIO2": "Inicia 2",
  "INICIO_2": "Inicia 2",
  "HORA_INICIO_2": "Inicia 2",
  "HORA_FIN": "Hora fin",
  "FIN": "Hora fin",
  "TERMINA": "Hora fin",
  "HORA_LLEGADA": "Hora llegada",
  "HORA_DESPACHO": "Hora despacho",
  "CONDUCTOR": "Conductor",
  "AFILIADO": "Afiliado"
};

let programacionFilasRows = [];
let programacionFilasJsonKeys = [];
let programacionFilasLastLoadedAt = null;
let programacionFilasSelectedKey = null;

const programacionFilasSearch = document.getElementById("programacionFilasSearch");
const programacionFilasPuesto = document.getElementById("programacionFilasPuesto");
const programacionFilasFecha = document.getElementById("programacionFilasFecha");
const programacionFilasHead = document.getElementById("programacionFilasHead");
const programacionFilasBody = document.getElementById("programacionFilasBody");
const programacionFilasCount = document.getElementById("programacionFilasCount");
const programacionFilasStatus = document.getElementById("programacionFilasStatus");
const btnRefreshProgramacionFilas = document.getElementById("btnRefreshProgramacionFilas");
const btnProgramacionFilasHoy = document.getElementById("btnProgramacionFilasHoy");

function todayIsoLocal(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseProgramacionRowData(value){
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value === "string") {
    try { return JSON.parse(value) || {}; } catch (_) { return {}; }
  }
  return {};
}

function orderProgramacionJsonKeys(keys){
  const upper = new Map(keys.map(k => [String(k).toUpperCase(), k]));
  const seen = new Set();
  const ordered = [];
  for (const want of PROGRAMACION_JSON_PRIORITY) {
    const original = upper.get(want);
    if (original && !seen.has(original)) {
      ordered.push(original);
      seen.add(original);
    }
  }
  for (const k of keys) {
    if (!seen.has(k)) ordered.push(k);
  }
  return ordered;
}

function collectProgramacionJsonKeys(rows){
  const keys = new Set();
  for (const row of rows || []) {
    const data = parseProgramacionRowData(row?.row_data);
    for (const k of Object.keys(data)) {
      if (PROGRAMACION_HIDDEN_TOP.has(k)) continue;
      if (PROGRAMACION_HIDDEN_JSON.has(String(k).toUpperCase())) continue;
      keys.add(k);
    }
  }
  return orderProgramacionJsonKeys(Array.from(keys));
}

function getProgramacionIniciaColumn(){
  const candidates = ["INICIA", "INICIO", "HORA_INICIO", "H_INICIO"];
  for (const k of programacionFilasJsonKeys) {
    if (candidates.includes(String(k).toUpperCase())) return k;
  }
  return null;
}

function programacionTimeToMinutes(value){
  const s = String(value ?? "").trim();
  if (!s) return Number.POSITIVE_INFINITY;
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return Number.POSITIVE_INFINITY;
  return Number(m[1]) * 60 + Number(m[2]);
}

function sortProgramacionFilasByInicia(rows){
  const col = getProgramacionIniciaColumn();
  if (!col) return rows;
  return rows.slice().sort((a, b) => {
    const da = parseProgramacionRowData(a?.row_data);
    const db = parseProgramacionRowData(b?.row_data);
    const ta = programacionTimeToMinutes(da?.[col]);
    const tb = programacionTimeToMinutes(db?.[col]);
    if (ta !== tb) return ta - tb;
    const ba = String(a?.base ?? "");
    const bb = String(b?.base ?? "");
    return ba.localeCompare(bb, "es");
  });
}

function labelForProgramacionColumn(key){
  return PROGRAMACION_HEADER_LABELS[key] || PROGRAMACION_HEADER_LABELS[String(key).toUpperCase()] || String(key);
}

function formatProgramacionCell(value){
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") {
    try { return JSON.stringify(value); } catch (_) { return String(value); }
  }
  return String(value);
}

function getProgramacionRowKey(row){
  if (row?.id !== undefined && row?.id !== null) return `id:${row.id}`;
  if (row?.row_key) return `rk:${row.row_key}`;
  return null;
}

function getProgramacionPuestoColumn(){
  const candidates = ["PUESTO", "ORIGEN", "RUTA", "DESTINO", "ITINERARIO", "TRAYECTO"];
  for (const k of programacionFilasJsonKeys) {
    if (candidates.includes(String(k).toUpperCase())) return k;
  }
  return null;
}

function getProgramacionPuesto(data){
  const col = getProgramacionPuestoColumn();
  if (!col || !data || typeof data !== "object") return "";
  return String(data[col] ?? "").trim();
}

function populateProgramacionPuestoOptions(){
  if (!programacionFilasPuesto) return;
  const col = getProgramacionPuestoColumn();
  const current = programacionFilasPuesto.value;
  if (!col) {
    programacionFilasPuesto.innerHTML = `<option value="">Sin columna puesto</option>`;
    programacionFilasPuesto.disabled = true;
    return;
  }
  programacionFilasPuesto.disabled = false;
  const values = new Set();
  for (const row of programacionFilasRows) {
    const data = parseProgramacionRowData(row?.row_data);
    const v = String(data?.[col] ?? "").trim();
    if (v) values.add(v);
  }
  const sorted = Array.from(values).sort((a, b) => a.localeCompare(b, "es"));
  const opts = [`<option value="">Todos los puestos</option>`]
    .concat(sorted.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`));
  programacionFilasPuesto.innerHTML = opts.join("");
  if (sorted.includes(current)) programacionFilasPuesto.value = current;
}

function getFilteredProgramacionFilasRows(){
  const term = String(programacionFilasSearch?.value || "").trim().toLowerCase();
  const puesto = String(programacionFilasPuesto?.value || "").trim();

  return programacionFilasRows.filter(row => {
    const data = parseProgramacionRowData(row?.row_data);

    if (puesto) {
      const p = getProgramacionPuesto(data);
      if (p !== puesto) return false;
    }

    if (term) {
      const haystack = [
        row?.fecha, row?.base,
        ...Object.values(data).map(v => (typeof v === "object" ? JSON.stringify(v) : v))
      ].map(v => String(v ?? "").toLowerCase()).join(" ");
      if (!haystack.includes(term)) return false;
    }

    return true;
  });
}

function renderProgramacionFilas(){
  if (!programacionFilasHead || !programacionFilasBody) return;
  const rows = sortProgramacionFilasByInicia(getFilteredProgramacionFilasRows());
  if (programacionFilasCount) programacionFilasCount.textContent = String(rows.length);

  const headers = [...PROGRAMACION_FIXED_COLS, ...programacionFilasJsonKeys];
  programacionFilasHead.innerHTML =
    `<tr>${headers.map(h => `<th>${escapeHtml(labelForProgramacionColumn(h))}</th>`).join("")}</tr>`;

  if (!rows.length) {
    programacionFilasBody.innerHTML =
      `<tr><td colspan="${headers.length}" class="muted" style="text-align:center;padding:12px">Sin resultados.</td></tr>`;
    return;
  }

  programacionFilasBody.innerHTML = rows.map(row => {
    const data = parseProgramacionRowData(row?.row_data);
    const fixedCells = PROGRAMACION_FIXED_COLS
      .map(col => `<td>${escapeHtml(formatProgramacionCell(row?.[col]))}</td>`)
      .join("");
    const jsonCells = programacionFilasJsonKeys
      .map(k => `<td>${escapeHtml(formatProgramacionCell(data?.[k]))}</td>`)
      .join("");
    const key = getProgramacionRowKey(row);
    const selectedCls = (key && key === programacionFilasSelectedKey) ? " is-selected" : "";
    const keyAttr = key ? ` data-row-key="${escapeHtml(key)}"` : "";
    return `<tr class="prog-filas-row${selectedCls}"${keyAttr}>${fixedCells}${jsonCells}</tr>`;
  }).join("");
}

function handleProgramacionFilasRowClick(ev){
  const tr = ev.target.closest("tr.prog-filas-row");
  if (!tr) return;
  const key = tr.getAttribute("data-row-key");
  if (!key) return;
  if (programacionFilasSelectedKey === key) {
    programacionFilasSelectedKey = null;
    tr.classList.remove("is-selected");
    return;
  }
  programacionFilasSelectedKey = key;
  programacionFilasBody.querySelectorAll("tr.prog-filas-row.is-selected").forEach(el => el.classList.remove("is-selected"));
  tr.classList.add("is-selected");
}

async function loadProgramacionFilas(){
  if (!currentUserId) return;
  if (programacionFilasFecha && !programacionFilasFecha.value) {
    programacionFilasFecha.value = todayIsoLocal();
  }
  const fecha = programacionFilasFecha?.value || "";
  const setStatus = (txt) => { if (programacionFilasStatus) programacionFilasStatus.textContent = txt; };
  setStatus(fecha ? `Consultando ${fecha}...` : "Consultando Supabase...");
  if (btnRefreshProgramacionFilas) btnRefreshProgramacionFilas.disabled = true;
  try {
    let q = planillaSupabaseClient
      .from(PROGRAMACION_FILAS_TABLE)
      .select("id, programacion_id, row_key, row_data, base, fecha");
    if (fecha) q = q.eq("fecha", fecha);
    const { data, error } = await q
      .order("fecha", { ascending: false })
      .order("base", { ascending: true })
      .order("id", { ascending: true })
      .limit(5000);
    if (error) throw error;
    programacionFilasRows = Array.isArray(data) ? data : [];
    programacionFilasJsonKeys = collectProgramacionJsonKeys(programacionFilasRows);
    programacionFilasLastLoadedAt = Date.now();
    programacionFilasSelectedKey = null;
    populateProgramacionPuestoOptions();
    renderProgramacionFilas();
    const stamp = horaCO(new Date());
    setStatus(`Actualizado ${stamp} · ${programacionFilasRows.length} registros${fecha ? ` · ${fecha}` : ""}`);
  } catch (err) {
    console.error(`[${PROGRAMACION_FILAS_TABLE}] consulta fallo:`, err);
    setStatus(`Error: ${err?.message || "fallo"}`);
    if (typeof showToast === "function") {
      showToast(`No se pudo cargar ${PROGRAMACION_FILAS_TABLE}: ${err?.message || "fallo"}`, "err");
    }
  } finally {
    if (btnRefreshProgramacionFilas) btnRefreshProgramacionFilas.disabled = false;
  }
}

/* ===================== TABLA VEHICULOSSONAR (vista cruda) ===================== */
const TABLA_VEHICULOSSONAR_COL_PRIORITY = ["INTERNO", "Interno", "interno", "Placa", "PLACA", "placa", "ID", "Id", "id", "mid", "MID"];
let tablaVehiculosSonarRows = [];
let tablaVehiculosSonarColumns = [];
let tablaVehiculosSonarLastLoadedAt = null;
let tablaVehiculosSonarSelectedKey = null;

const tablaVehiculosSonarSearch = document.getElementById("tablaVehiculosSonarSearch");
const tablaVehiculosSonarHead = document.getElementById("tablaVehiculosSonarHead");
const tablaVehiculosSonarBody = document.getElementById("tablaVehiculosSonarBody");
const tablaVehiculosSonarCount = document.getElementById("tablaVehiculosSonarCount");
const tablaVehiculosSonarStatus = document.getElementById("tablaVehiculosSonarStatus");
const btnRefreshTablaVehiculosSonar = document.getElementById("btnRefreshTablaVehiculosSonar");

function collectTablaVehiculosSonarColumns(rows){
  const set = new Set();
  for (const row of rows || []) {
    if (row && typeof row === "object") {
      for (const k of Object.keys(row)) set.add(k);
    }
  }
  const priority = TABLA_VEHICULOSSONAR_COL_PRIORITY.filter(k => set.has(k));
  const rest = Array.from(set).filter(k => !priority.includes(k));
  return [...priority, ...rest];
}

function formatTablaVehiculosSonarCell(value){
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") {
    try { return JSON.stringify(value); } catch (_) { return String(value); }
  }
  return String(value);
}

function getTablaVehiculosSonarKey(row, idx){
  const candidates = ["ID", "Id", "id", "INTERNO", "Interno", "interno"];
  for (const c of candidates) {
    if (row?.[c] !== undefined && row?.[c] !== null && row?.[c] !== "") {
      return `${c}:${row[c]}`;
    }
  }
  return `idx:${idx}`;
}

function getFilteredTablaVehiculosSonarRows(){
  const term = String(tablaVehiculosSonarSearch?.value || "").trim().toLowerCase();
  if (!term) return tablaVehiculosSonarRows.slice();
  return tablaVehiculosSonarRows.filter(row => {
    const haystack = Object.values(row || {})
      .map(v => (typeof v === "object" ? JSON.stringify(v) : v))
      .map(v => String(v ?? "").toLowerCase())
      .join(" ");
    return haystack.includes(term);
  });
}

function renderTablaVehiculosSonar(){
  if (!tablaVehiculosSonarHead || !tablaVehiculosSonarBody) return;
  const rows = getFilteredTablaVehiculosSonarRows();
  if (tablaVehiculosSonarCount) tablaVehiculosSonarCount.textContent = String(rows.length);

  const cols = tablaVehiculosSonarColumns.length
    ? tablaVehiculosSonarColumns
    : collectTablaVehiculosSonarColumns(rows);

  tablaVehiculosSonarHead.innerHTML = `<tr>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join("")}</tr>`;

  if (!rows.length) {
    tablaVehiculosSonarBody.innerHTML =
      `<tr><td colspan="${Math.max(cols.length, 1)}" class="muted" style="text-align:center;padding:12px">Sin resultados.</td></tr>`;
    return;
  }

  tablaVehiculosSonarBody.innerHTML = rows.map((row, idx) => {
    const key = getTablaVehiculosSonarKey(row, idx);
    const selectedCls = (key === tablaVehiculosSonarSelectedKey) ? " is-selected" : "";
    const cells = cols.map(c => `<td>${escapeHtml(formatTablaVehiculosSonarCell(row?.[c]))}</td>`).join("");
    return `<tr class="prog-filas-row${selectedCls}" data-row-key="${escapeHtml(key)}">${cells}</tr>`;
  }).join("");
}

function handleTablaVehiculosSonarRowClick(ev){
  const tr = ev.target.closest("tr.prog-filas-row");
  if (!tr) return;
  const key = tr.getAttribute("data-row-key");
  if (!key) return;
  if (tablaVehiculosSonarSelectedKey === key) {
    tablaVehiculosSonarSelectedKey = null;
    tr.classList.remove("is-selected");
    return;
  }
  tablaVehiculosSonarSelectedKey = key;
  tablaVehiculosSonarBody.querySelectorAll("tr.prog-filas-row.is-selected").forEach(el => el.classList.remove("is-selected"));
  tr.classList.add("is-selected");
}

async function loadTablaVehiculosSonar(){
  if (!currentUserId) return;
  const setStatus = (txt) => { if (tablaVehiculosSonarStatus) tablaVehiculosSonarStatus.textContent = txt; };
  setStatus("Consultando Supabase...");
  if (btnRefreshTablaVehiculosSonar) btnRefreshTablaVehiculosSonar.disabled = true;
  try {
    const { data, error } = await planillaSupabaseClient
      .from(VEHICULOS_SONAR_TABLE_NAME)
      .select("*")
      .limit(5000);
    if (error) throw error;
    tablaVehiculosSonarRows = Array.isArray(data) ? data : [];
    tablaVehiculosSonarColumns = collectTablaVehiculosSonarColumns(tablaVehiculosSonarRows);
    tablaVehiculosSonarLastLoadedAt = Date.now();
    tablaVehiculosSonarSelectedKey = null;
    renderTablaVehiculosSonar();
    const stamp = horaCO(new Date());
    setStatus(`Actualizado ${stamp} · ${tablaVehiculosSonarRows.length} registros`);
  } catch (err) {
    console.error(`[${VEHICULOS_SONAR_TABLE_NAME}] consulta fallo:`, err);
    setStatus(`Error: ${err?.message || "fallo"}`);
    if (typeof showToast === "function") {
      showToast(`No se pudo cargar ${VEHICULOS_SONAR_TABLE_NAME}: ${err?.message || "fallo"}`, "err");
    }
  } finally {
    if (btnRefreshTablaVehiculosSonar) btnRefreshTablaVehiculosSonar.disabled = false;
  }
}

/* ===================== PESTANAS ===================== */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Desactivar todas las pestanas
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Activar la pestana seleccionada
    tab.classList.add('active');
    const tabId = tab.getAttribute('data-tab');
    const tabContent = document.getElementById(`tab-${tabId}`);
    if (tabContent) tabContent.classList.add('active');
    
    if (tabId === 'planilla-afiliados') ensureFreshPlanillaData({ force: true });
    if (tabId === 'llegadas-aeropuerto') ensureFreshPlanillaData({ force: true });
    if (tabId === 'llegadas-terminalnorte') ensureFreshPlanillaData({ force: true });
    if (tabId === 'llegadas-san-diego') ensureFreshPlanillaData({ force: true });
    if (tabId === 'llegadas-nutibara') ensureFreshPlanillaData({ force: true });
    if (tabId === 'no-despacho') ensureFreshPlanillaData({ force: true });
    if (tabId === 'fuera-lista') renderFueraListaTab();
    if (tabId === 'vehiculos-sonar') loadVehiculosSonarFromSupabase({ force: true });
    if (tabId === 'despachos-sonar' && !despachosSonarLastLoadedAt) loadDespachosSonarFromEdge();
    if (tabId === 'mapa-vehiculos') activateMapaVehiculosTab();
    if (tabId === 'enturnamiento' || tabId === 'salidas-aeropuerto'
        || tabId === 'llegadas-almacentro-geo' || tabId === 'llegadas-exposiciones-geo') {
      loadEnturnamientos();
      ensureEnturnamientoRealtime();
      ensureEnturnamientoPolling();
      loadVehiculosSonarFromSupabase().catch(() => {});
      loadProgramacionHoy().catch(() => {});
    }
    if (tabId === 'historial-despachos') {
      if (!historialDespachosLastLoadedAt) loadDespachosRealizadosFromSupabase();
      // Insights ahora usan posiciones Sonar (no llegadas_104).
      if (!sonarLocationsLastLoadedAt) loadSonarFleetLocations();
      if (!vehiculosSonarLoadedOnce) loadVehiculosSonarFromSupabase().then(() => renderHistorialInsights()).catch(() => {});
    }
    if (tabId === 'despachos-aeropuerto') {
      if (!despachosAeropuertoLastLoadedAt) loadDespachosAeropuertoFromSupabase();
      else renderDespachosAeropuertoTab();
    }
    {
      const pcfg = planillaCfgByTab(tabId);
      if (pcfg) {
        const fEl = planillaEl(pcfg, "fecha");
        if (fEl && !fEl.value) fEl.value = fechaBogotaISO();
        loadPlanilla(pcfg);
        ensurePlanillaDespachosRealtime();
        ensurePlanillaDespachosPolling();
      }
    }
    if (tabId === 'conductores-csv') renderConductoresCsvTab();
    if (tabId === 'preop-sicov' && !preopSicovLastLoadedAt) loadPreoperacionalesSicov();
    if (tabId === 'programacion-filas' && !programacionFilasLastLoadedAt) loadProgramacionFilas();
    if (tabId === 'vista-excel') refreshVistaExcel();
    if (tabId === 'cumplimiento') refreshCumplimiento();
    if (tabId === 'alertas-gps') { loadGpsDesconexiones(); ensureGpsDescPolling(); }
    if (tabId === 'auditoria-manual') loadAuditoriaManual();
    if (tabId === 'vuelos') { loadVuelos(); ensureVuelosPolling(); }
    if (tabId === 'asistencias') { loadAsistencias(); ensureAsisTick(); }
    if (tabId === 'informe-flota') refreshInformeFlota();
    if (tabId === 'tabla-vehiculossonar' && !tablaVehiculosSonarLastLoadedAt) loadTablaVehiculosSonar();
    if (tabId === 'asistencia-biometrica') {
      setTimeout(() => { pushBiometricoSession(); }, 300);
      setTimeout(() => { pushBiometricoSession(); }, 1500);
    }
    refreshMobileTabSwitcher();
  });
});

/* ===================== ARCHIVO ===================== */

/* ===================== EVENTOS ===================== */

function showLlegadasVehiculosPanel(){
  if (operativoPanel) operativoPanel.classList.remove("hidden");
}

function bindUIEvents(){
  const triggerPlanillaRefresh = () => loadPlanillaAfiliadosFromSupabase();

  const btnGoLlegadasVehiculos = document.getElementById("btnGoLlegadasVehiculos");
  if (btnGoLlegadasVehiculos) {
    btnGoLlegadasVehiculos.addEventListener("click", showLlegadasVehiculosPanel);
  }

  // Conductores CSV
  if (btnRefreshConductoresCsv) btnRefreshConductoresCsv.addEventListener("click", loadDriversFromCSV);
  if (conductoresCsvSearch) conductoresCsvSearch.addEventListener("input", renderConductoresCsvTab);
  if (conductoresCsvBaseFilter) conductoresCsvBaseFilter.addEventListener("change", renderConductoresCsvTab);
  if (conductoresCsvStatusFilter) conductoresCsvStatusFilter.addEventListener("change", renderConductoresCsvTab);

  // Vehiculos Sonar
  if (btnRefreshVehiculosSonar) btnRefreshVehiculosSonar.addEventListener("click", () => loadVehiculosSonarFromSupabase({ force: true }));
  if (vehiculosSonarSearch) vehiculosSonarSearch.addEventListener("input", renderVehiculosSonarTab);
  if (btnRefreshDespachosSonar) btnRefreshDespachosSonar.addEventListener("click", () => loadDespachosSonarFromEdge());
  if (despachosSonarSearch) despachosSonarSearch.addEventListener("input", renderDespachosSonarTab);
  if (despachosSonarItinChips) despachosSonarItinChips.addEventListener("click", handleDespachosSonarChipClick);
  if (btnRefreshHistorialDespachos) btnRefreshHistorialDespachos.addEventListener("click", () => loadDespachosRealizadosFromSupabase());
  bindPlanillasDespacho();
  if (historialDespachosSearch) historialDespachosSearch.addEventListener("input", renderHistorialDespachosTab);
  if (historialDespachosEstadoFilter) historialDespachosEstadoFilter.addEventListener("change", () => {
    historialDespachosItinFilter = "";
    renderHistorialDespachosTab();
  });
  if (historialDespachosRangeFilter) historialDespachosRangeFilter.addEventListener("change", () => loadDespachosRealizadosFromSupabase());
  if (historialDespachosItinChips) historialDespachosItinChips.addEventListener("click", handleHistorialDespachosChipClick);
  if (historialDespachosBody) {
    historialDespachosBody.addEventListener("change", handleHistorialDespachosBodyChange);
    historialDespachosBody.addEventListener("keydown", handleHistorialDespachosBodyKeydown);
    historialDespachosBody.addEventListener("click", handleHistorialDespachosBodyClick);
  }
  // Despachos Aeropuerto (medio aeropuerto)
  if (btnRefreshDespachosAeropuerto) btnRefreshDespachosAeropuerto.addEventListener("click", () => loadDespachosAeropuertoFromSupabase());
  if (despachosAeropuertoSearch) despachosAeropuertoSearch.addEventListener("input", renderDespachosAeropuertoTab);
  if (despachosAeropuertoEstadoFilter) despachosAeropuertoEstadoFilter.addEventListener("change", () => {
    despachosAeropuertoItinFilter = "";
    renderDespachosAeropuertoTab();
  });
  if (despachosAeropuertoRangeFilter) despachosAeropuertoRangeFilter.addEventListener("change", () => loadDespachosAeropuertoFromSupabase());
  if (despachosAeropuertoItinChips) despachosAeropuertoItinChips.addEventListener("click", handleDespachosAeropuertoChipClick);
  if (btnRefreshMapaVehiculos) btnRefreshMapaVehiculos.addEventListener("click", () => loadSonarFleetLocations());
  if (btnFitMapaVehiculos) btnFitMapaVehiculos.addEventListener("click", () => fitMapaToMarkers());
  const mapaBuscarInput = document.getElementById("mapaBuscarCarro");
  const btnMapaBuscar = document.getElementById("btnMapaBuscarCarro");
  if (mapaBuscarInput) {
    mapaBuscarInput.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); agregarCarroSeleccion(mapaBuscarInput.value); } });
    mapaBuscarInput.addEventListener("change", () => { if (mapaBuscarInput.value.trim()) agregarCarroSeleccion(mapaBuscarInput.value); });
  }
  if (btnMapaBuscar) btnMapaBuscar.addEventListener("click", () => { const el = document.getElementById("mapaBuscarCarro"); agregarCarroSeleccion(el ? el.value : ""); });
  const mapaChips = document.getElementById("mapaSeleccionChips");
  if (mapaChips) mapaChips.addEventListener("click", (ev) => {
    const x = ev.target.closest(".mapa-chip-x");
    if (x) { const id = x.getAttribute("data-x"); mapaSeleccion = mapaSeleccion.filter(i => i !== id); renderSonarFleetMarkers(); renderMapaSeleccion(); renderMapaCheckList(); return; }
    const chip = ev.target.closest(".mapa-chip");
    if (chip) { const hit = sonarAllCars.find(y => y.id === chip.getAttribute("data-id")); if (hit) centrarEnCarro(hit); }
  });
  const btnLimpiarSel = document.getElementById("btnMapaSeleccionLimpiar");
  if (btnLimpiarSel) btnLimpiarSel.addEventListener("click", () => { mapaSeleccion = []; renderSonarFleetMarkers(); renderMapaSeleccion(); renderMapaCheckList(); });

  // Check list para filtrar carros en el mapa
  const btnMapaFiltro = document.getElementById("btnMapaFiltro");
  if (btnMapaFiltro) btnMapaFiltro.addEventListener("click", () => toggleMapaFiltro());
  const mapaFiltroSearch = document.getElementById("mapaFiltroSearch");
  if (mapaFiltroSearch) mapaFiltroSearch.addEventListener("input", () => renderMapaCheckList());
  const mapaFiltroLista = document.getElementById("mapaFiltroLista");
  if (mapaFiltroLista) mapaFiltroLista.addEventListener("change", (ev) => {
    const chk = ev.target.closest(".mapa-filtro-chk");
    if (chk) toggleCarroFiltro(chk.getAttribute("data-id"), chk.checked);
  });
  const btnFiltroTodos = document.getElementById("btnMapaFiltroTodos");
  if (btnFiltroTodos) btnFiltroTodos.addEventListener("click", () => {
    mapaSeleccion = Array.from(new Set(sonarAllCars.map(c => c.id).filter(Boolean)));
    renderSonarFleetMarkers(); renderMapaSeleccion(); renderMapaCheckList();
  });
  const btnFiltroNinguno = document.getElementById("btnMapaFiltroNinguno");
  if (btnFiltroNinguno) btnFiltroNinguno.addEventListener("click", () => {
    mapaSeleccion = []; renderSonarFleetMarkers(); renderMapaSeleccion(); renderMapaCheckList();
  });

  // Vuelos MDE
  const vRefresh = document.getElementById("vuelosRefresh");
  if (vRefresh) vRefresh.addEventListener("click", () => loadVuelos());
  const vLleg = document.getElementById("vuelosTabLleg");
  if (vLleg) vLleg.addEventListener("click", () => setVuelosTipo("llegada"));
  const vSal = document.getElementById("vuelosTabSal");
  if (vSal) vSal.addEventListener("click", () => setVuelosTipo("salida"));
  const vHoy = document.getElementById("vuelosDiaHoy");
  if (vHoy) vHoy.addEventListener("click", () => setVuelosDia("hoy"));
  const vMan = document.getElementById("vuelosDiaManana");
  if (vMan) vMan.addEventListener("click", () => setVuelosDia("manana"));
  const vSearch = document.getElementById("vuelosSearch");
  if (vSearch) vSearch.addEventListener("input", () => renderVuelos());
  const vDownload = document.getElementById("vuelosDownload");
  if (vDownload) vDownload.addEventListener("click", () => downloadVuelos());

  // Auditoría de ingresos manuales
  const amRefresh = document.getElementById("audManRefresh");
  if (amRefresh) amRefresh.addEventListener("click", () => loadAuditoriaManual());
  const amFecha = document.getElementById("audManFecha");
  if (amFecha) amFecha.addEventListener("change", () => renderAuditoriaManual());
  const amHoy = document.getElementById("audManHoy");
  if (amHoy) amHoy.addEventListener("click", () => { const f = document.getElementById("audManFecha"); if (f) { f.value = fechaBogotaISO(); renderAuditoriaManual(); } });
  const amSearch = document.getElementById("audManSearch");
  if (amSearch) amSearch.addEventListener("input", () => renderAuditoriaManual());
  const amDownload = document.getElementById("audManDownload");
  if (amDownload) amDownload.addEventListener("click", () => downloadAuditoriaManual());

  // Alertas GPS (desconexiones)
  const gdRefresh = document.getElementById("gpsDescRefresh");
  if (gdRefresh) gdRefresh.addEventListener("click", () => loadGpsDesconexiones());
  const gdActivas = document.getElementById("gpsDescFiltroActivas");
  if (gdActivas) gdActivas.addEventListener("click", () => setGpsDescFiltro(true));
  const gdTodas = document.getElementById("gpsDescFiltroTodas");
  if (gdTodas) gdTodas.addEventListener("click", () => setGpsDescFiltro(false));
  const gdFecha = document.getElementById("gpsDescFecha");
  if (gdFecha) gdFecha.addEventListener("change", () => renderGpsDesconexiones());
  const gdHoy = document.getElementById("gpsDescHoy");
  if (gdHoy) gdHoy.addEventListener("click", () => { const f = document.getElementById("gpsDescFecha"); if (f) { f.value = fechaBogotaISO(); renderGpsDesconexiones(); } });
  const gdSearch = document.getElementById("gpsDescSearch");
  if (gdSearch) gdSearch.addEventListener("input", () => renderGpsDesconexiones());
  const gdDownload = document.getElementById("gpsDescDownload");
  if (gdDownload) gdDownload.addEventListener("click", () => downloadGpsDesconexiones());
  const gdBody = document.getElementById("gpsDescBody");
  if (gdBody) gdBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-gpsdesc-action]");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-gpsdesc-action");
    if (action === "observar") observarGpsDesc(id);
    else if (action === "resolver") setEstadoGpsDesc(id, true);
    else if (action === "reabrir") setEstadoGpsDesc(id, false);
    else if (action === "historial") verHistorialGpsVehiculo(btn.getAttribute("data-interno"), btn.getAttribute("data-mid"));
  });
  const ghCerrar = document.getElementById("gpsHistCerrar");
  if (ghCerrar) ghCerrar.addEventListener("click", () => document.getElementById("gpsHistModal")?.classList.add("hidden"));
  const ghDownload = document.getElementById("gpsHistDownload");
  if (ghDownload) ghDownload.addEventListener("click", () => downloadHistorialGpsVehiculo());
  // Recordatorio siempre visible de pendientes (badge en la pestaña), aunque no se esté viendo.
  ensureGpsDescPendientesPolling();

  // Asistencias
  const aRefresh = document.getElementById("asisRefresh");
  if (aRefresh) aRefresh.addEventListener("click", () => loadAsistencias());
  const aFecha = document.getElementById("asisFecha");
  if (aFecha) aFecha.addEventListener("change", () => loadAsistencias());
  const aHoy = document.getElementById("asisHoy");
  if (aHoy) aHoy.addEventListener("click", () => { const f = document.getElementById("asisFecha"); if (f) f.value = fechaBogotaISO(); loadAsistencias(); });
  const aTodos = document.getElementById("asisFiltroTodos");
  if (aTodos) aTodos.addEventListener("click", () => setAsisFiltro("todos"));
  const aEnt = document.getElementById("asisFiltroEntrada");
  if (aEnt) aEnt.addEventListener("click", () => setAsisFiltro("entrada"));
  const aSal = document.getElementById("asisFiltroSalida");
  if (aSal) aSal.addEventListener("click", () => setAsisFiltro("salida"));
  const aSinSal = document.getElementById("asisFiltroSinSalida");
  if (aSinSal) aSinSal.addEventListener("click", () => setAsisFiltro("sinsalida"));
  const aSoloVeh = document.getElementById("asisSoloVehiculo");
  if (aSoloVeh) aSoloVeh.addEventListener("change", () => renderAsistencias());
  const aDemo = document.getElementById("asisDemo");
  if (aDemo) aDemo.addEventListener("click", () => asisToggleDemoAlerta());
  const aSearch = document.getElementById("asisSearch");
  if (aSearch) aSearch.addEventListener("input", () => renderAsistencias());

  // Informe de gestión de flota
  const iflR = document.getElementById("iflRefresh");
  if (iflR) iflR.addEventListener("click", () => loadInformeFlota());
  const iflF = document.getElementById("iflFecha");
  if (iflF) iflF.addEventListener("change", () => loadInformeFlota());
  const iflH = document.getElementById("iflHoy");
  if (iflH) iflH.addEventListener("click", () => { const f = document.getElementById("iflFecha"); if (f) f.value = fechaBogotaISO(); loadInformeFlota(); });
  const iflD = document.getElementById("iflDownload");
  if (iflD) iflD.addEventListener("click", () => downloadInformeFlota());

  if (btnFullscreenMapa) btnFullscreenMapa.addEventListener("click", () => toggleMapaFullscreen());
  document.addEventListener("fullscreenchange", handleMapaFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleMapaFullscreenChange);
  if (btnFloatingMapa) btnFloatingMapa.addEventListener("click", () => toggleMapaFloating());
  if (btnFloatingClose) btnFloatingClose.addEventListener("click", () => closeMapaFloating());
  if (btnFloatingFit) btnFloatingFit.addEventListener("click", () => fitMapaToMarkers());
  initMapaFloatingDrag();
  if (btnDefinirGeocerca) btnDefinirGeocerca.addEventListener("click", () => startGeocercaPlacement());
  if (btnConfigItinerarios) btnConfigItinerarios.addEventListener("click", () => toggleItinerariosConfig());
  const btnAdminGeocercas = document.getElementById("btnAdminGeocercas");
  if (btnAdminGeocercas) btnAdminGeocercas.addEventListener("click", () => promptGeocercaAdmin());
  applyGeocercaAdminUI(); // estado inicial (oculta controles de admin salvo desbloqueo en esta sesión)
  if (btnCloseConfigItin) btnCloseConfigItin.addEventListener("click", () => toggleItinerariosConfig(false));
  if (itinerariosConfigGrid) itinerariosConfigGrid.addEventListener("change", (ev) => {
    const sel = ev.target.closest("select[data-itin-dir]");
    if (!sel) return;
    setItinerarioDireccion(sel.getAttribute("data-itin-dir"), sel.getAttribute("data-itin-nombre"), sel.getAttribute("data-itin-grupo"), sel.value);
  });
  if (btnCancelGeocerca) btnCancelGeocerca.addEventListener("click", () => cancelGeocercaPlacement());
  if (btnFinishGeocerca) btnFinishGeocerca.addEventListener("click", () => finishGeocerca());
  if (btnUndoGeocerca) btnUndoGeocerca.addEventListener("click", () => undoGeocercaPoint());
  const btnItinTodos = document.getElementById("btnGeocercaItinTodos");
  const btnItinNinguno = document.getElementById("btnGeocercaItinNinguno");
  if (btnItinTodos) btnItinTodos.addEventListener("click", () => setAllGeocercaItins(true));
  if (btnItinNinguno) btnItinNinguno.addEventListener("click", () => setAllGeocercaItins(false));
  if (btnRefreshEnturnamiento) btnRefreshEnturnamiento.addEventListener("click", () => loadEnturnamientos());
  // Aeropuerto = SUBE; Almacentro = BAJA. Cada planilla muestra SOLO sus itinerarios.
  if (btnEnturnoManual) btnEnturnoManual.addEventListener("click", () => toggleEnturnoManual(true, "4505", ITINERARIOS_SUBIDA_AEROPUERTO)); // Aeropuerto (sube)
  const btnEntManAlm = document.getElementById("btnEnturnoManualAlmacentro");
  if (btnEntManAlm) btnEntManAlm.addEventListener("click", () => toggleEnturnoManual(true, "4507", ITINERARIOS_ALMACENTRO_LLEGADA)); // Almacentro (baja, sin Exposiciones)
  const btnEntManExp = document.getElementById("btnEnturnoManualExpo");
  if (btnEntManExp) btnEntManExp.addEventListener("click", () => toggleEnturnoManual(true, "4503", ITINERARIOS_EXPOSICIONES)); // Exposiciones (baja hacia Exposiciones)
  if (btnEnturnoManualCancel) btnEnturnoManualCancel.addEventListener("click", () => toggleEnturnoManual(false));
  const condSel = document.getElementById("enturnoManualConductorSelect");
  if (condSel) condSel.addEventListener("change", () => {
    const otroEl = document.getElementById("enturnoManualConductorOtro");
    const isOtro = condSel.value === "__OTRO__";
    if (otroEl) { otroEl.style.display = isOtro ? "block" : "none"; if (isOtro) setTimeout(() => otroEl.focus(), 20); else otroEl.value = ""; }
  });
  if (btnEnturnoManualSave) btnEnturnoManualSave.addEventListener("click", () => guardarEnturnoManual());
  // Vista previa en vivo del modal manual.
  const manIntEl = document.getElementById("enturnoManualInterno");
  if (manIntEl) manIntEl.addEventListener("input", () => refreshEnturnoManualPreview());
  const manItinEl = document.getElementById("enturnoManualItin");
  if (manItinEl) manItinEl.addEventListener("change", () => refreshEnturnoManualPreview());
  // Cerrar el modal al hacer clic en el fondo.
  const manModal = document.getElementById("enturnoManualModal");
  if (manModal) manModal.addEventListener("click", (ev) => { if (ev.target === manModal) toggleEnturnoManual(false); });
  if (enturnamientoGrid) enturnamientoGrid.addEventListener("click", handleEnturnamientoClick);
  const salidasGridEl = document.getElementById("salidasGrid");
  if (salidasGridEl) salidasGridEl.addEventListener("click", handleEnturnamientoClick);
  const btnRefreshSalidas = document.getElementById("btnRefreshSalidas");
  if (btnRefreshSalidas) btnRefreshSalidas.addEventListener("click", () => loadEnturnamientos());
  // Pestañas de salida por destino (Almacentro, Exposiciones): Quitar + Actualizar.
  ["almacentroGeoGrid", "exposicionesGeoGrid"].forEach(gid => {
    const el = document.getElementById(gid);
    if (el) el.addEventListener("click", handleEnturnamientoClick);
  });
  const btnRefreshAlmacentroGeo = document.getElementById("btnRefreshAlmacentroGeo");
  if (btnRefreshAlmacentroGeo) btnRefreshAlmacentroGeo.addEventListener("click", () => loadEnturnamientos());
  const btnRefreshExposicionesGeo = document.getElementById("btnRefreshExposicionesGeo");
  if (btnRefreshExposicionesGeo) btnRefreshExposicionesGeo.addEventListener("click", () => loadEnturnamientos());
  // Eliminar geocerca desde el popup del mapa (con confirmacion obligatoria).
  if (mapaVehiculosContainer) {
    mapaVehiculosContainer.addEventListener("click", (ev) => {
      const btn = ev.target?.closest?.(".btn-del-geocerca");
      if (!btn) return;
      const id = btn.getAttribute("data-geocerca-id");
      if (!id) return;
      const g = (geocercasRows || []).find(x => String(x.id) === String(id));
      const nombre = g?.nombre || "esta geocerca";
      if (confirm(`¿Eliminar "${nombre}"?\n\nDejará de enturnar carros. Esta acción NO se puede deshacer.`)) deleteGeocerca(id);
    });
  }
  // Lista de geocercas: alternar modo edición y eliminar (solo en modo edición, con confirmacion).
  const geocercasListEl = document.getElementById("geocercasList");
  if (geocercasListEl) {
    geocercasListEl.addEventListener("click", (ev) => {
      const editBtn = ev.target?.closest?.(".btn-geocercas-edit");
      if (editBtn) { geocercasEditMode = !geocercasEditMode; renderGeocercasList(); return; }
      const btn = ev.target?.closest?.(".btn-del-geocerca-list");
      if (!btn) return;
      const id = btn.getAttribute("data-geocerca-id");
      if (!id) return;
      const g = (geocercasRows || []).find(x => String(x.id) === String(id));
      const nombre = g?.nombre || "esta geocerca";
      if (confirm(`¿Eliminar "${nombre}"?\n\nDejará de enturnar carros. Esta acción NO se puede deshacer.`)) {
        deleteGeocerca(id);
        geocercasEditMode = false;
      }
    });
  }
  if (btnToggleSonarPositions) btnToggleSonarPositions.addEventListener("click", () => toggleSonarPositions());
  const btnAviones = document.getElementById("btnToggleAviones");
  if (btnAviones) btnAviones.addEventListener("click", () => toggleAviones());
  const btnRealQ = document.getElementById("btnToggleRealQuery");
  if (btnRealQ) btnRealQ.addEventListener("click", () => toggleRealQuery());
  const avionHoraSel = document.getElementById("avionHoraSel");
  if (avionHoraSel) avionHoraSel.addEventListener("change", (e) => {
    const val = String(e.target.value || "");
    avionHoraFiltro = val === "" ? null : parseInt(val, 10);
    if (!avionesVisible && avionHoraFiltro != null) toggleAviones(); // asegurar capa visible
    renderAvionesAterrizados();
  });
  if (vehiculosSonarBody) vehiculosSonarBody.addEventListener("click", handleVehiculosSonarTableClick);

  // Preoperacionales SICOV
  if (btnRefreshPreopSicov) btnRefreshPreopSicov.addEventListener("click", () => loadPreoperacionalesSicov(1));
  if (preopSicovSearch) preopSicovSearch.addEventListener("input", schedulePreopSicovSearch);
  if (preopSicovFrom) preopSicovFrom.addEventListener("change", () => loadPreoperacionalesSicov(1));
  if (preopSicovTo) preopSicovTo.addEventListener("change", () => loadPreoperacionalesSicov(1));
  if (preopSicovPageSize) preopSicovPageSize.addEventListener("change", () => loadPreoperacionalesSicov(1));
  if (btnPreopSicovFirst) btnPreopSicovFirst.addEventListener("click", () => loadPreoperacionalesSicov(1));
  if (btnPreopSicovPrev)  btnPreopSicovPrev.addEventListener("click",  () => loadPreoperacionalesSicov(Math.max(1, preopSicovCurrentPage - 1)));
  if (btnPreopSicovNext)  btnPreopSicovNext.addEventListener("click",  () => loadPreoperacionalesSicov(preopSicovCurrentPage + 1));
  if (btnPreopSicovLast)  btnPreopSicovLast.addEventListener("click",  () => {
    const totalPages = Math.max(1, Math.ceil(preopSicovTotalCount / getPreopSicovPageSize()));
    loadPreoperacionalesSicov(totalPages);
  });

  // Programacion filas
  if (btnRefreshProgramacionFilas) btnRefreshProgramacionFilas.addEventListener("click", () => loadProgramacionFilas());
  if (programacionFilasSearch) programacionFilasSearch.addEventListener("input", renderProgramacionFilas);
  if (programacionFilasPuesto) programacionFilasPuesto.addEventListener("change", renderProgramacionFilas);
  if (programacionFilasFecha) programacionFilasFecha.addEventListener("change", () => loadProgramacionFilas());
  if (btnProgramacionFilasHoy) btnProgramacionFilasHoy.addEventListener("click", () => {
    if (programacionFilasFecha) programacionFilasFecha.value = todayIsoLocal();
    loadProgramacionFilas();
  });
  if (programacionFilasBody) programacionFilasBody.addEventListener("click", handleProgramacionFilasRowClick);

  // Vista Excel (réplica del visor operativo)
  const veRefreshBtn = document.getElementById("veRefresh");
  const veFechaEl = document.getElementById("veFecha");
  const veHoyBtn = document.getElementById("veHoy");
  const veDownloadBtn = document.getElementById("veDownload");
  if (veRefreshBtn) veRefreshBtn.addEventListener("click", () => refreshVistaExcel());
  if (veDownloadBtn) veDownloadBtn.addEventListener("click", () => downloadVistaExcel());
  if (veFechaEl) veFechaEl.addEventListener("change", () => refreshVistaExcel());
  if (veHoyBtn) veHoyBtn.addEventListener("click", () => { const f = document.getElementById("veFecha"); if (f) f.value = fechaBogotaISO(); refreshVistaExcel(); });

  // Cumplimiento
  const cumpRefreshBtn = document.getElementById("cumpRefresh");
  const cumpFechaEl = document.getElementById("cumpFecha");
  const cumpHoyBtn = document.getElementById("cumpHoy");
  const cumpSoloEl = document.getElementById("cumpSoloProblemas");
  if (cumpRefreshBtn) cumpRefreshBtn.addEventListener("click", () => refreshCumplimiento());
  if (cumpFechaEl) cumpFechaEl.addEventListener("change", () => refreshCumplimiento());
  if (cumpHoyBtn) cumpHoyBtn.addEventListener("click", () => { const f = document.getElementById("cumpFecha"); if (f) f.value = fechaBogotaISO(); refreshCumplimiento(); });
  if (cumpSoloEl) cumpSoloEl.addEventListener("change", () => renderCumplimiento());

  // Tabla vehiculossonar (vista cruda)
  if (btnRefreshTablaVehiculosSonar) btnRefreshTablaVehiculosSonar.addEventListener("click", () => loadTablaVehiculosSonar());
  if (tablaVehiculosSonarSearch) tablaVehiculosSonarSearch.addEventListener("input", renderTablaVehiculosSonar);
  if (tablaVehiculosSonarBody) tablaVehiculosSonarBody.addEventListener("click", handleTablaVehiculosSonarRowClick);

  // Asistencia biometrica
  if (btnReloadAsistenciaBiometrica) {
    btnReloadAsistenciaBiometrica.addEventListener("click", () => {
      if (!asistenciaBiometricaFrame) return;
      asistenciaBiometricaFrame.src = asistenciaBiometricaFrame.src;
    });
  }
  setupBiometricoAutoLogin();

  // Planilla afiliados
  if (btnRefreshPlanilla) btnRefreshPlanilla.addEventListener("click", triggerPlanillaRefresh);
  if (planillaTableSource) {
    planillaTableSource.addEventListener("change", async () => {
      setCurrentPlanillaTableSource(planillaTableSource.value);
      resetPlanillaCache();
      await loadPlanillaAfiliadosFromSupabase();
    });
  }
  if (btnDownloadLlegadas) btnDownloadLlegadas.addEventListener("click", handleDownloadLlegadas);
  if (btnDownloadDespachos) btnDownloadDespachos.addEventListener("click", handleDownloadDespachos);
  if (planillaFilterInterno) planillaFilterInterno.addEventListener("input", renderPlanillaAfiliados);
  if (planillaFilterBase) planillaFilterBase.addEventListener("input", renderPlanillaAfiliados);
  if (planillaFilterHoraLlegada) planillaFilterHoraLlegada.addEventListener("input", renderPlanillaAfiliados);
  if (planillaFilterTipo) planillaFilterTipo.addEventListener("change", renderPlanillaAfiliados);

  // Llegadas Aeropuerto
  if (btnRefreshLlegadasAeropuerto) btnRefreshLlegadasAeropuerto.addEventListener("click", triggerPlanillaRefresh);
  if (aeropuertoSearch) aeropuertoSearch.addEventListener("input", renderLlegadasAeropuerto);
  if (aeropuertoEstadoFilter) aeropuertoEstadoFilter.addEventListener("change", renderLlegadasAeropuerto);
  if (aeropuertoBaseFilter) aeropuertoBaseFilter.addEventListener("change", renderLlegadasAeropuerto);
  if (aeropuertoUploadFrom) aeropuertoUploadFrom.addEventListener("change", renderLlegadasAeropuerto);
  if (aeropuertoUploadTo) aeropuertoUploadTo.addEventListener("change", renderLlegadasAeropuerto);
  if (btnDownloadLlegadasAeropuerto) btnDownloadLlegadasAeropuerto.addEventListener("click", handleDownloadLlegadasAeropuerto);

  // Llegadas Terminal Norte
  if (btnRefreshLlegadasTerminalNorte) btnRefreshLlegadasTerminalNorte.addEventListener("click", triggerPlanillaRefresh);
  if (terminalNorteSearch) terminalNorteSearch.addEventListener("input", renderLlegadasTerminalNorte);
  if (terminalNorteEstadoFilter) terminalNorteEstadoFilter.addEventListener("change", renderLlegadasTerminalNorte);
  if (terminalNorteBaseFilter) terminalNorteBaseFilter.addEventListener("change", renderLlegadasTerminalNorte);
  if (terminalNorteUploadFrom) terminalNorteUploadFrom.addEventListener("change", renderLlegadasTerminalNorte);
  if (terminalNorteUploadTo) terminalNorteUploadTo.addEventListener("change", renderLlegadasTerminalNorte);
  if (btnDownloadLlegadasTerminalNorte) btnDownloadLlegadasTerminalNorte.addEventListener("click", handleDownloadLlegadasTerminalNorte);

  // Llegadas Almacentro (San Diego)
  if (btnRefreshLlegadasSanDiego) btnRefreshLlegadasSanDiego.addEventListener("click", triggerPlanillaRefresh);
  if (sanDiegoSearch) sanDiegoSearch.addEventListener("input", renderLlegadasSanDiego);
  if (sanDiegoEstadoFilter) sanDiegoEstadoFilter.addEventListener("change", renderLlegadasSanDiego);
  if (sanDiegoBaseFilter) sanDiegoBaseFilter.addEventListener("change", renderLlegadasSanDiego);
  if (sanDiegoUploadFrom) sanDiegoUploadFrom.addEventListener("change", renderLlegadasSanDiego);
  if (sanDiegoUploadTo) sanDiegoUploadTo.addEventListener("change", renderLlegadasSanDiego);
  if (btnDownloadLlegadasSanDiego) btnDownloadLlegadasSanDiego.addEventListener("click", handleDownloadLlegadasSanDiego);

  // Llegadas Nutibara
  if (btnRefreshLlegadasNutibara) btnRefreshLlegadasNutibara.addEventListener("click", triggerPlanillaRefresh);
  if (nutibaraSearch) nutibaraSearch.addEventListener("input", renderLlegadasNutibara);
  if (nutibaraEstadoFilter) nutibaraEstadoFilter.addEventListener("change", renderLlegadasNutibara);
  if (nutibaraBaseFilter) nutibaraBaseFilter.addEventListener("change", renderLlegadasNutibara);
  if (nutibaraUploadFrom) nutibaraUploadFrom.addEventListener("change", renderLlegadasNutibara);
  if (nutibaraUploadTo) nutibaraUploadTo.addEventListener("change", renderLlegadasNutibara);
  if (btnDownloadLlegadasNutibara) btnDownloadLlegadasNutibara.addEventListener("click", handleDownloadLlegadasNutibara);

  // No despacho
  if (btnRefreshNoDespacho) btnRefreshNoDespacho.addEventListener("click", triggerPlanillaRefresh);
  if (noDespachoSearch) noDespachoSearch.addEventListener("input", renderNoDespachoTab);
  if (noDespachoPuntoFilter) noDespachoPuntoFilter.addEventListener("change", renderNoDespachoTab);
  if (noDespachoBaseFilter) noDespachoBaseFilter.addEventListener("change", renderNoDespachoTab);
  if (noDespachoFrom) noDespachoFrom.addEventListener("change", renderNoDespachoTab);
  if (noDespachoTo) noDespachoTo.addEventListener("change", renderNoDespachoTab);

  // Fuera de lista
  if (fueraListaSearch) fueraListaSearch.addEventListener("input", renderFueraListaTab);

  // Mobile tabs
  if (mobileTabSelect) {
    mobileTabSelect.addEventListener("change", () => {
      openTabById(mobileTabSelect.value);
    });
  }
}


/* ===================== PLANILLAS DE DESPACHO (formato operadores) ===================== */
// Genera automáticamente la planilla manual (FICHO, VEHICULO, SALIDA, CONTROL, RUTA,
// PASAJEROS, MAS, CONDUCTOR) desde despachos_realizados. Una planilla por destino de subida.
const PLANILLA_DESPACHOS_TABLE = "despachos_realizados";
const PLANILLAS_DESPACHO = [
  { key: "almacentro", tab: "planilla-despachos",          nombre: "Almacentro",                 itins: ["4505"] },
  { key: "sandiego",   tab: "planilla-despachos-sandiego", nombre: "Centro Comercial San Diego", itins: ["4504", "3395"] },
  { key: "expo",       tab: "planilla-despachos-expo",     nombre: "Exposiciones",               itins: ["4502", "3387", "3394"] },
];
const planillaDespachoState = {};
PLANILLAS_DESPACHO.forEach(c => { planillaDespachoState[c.key] = { rows: [] }; });

function planillaCfgByTab(tabId){ return PLANILLAS_DESPACHO.find(c => c.tab === tabId) || null; }
function planillaEl(cfg, suf){ return document.getElementById(`pd_${cfg.key}_${suf}`); }

// Nombre del conductor a partir del driver_id (catálogo cargado desde Sonar).
function driverNameById(drvId){
  const id = String(drvId || "").trim();
  if (!id) return "";
  const r = (driversCatalogRows || []).find(v => String(v?.dr_id || "").trim() === id);
  return r ? String(r.nombre || "").trim() : "";
}

// Hora de salida "H:MM" (12h) + control "AM/PM" desde un timestamp (Colombia).
function horaSalidaCO(value){
  if (!value) return { hora: "", control: "" };
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Bogota", hour: "numeric", minute: "2-digit", hour12: true,
    }).formatToParts(new Date(value));
    const get = (t) => parts.find(p => p.type === t)?.value || "";
    return { hora: `${get("hour")}:${get("minute")}`, control: (get("dayPeriod") || "").toUpperCase().replace(/\./g, "") };
  } catch (_) { return { hora: "", control: "" }; }
}

function planillaFechaSel(cfg){
  return String(planillaEl(cfg, "fecha")?.value || "").trim() || fechaBogotaISO();
}

// Recarga la planilla ACTIVA solo si: es su pestaña, es hoy y el usuario no está editando.
function maybeReloadPlanillaActiva(){
  const cfg = planillaCfgByTab(getActiveTabId());
  if (!cfg) return;
  if (planillaFechaSel(cfg) !== fechaBogotaISO()) return;
  const body = planillaEl(cfg, "body");
  if (body && body.contains(document.activeElement)) return; // no interrumpir edición
  loadPlanilla(cfg);
}

// Carga automática 1: Realtime — al instante cuando entra/cambia un despacho.
let planillaDespachosRealtimeChannel = null;
function ensurePlanillaDespachosRealtime(){
  if (planillaDespachosRealtimeChannel) return;
  if (!planillaSupabaseClient?.channel) return;
  try {
    planillaDespachosRealtimeChannel = planillaSupabaseClient
      .channel("despachos_realizados_planilla_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: PLANILLA_DESPACHOS_TABLE }, () => maybeReloadPlanillaActiva())
      .subscribe();
  } catch (err) {
    console.warn("[planilla-despachos] realtime no disponible:", err);
  }
}

// Carga automática 2: sondeo cada 20s como respaldo (por si Realtime no está activo).
let planillaDespachosPollTimer = null;
function ensurePlanillaDespachosPolling(){
  if (planillaDespachosPollTimer) return;
  planillaDespachosPollTimer = setInterval(() => {
    if (!navigator.onLine) return;
    maybeReloadPlanillaActiva();
  }, 20000);
}

async function loadPlanilla(cfg){
  const body = planillaEl(cfg, "body");
  const status = planillaEl(cfg, "status");
  if (!body) return;
  const fecha = planillaFechaSel(cfg);
  if (status) status.textContent = "Consultando...";
  try {
    const desde = new Date(`${fecha}T00:00:00-05:00`);
    const hasta = new Date(desde); hasta.setDate(hasta.getDate() + 1);
    const { data, error } = await planillaSupabaseClient
      .from(PLANILLA_DESPACHOS_TABLE)
      .select("id,interno,itinerario_id,itinerario,driver_id,pasajeros,ficho,mas,observaciones,estado,created_at")
      .in("itinerario_id", cfg.itins)
      .gte("created_at", desde.toISOString())
      .lt("created_at", hasta.toISOString())
      .order("created_at", { ascending: false });
    if (error) throw error;
    planillaDespachoState[cfg.key].rows = Array.isArray(data) ? data : [];
    renderPlanilla(cfg);
    if (status) {
      const rows = planillaDespachoState[cfg.key].rows;
      const canc = rows.filter(r => String(r?.estado || "").toUpperCase() === "CANCELADO").length;
      const act = rows.length - canc;
      status.textContent = `Actualizado ${horaCO(new Date())} · ${act} activos` + (canc ? ` · ${canc} cancelados` : "");
    }
  } catch (err) {
    console.error(`[planilla-${cfg.key}] error:`, err);
    if (status) status.textContent = `Error: ${err?.message || "fallo"}`;
  }
}

function planillaFilas(cfg){
  return (planillaDespachoState[cfg.key].rows || [])
    .map(r => {
      const { hora, control } = horaSalidaCO(r?.created_at);
      return {
        id: String(r?.id || ""),
        cancelado: String(r?.estado || "").toUpperCase() === "CANCELADO",
        ficho: String(r?.ficho || "").trim(),
        vehiculo: String(r?.interno || "").trim(),
        salida: hora,
        control,
        ruta: String(r?.itinerario || "").trim(),
        pasajeros: (r?.pasajeros ?? "") === "" ? "" : String(r.pasajeros),
        mas: String(r?.mas || "").trim(),
        conductor: driverNameById(r?.driver_id) || "",
      };
    });
}

// Rellena el datalist de conductores (nombres habilitados) para la edición.
function fillPlanillaConductoresDatalist(){
  const dl = document.getElementById("pdConductores");
  if (!dl) return;
  const nombres = Array.from(new Set((driversCatalogRows || [])
    .filter(v => String(v?.status || "").toUpperCase() === "ENABLED")
    .map(v => String(v?.nombre || "").trim())
    .filter(Boolean))).sort((a, b) => a.localeCompare(b));
  dl.innerHTML = nombres.map(n => `<option value="${escapeHtml(n)}"></option>`).join("");
}

function renderPlanilla(cfg){
  const body = planillaEl(cfg, "body");
  const count = planillaEl(cfg, "count");
  if (!body) return;
  fillPlanillaConductoresDatalist();
  const filas = planillaFilas(cfg);
  const activos = filas.filter(f => !f.cancelado).length;
  const cancelados = filas.length - activos;
  if (count) count.textContent = cancelados > 0 ? `${activos} (+${cancelados} canc.)` : String(activos);
  if (!filas.length) {
    body.innerHTML = `<tr><td colspan="8" class="muted" style="text-align:center;padding:14px">Sin despachos para esta fecha.</td></tr>`;
    return;
  }
  body.innerHTML = filas.map(f => {
    // Todas las filas se ven igual y son editables. Las canceladas solo llevan
    // una etiqueta roja "CANCELADO" para identificarlas, sin tachado ni gris.
    const badge = f.cancelado ? `<span class="pd-badge-canc">CANCELADO</span> ` : "";
    return `<tr class="${f.cancelado ? "pd-cancelado" : ""}">
      <td>${badge}<input class="pd-edit" data-field="ficho" data-id="${escapeHtml(f.id)}" list="fichoOpciones" type="text" value="${escapeHtml(f.ficho)}" placeholder="Ficho / nota…" style="width:100%;min-width:180px" /></td>
      <td class="ent-interno">${escapeHtml(f.vehiculo)}</td>
      <td>${escapeHtml(f.salida)}</td>
      <td>${escapeHtml(f.control)}</td>
      <td>${escapeHtml(f.ruta)}</td>
      <td><input class="pd-edit" data-field="pasajeros" data-id="${escapeHtml(f.id)}" type="number" min="0" step="1" value="${escapeHtml(f.pasajeros)}" style="width:64px" /></td>
      <td><input class="pd-edit" data-field="mas" data-id="${escapeHtml(f.id)}" type="text" value="${escapeHtml(f.mas)}" style="width:90px" /></td>
      <td><input class="pd-edit" data-field="conductor" data-id="${escapeHtml(f.id)}" list="pdConductores" type="text" value="${escapeHtml(f.conductor)}" style="width:190px" /></td>
    </tr>`;
  }).join("");
}

// Guarda un campo editado de una fila en despachos_realizados (y refleja en memoria).
async function savePlanillaDespachoField(cfg, id, field, rawValue){
  const rid = String(id || "").trim();
  if (!rid) return;
  const value = String(rawValue ?? "").trim();
  const update = {};
  if (field === "ficho") {
    update.ficho = value || null;
  } else if (field === "pasajeros") {
    const n = parseInt(value, 10);
    update.pasajeros = Number.isFinite(n) && n >= 0 ? n : 0;
  } else if (field === "mas") {
    update.mas = value || null;
  } else if (field === "conductor") {
    if (!value) { update.driver_id = null; }
    else {
      const drvId = findDriverIdByName(value);
      if (!drvId) { showToast(`Conductor "${value}" no está en el catálogo de Sonar.`, "warn"); return; }
      update.driver_id = String(drvId);
    }
  } else { return; }
  try {
    const { error } = await planillaSupabaseClient.from(PLANILLA_DESPACHOS_TABLE).update(update).eq("id", rid);
    if (error) throw error;
    const row = (planillaDespachoState[cfg.key].rows || []).find(r => String(r?.id) === rid);
    if (row) Object.assign(row, update);
    showToast("Cambio guardado.", "ok");
  } catch (err) {
    console.error(`[planilla-${cfg.key}] guardar fallo:`, err);
    showToast(`No se pudo guardar: ${err?.message || "fallo"}`, "err");
  }
}

function handlePlanillaEdit(ev, cfg){
  const el = ev.target?.closest?.(".pd-edit");
  if (!el) return;
  savePlanillaDespachoField(cfg, el.getAttribute("data-id"), el.getAttribute("data-field"), el.value);
}

function downloadPlanilla(cfg){
  // El CSV (planilla que se entrega) lleva solo los despachos activos.
  const filas = planillaFilas(cfg).filter(f => !f.cancelado);
  const head = "FICHO ;VEHICULO;SALIDA;CONTROL;RUTA;PASAJEROS;MAS;CONDUCTOR ";
  const lines = filas.map(f => [f.ficho, f.vehiculo, f.salida, f.control, f.ruta, f.pasajeros, f.mas, f.conductor].join(";"));
  const csv = [head, ...lines].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `planilla-despachos-${cfg.key}-${planillaFechaSel(cfg)}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// Conecta botones/inputs/edición de las tres planillas.
function bindPlanillasDespacho(){
  PLANILLAS_DESPACHO.forEach(cfg => {
    const btnR = planillaEl(cfg, "refresh");
    const btnD = planillaEl(cfg, "download");
    const fecha = planillaEl(cfg, "fecha");
    const body = planillaEl(cfg, "body");
    if (btnR) btnR.addEventListener("click", () => loadPlanilla(cfg));
    if (btnD) btnD.addEventListener("click", () => downloadPlanilla(cfg));
    if (fecha) fecha.addEventListener("change", () => loadPlanilla(cfg));
    if (body) body.addEventListener("change", (ev) => handlePlanillaEdit(ev, cfg));
  });
}

/* ==================== VISTA EXCEL (portada de combuasignacion1) ====================
   Réplica del "Visor Excel en línea": lee programacion_filas (row_data) de la fecha
   seleccionada (última programación del día) y arma el formato operativo IDÉNTICO:
   secciones por PUESTO, columnas  # | INICIA | VEH | CONDUCTOR 1 | INICIA | CONDUCTOR 2 | HORA FIN,
   con las filas FICHO resaltadas en sus posiciones fijas.
   Reusa helpers ya existentes: norm, getBaseCanonical, normalizeDateToISO, extractConductorName, escapeHtml. */

let vistaExcelRows = [];
let vistaExcelLoadedDate = null;

function veNormCompact(s){ return norm(s).replace(/\s+/g, ""); }

function veExcelTimeToHHMM(value){
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string") {
    const raw = value.trim();
    const m = raw.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!m) return raw;
    let hh = parseInt(m[1], 10); let mm = parseInt(m[2], 10);
    if (Number.isNaN(hh) || Number.isNaN(mm) || mm < 0 || mm > 59) return raw;
    if (hh >= 24) hh = hh % 24; if (hh < 0) hh = 0;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }
  if (typeof value !== "number") return value;
  const totalMins = Math.round((value % 1) * 24 * 60);
  const hh = Math.floor(totalMins / 60) % 24; const mm = totalMins % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function veExcelDateToReadable(iso){
  if (typeof iso !== "string" || !iso.includes("-")) return iso;
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function veFormatDateLongEs(value){
  const iso = normalizeDateToISO(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ""))) return veExcelDateToReadable(iso);
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).toUpperCase();
}

function veConductorNoteKey(k){ return `__NOTE__${String(k || "")}`; }
function veGetConductorNote(row, k){ return String((row || {})[veConductorNoteKey(k)] || "").trim(); }
function veGetVehiculoNote(row){ return String((row || {})["__NOTE__VEHICULO"] || "").trim(); }

function veInferConductorKeys(keys){
  const list = Array.isArray(keys) ? keys : [];
  const token = (k) => veNormCompact(k).replace(/[^A-Z0-9]/g, "");
  const cand = list.filter(k => token(k).includes("CONDUCT"));
  let key1 = null, key2 = null;
  cand.forEach(k => { const t = token(k); if (!key1 && (t.includes("1") || t.endsWith("UNO"))) key1 = k; if (!key2 && t.includes("2")) key2 = k; });
  cand.forEach(k => { if (!key1) { key1 = k; return; } if (!key2 && k !== key1) key2 = k; });
  return { key1, key2 };
}

function veInferInicioKeys(keys){
  const list = Array.isArray(keys) ? keys : [];
  const token = (k) => veNormCompact(k).replace(/[^A-Z0-9]/g, "");
  const cand = list.filter(k => { const t = token(k); return t.includes("INICIA") || t.includes("INICIO") || t.includes("HORAINICIO"); });
  let key1 = null, key2 = null;
  cand.forEach(k => { const t = token(k); if (!key2 && t.includes("2")) key2 = k; if (!key1 && (t.includes("1") || t === "INICIA" || t === "INICIO" || t === "HORAINICIO")) key1 = k; });
  cand.forEach(k => { if (!key1) { key1 = k; return; } if (!key2 && k !== key1) key2 = k; });
  return { key1, key2 };
}

function veKeysFromRows(rows){
  const set = new Set();
  (Array.isArray(rows) ? rows : []).slice(0, 200).forEach(r => Object.keys(r || {}).forEach(k => set.add(k)));
  return Array.from(set);
}
function veHeaderKey(rows, aliases){ return veKeysFromRows(rows).find(k => aliases.includes(norm(k))) || null; }
function veFechaKey(rows){ return veKeysFromRows(rows).find(k => norm(k) === "FECHA") || null; }
function veRowDateISO(row, preferredKey){
  const keys = Object.keys(row || {});
  const fk = (preferredKey && keys.includes(preferredKey)) ? preferredKey : (keys.find(k => norm(k) === "FECHA") || null);
  if (!fk) return "";
  const iso = normalizeDateToISO(row[fk]);
  return /^\d{4}-\d{2}-\d{2}$/.test(String(iso || "")) ? iso : "";
}
function veRowBase(row, baseKey){
  const keys = Object.keys(row || {});
  const bk = baseKey || keys.find(k => BASE_COLUMN_ALIASES.includes(norm(k))) || null;
  return bk ? getBaseCanonical(row[bk]) : "";
}

function veCanonicalizePuesto(value){
  const raw = String(value || "").trim();
  const n = norm(raw);
  if (n.includes("EXPOSICIONES")) return "EXPOSICIONES";
  if (n.includes("SAN DIEGO")) return "SAN DIEGO";
  if (n.includes("NUTIBARA") || n.includes("TERMINAL DEL NORTE")) return "NUTIBARA";
  return raw || "SIN PUESTO";
}
function veSectionDisplayName(value){
  const c = veCanonicalizePuesto(value);
  if (c === "NUTIBARA") return "TERMINAL DEL NORTE";
  if (c === "EXPOSICIONES") return "NUTIBARA -EXPOSICIONES";
  return c;
}
function veNumericTurn(value){ const d = String(value ?? "").match(/\d+/); if (!d) return null; const n = Number(d[0]); return Number.isFinite(n) ? n : null; }
function veFichoIndex(value){ const m = String(value || "").toUpperCase().match(/FICHO\s*([0-9]+)/); const i = m ? Number(m[1]) : NaN; return Number.isFinite(i) ? i : null; }
function veFichoSectionByIndex(idx){ const n = Number(idx); if (!Number.isFinite(n)) return null; if (n >= 1 && n <= 6) return "SAN DIEGO"; if (n >= 7 && n <= 10) return "EXPOSICIONES"; return null; }

const VE_FICHO_RULES = {
  "SAN DIEGO": [{ ficho: 1, after: 14 }, { ficho: 2, after: 18 }, { ficho: 3, after: 22 }, { ficho: 4, after: 26 }, { ficho: 5, after: 30 }, { ficho: 6, after: 34 }],
  "EXPOSICIONES": [{ ficho: 7, after: 38 }, { ficho: 8, after: 42 }, { ficho: 9, after: 46 }, { ficho: 10, after: 51 }],
};

// Números de turno de la sección SAN DIEGO que son despachos de ccsandiego → se pintan de ROJO.
// (Editar esta lista según la programación real; punto de partida tomado de la captura.)
const VE_CCSANDIEGO_TURNOS = new Set([24, 26, 28, 30, 32, 34]);

function veBuildEntries(rowsInput, puestoKey, numeroKey){
  const source = Array.isArray(rowsInput) ? rowsInput : [];
  let lastPuesto = "SIN PUESTO";
  return source.map((r, idx) => {
    const puestoRaw = String(puestoKey ? (r[puestoKey] || "") : "").trim();
    if (puestoRaw) lastPuesto = veCanonicalizePuesto(puestoRaw);
    const puestoResolved = puestoRaw ? veCanonicalizePuesto(puestoRaw) : lastPuesto;
    const numeroRaw = String(numeroKey ? (r[numeroKey] || "") : "").trim();
    return { row: r, idx, puestoResolved, numeroRaw, isFichoMarker: norm(numeroRaw).includes("FICHO") };
  });
}
function veSortByNumericTurn(entries){
  return (Array.isArray(entries) ? entries.slice() : []).sort((a, b) => {
    const an = veNumericTurn(a?.numeroRaw), bn = veNumericTurn(b?.numeroRaw);
    const am = !Number.isFinite(an), bm = !Number.isFinite(bn);
    if (am !== bm) return am ? 1 : -1;
    if (!am && an !== bn) return an - bn;
    return (a?.idx ?? 0) - (b?.idx ?? 0);
  });
}
function veGroupByPuesto(entries){
  const list = Array.isArray(entries) ? entries : [];
  const buckets = new Map(); const order = [];
  const ensure = (label) => { const k = String(label || "SIN PUESTO"); if (!buckets.has(k)) { buckets.set(k, []); order.push(k); } return buckets.get(k); };
  let currentSection = "SIN PUESTO";
  list.forEach(entry => {
    const rowLabel = veCanonicalizePuesto(entry?.puestoResolved || "SIN PUESTO");
    const fichoIdx = entry?.isFichoMarker ? veFichoIndex(entry?.numeroRaw) : null;
    const fichoSection = fichoIdx ? veFichoSectionByIndex(fichoIdx) : null;
    if (!entry?.isFichoMarker) currentSection = rowLabel || currentSection || "SIN PUESTO";
    else if (fichoSection) currentSection = fichoSection;
    else if (!currentSection || currentSection === "SIN PUESTO") currentSection = rowLabel || "SIN PUESTO";
    const sectionLabel = (entry?.isFichoMarker && fichoSection) ? fichoSection : (currentSection || "SIN PUESTO");
    ensure(sectionLabel).push(entry);
  });
  const preferred = ["NUTIBARA", "SAN DIEGO", "EXPOSICIONES", "SIN PUESTO"];
  const grouped = [];
  preferred.forEach(l => { if (buckets.has(l) && buckets.get(l).length) { grouped.push({ puesto: l, entries: buckets.get(l) }); buckets.delete(l); } });
  order.forEach(l => { if (buckets.has(l) && buckets.get(l).length) grouped.push({ puesto: l, entries: buckets.get(l) }); });
  return grouped;
}
function veSectionEntries(sectionLabelInput, entriesInput){
  const sectionLabel = veCanonicalizePuesto(sectionLabelInput);
  const entries = Array.isArray(entriesInput) ? entriesInput.slice() : [];
  const nonFicho = veSortByNumericTurn(entries.filter(e => !e?.isFichoMarker));
  if (sectionLabel === "NUTIBARA") return nonFicho;
  const fichoEntries = entries.filter(e => e?.isFichoMarker);
  if (!fichoEntries.length) return nonFicho;
  const byIndex = new Map();
  fichoEntries.forEach(e => { const i = veFichoIndex(e?.numeroRaw); if (i && !byIndex.has(i)) byIndex.set(i, e); });
  const rules = VE_FICHO_RULES[sectionLabel];
  if (!Array.isArray(rules) || !rules.length) return nonFicho.concat(veSortByNumericTurn(fichoEntries));
  const ordered = nonFicho.slice(); const inserted = new Set();
  rules.forEach(rule => {
    const e = byIndex.get(rule.ficho); if (!e) return;
    let at = ordered.findIndex(it => { if (it?.isFichoMarker) return false; const n = veNumericTurn(it?.numeroRaw); return Number.isFinite(n) && n > rule.after; });
    if (at < 0) at = ordered.length;
    ordered.splice(at, 0, e); inserted.add(rule.ficho);
  });
  const leftovers = Array.from(byIndex.entries()).filter(([i]) => !inserted.has(i)).sort((a, b) => a[0] - b[0]).map(([, e]) => e);
  return ordered.concat(leftovers);
}
function veBuildFichoAssignments(grouped, vehiculoKey, baseKey, fechaKey){
  const assignments = new Map();
  (Array.isArray(grouped) ? grouped : []).forEach(section => {
    const sectionColor = norm(veCanonicalizePuesto(section?.puesto || "")).includes("EXPOSICIONES") ? "blue" : "green";
    (Array.isArray(section?.entries) ? section.entries : []).forEach(entry => {
      if (!entry?.isFichoMarker) return;
      const idx = veFichoIndex(entry.numeroRaw); if (!idx) return;
      const veh = String(vehiculoKey ? (entry.row?.[vehiculoKey] || "") : "").trim(); if (!veh) return;
      const groupKey = `${veRowBase(entry.row, baseKey) || ""}|${veRowDateISO(entry.row, fechaKey) || ""}`;
      if (!assignments.has(groupKey)) assignments.set(groupKey, new Map());
      assignments.get(groupKey).set(idx, { veh, color: sectionColor });
    });
  });
  return assignments;
}

async function loadVistaExcel(dateIso){
  const date = normalizeDateToISO(dateIso || "");
  vistaExcelLoadedDate = date;
  if (!date) { vistaExcelRows = []; return; }
  let latest = 0;
  try {
    const probe = await planillaSupabaseClient
      .from(PROGRAMACION_FILAS_TABLE)
      .select("programacion_id").eq("fecha", date)
      .order("programacion_id", { ascending: false }).limit(1).maybeSingle();
    if (!probe.error) latest = Number(probe.data?.programacion_id || 0);
  } catch (_) { /* sin programacion_id: se cargan todas las de la fecha */ }
  const pageSize = 1000; const all = []; let offset = 0;
  while (true) {
    let q = planillaSupabaseClient.from(PROGRAMACION_FILAS_TABLE).select("row_data").eq("fecha", date);
    if (latest) q = q.eq("programacion_id", latest);
    const { data, error } = await q.order("id", { ascending: true }).range(offset, offset + pageSize - 1);
    if (error) throw error;
    const chunk = Array.isArray(data) ? data : [];
    all.push(...chunk);
    if (chunk.length < pageSize) break;
    offset += pageSize;
  }
  vistaExcelRows = all.map(r => r?.row_data).filter(r => r && typeof r === "object");
}

function renderVistaExcel(){
  const cont = document.getElementById("veContainer");
  const countEl = document.getElementById("veCount");
  if (!cont) return;
  const source = Array.isArray(vistaExcelRows) ? vistaExcelRows : [];
  if (!source.length) {
    cont.innerHTML = `<div class="muted" style="padding:12px;text-align:center">No hay programación para esta fecha.</div>`;
    if (countEl) countEl.textContent = "0";
    return;
  }
  const headerKeys = veKeysFromRows(source);
  const fechaKey = veFechaKey(source);
  const puestoKey = veHeaderKey(source, ["PUESTO"]);
  const numeroKey = veHeaderKey(source, ["#"]);
  const vehiculoKey = veHeaderKey(source, ["VEH", "VEHICULO", "VEHÍCULO", "MOVIL", "MÓVIL"]);
  const horaFinKey = veHeaderKey(source, ["HORA FIN", "HORA FINAL"]);
  const { key1: inicio1Key, key2: inicio2Key } = veInferInicioKeys(headerKeys);
  const { key1: conductor1Key, key2: conductor2Key } = veInferConductorKeys(headerKeys);
  const baseKey = veHeaderKey(source, BASE_COLUMN_ALIASES);

  const visorDate = vistaExcelLoadedDate || (fechaKey ? veRowDateISO(source[0], fechaKey) : "");
  let ordered = source.slice();
  if (fechaKey && visorDate) ordered = ordered.filter(r => veRowDateISO(r, fechaKey) === visorDate);
  if (countEl) countEl.textContent = String(ordered.length);

  const entries = veBuildEntries(ordered, puestoKey, numeroKey);
  const grouped = veGroupByPuesto(entries);
  const fichoAssignments = veBuildFichoAssignments(grouped, vehiculoKey, baseKey, fechaKey);

  const fmtConductor = (rowObj, conductorKey) => {
    if (!conductorKey) return "";
    const raw = String(rowObj?.[conductorKey] || "");
    const note = veGetConductorNote(rowObj, conductorKey);
    const assigned = extractConductorName(raw);
    const isUnassigned = !raw || norm(raw) === UNASSIGNED_LABEL || !assigned;
    if (!note || !isUnassigned) return raw;
    return `${UNASSIGNED_LABEL}\nNOTA: ${note}`;
  };

  const leftRows = [];
  const titleDate = veFormatDateLongEs(visorDate);
  grouped.forEach(section => {
    const sectionLabel = veCanonicalizePuesto(section.puesto);
    const sectionEntries = veSectionEntries(sectionLabel, section.entries);
    if (!sectionEntries.length) return;
    if (leftRows.length > 0) leftRows.push({ type: "spacer" });
    leftRows.push({ type: "sectionTitle", title: `${String(veSectionDisplayName(sectionLabel) || "SIN PUESTO").toUpperCase()} ${titleDate}` });
    leftRows.push({ type: "header" });
    sectionEntries.forEach(entry => {
      const r = entry.row;
      const turnNum = veNumericTurn(numeroKey ? r[numeroKey] : "");
      let vehRaw = String(vehiculoKey ? (r[vehiculoKey] || "") : "").trim();
      let vehColor = null;
      if (norm(sectionLabel).includes("NUTIBARA") && turnNum && turnNum >= 1 && turnNum <= 10) {
        const groupKey = `${veRowBase(r, baseKey) || ""}|${veRowDateISO(r, fechaKey) || visorDate}`;
        const assigned = fichoAssignments.get(groupKey)?.get(turnNum);
        if (assigned?.veh) { vehRaw = String(assigned.veh); vehColor = assigned.color || null; }
      }
      const vehNote = veGetVehiculoNote(r);
      const vehVal = vehNote ? `${vehRaw}\nCOMENTARIO: ${vehNote}` : vehRaw;
      const esCcsandiego = !entry.isFichoMarker && norm(sectionLabel).includes("SAN DIEGO") && turnNum && VE_CCSANDIEGO_TURNOS.has(turnNum);
      leftRows.push({
        type: "data",
        isFicho: entry.isFichoMarker,
        fichoBlue: entry.isFichoMarker && norm(sectionLabel).includes("EXPOSICIONES"),
        ccsandiego: esCcsandiego,
        vehColor,
        cells: [
          numeroKey ? (r[numeroKey] || (entry.idx + 1)) : (entry.idx + 1),
          inicio1Key ? veExcelTimeToHHMM(r[inicio1Key]) : "",
          vehVal,
          fmtConductor(r, conductor1Key),
          inicio2Key ? veExcelTimeToHHMM(r[inicio2Key]) : "",
          fmtConductor(r, conductor2Key),
          horaFinKey ? veExcelTimeToHHMM(r[horaFinKey]) : "",
        ],
      });
    });
  });

  const cellBase = "padding:6px;border:1px solid #d1d5db;font-size:12px;vertical-align:middle;color:#111";
  let html = `<table style="width:100%;border-collapse:collapse;table-layout:fixed;background:#fff">`;
  html += `<colgroup>
    <col style="width:7%"><col style="width:10%"><col style="width:9%"><col style="width:28%">
    <col style="width:10%"><col style="width:28%"><col style="width:8%">
  </colgroup>`;
  leftRows.forEach(left => {
    html += `<tr>`;
    if (left?.type === "sectionTitle") {
      html += `<td colspan="7" style="${cellBase};font-weight:900;text-align:center;background:#f8fafc;font-size:18px">${escapeHtml(left.title)}</td>`;
    } else if (left?.type === "header") {
      const hStyle = `${cellBase};font-weight:800;text-align:center;background:#fff59d`;
      ["#", "INICIA", "VEH", "CONDUCTOR 1", "INICIA", "CONDUCTOR 2", "HORA FIN"].forEach(h => { html += `<td style="${hStyle}">${escapeHtml(h)}</td>`; });
    } else if (left?.type === "data") {
      const fichoBg = left.isFicho ? (left.fichoBlue ? "background:#2563eb;color:#fff;font-weight:700" : "background:#16a34a;color:#fff;font-weight:700") : "";
      const ccBg = left.ccsandiego ? "background:#dc2626;color:#fff;font-weight:700" : "";
      left.cells.forEach((val, idx) => {
        let extra = "text-align:center;white-space:pre-line";
        if (idx === 2 && left.vehColor && !left.isFicho) {
          extra += left.vehColor === "blue" ? ";background:#2563eb;color:#fff;font-weight:700" : ";background:#16a34a;color:#fff;font-weight:700";
        } else if (fichoBg) { extra += `;${fichoBg}`; }
        else if (ccBg) { extra += `;${ccBg}`; }
        html += `<td style="${cellBase};${extra}">${escapeHtml(val)}</td>`;
      });
    } else {
      for (let c = 0; c < 7; c++) html += `<td style="${cellBase}"></td>`;
    }
    html += `</tr>`;
  });
  html += `</table>`;
  cont.innerHTML = html;
}

// Descarga la Vista Excel tal cual (con colores) como archivo .xls.
function downloadVistaExcel(){
  const cont = document.getElementById("veContainer");
  const table = cont ? cont.querySelector("table") : null;
  if (!table) { if (typeof showToast === "function") showToast("No hay nada para exportar. Pulsa Actualizar primero.", "warn"); return; }
  const date = document.getElementById("veFecha")?.value || fechaBogotaISO();
  const html =
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">` +
    `<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>` +
    `<x:Name>Vista Excel</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>` +
    `</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>${table.outerHTML}</body></html>`;
  const blob = new Blob(["﻿", html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `programaciones-vista-excel-${date}.xls`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

async function refreshVistaExcel(){
  const status = document.getElementById("veStatus");
  const cont = document.getElementById("veContainer");
  const fEl = document.getElementById("veFecha");
  if (fEl && !fEl.value) fEl.value = fechaBogotaISO();
  const date = fEl?.value || fechaBogotaISO();
  if (status) status.textContent = `Consultando ${date}...`;
  try {
    await loadVistaExcel(date);
    renderVistaExcel();
    if (status) status.textContent = `Actualizado ${horaCO(new Date())} · ${vistaExcelRows.length} filas · ${date}`;
  } catch (err) {
    console.error("[vista-excel] error:", err);
    if (status) status.textContent = `Error: ${err?.message || "fallo"}`;
    if (cont) cont.innerHTML = `<div class="muted" style="padding:12px;text-align:center">No se pudo cargar la programación: ${escapeHtml(err?.message || "fallo")}</div>`;
  }
}

/* ==================== CUMPLIMIENTO ====================
   Cruza la programación del día (Vista Excel) con los despachos reales para detectar:
   - Carros programados que NO laboraron (0 despachos en el día).
   - Carros que no cumplieron su ficho/ccsandiego (tenían ficho o turno ccsandiego pero
     no hicieron ningún despacho por ccsandiego).
   - Carros que hicieron menos despachos que turnos asignados (incompletos). */

let cumplimientoRows = [];
const CUMP_CCSANDIEGO_ITINS = ["4504", "3395"]; // itinerarios que cuentan como despacho ccsandiego

async function loadCumplimientoDespachos(date){
  const desde = new Date(`${date}T00:00:00-05:00`);
  const hasta = new Date(desde); hasta.setDate(hasta.getDate() + 1);
  const { data, error } = await planillaSupabaseClient
    .from(PLANILLA_DESPACHOS_TABLE)
    .select("interno,itinerario_id,estado,created_at")
    .gte("created_at", desde.toISOString())
    .lt("created_at", hasta.toISOString())
    .limit(5000);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Minutos del día (0..1439) de un timestamp, en hora Colombia.
function minutosDelDiaCO(iso){
  try {
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date(iso));
    const g = (t) => p.find(x => x.type === t)?.value || "0";
    return (parseInt(g("hour"), 10) || 0) * 60 + (parseInt(g("minute"), 10) || 0);
  } catch (_) { return null; }
}
function minToHHMM(m){
  if (m == null) return "—";
  const h = Math.floor(m / 60) % 24, mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

// Cada carro tiene 2 turnos de conductor: Turno 1 (INICIA → cambio/INICIA 2) y
// Turno 2 (INICIA 2 → HORA FIN). Se revisa que CADA turno haya tenido despachos.
function computeCumplimiento(despachos, date){
  const rows = Array.isArray(vistaExcelRows) ? vistaExcelRows : [];
  const vehiculoKey = veHeaderKey(rows, ["VEH", "VEHICULO", "VEHÍCULO", "MOVIL", "MÓVIL"]);
  const { key1: ini1Key, key2: ini2Key } = veInferInicioKeys(veKeysFromRows(rows));
  const { key1: cond1Key, key2: cond2Key } = veInferConductorKeys(veKeysFromRows(rows));
  const horaFinKey = veHeaderKey(rows, ["HORA FIN", "HORA FINAL", "HORA_FIN"]);

  // Horario por interno (fila con INICIA más temprano): INICIA 1, INICIA 2 (cambio), HORA FIN + conductores.
  const prog = new Map();
  rows.forEach(r => {
    const interno = String((vehiculoKey ? r[vehiculoKey] : "") || "").trim();
    if (!interno) return;
    const i1raw = ini1Key ? String(r[ini1Key] || "").trim() : "";
    const i1 = hhmmToMin(i1raw);
    if (i1 == null) return; // filas sin INICIA (p.ej. ficho) no definen el horario
    if (!prog.has(interno)) prog.set(interno, { interno, ini1: null });
    const p = prog.get(interno);
    if (p.ini1 == null || i1 < p.ini1) {
      const i2raw = ini2Key ? String(r[ini2Key] || "").trim() : "";
      const fraw = horaFinKey ? String(r[horaFinKey] || "").trim() : "";
      p.ini1 = i1; p.ini1Str = veExcelTimeToHHMM(i1raw);
      p.ini2 = hhmmToMin(i2raw); p.ini2Str = i2raw ? veExcelTimeToHHMM(i2raw) : "";
      p.fin = hhmmToMin(fraw); p.finStr = fraw ? veExcelTimeToHHMM(fraw) : "";
      p.cond1 = extractConductorName(cond1Key ? r[cond1Key] : "") || "";
      p.cond2 = extractConductorName(cond2Key ? r[cond2Key] : "") || "";
    }
  });

  const despByInterno = new Map();
  (despachos || []).forEach(d => {
    if (String(d?.estado || "").toUpperCase() === "CANCELADO") return;
    const k = String(d?.interno || "").trim(); if (!k) return;
    if (!despByInterno.has(k)) despByInterno.set(k, { times: [], total: 0 });
    const e = despByInterno.get(k);
    e.total++;
    const m = minutosDelDiaCO(d?.created_at); if (m != null) e.times.push(m);
  });

  const isToday = date === fechaBogotaISO();
  const nowMin = ahoraMinBogota();
  const G = 30; // gracia antes del inicio del turno

  // Evalúa un turno [start, end] contra las horas de despacho.
  const evalShift = (times, start, end) => {
    if (start == null) return { estado: "—", sev: -1 };
    let e = end; if (e != null && e < start) e += 1440; // el turno cruza medianoche
    const has = times.some(m => {
      let mm = m; if (e != null && e > 1440 && m < start) mm = m + 1440; // despacho de madrugada
      return mm >= (start - G) && (e == null || mm <= e);
    });
    if (has) return { estado: isToday ? "LABORANDO" : "OK", sev: 0 };
    if (!isToday) return { estado: "NO LABORÓ", sev: 3 };
    if (nowMin < (start - G)) return { estado: "PENDIENTE", sev: 1 }; // el turno aún no empieza
    return { estado: "SIN DESPACHAR", sev: 3 };                       // ya empezó y sin despachos
  };

  const result = [];
  prog.forEach(p => {
    const e = despByInterno.get(p.interno) || { times: [], total: 0 };
    const dosTurnos = p.ini2 != null;
    const t1 = evalShift(e.times, p.ini1, dosTurnos ? p.ini2 : p.fin);
    const t2 = dosTurnos ? evalShift(e.times, p.ini2, p.fin) : { estado: "—", sev: -1 };
    const sev = Math.max(t1.sev, t2.sev);
    result.push({
      interno: p.interno,
      t1Horas: p.ini1Str ? `${p.ini1Str}–${dosTurnos ? p.ini2Str : (p.finStr || "?")}` : "—",
      t2Horas: dosTurnos ? `${p.ini2Str}–${p.finStr || "?"}` : "—",
      t1Cond: p.cond1 || "", t2Cond: dosTurnos ? (p.cond2 || "") : "",
      t1, t2, despachos: e.total, sev,
    });
  });
  result.sort((a, b) => (b.sev - a.sev) || String(a.interno).localeCompare(String(b.interno), "es", { numeric: true }));
  return result;
}

function renderCumplimiento(){
  const body = document.getElementById("cumpBody");
  const summary = document.getElementById("cumpSummary");
  if (!body) return;
  const soloProblemas = !!document.getElementById("cumpSoloProblemas")?.checked;
  const all = cumplimientoRows;
  if (!all.length) {
    body.innerHTML = `<tr><td colspan="5" class="muted" style="text-align:center;padding:14px">Sin programación cargada para esta fecha.</td></tr>`;
    if (summary) summary.textContent = "";
    return;
  }
  const problemas = all.filter(d => d.sev >= 3).length;
  const pend = all.filter(d => d.sev === 1).length;
  const ok = all.filter(d => d.sev === 0).length;
  if (summary) summary.innerHTML = `Carros: <b>${all.length}</b> &nbsp;·&nbsp; ✅ Ambos turnos: <b>${ok}</b> &nbsp;·&nbsp; 🔵 Pendiente: <b>${pend}</b> &nbsp;·&nbsp; 🔴 Con turno sin cubrir: <b>${problemas}</b>`;
  const data = soloProblemas ? all.filter(d => d.sev >= 3) : all;
  if (!data.length) {
    body.innerHTML = `<tr><td colspan="4" class="muted" style="text-align:center;padding:14px">Sin carros para mostrar. 🎉</td></tr>`;
    return;
  }
  const badge = (e) => e === "—" ? `<span class="muted">—</span>`
    : (e === "SIN DESPACHAR" || e === "NO LABORÓ") ? `<span class="cump-badge cump-nolabor">${e}</span>`
    : e === "PENDIENTE" ? `<span class="cump-badge cump-pend">PENDIENTE</span>`
    : `<span class="cump-badge cump-ok">${e}</span>`;
  const turnoCell = (horas, cond, t) => `<div style="font-weight:600">${escapeHtml(horas)}</div>`
    + (cond ? `<div class="muted" style="font-size:12px">${escapeHtml(cond)}</div>` : "")
    + badge(t.estado);
  body.innerHTML = data.map(d => `<tr>
    <td class="ent-interno">${escapeHtml(d.interno)}</td>
    <td>${turnoCell(d.t1Horas, d.t1Cond, d.t1)}</td>
    <td>${turnoCell(d.t2Horas, d.t2Cond, d.t2)}</td>
    <td style="text-align:center">${d.despachos}</td>
  </tr>`).join("");
}

async function refreshCumplimiento(){
  const status = document.getElementById("cumpStatus");
  const fEl = document.getElementById("cumpFecha");
  if (fEl && !fEl.value) fEl.value = fechaBogotaISO();
  const date = fEl?.value || fechaBogotaISO();
  if (status) status.textContent = `Consultando ${date}...`;
  try {
    await loadVistaExcel(date);
    const desp = await loadCumplimientoDespachos(date);
    cumplimientoRows = computeCumplimiento(desp, date);
    renderCumplimiento();
    if (status) status.textContent = `Actualizado ${horaCO(new Date())} · ${date}`;
  } catch (err) {
    console.error("[cumplimiento] error:", err);
    if (status) status.textContent = `Error: ${err?.message || "fallo"}`;
  }
}

/* ==================== VUELOS MDE ====================
   Lee la tabla vuelos_mde (la alimenta la Edge Function vuelos-mde por cron) y
   muestra llegadas/salidas del aeropuerto en hora Colombia. */

let vuelosRows = [];
let vuelosTipo = "llegada";  // 'llegada' | 'salida'
let vuelosDia = "hoy";       // 'hoy' | 'manana'
let vuelosPollingTimer = null;

/* ============ Alertas GPS · Desconexiones (historial guardado 24/7) ============ */
// El registro lo hace Supabase solo (pg_cron cada 2 min -> detectar_gps_desconexiones()).
// Aquí solo se LEE y se muestra el historial: cuándo se calló, cuándo volvió y cuánto duró.
const GPS_DESC_TABLE = "gps_desconexiones";
let gpsDescRows = [];
let gpsDescSoloActivas = false;   // false = Todas · true = solo las que siguen sin reportar
let gpsDescPollTimer = null;

// YYYY-MM-DD del valor en zona Colombia (para el filtro por día).
function fechaDiaCO(value){
  // Normaliza timestamps tipo "2026-07-07 10:00:00+00" (con espacio) a ISO con "T",
  // que algunos motores no parsean, para que la fila no se caiga del filtro por día.
  const norm = (typeof value === "string") ? value.trim().replace(" ", "T") : value;
  const d = norm instanceof Date ? norm : new Date(norm);
  if (Number.isNaN(d.getTime())) return "";
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d);
  const g = t => p.find(x => x.type === t)?.value || "";
  return `${g("year")}-${g("month")}-${g("day")}`;
}

// Duración en minutos de una desconexión (en vivo si sigue caída, cerrada si ya volvió).
function gpsDescDuracionMin(r){
  if (r.activa) return Math.max(0, Math.round((Date.now() - new Date(r.ultimo_reporte).getTime()) / 60000));
  return (r.duracion_min ?? null);
}

async function loadGpsDesconexiones(){
  const status = document.getElementById("gpsDescStatus");
  if (status) status.textContent = "Consultando…";
  try {
    const { data, error } = await planillaSupabaseClient
      .from(GPS_DESC_TABLE)
      .select("id,mid,interno,placa,ultimo_reporte,detectada_en,fin,duracion_min,activa,created_at,reportado,reportado_por,reportado_en,reporte_nota,resuelto,resuelto_por,resuelto_en")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    gpsDescRows = Array.isArray(data) ? data : [];
    renderGpsDesconexiones();
    refreshGpsDescPendientes();
    const nActivas = gpsDescRows.filter(r => r.activa).length;
    if (status) status.textContent = `Actualizado ${horaCO(new Date())} · ${nActivas} sin reportar ahora`;
  } catch (err) {
    console.error("[gps-desc] error:", err);
    if (status) status.textContent = `Error: ${err?.message || "fallo"}`;
  }
}

function getGpsDescFiltradas(){
  const term = String(document.getElementById("gpsDescSearch")?.value || "").trim().toLowerCase();
  const fecha = String(document.getElementById("gpsDescFecha")?.value || "").trim();
  return gpsDescRows
    .filter(r => !gpsDescSoloActivas || r.activa)
    .filter(r => !fecha || fechaDiaCO(r.ultimo_reporte) === fecha)
    .filter(r => !term || [r.interno, r.placa, r.mid].join(" ").toLowerCase().includes(term));
}

// Clave para contar reincidencia: interno si existe, si no el ID Sonar.
function gpsDescVehKey(r){
  return (r.interno && String(r.interno).trim()) || String(r.mid || "").trim();
}

function renderGpsDesconexiones(){
  const body = document.getElementById("gpsDescBody");
  const count = document.getElementById("gpsDescCount");
  if (!body) return;
  const filas = getGpsDescFiltradas();
  if (count) count.textContent = String(filas.length);
  if (!filas.length) {
    body.innerHTML = `<tr><td colspan="9" class="muted" style="text-align:center;padding:14px">${gpsDescSoloActivas ? "Ningún vehículo sin reportar ahora mismo. 👍" : "Sin desconexiones registradas."}</td></tr>`;
    return;
  }
  // Reincidencia: cuántas veces aparece cada vehículo en TODO lo cargado (no solo lo filtrado).
  const fallosPorVeh = new Map();
  for (const r of gpsDescRows) {
    const k = gpsDescVehKey(r);
    if (k) fallosPorVeh.set(k, (fallosPorVeh.get(k) || 0) + 1);
  }
  body.innerHTML = filas.map(r => {
    const interno = r.interno ? escapeHtml(String(r.interno)) : "—";
    const placa = r.placa ? escapeHtml(String(r.placa)) : escapeHtml(String(r.mid || "—"));
    const dur = fmtDuracionMin(gpsDescDuracionMin(r));
    const volvio = r.activa
      ? `<span style="color:#b91c1c;font-weight:700">— sigue caído —</span>`
      : (r.fin ? escapeHtml(fechaHoraCO(r.fin)) : "—");
    const gps = r.activa
      ? `<span style="display:inline-block;background:#b91c1c;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:5px">CAÍDO</span>`
      : `<span style="display:inline-block;background:#047857;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:5px">RECUPERADO</span>`;

    // Reincidencia (clic en el badge = ver el historial de ese vehículo con fecha y hora)
    const fallos = fallosPorVeh.get(gpsDescVehKey(r)) || 1;
    const dataVeh = `data-interno="${escapeHtml(String(r.interno || ""))}" data-mid="${escapeHtml(String(r.mid || ""))}"`;
    const fallosBadge = fallos >= 2
      ? `<button data-gpsdesc-action="historial" ${dataVeh} title="Ver los ${fallos} incidentes con fecha y hora" style="cursor:pointer;border:none;display:inline-block;background:${fallos >= 3 ? "#b91c1c" : "#c2410c"};color:#fff;font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px">×${fallos} ⤢</button>`
      : `<button data-gpsdesc-action="historial" ${dataVeh} title="Ver historial de este vehículo" class="muted" style="cursor:pointer;border:none;background:transparent;font-size:12px;padding:2px 6px">×1</button>`;

    // Observación (texto libre que escribe el usuario) + quién/cuándo la anotó.
    const tieneObs = r.reporte_nota && String(r.reporte_nota).trim();
    const obsMeta = r.reportado_por ? `Anotó ${r.reportado_por}${r.reportado_en ? " · " + fechaHoraCO(r.reportado_en) : ""}` : "";
    const obsTexto = tieneObs
      ? `<span title="${escapeHtml(obsMeta)}">${escapeHtml(String(r.reporte_nota))}</span>`
      : `<span class="muted">— sin observación —</span>`;
    const obs = `${obsTexto}
      <button class="btn btn-ghost" data-gpsdesc-action="observar" data-id="${escapeHtml(String(r.id))}" title="Agregar / editar observación" style="padding:1px 7px;font-size:11px;margin-left:4px">✏️</button>`;

    // Estado del seguimiento: Pendiente / Resuelto
    let estado;
    if (r.resuelto) {
      const t = `Resolvió ${r.resuelto_por || "-"}${r.resuelto_en ? " · " + fechaHoraCO(r.resuelto_en) : ""}`;
      estado = `<span title="${escapeHtml(t)}" style="display:inline-block;background:#047857;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:5px">RESUELTO ✓</span>
        <button class="btn btn-ghost" data-gpsdesc-action="reabrir" data-id="${escapeHtml(String(r.id))}" title="Reabrir (volver a pendiente)" style="padding:2px 7px;font-size:11px;margin-left:4px">Reabrir</button>`;
    } else {
      estado = `<span style="display:inline-block;background:#c2410c;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:5px">PENDIENTE</span>
        <button class="btn btn-primary" data-gpsdesc-action="resolver" data-id="${escapeHtml(String(r.id))}" style="padding:2px 8px;font-size:11px;margin-left:4px">Marcar resuelto</button>`;
    }

    return `<tr${r.activa ? ' style="background:rgba(185,28,28,.08)"' : ''}>
      <td style="font-weight:700">${interno}</td>
      <td>${placa}</td>
      <td style="text-align:center">${fallosBadge}</td>
      <td>${escapeHtml(fechaHoraCO(r.ultimo_reporte))}</td>
      <td>${volvio}</td>
      <td style="font-weight:700">${escapeHtml(dur)}</td>
      <td>${gps}</td>
      <td style="min-width:180px">${obs}</td>
      <td style="white-space:nowrap">${estado}</td>
    </tr>`;
  }).join("");
}

// Agrega o edita la observación de una desconexión (deja traza: quién y cuándo).
async function observarGpsDesc(id){
  if (!id) return;
  const actual = (gpsDescRows.find(x => String(x.id) === String(id))?.reporte_nota) || "";
  const nota = window.prompt("Observación sobre esta desconexión:\nEj: GPS sin señal en el túnel, revisar equipo.", actual);
  if (nota === null) return; // canceló
  try {
    const { error } = await planillaSupabaseClient
      .from(GPS_DESC_TABLE)
      .update({
        reporte_nota: nota.trim() ? nota.trim() : null,
        reportado: nota.trim() ? true : false,
        reportado_por: currentUserEmail || currentUserId || "desconocido",
        reportado_en: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    showToast(nota.trim() ? "✅ Observación guardada." : "Observación borrada.", "ok");
    await loadGpsDesconexiones();
  } catch (err) {
    console.error("[gps-desc] observar falló:", err);
    showToast(`No se pudo guardar: ${err?.message || "error"}`, "err");
  }
}

// Cambia el estado del seguimiento: Pendiente <-> Resuelto.
async function setEstadoGpsDesc(id, resuelto){
  if (!id) return;
  if (resuelto && !window.confirm("¿Marcar como RESUELTO?")) return;
  try {
    const patch = resuelto
      ? { resuelto: true, resuelto_por: currentUserEmail || currentUserId || "desconocido", resuelto_en: new Date().toISOString() }
      : { resuelto: false, resuelto_por: null, resuelto_en: null };
    const { error } = await planillaSupabaseClient.from(GPS_DESC_TABLE).update(patch).eq("id", id);
    if (error) throw error;
    showToast(resuelto ? "✅ Marcado como resuelto." : "Reabierto (pendiente).", "ok");
    await loadGpsDesconexiones();
  } catch (err) {
    console.error("[gps-desc] estado falló:", err);
    showToast(`No se pudo cambiar el estado: ${err?.message || "error"}`, "err");
  }
}

// ===== Historial de un vehículo (todos sus incidentes, con fecha y hora) =====
let gpsHistRows = [];   // último historial consultado (para descargar)
let gpsHistLabel = "";  // etiqueta del vehículo (interno o ID)

async function verHistorialGpsVehiculo(interno, mid){
  const modal = document.getElementById("gpsHistModal");
  const body = document.getElementById("gpsHistBody");
  const title = document.getElementById("gpsHistTitle");
  const sub = document.getElementById("gpsHistSub");
  if (!modal || !body) return;
  const inter = String(interno || "").trim();
  const m = String(mid || "").trim();
  gpsHistLabel = inter ? `Interno ${inter}` : (m ? `ID ${m}` : "Vehículo");
  if (title) title.textContent = `Historial de desconexiones · ${gpsHistLabel}`;
  if (sub) sub.textContent = "Consultando toda la base…";
  body.innerHTML = `<tr><td colspan="7" class="muted" style="text-align:center;padding:12px">Cargando…</td></tr>`;
  modal.classList.remove("hidden");
  try {
    // Se consulta TODA la base para este vehículo (no solo lo cargado en la tabla).
    let q = planillaSupabaseClient
      .from(GPS_DESC_TABLE)
      .select("mid,interno,placa,ultimo_reporte,fin,duracion_min,activa,reporte_nota,resuelto,resuelto_por,resuelto_en")
      .order("ultimo_reporte", { ascending: false })
      .limit(1000);
    q = inter ? q.eq("interno", inter) : q.eq("mid", m);
    const { data, error } = await q;
    if (error) throw error;
    gpsHistRows = Array.isArray(data) ? data : [];
    renderHistorialGpsVehiculo();
  } catch (err) {
    console.error("[gps-desc] historial falló:", err);
    if (sub) sub.textContent = "Error consultando el historial.";
    body.innerHTML = `<tr><td colspan="7" class="muted" style="text-align:center;padding:12px">No se pudo cargar: ${escapeHtml(err?.message || "error")}</td></tr>`;
  }
}

function renderHistorialGpsVehiculo(){
  const body = document.getElementById("gpsHistBody");
  const sub = document.getElementById("gpsHistSub");
  if (!body) return;
  const filas = gpsHistRows;
  const totalMin = filas.reduce((a, r) => a + (gpsDescDuracionMin(r) || 0), 0);
  if (sub) sub.textContent = `${filas.length} incidente(s) · tiempo total sin GPS: ${fmtDuracionMin(totalMin)}. Sirve como evidencia con fecha y hora.`;
  if (!filas.length) {
    body.innerHTML = `<tr><td colspan="7" class="muted" style="text-align:center;padding:12px">Sin incidentes.</td></tr>`;
    return;
  }
  body.innerHTML = filas.map((r, i) => {
    const volvio = r.activa ? `<span style="color:#b91c1c;font-weight:700">— sigue caído —</span>` : (r.fin ? escapeHtml(fechaHoraCO(r.fin)) : "—");
    const gps = r.activa
      ? `<span style="display:inline-block;background:#b91c1c;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:5px">CAÍDO</span>`
      : `<span style="display:inline-block;background:#047857;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:5px">RECUPERADO</span>`;
    const estado = r.resuelto
      ? `<span style="display:inline-block;background:#047857;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:5px">RESUELTO ✓</span>`
      : `<span style="display:inline-block;background:#c2410c;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:5px">PENDIENTE</span>`;
    const obs = r.reporte_nota && String(r.reporte_nota).trim() ? escapeHtml(String(r.reporte_nota)) : `<span class="muted">—</span>`;
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(fechaHoraCO(r.ultimo_reporte))}</td>
      <td>${volvio}</td>
      <td style="font-weight:700">${escapeHtml(fmtDuracionMin(gpsDescDuracionMin(r)))}</td>
      <td>${gps}</td>
      <td>${obs}</td>
      <td>${estado}</td>
    </tr>`;
  }).join("");
}

function downloadHistorialGpsVehiculo(){
  const filas = gpsHistRows;
  if (!filas.length) { showToast("No hay incidentes para descargar.", "warn"); return; }
  const data = filas.map((r, i) => ({
    "#": i + 1,
    "SE CALLO": fechaHoraCO(r.ultimo_reporte),
    "VOLVIO": r.activa ? "sigue caido" : (r.fin ? fechaHoraCO(r.fin) : ""),
    DURACION_MIN: gpsDescDuracionMin(r) ?? "",
    DURACION: fmtDuracionMin(gpsDescDuracionMin(r)),
    GPS: r.activa ? "CAIDO" : "RECUPERADO",
    OBSERVACION: r.reporte_nota || "",
    ESTADO: r.resuelto ? "RESUELTO" : "PENDIENTE",
    "RESUELTO_POR": r.resuelto_por || "",
    "RESUELTO_EN": r.resuelto_en ? fechaHoraCO(r.resuelto_en) : "",
  }));
  const base = `historial_gps_${gpsHistLabel.replace(/\s+/g, "_")}_${fechaBogotaISO()}`;
  try {
    if (window.XLSX) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Historial");
      XLSX.writeFile(wb, `${base}.xlsx`);
    } else {
      const headers = Object.keys(data[0]);
      const csv = [headers.join(",")]
        .concat(data.map(row => headers.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")))
        .join("\n");
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${base}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(a.href);
    }
    showToast(`Descargando historial de ${gpsHistLabel}…`, "ok");
  } catch (err) {
    console.error("[gps-desc] descarga historial falló:", err);
    showToast(`No se pudo descargar: ${err?.message || "error"}`, "err");
  }
}

function setGpsDescFiltro(soloActivas){
  gpsDescSoloActivas = !!soloActivas;
  const bAct = document.getElementById("gpsDescFiltroActivas");
  const bTodas = document.getElementById("gpsDescFiltroTodas");
  if (bAct) bAct.className = `btn ${soloActivas ? "btn-primary" : "btn-ghost"}`;
  if (bTodas) bTodas.className = `btn ${soloActivas ? "btn-ghost" : "btn-primary"}`;
  renderGpsDesconexiones();
}

function downloadGpsDesconexiones(){
  const filas = getGpsDescFiltradas();
  if (!filas.length) { showToast("No hay desconexiones para descargar.", "warn"); return; }
  const fallosPorVeh = new Map();
  for (const r of gpsDescRows) { const k = gpsDescVehKey(r); if (k) fallosPorVeh.set(k, (fallosPorVeh.get(k) || 0) + 1); }
  const data = filas.map(r => {
    const durMin = gpsDescDuracionMin(r);
    return {
      INTERNO: r.interno || "",
      PLACA: r.placa || r.mid || "",
      FALLOS: fallosPorVeh.get(gpsDescVehKey(r)) || 1,
      "SE CALLO": fechaHoraCO(r.ultimo_reporte),
      "VOLVIO": r.activa ? "sigue caido" : (r.fin ? fechaHoraCO(r.fin) : ""),
      DURACION_MIN: durMin ?? "",
      DURACION: fmtDuracionMin(durMin),
      GPS: r.activa ? "CAIDO" : "RECUPERADO",
      OBSERVACION: r.reporte_nota || "",
      ESTADO: r.resuelto ? "RESUELTO" : "PENDIENTE",
      "ANOTO_POR": r.reportado_por || "",
      "ANOTO_EN": r.reportado_en ? fechaHoraCO(r.reportado_en) : "",
      "RESUELTO_POR": r.resuelto_por || "",
      "RESUELTO_EN": r.resuelto_en ? fechaHoraCO(r.resuelto_en) : "",
    };
  });
  const base = `alertas_gps_${fechaBogotaISO()}`;
  try {
    if (window.XLSX) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Desconexiones");
      XLSX.writeFile(wb, `${base}.xlsx`);
    } else {
      const headers = Object.keys(data[0]);
      const csv = [headers.join(",")]
        .concat(data.map(row => headers.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")))
        .join("\n");
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${base}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(a.href);
    }
    showToast(`Descargando ${filas.length} desconexiones…`, "ok");
  } catch (err) {
    console.error("[gps-desc] descarga falló:", err);
    showToast(`No se pudo descargar: ${err?.message || "error"}`, "err");
  }
}

function ensureGpsDescPolling(){
  if (gpsDescPollTimer) return;
  gpsDescPollTimer = setInterval(() => {
    if (getActiveTabId() === "alertas-gps") loadGpsDesconexiones();
  }, 120000); // cada 2 min, igual que el cron de Supabase
}

// ===== Recordatorio en pantalla de desconexiones PENDIENTES por atender =====
// Cuenta las que NO están resueltas para que el operador tenga que observarlas y
// marcarlas. Actualiza el badge de la pestaña (siempre visible) y el banner interno.
let gpsDescPendientesTimer = null;

function setGpsDescTabBadge(n){
  const badge = document.getElementById("gpsDescTabBadge");
  if (badge) {
    if (n > 0) { badge.textContent = String(n); badge.style.display = "inline-block"; }
    else { badge.style.display = "none"; }
  }
  const rec = document.getElementById("gpsDescRecordatorio");
  if (rec) {
    if (n > 0) {
      rec.style.display = "block";
      rec.innerHTML = `⚠️ Tienes <b>${n}</b> desconexión(es) <b>pendiente(s)</b> por atender. Agrega la <b>observación</b> y márcalas como <b>Resuelto</b> cuando corresponda.`;
    } else {
      rec.style.display = "none";
    }
  }
}

async function refreshGpsDescPendientes(){
  if (!currentUserId) return;
  try {
    const { count, error } = await planillaSupabaseClient
      .from(GPS_DESC_TABLE)
      .select("id", { count: "exact", head: true })
      .eq("resuelto", false);
    if (error) throw error;
    setGpsDescTabBadge(count || 0);
  } catch (err) {
    // Silencioso: el recordatorio no debe romper nada si falla la red.
    console.debug("[gps-desc] conteo pendientes falló:", err?.message || err);
  }
}

function ensureGpsDescPendientesPolling(){
  if (gpsDescPendientesTimer) return;
  refreshGpsDescPendientes();
  gpsDescPendientesTimer = setInterval(refreshGpsDescPendientes, 90000); // cada 1m30s
}

/* ============ Auditoría de ingresos manuales al enturnamiento ============ */
const AUD_MANUAL_TABLE = "enturnamientos_manual_log";
let audManRows = [];

async function loadAuditoriaManual(){
  const status = document.getElementById("audManStatus");
  if (status) status.textContent = "Consultando…";
  try {
    const { data, error } = await planillaSupabaseClient
      .from(AUD_MANUAL_TABLE)
      .select("interno,placa,itinerario,itinerario_id,conductor,hora_paso,posicion,motivo,justificacion,usuario,creado_en")
      .order("creado_en", { ascending: false })
      .limit(1000);
    if (error) throw error;
    audManRows = Array.isArray(data) ? data : [];
    renderAuditoriaManual();
    if (status) status.textContent = `Actualizado ${horaCO(new Date())} · ${audManRows.length} registros`;
  } catch (err) {
    console.error("[auditoria-manual] error:", err);
    if (status) status.textContent = `Error: ${err?.message || "fallo"}`;
  }
}

function getAuditoriaManualFiltradas(){
  const term = String(document.getElementById("audManSearch")?.value || "").trim().toLowerCase();
  const fecha = String(document.getElementById("audManFecha")?.value || "").trim();
  return audManRows
    .filter(r => !fecha || fechaDiaCO(r.creado_en) === fecha)
    .filter(r => !term || [r.interno, r.placa, r.usuario, r.justificacion, r.itinerario, r.motivo].join(" ").toLowerCase().includes(term));
}

function renderAuditoriaManual(){
  const body = document.getElementById("audManBody");
  const count = document.getElementById("audManCount");
  if (!body) return;
  const filas = getAuditoriaManualFiltradas();
  if (count) count.textContent = String(filas.length);
  if (!filas.length) {
    body.innerHTML = `<tr><td colspan="9" class="muted" style="text-align:center;padding:14px">Sin ingresos manuales registrados.</td></tr>`;
    return;
  }
  body.innerHTML = filas.map(r => `<tr>
    <td style="white-space:nowrap">${escapeHtml(fechaHoraCO(r.creado_en))}</td>
    <td>${escapeHtml(String(r.usuario || "—"))}</td>
    <td style="font-weight:700">${escapeHtml(String(r.interno || "—"))}</td>
    <td>${escapeHtml(String(r.placa || "—"))}</td>
    <td>${escapeHtml(String(r.itinerario || r.itinerario_id || "—"))}</td>
    <td style="white-space:nowrap">${escapeHtml(fechaHoraCO(r.hora_paso))}</td>
    <td style="text-align:center">${r.posicion != null ? escapeHtml(String(r.posicion)) : "—"}</td>
    <td>${escapeHtml(String(r.motivo || "—"))}</td>
    <td>${escapeHtml(String(r.justificacion || "—"))}</td>
  </tr>`).join("");
}

function downloadAuditoriaManual(){
  const filas = getAuditoriaManualFiltradas();
  if (!filas.length) { showToast("No hay registros para descargar.", "warn"); return; }
  const data = filas.map(r => ({
    REGISTRADO_REAL: fechaHoraCO(r.creado_en),
    USUARIO: r.usuario || "",
    INTERNO: r.interno || "",
    PLACA: r.placa || "",
    ITINERARIO: r.itinerario || r.itinerario_id || "",
    HORA_DE_PASO: fechaHoraCO(r.hora_paso),
    POSICION: r.posicion != null ? r.posicion : "",
    MOTIVO: r.motivo || "",
    JUSTIFICACION: r.justificacion || "",
  }));
  const base = `auditoria_ingresos_manuales_${fechaBogotaISO()}`;
  try {
    if (window.XLSX) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Auditoria");
      XLSX.writeFile(wb, `${base}.xlsx`);
    } else {
      const headers = Object.keys(data[0]);
      const csv = [headers.join(",")].concat(data.map(row => headers.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))).join("\n");
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${base}.csv`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
    }
    showToast(`Descargando ${filas.length} registros…`, "ok");
  } catch (err) {
    console.error("[auditoria-manual] descarga falló:", err);
    showToast(`No se pudo descargar: ${err?.message || "error"}`, "err");
  }
}

async function loadVuelos(){
  const status = document.getElementById("vuelosStatus");
  if (status) status.textContent = "Consultando…";
  try {
    const { data, error } = await planillaSupabaseClient
      .from("vuelos_mde")
      .select("tipo,fecha,hora,operation_time,vuelo,aerolinea,ciudad,asientos,puerta,estado,estado_code")
      .order("operation_time", { ascending: true })
      .limit(3000);
    if (error) throw error;
    vuelosRows = Array.isArray(data) ? data : [];
    renderVuelos();
    if (status) status.textContent = `Actualizado ${horaCO(new Date())} · ${vuelosRows.length} vuelos`;
  } catch (err) {
    console.error("[vuelos] error:", err);
    if (status) status.textContent = `Error: ${err?.message || "fallo"}`;
  }
}

function vuelosFechaSel(){
  const hoy = fechaBogotaISO();
  if (vuelosDia === "manana") {
    const d = new Date(`${hoy}T12:00:00-05:00`);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }
  return hoy;
}

function vueloEstadoBadge(code, txt){
  const c = String(code || "").toUpperCase();
  const bg = (c === "LD" || c === "OT" || c === "DP" || c === "AB") ? "#047857"
    : (c === "DL" || c === "DW") ? "#c2410c"
    : (c === "CN" || c === "NO") ? "#b91c1c"
    : (c === "PA" || c === "ER" || c === "ES" || c === "BD" || c === "CL") ? "#2563eb" : "#6b7280";
  return `<span style="display:inline-block;background:${bg};color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:5px">${escapeHtml(txt || code || "")}</span>`;
}

// Filas de vuelos que se están mostrando (mismo filtro que la tabla: tipo, día, búsqueda, dedup).
function getVuelosFiltrados(){
  const term = String(document.getElementById("vuelosSearch")?.value || "").trim().toLowerCase();
  const fecha = vuelosFechaSel();
  const vistos = new Set();
  return vuelosRows
    .filter(v => v.tipo === vuelosTipo && String(v.fecha || "") === fecha)
    // Airplan a veces repite el mismo vuelo con distinto correlation_id → dedup visual.
    .filter(v => { const k = `${v.vuelo}|${v.hora}|${v.ciudad}`; if (vistos.has(k)) return false; vistos.add(k); return true; })
    .filter(v => !term || [v.vuelo, v.aerolinea, v.ciudad, v.estado].join(" ").toLowerCase().includes(term));
}

// Descarga la lista de vuelos que se está viendo (Excel; si no hay XLSX, CSV).
function downloadVuelos(){
  const filas = getVuelosFiltrados();
  if (!filas.length) { showToast("No hay vuelos para descargar.", "warn"); return; }
  const esLleg = vuelosTipo === "llegada";
  const colCiudad = esLleg ? "ORIGEN" : "DESTINO";
  const colPuerta = esLleg ? "PUERTA" : "PUERTA";
  const data = filas.map(v => ({
    HORA: v.hora || "",
    VUELO: v.vuelo || "",
    "AEROLINEA": v.aerolinea || "",
    [colCiudad]: v.ciudad || "",
    [colPuerta]: v.puerta || "",
    ASIENTOS: v.asientos || "",
    ESTADO: v.estado || v.estado_code || "",
  }));
  const fecha = vuelosFechaSel();
  const base = `vuelos_${esLleg ? "llegadas" : "salidas"}_${fecha}`;
  try {
    if (window.XLSX) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, esLleg ? "Llegadas" : "Salidas");
      XLSX.writeFile(wb, `${base}.xlsx`);
    } else {
      const headers = Object.keys(data[0]);
      const csv = [headers.join(",")]
        .concat(data.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")))
        .join("\n");
      const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${base}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(a.href);
    }
    showToast(`Descargando ${filas.length} ${esLleg ? "llegadas" : "salidas"}…`, "ok");
  } catch (err) {
    console.error("[vuelos] descarga falló:", err);
    showToast(`No se pudo descargar: ${err?.message || "error"}`, "err");
  }
}

function renderVuelos(){
  const body = document.getElementById("vuelosBody");
  const count = document.getElementById("vuelosCount");
  const ciudadTh = document.getElementById("vuelosCiudadTh");
  if (!body) return;
  if (ciudadTh) ciudadTh.textContent = vuelosTipo === "llegada" ? "ORIGEN" : "DESTINO";
  const puertaTh = document.getElementById("vuelosPuertaTh");
  if (puertaTh) puertaTh.textContent = vuelosTipo === "llegada" ? "PUERTA (desemb.)" : "PUERTA (emb.)";
  const filas = getVuelosFiltrados();
  if (count) count.textContent = String(filas.length);
  if (!filas.length) {
    body.innerHTML = `<tr><td colspan="7" class="muted" style="text-align:center;padding:14px">Sin vuelos para ${vuelosTipo === "llegada" ? "llegadas" : "salidas"} de ${vuelosDia === "manana" ? "mañana" : "hoy"}.</td></tr>`;
    return;
  }
  body.innerHTML = filas.map(v => `<tr>
    <td style="font-weight:700">${escapeHtml(v.hora || "")}</td>
    <td>${escapeHtml(v.vuelo || "")}</td>
    <td>${escapeHtml(v.aerolinea || "")}</td>
    <td>${escapeHtml(v.ciudad || "")}</td>
    <td style="text-align:center">${v.puerta ? `<span style="font-weight:700;color:#1d4ed8">${escapeHtml(String(v.puerta))}</span>` : "—"}</td>
    <td style="text-align:center">${v.asientos ? escapeHtml(String(v.asientos)) : "—"}</td>
    <td>${vueloEstadoBadge(v.estado_code, v.estado)}</td>
  </tr>`).join("");
}

function setVuelosTipo(t){
  vuelosTipo = t;
  const lleg = document.getElementById("vuelosTabLleg");
  const sal = document.getElementById("vuelosTabSal");
  if (lleg && sal) {
    lleg.className = `btn ${t === "llegada" ? "btn-primary" : "btn-ghost"}`;
    sal.className = `btn ${t === "salida" ? "btn-primary" : "btn-ghost"}`;
  }
  renderVuelos();
}
function setVuelosDia(d){
  vuelosDia = d;
  const hoy = document.getElementById("vuelosDiaHoy");
  const man = document.getElementById("vuelosDiaManana");
  if (hoy && man) {
    hoy.className = `btn ${d === "hoy" ? "btn-primary" : "btn-ghost"}`;
    man.className = `btn ${d === "manana" ? "btn-primary" : "btn-ghost"}`;
  }
  renderVuelos();
}

function ensureVuelosPolling(){
  if (vuelosPollingTimer) return;
  vuelosPollingTimer = setInterval(() => {
    if (document.hidden || !currentUserId) return;
    if (getActiveTabId() !== "vuelos") return;
    loadVuelos();
  }, 60000);
}

// ==================== ASISTENCIAS ====================
let asistenciasRows = [];
let asisFiltro = "sinsalida"; // 'todos' | 'entrada' | 'salida' | 'sinsalida' (arranca en pendientes de salida)
let asisTickTimer = null;

// Refresca el contador "trabajando" cada minuto (solo re-render, sin red).
function ensureAsisTick(){
  if (asisTickTimer) return;
  asisTickTimer = setInterval(() => {
    if (document.hidden) return;
    if (getActiveTabId() !== "asistencias") return;
    renderAsistencias();
  }, 60000);
}

async function loadAsistencias(){
  const status = document.getElementById("asisStatus");
  const body = document.getElementById("asisBody");
  const fEl = document.getElementById("asisFecha");
  if (fEl && !fEl.value) fEl.value = fechaBogotaISO();
  const fecha = fEl?.value || fechaBogotaISO();
  if (status) status.textContent = `Consultando ${fecha}…`;

  // 1) Verificar que haya sesión (la tabla solo la lee el rol authenticated).
  try {
    const { data: sess } = await planillaSupabaseClient.auth.getSession();
    if (!sess || !sess.session) {
      if (status) status.textContent = "Sin sesión: inicia sesión para ver asistencias.";
      if (body) body.innerHTML = `<tr><td colspan="7" class="muted" style="text-align:center;padding:14px">No hay sesión activa. Inicia sesión en la app y vuelve a esta pestaña.</td></tr>`;
      return;
    }
  } catch (_) { /* si el sdk no expone getSession, seguimos igual */ }

  // Cargar posiciones Sonar en 2º plano para poder mostrar la ubicación del carro
  // en la alerta de jornada máxima (re-render al terminar).
  if (currentUserId && (!sonarLocationsLastLoadedAt || (Date.now() - sonarLocationsLastLoadedAt) > 60000)) {
    loadSonarFleetLocations().then(() => { if (getActiveTabId() === "asistencias") renderAsistencias(); }).catch(() => {});
  }

  // 2) Consulta CON join embebido (trae nombre/cédula/obra en un solo viaje).
  try {
    const { data, error } = await planillaSupabaseClient
      .from("asistencias")
      .select("id,fecha,hora,sentido,origen,base_operativa,punto_operativo,vehiculo_reporte,enviado_buk,sonar_asignado,observacion,colaboradores(nombre,dni),obras(nombre)")
      .eq("fecha", fecha)
      .order("hora", { ascending: true })
      .limit(2000);
    if (error) throw error;
    asistenciasRows = Array.isArray(data) ? data : [];
    renderAsistencias();
    if (status) status.textContent = `Actualizado ${horaCO(new Date())} · ${asistenciasRows.length} registros`;
    return;
  } catch (errEmbed) {
    console.warn("[asistencias] join embebido falló, reintento sin join:", errEmbed);
  }

  // 3) Fallback: sin join (por si el embed falla). Luego resolvemos nombres aparte.
  try {
    const { data, error } = await planillaSupabaseClient
      .from("asistencias")
      .select("id,fecha,hora,sentido,origen,base_operativa,punto_operativo,vehiculo_reporte,enviado_buk,sonar_asignado,observacion,colaborador_id,obra_id")
      .eq("fecha", fecha)
      .order("hora", { ascending: true })
      .limit(2000);
    if (error) throw error;
    const rows = Array.isArray(data) ? data : [];
    await asisResolverNombres(rows);
    asistenciasRows = rows;
    renderAsistencias();
    if (status) status.textContent = `Actualizado ${horaCO(new Date())} · ${asistenciasRows.length} registros`;
  } catch (err) {
    console.error("[asistencias] error:", err);
    if (status) status.textContent = `Error: ${err?.message || "fallo"}`;
    if (body) body.innerHTML = `<tr><td colspan="7" class="muted" style="text-align:center;padding:14px">No se pudo cargar. ${escapeHtml(err?.message || "")}</td></tr>`;
  }
}

// Resuelve nombre/cédula (colaboradores) y nombre de obra en lote, y los inyecta
// con la misma forma que el join embebido para que renderAsistencias no cambie.
async function asisResolverNombres(rows){
  try {
    const colIds = [...new Set(rows.map(r => r.colaborador_id).filter(Boolean))];
    const obraIds = [...new Set(rows.map(r => r.obra_id).filter(Boolean))];
    const colMap = new Map();
    const obraMap = new Map();
    if (colIds.length) {
      const { data } = await planillaSupabaseClient.from("colaboradores").select("id,nombre,dni").in("id", colIds);
      (data || []).forEach(c => colMap.set(c.id, { nombre: c.nombre, dni: c.dni }));
    }
    if (obraIds.length) {
      const { data } = await planillaSupabaseClient.from("obras").select("id,nombre").in("id", obraIds);
      (data || []).forEach(o => obraMap.set(o.id, { nombre: o.nombre }));
    }
    rows.forEach(r => {
      r.colaboradores = colMap.get(r.colaborador_id) || null;
      r.obras = obraMap.get(r.obra_id) || null;
    });
  } catch (e) { console.warn("[asistencias] no se pudieron resolver nombres:", e); }
}

function setAsisFiltro(f){
  asisFiltro = f;
  const map = { todos: "asisFiltroTodos", entrada: "asisFiltroEntrada", salida: "asisFiltroSalida", sinsalida: "asisFiltroSinSalida" };
  Object.entries(map).forEach(([k, id]) => {
    const el = document.getElementById(id);
    if (el) el.className = `btn ${k === f ? "btn-primary" : "btn-ghost"}`;
  });
  renderAsistencias();
}

function asisSentidoBadge(s){
  const v = String(s || "").toLowerCase();
  if (v === "entrada") return `<span class="cump-badge cump-ok">Entrada</span>`;
  if (v === "salida") return `<span class="cump-badge cump-nolabor">Salida</span>`;
  return `<span class="cump-badge">${escapeHtml(s || "—")}</span>`;
}
const ASIS_ALERTA_MIN = 870; // 14h30m: máximo permitido por Combuses.

// Ubica el carro que reporta el conductor (vehiculo_reporte tipo "719 - TRN968")
// en las posiciones Sonar ya cargadas. Devuelve {lat,lon,plate,interno,driverName} o null.
function asisPosicionCarro(vehiculoReporte){
  const raw = String(vehiculoReporte || "").trim();
  if (!raw) return null;
  const partes = raw.split("-").map(s => s.trim()).filter(Boolean);
  let interno = "", plate = "";
  partes.forEach(p => { if (/^\d+$/.test(p)) interno = p; else plate = p.replace(/\s+/g, "").toUpperCase(); });
  if (!plate && partes.length) plate = partes[partes.length - 1].replace(/\s+/g, "").toUpperCase();
  const norm = s => String(s || "").replace(/\s+/g, "").toUpperCase();
  const flota = sonarFleetLocations || [];
  // 1) por placa
  let hit = plate ? flota.find(p => norm(p.plate) === plate) : null;
  // 2) por interno → mid (catálogo vehiculossonar)
  if (!hit && interno) {
    const v = (vehiculosSonarRows || []).find(x => String(x?.interno || "").trim() === interno);
    const mid = v ? String(v.mid || "").trim().toUpperCase() : "";
    if (mid) hit = flota.find(p => String(p.id || "").trim().toUpperCase() === mid);
  }
  if (!hit) return null;
  return { lat: Number(hit.lat), lon: Number(hit.lon), plate: hit.plate || plate, interno, driverName: hit.driverName || "", datetime: hit.datetime || null };
}

// Frescura del GPS: "último GPS: hace X min (HH:MM)". Naranja si >15 min.
function asisGpsFrescura(datetime){
  if (!datetime) return "";
  const age = sonarAgeMin({ datetime });
  const hhmm = horaCO(parseSonarGmt(datetime));
  if (age == null) return "";
  const mins = Math.round(age);
  const color = mins > 15 ? "#c2410c" : "#047857";
  const cuando = mins <= 1 ? "hace instantes" : `hace ${mins} min`;
  return `<span style="color:${color}">último GPS: ${cuando} (${hhmm})</span>`;
}

// Tiempo trabajando desde la ENTRADA hasta la hora actual (solo aplica para hoy
// y para la marcación de entrada). Devuelve HTML con formato "Xh YYm".
function asisTrabajando(a, esHoy){
  if (!esHoy) return `<span class="muted">—</span>`;
  if (String(a.sentido || "").toLowerCase() !== "entrada") return `<span class="muted">—</span>`;
  const ini = hhmmToMin(String(a.hora || "").slice(0, 5));
  if (ini == null) return `<span class="muted">—</span>`;
  let diff = ahoraMinBogota() - ini;
  if (diff < 0) diff += 1440; // cruzó medianoche
  const h = Math.floor(diff / 60), m = diff % 60;
  const txt = `${h}h ${String(m).padStart(2, "0")}m`;
  // Naranja si ya lleva 10h o más (jornada larga).
  const color = diff >= 600 ? "#c2410c" : "#1d4ed8";
  return `<span style="font-weight:700;color:${color}">${txt}</span>`;
}

function renderAsistencias(){
  const body = document.getElementById("asisBody");
  const count = document.getElementById("asisCount");
  if (!body) return;
  const term = String(document.getElementById("asisSearch")?.value || "").trim().toLowerCase();
  const soloVeh = !!document.getElementById("asisSoloVehiculo")?.checked;

  // Agrupa por colaborador: ¿tiene entrada?, ¿tiene salida?  Sirve para el filtro
  // "sinsalida" y también para resaltar en rojo esas filas en cualquier vista.
  const asisKey = a => a.colaborador_id || a.colaboradores?.dni || a.colaboradores?.nombre || "";
  const grupos = new Map();
  asistenciasRows.forEach(a => {
    const k = asisKey(a);
    if (!k) return;
    if (!grupos.has(k)) grupos.set(k, { entrada: null, salida: false });
    const s = String(a.sentido || "").toLowerCase();
    if (s === "entrada") { const e = grupos.get(k); if (!e.entrada) e.entrada = a; }
    else if (s === "salida") grupos.get(k).salida = true;
  });
  // Colaboradores con entrada pero sin salida → pendientes de cerrar turno.
  const sinSalidaKeys = new Set();
  grupos.forEach((v, k) => { if (v.entrada && !v.salida) sinSalidaKeys.add(k); });

  const esHoy = (document.getElementById("asisFecha")?.value || fechaBogotaISO()) === fechaBogotaISO();
  // Alerta: conductores con +14h30m trabajando (entrada sin salida, hoy).
  renderAsisAlerta(grupos, esHoy);

  // Base según el filtro de sentido.
  let base;
  if (asisFiltro === "sinsalida") {
    base = [];
    grupos.forEach(v => { if (v.entrada && !v.salida) base.push(v.entrada); });
  } else {
    base = asistenciasRows.filter(a => asisFiltro === "todos" || String(a.sentido || "").toLowerCase() === asisFiltro);
  }

  const filas = base
    // Ocultar marcaciones sin colaborador identificado (salían con "—").
    .filter(a => String(a.colaboradores?.nombre || "").trim() !== "")
    .filter(a => !soloVeh || String(a.vehiculo_reporte || "").trim() !== "")
    .filter(a => {
      if (!term) return true;
      const nom = a.colaboradores?.nombre || "";
      const dni = a.colaboradores?.dni || "";
      return [nom, dni, a.vehiculo_reporte, a.base_operativa, a.punto_operativo].join(" ").toLowerCase().includes(term);
    });
  if (count) count.textContent = String(filas.length);
  if (!filas.length) {
    body.innerHTML = `<tr><td colspan="7" class="muted" style="text-align:center;padding:14px">Sin marcaciones para esta fecha/filtro.</td></tr>`;
    return;
  }
  body.innerHTML = filas.map(a => {
    const nombre = a.colaboradores?.nombre || "—";
    const dni = a.colaboradores?.dni || "";
    const obra = a.obras?.nombre || (a.base_operativa ? `Base ${a.base_operativa}` : "");
    const puntoExtra = a.punto_operativo ? ` · ${escapeHtml(a.punto_operativo)}` : "";
    const hora = String(a.hora || "").slice(0, 5);
    // Rojo si el colaborador tiene entrada sin salida (turno sin cerrar).
    const sinSalida = sinSalidaKeys.has(asisKey(a));
    const rowStyle = sinSalida ? ' style="background:#fee2e2"' : "";
    return `<tr${rowStyle}>
    <td style="font-weight:700">${escapeHtml(hora)}</td>
    <td>${asisSentidoBadge(a.sentido)}</td>
    <td>${escapeHtml(nombre)}</td>
    <td>${escapeHtml(dni)}</td>
    <td>${escapeHtml(obra)}${puntoExtra}</td>
    <td>${escapeHtml(a.vehiculo_reporte || "—")}</td>
    <td style="text-align:center">${asisTrabajando(a, esHoy)}</td>
  </tr>`;
  }).join("");
}

// Calcula, a partir del mapa de grupos {entrada,salida}, la lista de conductores
// con +14h30m trabajando (entrada sin salida). Devuelve [{a, diff}] ordenada desc.
function asisCalcularAlertas(grupos, esHoy){
  const alertas = [];
  if (!esHoy) return alertas;
  grupos.forEach(v => {
    if (!v.entrada || v.salida) return;
    if (!v.entrada.colaboradores?.nombre) return; // sin identificar, no alertamos
    const ini = hhmmToMin(String(v.entrada.hora || "").slice(0, 5));
    if (ini == null) return;
    let diff = ahoraMinBogota() - ini;
    if (diff < 0) diff += 1440;
    if (diff >= ASIS_ALERTA_MIN) alertas.push({ a: v.entrada, diff });
  });
  alertas.sort((x, y) => y.diff - x.diff);
  return alertas;
}

// Tarjeta HTML de un conductor alertado (compartida por el panel y el flotante).
function asisAlertaCardHtml(a, diff){
  const nombre = a.colaboradores?.nombre || "—";
  const dni = a.colaboradores?.dni || "";
  const veh = a.vehiculo_reporte || "";
  const h = Math.floor(diff / 60), m = diff % 60;
  const tiempo = `${h}h ${String(m).padStart(2, "0")}m`;
  const pos = asisPosicionCarro(veh);
  let ubicHtml;
  if (pos && Number.isFinite(pos.lat) && Number.isFinite(pos.lon)) {
    const q = escapeHtml(veh);
    const gmaps = `https://www.google.com/maps?q=${pos.lat},${pos.lon}`;
    const fresca = asisGpsFrescura(pos.datetime);
    ubicHtml = `Ubicación del carro: <b>${pos.lat.toFixed(5)}, ${pos.lon.toFixed(5)}</b>${fresca ? ` · ${fresca}` : ""}
      <div style="margin-top:4px">
        <button class="btn btn-ghost" style="padding:2px 8px" onclick="asisVerCarroEnMapa('${q}')">Ver en mapa</button>
        <a class="btn btn-ghost" style="padding:2px 8px;margin-left:4px;text-decoration:none" href="${gmaps}" target="_blank" rel="noopener">Google Maps</a>
      </div>`;
  } else {
    ubicHtml = `<span class="muted">Ubicación del carro no disponible (sin posición Sonar reciente${veh ? ` para ${escapeHtml(veh)}` : ""}).</span>`;
  }
  return `<div style="border-left:5px solid #b91c1c;background:#fff1f2;border-radius:8px;padding:10px 12px;margin-bottom:8px">
    <div style="font-weight:800;color:#7f1d1d;font-size:14px">⚠️ ${escapeHtml(nombre)}${dni ? ` <span style="font-weight:600;color:#7f1d1d">· CC ${escapeHtml(dni)}</span>` : ""} — lleva <span style="color:#b91c1c">${tiempo}</span> laborando</div>
    <div style="margin-top:3px">Vehículo: <b>${escapeHtml(veh || "—")}</b></div>
    <div style="margin-top:3px">${ubicHtml}</div>
    <div style="margin-top:5px;color:#7f1d1d">Debe <b>presentarse a cerrar labores</b>. Superó el máximo de <b>14h30m</b> permitido por Combuses y no puede seguir laborando.</div>
  </div>`;
}

// Panel de alerta dentro de la pestaña Asistencias.
let asisAlertaAvisados = new Set(); // para no repetir el toast cada minuto
let asisDemoAlertas = null;         // ejemplo para previsualizar/aprobar
function renderAsisAlerta(grupos, esHoy){
  const cont = document.getElementById("asisAlerta");
  if (!cont) return;
  let alertas = asisCalcularAlertas(grupos, esHoy);
  let demo = false;
  if (!alertas.length && asisDemoAlertas) { alertas = asisDemoAlertas; demo = true; }
  if (!alertas.length) { cont.innerHTML = ""; return; }
  const ribbon = demo ? `<div style="background:#fde68a;color:#78350f;font-weight:800;padding:4px 10px;border-radius:6px;margin-bottom:8px;display:inline-block">🧪 EJEMPLO (demostración) — datos ficticios</div>` : "";
  cont.innerHTML = `<div style="border:1px solid #fca5a5;background:#fef2f2;border-radius:10px;padding:12px;margin-bottom:12px">
    ${ribbon}
    <div style="font-weight:800;color:#b91c1c;margin-bottom:8px;font-size:15px">🚨 ${alertas.length} conductor(es) superaron la jornada máxima (14h30m)</div>
    ${alertas.map(({ a, diff }) => asisAlertaCardHtml(a, diff)).join("")}
  </div>`;
}

// Muestra/quita un EJEMPLO de la alerta (para aprobar el diseño sin esperar a que
// un conductor real llegue a las 14h30m). Usa un carro real para la ubicación.
async function asisToggleDemoAlerta(){
  const btn = document.getElementById("asisDemo");
  if (asisDemoAlertas) {
    asisDemoAlertas = null;
    if (btn) btn.textContent = "Ver ejemplo de alerta";
    renderAsisAlertaFlotante([]);
    renderAsistencias();
    if (typeof showToast === "function") showToast("Ejemplo de alerta quitado.", "ok");
    return;
  }
  if (!sonarLocationsLastLoadedAt) { try { await loadSonarFleetLocations(); } catch (_) {} }
  const car = (sonarFleetLocations || []).find(p => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon)) && p.plate);
  const plate = car ? car.plate : "TRN968";
  const diff = 885; // 14h45m
  const hora = minToHHMM((((ahoraMinBogota() - diff) % 1440) + 1440) % 1440) + ":00";
  const a = {
    hora, sentido: "entrada", vehiculo_reporte: `999 - ${plate}`,
    colaborador_id: "demo-0000", colaboradores: { nombre: "EJEMPLO — Juan Pérez (demo)", dni: "1234567890" },
    obras: null, base_operativa: null, punto_operativo: null,
  };
  asisDemoAlertas = [{ a, diff }];
  if (btn) btn.textContent = "Quitar ejemplo";
  renderAsisAlertaFlotante(asisDemoAlertas, true);
  renderAsistencias();
  if (getActiveTabId() !== "asistencias") asisIrAAsistencias();
  if (typeof showToast === "function") showToast("🧪 Mostrando EJEMPLO de alerta. Pulsa de nuevo para quitarlo.", "warn");
}

// Lleva al mapa y centra en el carro del conductor alertado.
function asisVerCarroEnMapa(query){
  const tab = document.querySelector('.tab[data-tab="mapa-vehiculos"]');
  if (tab) tab.click();
  setTimeout(() => { try { buscarCarroEnMapa(query); } catch (_) {} }, 400);
}

// ===== Alerta GLOBAL flotante (se superpone en toda la app, en cualquier pestaña) =====
let asisAlertaGlobalTimer = null;

// Persistencia del "posponer" (snooze): al cerrar un aviso NO se elimina, solo se
// pospone 30 min. Se guarda en localStorage para sobrevivir recargas. Si el
// conductor sigue pasado de horas, el aviso VUELVE a salir. La alerta refleja
// siempre lo que hay en los datos, no un estado que se pierda al refrescar.
const ASIS_SNOOZE_MIN = 30;
const ASIS_SNOOZE_LS = "combuses_asis_snooze";
function asisSnoozeMap(){
  try { return JSON.parse(localStorage.getItem(ASIS_SNOOZE_LS) || "{}") || {}; } catch (_) { return {}; }
}
function asisSnoozeActivo(k){
  const until = asisSnoozeMap()[k];
  return !!(until && Date.now() < until);
}
function asisSnoozeSet(k){
  const m = asisSnoozeMap();
  m[k] = Date.now() + ASIS_SNOOZE_MIN * 60000;
  const now = Date.now();
  Object.keys(m).forEach(key => { if (!m[key] || m[key] < now) delete m[key]; }); // limpiar vencidos
  try { localStorage.setItem(ASIS_SNOOZE_LS, JSON.stringify(m)); } catch (_) {}
}

async function checkAsisAlertaGlobal(){
  if (!currentUserId) return;
  try {
    const fecha = fechaBogotaISO();
    // Consulta liviana: solo lo necesario para detectar la jornada máxima.
    const { data, error } = await planillaSupabaseClient
      .from("asistencias")
      .select("hora,sentido,vehiculo_reporte,colaborador_id,colaboradores(nombre,dni)")
      .eq("fecha", fecha)
      .limit(2000);
    if (error) throw error;
    const rows = Array.isArray(data) ? data : [];
    const grupos = new Map();
    rows.forEach(a => {
      const k = a.colaborador_id || a.colaboradores?.dni || a.colaboradores?.nombre;
      if (!k) return;
      if (!grupos.has(k)) grupos.set(k, { entrada: null, salida: false });
      const s = String(a.sentido || "").toLowerCase();
      if (s === "entrada") { const e = grupos.get(k); if (!e.entrada) e.entrada = a; }
      else if (s === "salida") grupos.get(k).salida = true;
    });
    let alertas = asisCalcularAlertas(grupos, true);
    // Respetar los pospuestos (snooze), pero solo mientras siga vigente.
    alertas = alertas.filter(({ a }) => !asisSnoozeActivo(a.colaborador_id || a.colaboradores?.dni || a.colaboradores?.nombre));

    if (!alertas.length) { renderAsisAlertaFlotante(asisDemoAlertas || [], !!asisDemoAlertas); return; }
    // Si hay alertas y no hay posiciones frescas, cargarlas y re-render.
    if (!sonarLocationsLastLoadedAt || (Date.now() - sonarLocationsLastLoadedAt) > 90000) {
      loadSonarFleetLocations().then(() => renderAsisAlertaFlotante(alertas)).catch(() => renderAsisAlertaFlotante(alertas));
    } else {
      renderAsisAlertaFlotante(alertas);
    }
  } catch (err) {
    console.warn("[asistencias] alerta global falló:", err);
  }
}

function renderAsisAlertaFlotante(alertas, demo){
  let box = document.getElementById("asisAlertaFlotante");
  if (!alertas.length) { if (box) box.remove(); return; }
  if (!box) {
    box = document.createElement("div");
    box.id = "asisAlertaFlotante";
    box.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:9999;width:min(380px,92vw);max-height:70vh;overflow:auto;box-shadow:0 8px 30px rgba(0,0,0,.25);border-radius:12px";
    document.body.appendChild(box);
  }
  const cards = alertas.map(({ a, diff }) => {
    const k = a.colaborador_id || a.colaboradores?.dni || a.colaboradores?.nombre || "";
    const card = asisAlertaCardHtml(a, diff);
    // Botón para ocultar esa alerta puntual.
    return card.replace("<div style=\"margin-top:5px;color:#7f1d1d\">",
      `<div style="text-align:right;margin-top:-4px"><button class="btn btn-ghost" style="padding:0 6px;font-size:16px;line-height:1" title="Posponer ${ASIS_SNOOZE_MIN} min" onclick="asisOcultarAlertaGlobal('${escapeHtml(String(k))}')">✕</button></div><div style="margin-top:5px;color:#7f1d1d">`);
  }).join("");
  const ribbon = demo ? `<div style="background:#fde68a;color:#78350f;font-weight:800;padding:5px 10px;font-size:12px;text-align:center">🧪 EJEMPLO (demostración) — datos ficticios</div>` : "";
  box.innerHTML = `${ribbon}<div style="background:#b91c1c;color:#fff;font-weight:800;padding:10px 12px;font-size:14px">🚨 Jornada máxima (14h30m) — ${alertas.length} conductor(es)</div>
    <div style="background:#fff;padding:10px">${cards}
      <div style="text-align:center;margin-top:4px"><button class="btn btn-ghost" style="padding:3px 10px" onclick="asisIrAAsistencias()">Abrir Asistencias</button></div>
    </div>`;
}

function asisOcultarAlertaGlobal(k){
  if (k === "demo-0000") { // cerrar el ejemplo
    asisDemoAlertas = null;
    const btn = document.getElementById("asisDemo");
    if (btn) btn.textContent = "Ver ejemplo de alerta";
    renderAsisAlertaFlotante([]);
    renderAsistencias();
    return;
  }
  if (k) {
    asisSnoozeSet(k);
    if (typeof showToast === "function") showToast(`Aviso pospuesto ${ASIS_SNOOZE_MIN} min. Volverá a salir si el conductor sigue sin cerrar labores.`, "warn");
  }
  checkAsisAlertaGlobal();
}
function asisIrAAsistencias(){
  const tab = document.querySelector('.tab[data-tab="asistencias"]');
  if (tab) tab.click();
}

function ensureAsisAlertaGlobal(){
  if (asisAlertaGlobalTimer) return;
  checkAsisAlertaGlobal();
  // Cada 3 minutos revisa en segundo plano (independiente de la pestaña activa).
  asisAlertaGlobalTimer = setInterval(() => {
    if (document.hidden) return;
    checkAsisAlertaGlobal();
  }, 180000);
}

// Lleva al mapa y centra en el carro del conductor alertado.
function asisVerCarroEnMapa(query){
  const tab = document.querySelector('.tab[data-tab="mapa-vehiculos"]');
  if (tab) tab.click();
  setTimeout(() => { try { buscarCarroEnMapa(query); } catch (_) {} }, 400);
}

// ==================== INFORME DE GESTIÓN DE FLOTA ====================
// Cruce por hora: llegadas del aeropuerto (Airplan) vs despachos realizados desde
// el aeropuerto. Incluye modelo de demanda (pax estimados → buses necesarios).
const IFL_OCUPACION = 0.82;   // ocupación media del vuelo
const IFL_CAPTACION = 0.15;   // % de pax que toma nuestro servicio
const IFL_PAX_BUS   = 19;     // capacidad útil por bus
let iflRows = [];             // filas por hora ya calculadas
let iflMeta = { fecha: "", vuelos: 0, asientos: 0, pax: 0, buses: 0, despachos: 0, paxTransp: 0 };
let iflPuntos = [];           // desglose por punto de despacho

// Itinerario_id → punto de despacho (alineado con las planillas que usa la operación).
const IFL_PUNTO_POR_ITIN = {
  "4505": "Almacentro",
  "4504": "San Diego", "3395": "San Diego", "4507": "San Diego", "3385": "San Diego",
  "4502": "Exposiciones", "3387": "Exposiciones", "3394": "Exposiciones", "4503": "Exposiciones", "4413": "Exposiciones",
  "4501": "Terminal Norte",
};
function iflPuntoDeDespacho(d){
  const id = String(d?.itinerario_id || "").trim();
  if (IFL_PUNTO_POR_ITIN[id]) return IFL_PUNTO_POR_ITIN[id];
  const n = String(d?.itinerario || "").toLowerCase();
  if (n.includes("almacentro")) return "Almacentro";
  if (n.includes("san diego") || n.includes("sandiego")) return "San Diego";
  if (n.includes("exposicion") || n.includes("nutibara")) return "Exposiciones";
  if (n.includes("terminalnorte") || n.includes("terminal norte")) return "Terminal Norte";
  return "Otros";
}

function iflFechaSel(){
  return String(document.getElementById("iflFecha")?.value || "").trim() || fechaBogotaISO();
}

// ¿El despacho fue CANCELADO DE VERDAD por el operador?
// Ojo: al cerrar el día, el sistema pasa TODOS los despachos activos a CANCELADO
// (con cancelled_at), así que en días pasados "CANCELADO" no significa que no salió.
// La cancelación real se hace a los pocos minutos de crear el despacho; el cierre
// de día cancela buses que ya llevaban horas trabajando. Regla: si vivió < 30 min
// desde que se creó, fue cancelación real; si vivió más (o sigue ACTIVO), el bus salió.
const IFL_VIDA_MIN_REAL = 30; // minutos: umbral cancelación real vs cierre de día
function iflEstaCancelado(d){
  if (String(d?.estado || "").toUpperCase() !== "CANCELADO") return false; // ACTIVO u otro → cuenta
  if (!d?.cancelled_at) return true;
  const vida = (new Date(d.cancelled_at).getTime() - new Date(d.created_at).getTime()) / 60000;
  if (!Number.isFinite(vida)) return true;
  return vida < IFL_VIDA_MIN_REAL; // vivió poco → cancelación real (excluir)
}

async function loadInformeFlota(){
  const status = document.getElementById("iflStatus");
  const fEl = document.getElementById("iflFecha");
  if (fEl && !fEl.value) fEl.value = fechaBogotaISO();
  const fecha = iflFechaSel();
  if (status) status.textContent = `Consultando ${fecha}…`;
  try {
    // Rango UTC del día en hora Colombia (UTC-5): [fecha 05:00Z, fecha+1 05:00Z).
    const startISO = `${fecha}T05:00:00+00:00`;
    const finDia = new Date(new Date(`${fecha}T12:00:00-05:00`).getTime() + 24 * 3600 * 1000);
    const endISO = `${finDia.toISOString().slice(0, 10)}T05:00:00+00:00`;

    const [llegRes, despRes] = await Promise.all([
      planillaSupabaseClient
        .from("vuelos_mde_historico")
        .select("hora,asientos,tipo,fecha")
        .eq("fecha", fecha).eq("tipo", "llegada").limit(3000),
      planillaSupabaseClient
        .from(HISTORIAL_DESPACHOS_TABLE)
        .select("itinerario_id,itinerario,pasajeros,estado,cancelled_at,created_at")
        .gte("created_at", startISO).lt("created_at", endISO).limit(5000),
    ]);
    if (llegRes.error) throw llegRes.error;
    if (despRes.error) throw despRes.error;

    // Dedup visual de llegadas (Airplan a veces repite): por hora la contamos una vez.
    const llegadas = Array.isArray(llegRes.data) ? llegRes.data : [];
    // Todos los despachos reales del día (sin cancelaciones reales) → desglose por punto.
    const despachosDia = (Array.isArray(despRes.data) ? despRes.data : [])
      .filter(d => !iflEstaCancelado(d));
    // Para el cruce con las llegadas contamos los despachos de SUBIDA (buses enviados
    // al aeropuerto a atender los vuelos que llegan).
    const despachos = despachosDia.filter(d => getItineraryDirection(d.itinerario, d.itinerario_id) === "sube");

    // Desglose por punto de despacho (todos los despachos del día).
    const puntoMap = new Map();
    despachosDia.forEach(d => {
      const p = iflPuntoDeDespacho(d);
      if (!puntoMap.has(p)) puntoMap.set(p, { punto: p, despachos: 0, paxTransp: 0 });
      const o = puntoMap.get(p);
      o.despachos += 1;
      o.paxTransp += Number(d.pasajeros) || 0;
    });
    const totalDespDia = despachosDia.length || 1;
    iflPuntos = Array.from(puntoMap.values())
      .map(o => ({ ...o, pct: Math.round(o.despachos / totalDespDia * 100) }))
      .sort((a, b) => b.despachos - a.despachos);

    // Acumular por hora (0..23).
    const H = Array.from({ length: 24 }, (_, h) => ({
      hora: h, vuelos: 0, asientos: 0, despachos: 0, paxTransp: 0,
    }));
    llegadas.forEach(v => {
      const h = parseInt(String(v.hora || "").slice(0, 2), 10);
      if (!(h >= 0 && h < 24)) return;
      H[h].vuelos += 1;
      H[h].asientos += Number(v.asientos) || 0;
    });
    despachos.forEach(d => {
      const min = minutosDelDiaCO(d.created_at);
      if (min == null) return;
      const h = Math.floor(min / 60);
      if (!(h >= 0 && h < 24)) return;
      H[h].despachos += 1;
      H[h].paxTransp += Number(d.pasajeros) || 0;
    });

    // Calcular demanda y quedarnos solo con horas que tengan actividad.
    iflRows = H.map(r => {
      const pax = Math.round(r.asientos * IFL_OCUPACION * IFL_CAPTACION);
      const buses = Math.ceil(pax / IFL_PAX_BUS);
      const cobertura = buses > 0 ? (r.despachos / buses) : null;
      return { ...r, pax, buses, cobertura };
    }).filter(r => r.vuelos > 0 || r.despachos > 0);

    iflMeta = {
      fecha,
      vuelos: iflRows.reduce((s, r) => s + r.vuelos, 0),
      asientos: iflRows.reduce((s, r) => s + r.asientos, 0),
      pax: iflRows.reduce((s, r) => s + r.pax, 0),
      buses: iflRows.reduce((s, r) => s + r.buses, 0),
      despachos: iflRows.reduce((s, r) => s + r.despachos, 0),
      paxTransp: iflRows.reduce((s, r) => s + r.paxTransp, 0),
    };
    renderInformeFlota();
    if (status) status.textContent = `Actualizado ${horaCO(new Date())} · ${iflRows.length} franjas`;
  } catch (err) {
    console.error("[informe-flota] error:", err);
    if (status) status.textContent = `Error: ${err?.message || "fallo"}`;
    const body = document.getElementById("iflBody");
    if (body) body.innerHTML = `<tr><td colspan="8" class="muted" style="text-align:center;padding:14px">No se pudo cargar. ${escapeHtml(err?.message || "")}</td></tr>`;
  }
}

function iflCoberturaBadge(cob, despachos, buses){
  if (buses === 0) {
    return despachos > 0
      ? `<span class="cump-badge cump-ok">Sin demanda (${despachos} desp.)</span>`
      : `<span class="muted">—</span>`;
  }
  const pct = Math.round(cob * 100);
  let cls = "cump-nolabor"; // rojo: cobertura baja
  if (pct >= 100) cls = "cump-ok";
  else if (pct >= 70) cls = "cump-incompleto"; // ámbar
  return `<span class="cump-badge ${cls}">${pct}%</span>`;
}

function renderInformeFlotaPuntos(){
  const body = document.getElementById("iflPuntoBody");
  if (!body) return;
  if (!iflPuntos.length) {
    body.innerHTML = `<tr><td colspan="4" class="muted" style="text-align:center;padding:12px">Sin despachos para esta fecha.</td></tr>`;
    return;
  }
  const totDesp = iflPuntos.reduce((s, p) => s + p.despachos, 0);
  const totPax = iflPuntos.reduce((s, p) => s + p.paxTransp, 0);
  body.innerHTML = iflPuntos.map(p => `<tr>
    <td style="font-weight:700">${escapeHtml(p.punto)}</td>
    <td style="text-align:center;font-weight:700;color:#1d4ed8">${p.despachos}</td>
    <td style="text-align:center">${p.paxTransp || "—"}</td>
    <td style="text-align:center">${p.pct}%</td>
  </tr>`).join("") + `<tr style="background:#f1f5f9;font-weight:800">
    <td>TOTAL</td>
    <td style="text-align:center;color:#1d4ed8">${totDesp}</td>
    <td style="text-align:center">${totPax}</td>
    <td style="text-align:center">100%</td>
  </tr>`;
}

function renderInformeFlota(){
  const body = document.getElementById("iflBody");
  const resumen = document.getElementById("iflResumen");
  if (!body) return;
  renderInformeFlotaPuntos();
  if (!iflRows.length) {
    body.innerHTML = `<tr><td colspan="8" class="muted" style="text-align:center;padding:14px">Sin llegadas ni despachos para esta fecha.</td></tr>`;
    if (resumen) resumen.innerHTML = "";
    return;
  }
  body.innerHTML = iflRows.map(r => {
    const hh = `${String(r.hora).padStart(2, "0")}:00`;
    return `<tr>
      <td style="font-weight:700">${hh}</td>
      <td style="text-align:center">${r.vuelos || "—"}</td>
      <td style="text-align:center">${r.asientos || "—"}</td>
      <td style="text-align:center">${r.pax || "—"}</td>
      <td style="text-align:center;font-weight:700">${r.buses || "—"}</td>
      <td style="text-align:center;font-weight:700;color:#1d4ed8">${r.despachos || "—"}</td>
      <td style="text-align:center">${r.paxTransp || "—"}</td>
      <td style="text-align:center">${iflCoberturaBadge(r.cobertura, r.despachos, r.buses)}</td>
    </tr>`;
  }).join("") + `<tr style="background:#f1f5f9;font-weight:800">
      <td>TOTAL</td>
      <td style="text-align:center">${iflMeta.vuelos}</td>
      <td style="text-align:center">${iflMeta.asientos}</td>
      <td style="text-align:center">${iflMeta.pax}</td>
      <td style="text-align:center">${iflMeta.buses}</td>
      <td style="text-align:center;color:#1d4ed8">${iflMeta.despachos}</td>
      <td style="text-align:center">${iflMeta.paxTransp}</td>
      <td style="text-align:center">${iflMeta.buses > 0 ? Math.round(iflMeta.despachos / iflMeta.buses * 100) + "%" : "—"}</td>
    </tr>`;

  if (resumen) {
    const card = (t, v, c) => `<div style="border:1px solid #e2e8f0;border-radius:10px;padding:8px 14px;min-width:120px">
      <div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.4px">${t}</div>
      <div style="font-weight:800;font-size:20px;color:${c || "#0f172a"}">${v}</div></div>`;
    const covTotal = iflMeta.buses > 0 ? Math.round(iflMeta.despachos / iflMeta.buses * 100) : null;
    resumen.innerHTML =
      card("Vuelos llegada", iflMeta.vuelos) +
      card("Pax estimados", iflMeta.pax) +
      card("Buses necesarios", iflMeta.buses) +
      card("Despachos", iflMeta.despachos, "#1d4ed8") +
      card("Cobertura", covTotal == null ? "—" : covTotal + "%", covTotal == null ? "#0f172a" : (covTotal >= 100 ? "#047857" : covTotal >= 70 ? "#a16207" : "#b91c1c"));
  }
}

function refreshInformeFlota(){
  const fEl = document.getElementById("iflFecha");
  if (fEl && !fEl.value) fEl.value = fechaBogotaISO();
  loadInformeFlota();
}

function downloadInformeFlota(){
  const table = document.getElementById("iflTabla");
  const tablaPunto = document.getElementById("iflPuntoTabla");
  if (!table || !iflRows.length) { if (typeof showToast === "function") showToast("No hay datos para exportar. Pulsa Actualizar.", "warn"); return; }
  const html =
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">` +
    `<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Informe Flota</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>` +
    `<body><h3>Informe de gestión de flota — ${escapeHtml(iflMeta.fecha)}</h3>${table.outerHTML}` +
    `<h3>Despachos por punto de despacho</h3>${tablaPunto ? tablaPunto.outerHTML : ""}</body></html>`;
  const blob = new Blob(["﻿", html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `informe_flota_${iflMeta.fecha}.xls`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ==================== INIT ====================
async function initializeApp(){
  loadPlanillaTableSourcePreference();
  await loadDriversFromCSV();
  await loadVehiculosSonarFromSupabase();
  // Sistema viejo (104) desconectado: NO se carga planilla_afiliados_2 al arrancar.
  // Las pestañas viejas están ocultas y su auto-refresco solo corre si están activas.
  // (El sistema nuevo usa tablas aparte: enturnamientos, geocercas, vehiculossonar, despachos_realizados.)
  if (operativoPanel) operativoPanel.classList.remove("hidden");
  if (operativoInner) operativoInner.classList.remove("hidden");
  renderFueraListaTab();
  refreshMobileTabSwitcher();
  if (getActiveTabId() === "mapa-vehiculos" && typeof activateMapaVehiculosTab === "function") {
    activateMapaVehiculosTab();
  }
}

function bindWindowEvents(){
  window.addEventListener("beforeunload", () => {
    if (planillaAutoRefreshTimer) {
      clearInterval(planillaAutoRefreshTimer);
      planillaAutoRefreshTimer = null;
    }
  });

  if (!planillaAutoRefreshTimer) {
    planillaAutoRefreshTimer = setInterval(async () => {
      if (!navigator.onLine || !currentUserId) return;
      const activeTab = getActiveTabId();
      if (!isPlanillaRelatedTab(activeTab)) return;
      await ensureFreshPlanillaData({ maxAgeMs: PLANILLA_REFRESH_MAX_AGE_MS });
    }, PLANILLA_AUTO_REFRESH_MS);
  }
}
