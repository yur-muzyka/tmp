(function () {
    var p = admixerSm.autoUpdate;
    var asm = admixerSm;
    var w = window, d = document;
    asm.isLoading = true;
    if (p.isInit)
        return;
    p.isInit = true;
    p.asm.version = '1.9';
    p.asm.scannerVersion = 1.7;
    if (!p.asm.coreVersion || p.asm.coreVersion < 4.4) {
        p.asm.coreVersion = 4.4;
        asm.loadScript(w.admixerSm.cdnPath + '/scriptlib/asm_upd.js?v=' + p.asm.coreVersion);
    }
    else {

        while (p.initCallbacks.length > 0) {
            p.initCallbacks.pop()(p);
        }
    }
})();