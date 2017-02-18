//playlist数据格式
// {
//         id: 0, //数据库主键
//         song: "", //歌名
//         time: "", //音频总时长
//         lrc: "", //lrc地址
//         singer: "", //歌手
//         lyrics: "", //作词
//         composer: "", //作曲
// }

function MXJplayer() {
    //播放器对象
    this.Audio = null;
    //播放列表
    this.playList = []; //播放列表
    this.currentIndex = 0; //当前播放音频在播放列表中的下标
    this.currentTime = 0; //当前音频播放到第几秒了
    this.currentSrc = ""; //当前音频的src地址
    this.playProgress = 0.1; //播放进度,使用的时候乘以100%
    this.loadProgress = 0.2; //音频加载进度，使用的时候乘以100%
    this.timer = null; //计时器对象
    this.init();
    this.initEvent();
}

MXJplayer.prototype = {
    constructor: MXJplayer,
    //初始化方法
    init: function() {
        this.utils().createAudioHtml();
        this.set().currentTime(200);
        this.set().currentIndex(0);
        this.addToPlayList({ src: "http://weixin.shangyang123.com/video/test1.mp3" })
    },
    //播放
    play: function() {
        this.set().currentSrc(this.playList[this.currentIndex].src);
        this.Audio.load();
        this.set().currentTime(this.currentTime);
        this.Audio.play();
        this.utils().startTimer();
    },
    //暂停
    pause: function() {
        console.log(this);
        this.Audio.pause();
        this.utils().clearTimer();
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
            this.playList.unshift(song);
        }
    },
    initEvent: function() {
        var _this = this;
        var eventArr = [".mxjp-play-stop", ".mxjp-prev", ".mxjp-next"];
        for (var i = 0, len = eventArr.length; i < len; i++) {
            console.log(document.querySelector(eventArr[i]))
            document.querySelector(eventArr[i]).onclick = function() {
                if (this.getAttribute("class").search(/mxjp-play-stop/)!==-1) {
                    _this.play();
                }
            }
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
                document.body.appendChild(audio);
                _this.Audio = audio;
            },
            startTimer: function() {
                if (_this.timer === null) {
                    _this.timer = setInterval(function() {
                        _this.currentTime = _this.Audio.currentTime;
                        _this.playProgress = parseFloat(_this.Audio.currentTime / _this.Audio.duration).toFixed(2);
                        var buffered = _this.Audio.buffered.end(0);
                        _this.loadProgress = parseFloat(buffered / _this.Audio.duration).toFixed(2);

                        _this.update().loadProgress(_this.loadProgress);
                        _this.update().playProgress(_this.playProgress);
                        _this.update().progressControlPointer(_this.playProgress);
                        _this.update().currentTime(_this.Audio.currentTime);
                        _this.update().duration(_this.Audio.duration);

                        _this.Audio.onended = function() {
                            _this.currentIndex += 1;
                            console.log(_this.playList)
                            console.log(_this.currentIndex + "     " + _this.playList.length)
                            if (_this.currentIndex < _this.playList.length) {
                                _this.set().currentTime(0);
                                _this.play();
                            } else {
                                console.log("播放列表播放结束！")
                                _this.utils().clearTimer();
                            }
                        }

                    }, 1000);
                }
            },
            clearTimer: function() {
                clearInterval(_this.timer);
                _this.timer = null;
            }
        }
    },
    update: function() {
        var _this = this;
        return {
            currentTime: function(currentTime) {
                document.querySelector(".mxjp-current-time").innerHTML = currentTime;
            },
            playProgress: function(playProgress) {
                document.querySelector(".mxjp-player-progress").style.width = playProgress * 100 + "%";
            },
            progressControlPointer: function(progressControlPointer) {
                document.querySelector(".mxjp-progress-control-pointer").style.marginLeft = "calc(" + progressControlPointer * 100 + "%)";
            },
            loadProgress: function(loadProgress) {
                document.querySelector(".mxjp-load-progress").style.width = loadProgress * 100 + "%";
            },
            duration: function(duration) {
                document.querySelector(".mxjp-duration").innerHTML = duration;
            }
        }
    },
    //设置播放参数
    set: function() {
        var _this = this;
        return {
            currentTime: function(time) {
                _this.currentTime = time;
                _this.Audio.currentTime = time;
            },
            currentSrc: function(src) {
                _this.currentSrc = src;
                _this.Audio.src = src;
            },
            currentIndex: function(index) {
                _this.currentIndex = index;
            }
        }
    }
}
