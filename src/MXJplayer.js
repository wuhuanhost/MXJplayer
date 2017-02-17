function MXJplayer() {
    //播放器对象
    this.Audio = null;
    //播放列表
    this.playList = [{
        id: 0, //数据库主键
        song: "", //歌名
        time: "", //音频总时长
        lrc: "", //lrc地址
        singer: "", //歌手
        lyrics: "", //作词
        composer: "", //作曲
    }]; //播放列表
    this.currentIndex = 0; //当前播放音频在播放列表中的下标
    this.currentTime = 0; //当前音频播放到第几秒了
    this.currentSrc = ""; //当前音频的src地址
    this.playProgress = 0.1; //播放进度,使用的时候乘以100%
    this.loadProgress = 0.2; //音频加载进度，使用的时候乘以100%
    this.timer = null; //计时器对象
    this.init();
}

MXJplayer.prototype = {
    constructor: MXJplayer,
    //初始化方法
    init: function() {
        this.utils().createAudioHtml();
        this.utils().createPlayerPanel();
        this.set().currentTime(12);
        this.set().currentIndex(0);
        this.set().currentSrc("http://testadmin0123.oicp.net/uploads/audio/U7ZE1WdIiP7vQRD6MXrL6Yvr.mp3");
    },
    //播放
    play: function() {
        this.Audio.load();
        this.Audio.play();
        this.utils().startTimer();
    },
    //暂停
    pause: function() {
        console.log(this);
        this.Audio.pause();
        this.utils().closeTimer();
    },
    //上一曲
    prev: function() {
        if (this.currentIndex >= 1) {
            this.currentIndex -= 1;
        }
    },
    //下一曲
    next: function() {
        var playListLength = this.playList.length;
        if (index < playListLength - 1) {
            this.currentIndex += 1;
        }
    },
    //清空播放列表
    clearPlayList: function() {
        this.playList = [];
    },
    //添加到播放列表
    addToPlayList: function(song) {
        if (song.constructor === Array) {
            for (var i = 0, len = song.length; i < len; i++) {
                //需要判断对象的格式是否正确
                this.playList.push(song[i]);
            }
        } else if (song.constructor === Object) {
            //需要判断对象的格式是否正确
            this.playList.push(object);
        }
    },
    //工具方法组
    utils: function() {
        var _this = this;
        return {
            //加载音乐
            loadSong: function(src, cb) {

            },
            //加载歌词
            loadLrc: function(src, cb) {

            }, //创建audio标签并且添加到body中
            createAudioHtml: function() {
                var audio = document.createElement("audio");
                audio.setAttribute("id", "MXJplayer");
                document.body.append(audio);
                _this.Audio = audio;
            },
            createPlayerPanel: function() {
                //播放器面板容器
                var container = document.createElement("div");
                container.setAttribute("class", "MXJplayer");
                //控制面板容器，播放，暂停，上一曲，下一曲
                var controlPanel = document.createElement("div");
                controlPanel.setAttribute("class", "control-panel");
                //播放暂停
                var playOrPauseBtn = document.createElement("div");
                playOrPauseBtn.setAttribute("class", "play-stop control-btn");
                playOrPauseBtn.innerHTML = "播放";
                //上一曲
                var prevBtn = document.createElement("div");
                prevBtn.setAttribute("class", "prev control-btn");
                prevBtn.innerHTML = "上一曲";
                //下一曲
                var nextBtn = document.createElement("div");
                nextBtn.setAttribute("class", "next control-btn");
                nextBtn.innerHTML = "下一曲";
                controlPanel.appendChild(prevBtn);
                controlPanel.appendChild(playOrPauseBtn);
                controlPanel.appendChild(nextBtn);

                //进度条面板
                var progressPanel = document.createElement("div");
                progressPanel.setAttribute("class", "progress-panel");

                //进度条背景
                var progressBackground = document.createElement("div");
                progressBackground.setAttribute("class", "progress-background progress-position");

                //加载进度条
                var progressLoad = document.createElement("div");
                progressLoad.setAttribute("class", "progress-load progress-position");

                //当前播放进度条
                var progressPlayer = document.createElement("div");
                progressPlayer.setAttribute("class", "progress-player progress-position");

                //进度条上的控制点
                var progressControlPointer = document.createElement("div");
                progressControlPointer.setAttribute("class", "progress-control-pointer");

                progressPanel.appendChild(progressControlPointer);
                progressPanel.appendChild(progressBackground);
                progressPanel.appendChild(progressLoad);
                progressPanel.appendChild(progressPlayer);

                container.appendChild(progressPanel);
                container.appendChild(controlPanel);
                document.body.appendChild(container);

            },
            startTimer: function() {
                if (_this.timer === null) {
                    _this.timer = setInterval(function() {
                        _this.currentTime = _this.Audio.currentTime;
                        _this.playProgress = parseFloat(_this.Audio.currentTime / _this.Audio.duration).toFixed(2);
                        console.log(_this.playProgress);
                        document.querySelector(".progress-player").style.width = _this.playProgress * 100 + "%";
                        document.querySelector(".progress-control-pointer").style.marginLeft = "calc("+_this.playProgress * 100 + "% - 20px)";
                        var buffered = _this.Audio.buffered.end(0);
                        _this.loadProgress = parseFloat(buffered / _this.Audio.duration).toFixed(2);
                        document.querySelector(".progress-load").style.width = _this.loadProgress * 100 + "%";
                    }, 1000);
                }
            },
            closeTimer: function() {
                clearInterval(_this.timer);
                _this.timer = null;
            }
        }
    },
    //设置播放参数
    set: function() {
        var _this = this;
        return {
            currentTime: function(time) {
                _this.currentTime = time;
                _this.Audio.currentTime = _this.currentTime;
            },
            currentSrc: function(src) {
                _this.currentSrc = src;
                _this.Audio.src = _this.currentSrc;
            },
            currentIndex: function(index) {
                _this.currentIndex = index;
            }
        }
    }
}
