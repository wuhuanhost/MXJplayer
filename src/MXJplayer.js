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

!(function(window){

	function MXJplayer() {
		//播放器对象
		this.Audio = null;
		//播放列表
		this.playList = [];
		//播放列表的数量
		this.countPlaylist=0;
		//当前播放音频在播放列表中的下标
		this.currentIndex = 0;
		//当前音频播放到第几秒了
		this.currentTime = 0; 
		//当前音频的src地址
		this.currentSrc = ""; 
		//播放进度,使用的时候乘以100%
		this.playProgress = 0.1; 
		//音频加载进度，使用的时候乘以100%
		this.loadProgress = 0.2;
		//计时器对象
		this.timer = null;
		//初始化方法
		this.init();
		//事件初始化方法
		this.initEvent();
	};

	MXJplayer.prototype = {
		constructor: MXJplayer,
		//初始化方法
		init: function() {
			this.utils().createAudioHtml();
			this.set().currentTime(0);
			this.set().currentIndex(0);
			this.addToPlayList({ src: "http://weixin.shangyang123.com/video/test1.mp3" });
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
			this.Audio.pause();//暂停播放
			this.utils().clearTimer();//关闭定时器
		},
		//上一曲
		prev: function() {
			if (this.currentIndex >= 1) {
				this.currentIndex -= 1;
			}
		},
		//下一曲
		next: function() {
			var playListLength = this.countPlaylist;
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
					this.countPlaylist=this.countPlaylist+1;//播放列表的条数+1
				}
			} else if (song.constructor === Object) {
				//需要判断对象的格式是否正确
				this.playList.unshift(song);
				this.countPlaylist=this.countPlaylist+1;//播放列表的条数+1
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
				startTimer: function() {//计时器
					if (_this.timer === null) {
						_this.timer = setInterval(function() {
							_this.currentTime = _this.Audio.currentTime;
							_this.playProgress = parseFloat(_this.Audio.currentTime / _this.Audio.duration).toFixed(2);
							
							//播放音频准备完毕							
							if(_this.Audio.readyState){
								//加载进度
								var buffered = _this.Audio.buffered.end(0);
								_this.loadProgress = parseFloat(buffered / _this.Audio.duration).toFixed(2);
									
							};

							//更新加载进度
							_this.updateView().loadProgress(_this.loadProgress);
							//更新播放进度
							_this.updateView().playProgress(_this.playProgress);
							//更新控制点位置
							_this.updateView().progressControlPointer(_this.playProgress);
							//更新当前的播放时间
							_this.updateView().currentTime(_this.Audio.currentTime);
							//更新总时间
							_this.updateView().duration(_this.Audio.duration);
							
							_this.Audio.onended = function() {//当前播放MP3播放完毕
								_this.currentIndex += 1;//指针指向播放列表的下一首
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
		updateView: function() {//界面刷新
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
	};

	window.MXJplayer=window.$$=new MXJplayer();

})(window);