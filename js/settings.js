// Ketel — settings.html
(function(){
  document.getElementById('btnExport').addEventListener('click', ()=>{
    const blob = new Blob([exportData()], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0,10);
    a.href = url;
    a.download = `ketel-donnees-${date}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  const fileInput = document.getElementById('fileImport');
  const msg = document.getElementById('importMsg');
  function showMsg(text){
    msg.textContent = text;
    msg.style.display = 'block';
  }
  document.getElementById('btnImportTrigger').addEventListener('click', ()=> fileInput.click());
  fileInput.addEventListener('change', ()=>{
    const file = fileInput.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        importData(reader.result);
        showMsg('Données importées. Rechargement…');
        setTimeout(()=> location.href = 'index.html', 900);
      }catch(e){
        showMsg("Fichier invalide, rien n'a été importé.");
      }
    };
    reader.onerror = ()=> showMsg('Impossible de lire le fichier.');
    reader.readAsText(file);
    fileInput.value = '';
  });

  document.getElementById('btnReset').addEventListener('click', ()=>{
    if(!confirm('Supprimer toutes les données Ketel de ce navigateur ? Cette action est irréversible.')) return;
    resetAllData();
    location.href = 'index.html';
  });
})();
