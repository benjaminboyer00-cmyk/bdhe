// Ketel — persistence layer (localStorage)
const STORE_KEY = 'ketel:v1';

function defaultStore(){
  return {
    profile:{
      gender:'homme', level:'debutant', goal:null, equipment:null,
      painArea:'aucune', sessionsPerWeek:3, sessionDuration:30,
      weightKg:null, heightCm:null, age:null, activity:'modere',
      recommendedProgramId:null, quizDone:false
    },
    history:[],
    activeSession:null,
    loads:{}
  };
}

function loadStore(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw) return defaultStore();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultStore(), parsed, {
      profile: Object.assign(defaultStore().profile, parsed.profile || {})
    });
  }catch(e){
    return defaultStore();
  }
}

function saveStore(store){
  try{ localStorage.setItem(STORE_KEY, JSON.stringify(store)); }catch(e){}
}

function updateProfile(patch){
  const store = loadStore();
  store.profile = Object.assign(store.profile, patch);
  saveStore(store);
  return store.profile;
}

function addHistoryEntry(entry){
  const store = loadStore();
  store.history.unshift(Object.assign({date:new Date().toISOString()}, entry));
  saveStore(store);
  return store.history;
}

function setActiveSession(session){
  const store = loadStore();
  store.activeSession = session;
  saveStore(store);
}
function clearActiveSession(){
  const store = loadStore();
  store.activeSession = null;
  saveStore(store);
}
function getActiveSession(){
  return loadStore().activeSession;
}

function getLoad(exerciseName){
  const store = loadStore();
  return (store.loads && store.loads[exerciseName] != null) ? store.loads[exerciseName] : null;
}
function setLoad(exerciseName, kg){
  const store = loadStore();
  if(!store.loads) store.loads = {};
  store.loads[exerciseName] = kg;
  saveStore(store);
}

function resetAllData(){
  try{ localStorage.removeItem(STORE_KEY); }catch(e){}
}

function exportData(){
  return JSON.stringify(loadStore(), null, 2);
}

function importData(json){
  const parsed = JSON.parse(json);
  if(typeof parsed !== 'object' || parsed === null) throw new Error('Format invalide');
  saveStore(Object.assign(defaultStore(), parsed, {
    profile: Object.assign(defaultStore().profile, parsed.profile || {})
  }));
}
