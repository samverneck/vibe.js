(function (){
    const originalVibrate = navigator.vibrate;
    var timeout = null;
    var _b = document.body || false;
    var enabled = true;
    
    var audio = new Audio('/vibe.js/audios/vibrate-sound.mp3');
    
    navigator.vibrate = function(){
        
        var timer = 0;
        var curToggleStatus = true;
        
        if (!enabled) {
            return false;
        }
        
        enabled = false;

        function toggle (force) {
            if(!_b) return;
            if(curToggleStatus && !force){
                _b.classList.add('vibrating');
                audio.currentTime = 0;
                audio.play();
            }else{
                _b.classList.remove('vibrating');
                audio.pause();
            }
            curToggleStatus = !curToggleStatus;
        }

        (arguments[0] || []).forEach(function(cur){
            timeout = setTimeout(toggle, timer);
            timer+= cur;
        });
        setTimeout(function(){
            toggle(true);
            enabled = true;
            audio.pause();
        }, ++timer);
        return originalVibrate.apply(navigator, arguments);
    };
    
    var start = 0;
    var result = document.getElementById('created-result');
    var finalVib = [];
    
    function clearPattern () {
        result.innerHTML = '';
        finalVib = [];
        start = 0;
        clearTimeout(timeout);
        _b.classList.remove('recording');
    }
    document.getElementById('clear-button').addEventListener('click', clearPattern);
    document.getElementById('clear-button').addEventListener('keypress', clearPattern);
    
    function vibratePattern () {
        window.navigator.vibrate(finalVib.length? finalVib : [
            500, 200, 500, 200, 500,
            200, 100, 200, 100, 200, 500,
            200, 100, 200, 100, 200, 500
        ]);
    }
    document.getElementById('vib-button').addEventListener('click', vibratePattern);
    document.getElementById('vib-button').addEventListener('keypress', vibratePattern);
    
    function down () {
        var d = new Date();
        var newStart = d.getTime();
        if (start) {
            finalVib.push(newStart - start);
        }
        start = newStart;
    }
    
    function up () {
        var d = new Date();
        var end = d.getTime();
        finalVib.push(end - start);
        result.innerHTML= finalVib.map(function(cur, idx, arr){
            return idx%4===0? '<br/>&nbsp;&nbsp;' + cur: cur;
        });
        start = d.getTime();
    }
    
    function selectText(container) {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(container);
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(container);
            window.getSelection().addRange(range);
        }
    }
    
    function startRecording (event) {
        if (enabled) {
          document.getElementById('start-recording-btn').blur();
        } else {
          document.getElementById('vib-button').focus();
        }
        enabled = !enabled;
        _b.classList.toggle('recording');
    }
    document.getElementById('start-recording-btn').addEventListener('click', startRecording);
    document.getElementById('start-recording-btn').addEventListener('keyup', function (event) {
        if (event.keyCode == 32 || event.keyCode == 13) {
            startRecording(event);
            event.cancelBubble = true;
            event.stopPropagation();
        }
    });
    
    result.parentElement.addEventListener('click', function (event) {
        selectText(this);
    });
    document.getElementById('listen-button').addEventListener('mousedown', down);
    document.getElementById('listen-button').addEventListener('touchstart', down);
    document.getElementById('listen-button').addEventListener('mouseup', up);
    document.getElementById('listen-button').addEventListener('touchend', up);
    var kd = false;
    _b.addEventListener('keydown', function(event){
        if (event.keyCode == 32 && !enabled && !kd) {
          kd = true;
          down();
        } else if (event.keyCode == 27 && !enabled) {
          startRecording();
        }
    });
    _b.addEventListener('keyup', function(event){
        if (event.keyCode == 32 && !enabled) {
            kd = false;
            up();
        }
    });
})();



/*
// plays the imperial march
window.navigator.vibrate([500, 200, 500, 200, 500,
200, 100, 200, 100, 200, 500,
200, 100, 200, 100, 200, 500
]);
*/